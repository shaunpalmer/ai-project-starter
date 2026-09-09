#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const TASK_SCHEMA_VERSION = 2;
const ANSWERS = new Set(['YES', 'NO', 'UNKNOWN']);
const TASK_STATUSES = new Set(['blocked', 'ready', 'in_progress', 'completed']);
const BLOCKING_GATES = [
  'destination',
  'evidence',
  'system_model',
  'boundaries',
  'ownership',
  'minimum_slice',
  'debt_control',
  'proof',
];
const DISCOVERY_ARTIFACTS = [
  {
    path: '00-PLANNING/SYSTEM-MODEL.md',
    marker: 'MODEL_STATUS: CONFIRMED',
    headings: ['Goal', 'Inputs', 'Outputs', 'Capabilities', 'Data flow', 'State and persistence', 'Failure boundaries', 'Invariants', 'Unknowns', 'Evidence'],
  },
  {
    path: '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md',
    marker: 'HYPOTHESIS_STATUS: ACCEPTED',
    headings: ['Primary shape', 'Capabilities', 'Candidate patterns', 'Assumptions', 'Alternatives considered', 'Bounded proof', 'Proposed architecture', 'Approval evidence'],
  },
];

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
    discovery: DISCOVERY_ARTIFACTS.map((artifact) => ({
      path: artifact.path,
      status: readText(artifact.path, false).includes(artifact.marker) ? 'confirmed' : 'draft-or-missing',
    })),
    git: gitFacts(),
  };
  console.log(JSON.stringify(output, null, 2));
}

function verifyAlignment(task, failures) {
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    failures.push('Active task state is missing.');
    return;
  }
  if (task.schema_version !== TASK_SCHEMA_VERSION) {
    failures.push(`Active task requires schema_version: ${TASK_SCHEMA_VERSION}.`);
  }
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

