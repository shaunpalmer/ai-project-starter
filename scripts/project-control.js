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
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    failures.push('Active task state is missing.');
    return;
  }
  if (task.schema_version !== 1) failures.push('Active task requires schema_version: 1.');
  for (const field of ['id', 'goal', 'status']) {
    if (typeof task[field] !== 'string' || !task[field].trim()) {
      failures.push(`Active task requires a non-empty ${field}.`);
    }
  }
  if (!TASK_STATUSES.has(task.status)) failures.push(`Active task has invalid status: ${task.status}`);
  if (!Array.isArray(task.alignment)) {
    failures.push('Active task alignment must be an array.');
    return;
  }
  const gates = new Map();
  for (const gate of task.alignment) {
    if (!gate || !BLOCKING_GATES.includes(gate.gate)) {
      failures.push('Alignment contains an unknown or malformed gate.');
      continue;
    }
    if (gates.has(gate.gate)) failures.push(`Duplicate alignment gate: ${gate.gate}`);
    gates.set(gate.gate, gate);
  }
  for (const requiredGate of BLOCKING_GATES) {
    const gate = gates.get(requiredGate);
    if (!gate) {
      failures.push(`Alignment gate is missing: ${requiredGate}`);
      continue;
    }
    if (!ANSWERS.has(gate.answer)) failures.push(`Alignment gate ${requiredGate} has invalid answer: ${gate.answer}`);
    if (typeof gate.evidence !== 'string' || !gate.evidence.trim()) failures.push(`Alignment gate ${requiredGate} requires evidence.`);
    if (['ready', 'in_progress', 'completed'].includes(task.status) && gate.answer !== 'YES') {
      failures.push(`${task.status} task has blocking ${gate.answer} gate: ${requiredGate}`);
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

// Resolve existing symlinks while retaining a not-yet-created suffix.
function canonicalPath(candidate) {
  try {
    return fs.realpathSync(candidate);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    if (fs.lstatSync(candidate, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error(`Dangling symlink in destination: ${candidate}`);
    }
    const parent = path.dirname(candidate);
    if (parent === candidate) throw error;
    return path.join(canonicalPath(parent), path.basename(candidate));
  }
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function assertSafeDestination(workspaceRoot, destination, deployDestination) {
  const canonicalDestination = canonicalPath(destination);
  const canonicalWorkspace = canonicalPath(workspaceRoot);
  if (isWithin(canonicalPath(ROOT), canonicalDestination)) {
    throw new Error('Project destination cannot be inside the harness repository.');
  }
  if (canonicalDestination === canonicalWorkspace || !isWithin(canonicalWorkspace, canonicalDestination)) {
    throw new Error('Project destination must be a child of the configured workspace root.');
  }
  if (deployDestination) {
    const canonicalDeployment = canonicalPath(deployDestination);
    if (isWithin(canonicalDestination, canonicalDeployment) || isWithin(canonicalDeployment, canonicalDestination)) {
      throw new Error('Project and deployment destinations must not overlap.');
    }
  }
}

function projectLayout(type, slug, projectDestination, deployDestination) {
  const isWordPressPlugin = type === 'wordpress-plugin';
  const relative = {
    harness: '.harness',
    planning: '00-PLANNING',
    documentation: 'docs',
    decisions: path.join('docs', 'decisions'),
    source: isWordPressPlugin ? path.join('src', slug) : 'src',
    tests: 'tests',
    build: 'build',
    distribution: 'dist',
  };

  return {
    working_directory: projectDestination,
    planning_root: path.join(projectDestination, relative.planning),
    code_root: path.join(projectDestination, relative.source),
    test_root: path.join(projectDestination, relative.tests),
    build_root: path.join(projectDestination, relative.build),
    distribution_root: path.join(projectDestination, relative.distribution),
    deploy_destination: deployDestination,
    relative,
    release: isWordPressPlugin
      ? {
          format: 'zip',
          artifact_pattern: `${slug}-{version}.zip`,
          archive_root: slug,
          ship_from: relative.source,
        }
      : {
          format: 'type-specific',
          artifact_pattern: `${slug}-{version}.{format}`,
          archive_root: null,
          ship_from: relative.build,
        },
    next_action: `Open ${projectDestination} as the VS Code workspace; plan in ${relative.planning} and write product code only in ${relative.source}.`,
  };
}

function projectGuidanceFiles(project, layout) {
  const sourcePath = layout.relative.source.split(path.sep).join('/');
  const createdAt = new Date().toISOString();
  return {
    'AGENTS.md': `# ${project.name} — Agent Contract

This is the canonical product project. The reusable starter created it, but product code belongs here—not in the starter repository.

## Entry order

1. Read \`docs/NORTH-STAR.md\`.
2. Read \`docs/CURRENT-STATE.md\`.
3. Read \`.harness/project.json\` and \`.harness/state/active-task.json\`.
4. Complete \`00-PLANNING/PROJECT-INTAKE.md\` and the design envelope before coding.
5. Inspect relevant source, tests, decisions, and Git history.

## Folder ownership

- Plan in \`00-PLANNING/\`.
- Write canonical product code only in \`${sourcePath}/\`.
- Put proof in \`tests/\`.
- Treat \`build/\` as disposable generated assembly; never hand-edit it.
- Put only finished, verified delivery artifacts in \`dist/\`.
- Treat any deployment path as external runtime state, never as canonical source.

## Development behaviour

- Make routine, reversible implementation decisions autonomously and prove them.
- Ask Shaun only about purpose, architecture, language, framework, database, providers, material cost, security boundaries, scope pivots, destructive actions, merges, deployments, or releases.
- Do not start product code until all seven Alignment Ladder gates are \`YES\`.
- Reconcile current state, decisions, tests, and implementation at meaningful checkpoints.
- Never merge, deploy, publish, spend credits, or mutate production without explicit approval.
`,
    '00-PLANNING/PROJECT-INTAKE.md': `# Project Intake

Project: ${project.name}
Slug: \`${project.slug}\`
Type: \`${project.type}\`

Complete these five items before execution:

1. **Purpose and commercial reason:**
2. **Confirmed project type:**
3. **First useful working slice:**
4. **Default stack or explicit override:**
5. **Done condition:**

Optional only when the agent would otherwise guess incorrectly:

- External integrations:
- Users or authentication:
- Hard constraints:
- Data volume:
`,
    'docs/NORTH-STAR.md': `# North Star

## Project purpose

To be completed from \`00-PLANNING/PROJECT-INTAKE.md\` before execution.

## Invariants

- Product code remains inside \`${sourcePath}/\`.
- Build and distribution output never becomes canonical source.
- Consequential decisions remain with Shaun; routine development remains with Athena.

## Success condition

To be defined during intake.
`,
    'docs/CURRENT-STATE.md': `# Current State

Last verified: ${createdAt}

## Current truth

The project lifecycle scaffold exists. No product implementation has started.

## Known boundaries

- The intake and North Star are incomplete.
- The active task remains blocked until every Alignment Ladder gate has evidence.
- Project creation did not build, package, deploy, or publish anything.

## Next action

Complete \`00-PLANNING/PROJECT-INTAKE.md\`, establish the North Star, and define the first useful slice.
`,
  };
}

function createProjectScaffold(projectDestination, project, layout) {
  const persistentDirectories = [
    layout.relative.planning,
    layout.relative.decisions,
    layout.relative.source,
    layout.relative.tests,
    path.join(layout.relative.harness, 'state', 'checkpoints'),
  ];
  const generatedDirectories = [layout.relative.build, layout.relative.distribution];

  for (const relativePath of [...persistentDirectories, ...generatedDirectories]) {
    fs.mkdirSync(path.join(projectDestination, relativePath), { recursive: true });
  }

  for (const relativePath of persistentDirectories) {
    fs.writeFileSync(path.join(projectDestination, relativePath, '.gitkeep'), '');
  }

  for (const relativePath of generatedDirectories) {
    fs.writeFileSync(path.join(projectDestination, relativePath, '.gitkeep'), '');
  }

  const gitignore = [
    '# Local secrets',
    '.env',
    '.env.*',
    '!.env.example',
    '',
    '# Dependencies and generated files',
    'node_modules/',
    'vendor/',
    `${layout.relative.build}/*`,
    `!${layout.relative.build}/.gitkeep`,
    `${layout.relative.distribution}/*`,
    `!${layout.relative.distribution}/.gitkeep`,
    '',
    '# Runtime files',
    'logs/',
    '*.log',
    '*.sqlite',
    '*.sqlite3',
    '.DS_Store',
    'Thumbs.db',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(projectDestination, '.gitignore'), gitignore, { flag: 'wx' });

  for (const [relativePath, content] of Object.entries(projectGuidanceFiles(project, layout))) {
    fs.writeFileSync(path.join(projectDestination, relativePath), content, { flag: 'wx' });
  }
}

function destination(args) {
  const slug = args.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('destination requires a lowercase kebab-case --slug.');
  }
  const workspaceInput = args['workspace-root'] ?? process.env.HARNESS_WORKSPACE_ROOT;
  if (!workspaceInput) {
    throw new Error('Provide --workspace-root or HARNESS_WORKSPACE_ROOT.');
  }
  if (typeof workspaceInput !== 'string' || !path.isAbsolute(workspaceInput)) {
    throw new Error('Workspace root must be an absolute path.');
  }
  if (args['deploy-root'] !== undefined && (typeof args['deploy-root'] !== 'string' || !path.isAbsolute(args['deploy-root']))) {
    throw new Error('Deployment root must be an absolute path.');
  }
  if (args.create !== undefined && args.create !== true) {
    throw new Error('--create is a flag without a value; omit it for a preview.');
  }
  const workspaceRoot = path.resolve(workspaceInput);
  const projectDestination = path.resolve(workspaceRoot, slug);
  const deployDestination = args['deploy-root'] ? path.resolve(args['deploy-root'], slug) : null;
  assertSafeDestination(workspaceRoot, projectDestination, deployDestination);
  const name = String(args.name ?? slug).replace(/\s+/g, ' ').trim() || slug;
  const type = args.type ?? 'unspecified';
  const layout = projectLayout(type, slug, projectDestination, deployDestination);
  const result = {
    name,
    slug,
    type,
    workspace_root: workspaceRoot,
    project_destination: projectDestination,
    deploy_destination: deployDestination,
    layout,
    action: args.create ? 'create' : 'preview',
  };
  if (args.create) {
    if (fs.existsSync(projectDestination) && fs.readdirSync(projectDestination).length > 0) {
      throw new Error(`Destination already exists and is not empty: ${projectDestination}`);
    }
    createProjectScaffold(projectDestination, result, layout);
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
