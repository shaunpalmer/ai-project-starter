#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const ANSWERS = new Set(['YES', 'NO', 'UNKNOWN']);
const TASK_STATUSES = new Set(['blocked', 'ready', 'in_progress', 'completed']);
const BLOCKING_GATES = ['destination', 'evidence', 'boundaries', 'ownership', 'minimum_slice', 'debt_control', 'proof'];

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      index += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

function readText(relativePath, required = true) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    if (required) throw new Error(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function readJson(relativePath, required = true) {
  const raw = readText(relativePath, required);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${relativePath}: ${error.message}`);
  }
}

function runGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unavailable';
  }
}

function gitFacts() {
  return {
    branch: runGit(['branch', '--show-current']),
    head: runGit(['rev-parse', '--short', 'HEAD']),
    status: runGit(['status', '--short']) || 'clean',
  };
}

function extractHeadingBody(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return '';
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break;
    body.push(line);
  }
  return body.join('\n').trim();
}

function listActiveDecisions() {
  const decisionDir = path.join(ROOT, 'docs', 'decisions');
  if (!fs.existsSync(decisionDir)) return [];
  return fs.readdirSync(decisionDir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => ({ name, content: fs.readFileSync(path.join(decisionDir, name), 'utf8') }))
    .filter(({ content }) => /^status:\s*accepted\s*$/mi.test(content))
    .map(({ name, content }) => ({
      id: content.match(/^id:\s*(.+)$/mi)?.[1]?.trim() ?? name,
      title: content.match(/^title:\s*(.+)$/mi)?.[1]?.trim() ?? name,
    }));
}

function resume() {
  const northStar = readText('docs/NORTH-STAR.md');
  const currentState = readText('docs/CURRENT-STATE.md');
  const task = readJson('.harness/state/active-task.json', false);
  const output = {
    project: extractHeadingBody(northStar, 'Project purpose'),
    invariants: extractHeadingBody(northStar, 'Invariants'),
    current_state: extractHeadingBody(currentState, 'Current truth'),
    next_action: extractHeadingBody(currentState, 'Next action'),
    active_task: task,
    active_decisions: listActiveDecisions(),
    git: gitFacts(),
  };
  console.log(JSON.stringify(output, null, 2));
}

function verifyAlignment(task, failures) {
  if (!task || typeof task !== 'object') {
    failures.push('Active task state is missing.');
    return;
  }
  if (!task.id || !task.goal || !task.status) failures.push('Active task requires id, goal, and status.');
  if (task.status && !TASK_STATUSES.has(task.status)) failures.push(`Active task has invalid status: ${task.status}`);
  const gates = new Map((task.alignment ?? []).map((gate) => [gate.gate, gate]));
  for (const requiredGate of BLOCKING_GATES) {
    const gate = gates.get(requiredGate);
    if (!gate) {
      failures.push(`Alignment gate is missing: ${requiredGate}`);
      continue;
    }
    if (!ANSWERS.has(gate.answer)) failures.push(`Alignment gate ${requiredGate} has invalid answer: ${gate.answer}`);
    if (!gate.evidence) failures.push(`Alignment gate ${requiredGate} requires evidence.`);
    if (task.status === 'ready' && gate.answer !== 'YES') {
      failures.push(`Ready task has blocking ${gate.answer} gate: ${requiredGate}`);
    }
  }
}

function verifyDecisions(failures) {
  const decisionDir = path.join(ROOT, 'docs', 'decisions');
  if (!fs.existsSync(decisionDir)) {
    failures.push('Decision directory is missing: docs/decisions');
    return;
  }
  const accepted = new Map();
  for (const name of fs.readdirSync(decisionDir).filter((file) => file.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(decisionDir, name), 'utf8');
    const id = content.match(/^id:\s*(.+)$/mi)?.[1]?.trim();
    const status = content.match(/^status:\s*(.+)$/mi)?.[1]?.trim();
    if (!id || !status) failures.push(`${name} requires id and status metadata.`);
    if (status === 'accepted') {
      if (accepted.has(id)) failures.push(`Duplicate accepted decision id: ${id}`);
      accepted.set(id, name);
    }
    if (status === 'superseded' && !/^superseded_by:\s*\S+/mi.test(content)) {
      failures.push(`${name} is superseded but has no superseded_by link.`);
    }
  }
}

function verify() {
  const failures = [];
  for (const required of [
    'docs/NORTH-STAR.md',
    'docs/CURRENT-STATE.md',
    'docs/PROJECT-CONTROL.md',
    'docs/DECISION-RIGHTS.md',
    '.harness/state/active-task.json',
  ]) {
    try { readText(required); } catch (error) { failures.push(error.message); }
  }
  let task = null;
  try { task = readJson('.harness/state/active-task.json'); } catch (error) { failures.push(error.message); }
  verifyAlignment(task, failures);
  verifyDecisions(failures);
  if (failures.length > 0) {
    console.error(`Project-control verification failed:\n- ${failures.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log('Project-control verification passed.');
}

function checkpoint(args) {
  if (!args.summary || typeof args.summary !== 'string') {
    throw new Error('checkpoint requires --summary "what changed and why"');
  }
  const checkpointDir = path.join(ROOT, '.harness', 'state', 'checkpoints');
  fs.mkdirSync(checkpointDir, { recursive: true });
  const timestamp = new Date().toISOString();
  const safeTimestamp = timestamp.replaceAll(':', '-');
  const record = {
    schema_version: 1,
    timestamp,
    summary: args.summary,
    next_action: args.next ?? null,
    verification: args.verification ?? null,
    git: gitFacts(),
  };
  const relativePath = path.join('.harness', 'state', 'checkpoints', `${safeTimestamp}.json`);
  fs.writeFileSync(path.join(ROOT, relativePath), `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  console.log(`Checkpoint written: ${relativePath}`);
}

function decision(args) {
  const policies = {
    routine: ['ATHENA', 'decide-and-proceed'],
    reversible: ['ATHENA', 'recommend-test-and-proceed'],
    architecture: ['SHAUN', 'recommend-and-request-approval'],
    financial: ['SHAUN', 'recommend-and-request-approval'],
    provider: ['SHAUN', 'recommend-and-request-approval'],
    security: ['SHAUN', 'request-approval-if-risk-changes'],
    destructive: ['SHAUN', 'request-explicit-approval'],
    merge: ['SHAUN', 'request-explicit-approval'],
    release: ['SHAUN', 'request-explicit-approval'],
  };
  const selected = policies[args.kind];
  if (!selected) throw new Error(`Unknown decision kind. Use: ${Object.keys(policies).join(', ')}`);
  console.log(JSON.stringify({ kind: args.kind, owner: selected[0], action: selected[1] }, null, 2));
}

function assertSafeDestination(workspaceRoot, destination) {
  if (!path.isAbsolute(workspaceRoot)) throw new Error('Workspace root must be an absolute path.');
  if (path.resolve(destination) === ROOT) throw new Error('Project destination cannot be the harness repository.');
  const relative = path.relative(workspaceRoot, destination);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Project destination must be a child of the configured workspace root.');
  }
}

function destination(args) {
  const slug = args.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('destination requires a lowercase kebab-case --slug.');
  }
  const workspaceRoot = path.resolve(args['workspace-root'] ?? process.env.HARNESS_WORKSPACE_ROOT ?? '');
  if (!args['workspace-root'] && !process.env.HARNESS_WORKSPACE_ROOT) {
    throw new Error('Provide --workspace-root or HARNESS_WORKSPACE_ROOT.');
  }
  const projectDestination = path.resolve(workspaceRoot, slug);
  assertSafeDestination(workspaceRoot, projectDestination);
  const deployDestination = args['deploy-root'] ? path.resolve(args['deploy-root'], slug) : null;
  const result = {
    name: args.name ?? slug,
    slug,
    type: args.type ?? 'unspecified',
    workspace_root: workspaceRoot,
    project_destination: projectDestination,
    deploy_destination: deployDestination,
    action: args.create ? 'create' : 'preview',
  };
  if (args.create) {
    if (fs.existsSync(projectDestination) && fs.readdirSync(projectDestination).length > 0) {
      throw new Error(`Destination already exists and is not empty: ${projectDestination}`);
    }
    fs.mkdirSync(path.join(projectDestination, '.harness', 'state'), { recursive: true });
    fs.writeFileSync(path.join(projectDestination, '.harness', 'project.json'), `${JSON.stringify({ schema_version: 1, ...result }, null, 2)}\n`, { flag: 'wx' });
    fs.writeFileSync(path.join(projectDestination, '.harness', 'state', 'active-task.json'), `${JSON.stringify({
      schema_version: 1,
      id: 'project-intake',
      goal: 'Complete intake and establish the first useful slice.',
      status: 'blocked',
      alignment: BLOCKING_GATES.map((gate) => ({ gate, answer: 'UNKNOWN', evidence: 'Not established during project creation.' })),
    }, null, 2)}\n`, { flag: 'wx' });
  }
  console.log(JSON.stringify(result, null, 2));
}

function usage() {
  console.log('Usage: node scripts/project-control.js <resume|verify|checkpoint|decision|destination> [options]');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  if (!command) return usage();
  if (command === 'resume') return resume();
  if (command === 'verify') return verify();
  if (command === 'checkpoint') return checkpoint(args);
  if (command === 'decision') return decision(args);
  if (command === 'destination') return destination(args);
  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`Project control failed: ${error.message}`);
  process.exitCode = 1;
}