function verifyDiscoveryArtifacts(task, failures) {
  if (!task || !['ready', 'in_progress', 'completed'].includes(task.status)) return;
  for (const artifact of DISCOVERY_ARTIFACTS) {
    const content = readText(artifact.path, false);
    if (!content) {
      failures.push(`Missing discovery artifact: ${artifact.path}`);
      continue;
    }
    if (!content.includes(artifact.marker)) {
      failures.push(`${artifact.path} requires ${artifact.marker} before execution.`);
    }
    for (const heading of artifact.headings) {
      const body = extractHeadingBody(content, heading);
      if (!body) failures.push(`${artifact.path} requires a non-empty ## ${heading} section.`);
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
  verifyDiscoveryArtifacts(task, failures);
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
    scripts: 'scripts',
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
    next_action: `Open ${projectDestination} as the VS Code workspace; model the system in ${relative.planning} before locking architecture or writing product code in ${relative.source}.`,
  };
}

function generatedReadinessScript() {
  return `#!/usr/bin/env node\n\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');\nconst GATES = ${JSON.stringify(BLOCKING_GATES)};\nconst task = JSON.parse(fs.readFileSync(path.join(ROOT, '.harness/state/active-task.json'), 'utf8'));\nconst failures = [];\n\nif (task.schema_version !== ${TASK_SCHEMA_VERSION}) failures.push('active-task.json requires schema_version ${TASK_SCHEMA_VERSION}');\nif (!['blocked', 'ready', 'in_progress', 'completed'].includes(task.status)) failures.push('invalid task status');\nconst gates = new Map(Array.isArray(task.alignment) ? task.alignment.map((gate) => [gate.gate, gate]) : []);\nfor (const name of GATES) {\n  const gate = gates.get(name);\n  if (!gate) failures.push('missing gate: ' + name);\n  else if (['ready', 'in_progress', 'completed'].includes(task.status) && gate.answer !== 'YES') failures.push('blocking gate: ' + name);\n  else if (!String(gate.evidence ?? '').trim()) failures.push('missing evidence: ' + name);\n}\nconst artifacts = [\n  ['00-PLANNING/SYSTEM-MODEL.md', 'MODEL_STATUS: CONFIRMED'],\n  ['00-PLANNING/ARCHITECTURE-HYPOTHESIS.md', 'HYPOTHESIS_STATUS: ACCEPTED'],\n];\nif (['ready', 'in_progress', 'completed'].includes(task.status)) {\n  for (const [relativePath, marker] of artifacts) {\n    const absolutePath = path.join(ROOT, relativePath);\n    if (!fs.existsSync(absolutePath)) failures.push('missing artifact: ' + relativePath);\n    else if (!fs.readFileSync(absolutePath, 'utf8').includes(marker)) failures.push(relativePath + ' requires ' + marker);\n  }\n}\nif (failures.length) {\n  console.error('Project readiness failed:\\n- ' + failures.join('\\n- '));\n  process.exit(1);\n}\nconsole.log('Project readiness passed.');\n`;
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
4. Read or complete \`00-PLANNING/PROJECT-INTAKE.md\`.
5. Build \`00-PLANNING/SYSTEM-MODEL.md\` from evidence before selecting architecture.
6. Draft \`00-PLANNING/ARCHITECTURE-HYPOTHESIS.md\`; use presets as evidence, not as law.
7. Inspect relevant source, tests, accepted decisions, dependencies, and Git history.
8. Run \`node scripts/project-ready.mjs\` before product execution.

## Infer before implement

A natural-language project prompt is a valid starting point. Do not force an unfamiliar or hybrid system into one preset prematurely.

- Infer a primary project shape only after modelling inputs, outputs, capabilities, state, failure boundaries, invariants, and unknowns.
- Record capability composition such as scraping + browser automation + API integration + persistent state when the work crosses categories.
- If confidence is low, inspect evidence or run a bounded proof. UNKNOWN means investigate; it does not mean ask Shaun to program the architecture for you.
- Architecture, language, framework, database, provider, cost, security boundary, merge, deployment, and release remain Shaun-owned consequential decisions.

## Folder ownership

- Plan in \`00-PLANNING/\`.
- Write canonical product code only in \`${sourcePath}/\`.
- Put proof in \`tests/\`.
- Treat \`build/\` as disposable generated assembly; never hand-edit it.
- Put only finished, verified delivery artifacts in \`dist/\`.
- Treat any deployment path as external runtime state, never as canonical source.

## Development behaviour

- Make routine, reversible implementation decisions autonomously and prove them.
- Do not start product code until all eight Alignment Ladder gates are \`YES\`, the system model is confirmed, and the architecture hypothesis is accepted.
- Reconcile current state, decisions, tests, and implementation at meaningful checkpoints.
- Never merge, deploy, publish, spend credits, or mutate production without explicit approval.
`,
    '00-PLANNING/PROJECT-INTAKE.md': `# Project Intake

Project: ${project.name}
Slug: \`${project.slug}\`
Initial type hint: \`${project.type}\`

A natural-language brief is enough to begin discovery. Do not guess architecture from the type hint.

Complete these five items before execution:

1. **Purpose and commercial reason:** What outcome matters and for whom?
2. **Initial shape hint:** Known preset, \`infer\`, or \`hybrid\`. This is a starting clue, not an architecture decision.
3. **First useful working slice:** What is the smallest observable outcome worth proving?
4. **Known constraints:** Runtime, language, storage, providers, cost limits, deployment, or \`infer from evidence\`.
5. **Done condition:** What can the user do when this slice is finished, and what pain is removed?

Optional only when the agent would otherwise guess incorrectly:

- External integrations:
- Users or authentication:
- Hard constraints:
- Data volume:
- Existing system that must be preserved:
`,
    '00-PLANNING/SYSTEM-MODEL.md': `# System Model

MODEL_STATUS: DRAFT

Change to \`MODEL_STATUS: CONFIRMED\` only when each section is evidence-backed and remaining unknowns are either non-blocking or assigned under decision rights.

## Goal

Describe the outcome without prescribing implementation.

## Inputs

List data, commands, events, files, users, or external sources entering the system.

## Outputs

List observable outputs and delivery destinations.

## Capabilities

List capabilities the system needs. Compose them freely: scraping, browser automation, API integration, persistence, scheduling, UI, reporting, queues, enrichment, etc.

## Data flow

Describe how information moves from input to output. Do not name classes yet.

## State and persistence

What must survive retries, crashes, reruns, or sessions? What must be idempotent?

## Failure boundaries

List external failures, partial-success cases, retry boundaries, fallback routes, and stop conditions.

## Invariants

State facts that must remain true regardless of implementation route.

## Unknowns

Record unresolved technical questions and whether each needs inspection, a bounded proof, or Shaun's consequential approval.

## Evidence

List repository files, documentation, experiments, provider facts, tests, or observed behaviour supporting the model.
`,
    '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md': `# Architecture Hypothesis

HYPOTHESIS_STATUS: DRAFT

Promote to \`HYPOTHESIS_STATUS: ACCEPTED\` only after the system model is confirmed, credible alternatives are compared, bounded proof is run when needed, and Shaun has approved any consequential architecture choice.

## Primary shape

State the best current description: a known preset, hybrid composition, or custom shape. Include confidence.

## Capabilities

Map system-model capabilities to responsibilities. A capability does not automatically require its own class, process, service, or database.

## Candidate patterns

List only patterns that solve observed responsibilities or failure modes.

## Assumptions

List assumptions that could invalidate the route.

## Alternatives considered

Record credible alternatives and why they are weaker for this slice.

## Bounded proof

State the smallest experiment needed to resolve material uncertainty, plus the observed result.

## Proposed architecture

Describe components, boundaries, data ownership, storage, dependencies, and execution flow at the minimum useful level.

## Approval evidence

Record the consequential decision and Shaun's approval, or explain why the route is a routine/reversible implementation detail under the decision-right contract.
`,
    'scripts/project-ready.mjs': generatedReadinessScript(),
    'docs/NORTH-STAR.md': `# North Star

## Project purpose

To be completed from \`00-PLANNING/PROJECT-INTAKE.md\` before execution.

## Invariants

- Product code remains inside \`${sourcePath}/\`.
- Build and distribution output never becomes canonical source.
- Consequential decisions remain with Shaun; routine development remains with Athena.
- Unfamiliar work is modelled before architecture is locked.

## Success condition

To be defined during intake.
`,
    'docs/CURRENT-STATE.md': `# Current State

Last verified: ${createdAt}

## Current truth

The project lifecycle scaffold exists. No product implementation has started. The initial type is a hint only; system discovery comes first.

## Known boundaries

- The intake and North Star are incomplete.
- The system model and architecture hypothesis are drafts.
- The active task remains blocked until every Alignment Ladder gate has evidence.
- Project creation did not build, package, deploy, or publish anything.

## Next action

Complete the intake, confirm the system model, then produce an evidence-backed architecture hypothesis before writing product code.
`,
  };
}

function createProjectScaffold(projectDestination, project, layout) {
  const persistentDirectories = [
    layout.relative.planning,
    layout.relative.decisions,
    layout.relative.source,
    layout.relative.tests,
    layout.relative.scripts,
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
  if (!workspaceInput) throw new Error('Provide --workspace-root or HARNESS_WORKSPACE_ROOT.');
  if (typeof workspaceInput !== 'string' || !path.isAbsolute(workspaceInput)) throw new Error('Workspace root must be an absolute path.');
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
  const type = args.type ?? 'infer';
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
      schema_version: TASK_SCHEMA_VERSION,
      id: 'project-intake',
      goal: 'Model the system, establish an architecture hypothesis, and define the first useful slice.',
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
