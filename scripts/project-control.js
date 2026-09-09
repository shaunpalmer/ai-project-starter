#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TASK_SCHEMA_VERSION = 2;
const ANSWERS = new Set(['YES', 'NO', 'UNKNOWN']);
const TASK_STATUSES = new Set(['blocked', 'ready', 'in_progress', 'completed']);
const EXECUTION_STATUSES = new Set(['ready', 'in_progress', 'completed']);
const BLOCKING_GATES = [
  'destination', 'evidence', 'system_model', 'boundaries',
  'ownership', 'minimum_slice', 'debt_control', 'proof',
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
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      i += 1;
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

function hasExactLine(content, marker) {
  return content.split(/\r?\n/).some((line) => line.trim() === marker);
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
  console.log(JSON.stringify({
    project: extractHeadingBody(northStar, 'Project purpose'),
    invariants: extractHeadingBody(northStar, 'Invariants'),
    current_state: extractHeadingBody(currentState, 'Current truth'),
    next_action: extractHeadingBody(currentState, 'Next action'),
    active_task: task,
    active_decisions: listActiveDecisions(),
    discovery: DISCOVERY_ARTIFACTS.map((artifact) => ({
      path: artifact.path,
      status: hasExactLine(readText(artifact.path, false), artifact.marker) ? 'confirmed' : 'draft-or-missing',
    })),
    git: gitFacts(),
  }, null, 2));
}

function verifyAlignment(task, failures) {
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    failures.push('Active task state is missing.');
    return;
  }
  if (task.schema_version !== TASK_SCHEMA_VERSION) failures.push(`Active task requires schema_version: ${TASK_SCHEMA_VERSION}.`);
  for (const field of ['id', 'goal', 'status']) {
    if (typeof task[field] !== 'string' || !task[field].trim()) failures.push(`Active task requires a non-empty ${field}.`);
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

  for (const name of BLOCKING_GATES) {
    const gate = gates.get(name);
    if (!gate) {
      failures.push(`Alignment gate is missing: ${name}`);
      continue;
    }
    if (!ANSWERS.has(gate.answer)) failures.push(`Alignment gate ${name} has invalid answer: ${gate.answer}`);
    if (typeof gate.evidence !== 'string' || !gate.evidence.trim()) failures.push(`Alignment gate ${name} requires evidence.`);
    if (EXECUTION_STATUSES.has(task.status) && gate.answer !== 'YES') failures.push(`${task.status} task has blocking ${gate.answer} gate: ${name}`);
  }
}

function verifyDiscoveryArtifacts(task, failures) {
  if (!task || !EXECUTION_STATUSES.has(task.status)) return;
  for (const artifact of DISCOVERY_ARTIFACTS) {
    const content = readText(artifact.path, false);
    if (!content) {
      failures.push(`Missing discovery artifact: ${artifact.path}`);
      continue;
    }
    if (!hasExactLine(content, artifact.marker)) failures.push(`${artifact.path} requires ${artifact.marker} before execution.`);
    for (const heading of artifact.headings) {
      if (!extractHeadingBody(content, heading)) failures.push(`${artifact.path} requires a non-empty ## ${heading} section.`);
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
    if (status === 'superseded' && !/^superseded_by:\s*\S+/mi.test(content)) failures.push(`${name} is superseded but has no superseded_by link.`);
  }
}

function verify() {
  const failures = [];
  for (const required of [
    'docs/NORTH-STAR.md', 'docs/CURRENT-STATE.md', 'docs/PROJECT-CONTROL.md',
    'docs/DECISION-RIGHTS.md', '.harness/state/active-task.json',
  ]) {
    try { readText(required); } catch (error) { failures.push(error.message); }
  }
  let task = null;
  try { task = readJson('.harness/state/active-task.json'); } catch (error) { failures.push(error.message); }
  verifyAlignment(task, failures);
  verifyDiscoveryArtifacts(task, failures);
  verifyDecisions(failures);
  if (failures.length) {
    console.error(`Project-control verification failed:\n- ${failures.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log('Project-control verification passed.');
}

function checkpoint(args) {
  if (!args.summary || typeof args.summary !== 'string') throw new Error('checkpoint requires --summary "what changed and why"');
  const dir = path.join(ROOT, '.harness', 'state', 'checkpoints');
  fs.mkdirSync(dir, { recursive: true });
  const timestamp = new Date().toISOString();
  const record = {
    schema_version: 1,
    timestamp,
    summary: args.summary,
    next_action: args.next ?? null,
    verification: args.verification ?? null,
    git: gitFacts(),
  };
  const relativePath = path.join('.harness', 'state', 'checkpoints', `${timestamp.replaceAll(':', '-')}.json`);
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
    if (fs.lstatSync(candidate, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error(`Dangling symlink in destination: ${candidate}`);
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
  if (isWithin(canonicalPath(ROOT), canonicalDestination)) throw new Error('Project destination cannot be inside the harness repository.');
  if (canonicalDestination === canonicalWorkspace || !isWithin(canonicalWorkspace, canonicalDestination)) throw new Error('Project destination must be a child of the configured workspace root.');
  if (deployDestination) {
    const canonicalDeployment = canonicalPath(deployDestination);
    if (isWithin(canonicalDestination, canonicalDeployment) || isWithin(canonicalDeployment, canonicalDestination)) throw new Error('Project and deployment destinations must not overlap.');
  }
}

function projectLayout(type, slug, destination, deployDestination) {
  const wordpress = type === 'wordpress-plugin';
  const relative = {
    harness: '.harness', planning: '00-PLANNING', documentation: 'docs', decisions: path.join('docs', 'decisions'),
    source: wordpress ? path.join('src', slug) : 'src', tests: 'tests', scripts: 'scripts', build: 'build', distribution: 'dist',
  };
  return {
    working_directory: destination,
    planning_root: path.join(destination, relative.planning),
    code_root: path.join(destination, relative.source),
    test_root: path.join(destination, relative.tests),
    build_root: path.join(destination, relative.build),
    distribution_root: path.join(destination, relative.distribution),
    deploy_destination: deployDestination,
    relative,
    release: wordpress
      ? { format: 'zip', artifact_pattern: `${slug}-{version}.zip`, archive_root: slug, ship_from: relative.source }
      : { format: 'type-specific', artifact_pattern: `${slug}-{version}.{format}`, archive_root: null, ship_from: relative.build },
    next_action: `Open ${destination} as the VS Code workspace; model the system in ${relative.planning} before locking architecture or writing product code in ${relative.source}.`,
  };
}

function generatedReadinessScript() {
  return `#!/usr/bin/env node\n\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');\nconst GATES = ${JSON.stringify(BLOCKING_GATES)};\nconst task = JSON.parse(fs.readFileSync(path.join(ROOT, '.harness/state/active-task.json'), 'utf8'));\nconst failures = [];\nconst executionStatuses = new Set(['ready', 'in_progress', 'completed']);\nconst hasExactLine = (content, marker) => content.split(/\\r?\\n/).some((line) => line.trim() === marker);\n\nif (task.schema_version !== ${TASK_SCHEMA_VERSION}) failures.push('active-task.json requires schema_version ${TASK_SCHEMA_VERSION}');\nif (!executionStatuses.has(task.status)) failures.push('task is not execution-ready: ' + task.status);\nconst gates = new Map(Array.isArray(task.alignment) ? task.alignment.map((gate) => [gate.gate, gate]) : []);\nfor (const name of GATES) {\n  const gate = gates.get(name);\n  if (!gate) failures.push('missing gate: ' + name);\n  else if (gate.answer !== 'YES') failures.push('blocking gate: ' + name);\n  else if (!String(gate.evidence ?? '').trim()) failures.push('missing evidence: ' + name);\n}\nfor (const [relativePath, marker] of [\n  ['00-PLANNING/SYSTEM-MODEL.md', 'MODEL_STATUS: CONFIRMED'],\n  ['00-PLANNING/ARCHITECTURE-HYPOTHESIS.md', 'HYPOTHESIS_STATUS: ACCEPTED'],\n]) {\n  const absolutePath = path.join(ROOT, relativePath);\n  if (!fs.existsSync(absolutePath)) failures.push('missing artifact: ' + relativePath);\n  else if (!hasExactLine(fs.readFileSync(absolutePath, 'utf8'), marker)) failures.push(relativePath + ' requires ' + marker);\n}\nif (failures.length) {\n  console.error('Project readiness failed:\\n- ' + failures.join('\\n- '));\n  process.exit(1);\n}\nconsole.log('Project readiness passed.');\n`;
}

function projectGuidanceFiles(project, layout) {
  const sourcePath = layout.relative.source.split(path.sep).join('/');
  const createdAt = new Date().toISOString();
  return {
    'AGENTS.md': `# ${project.name} — Agent Contract\n\nThis is the canonical product project. Product code belongs here, not in the starter repository.\n\n## Entry order\n\n1. Read \`docs/NORTH-STAR.md\`.\n2. Read \`docs/CURRENT-STATE.md\`.\n3. Read \`.harness/project.json\` and \`.harness/state/active-task.json\`.\n4. Complete \`00-PLANNING/PROJECT-INTAKE.md\`.\n5. Confirm \`00-PLANNING/SYSTEM-MODEL.md\` from evidence.\n6. Draft and obtain approval for \`00-PLANNING/ARCHITECTURE-HYPOTHESIS.md\`.\n7. Inspect relevant source, tests, decisions, dependencies, and Git history.\n8. Run \`node scripts/project-ready.mjs\` before product execution.\n\n## Infer before implement\n\nA natural-language prompt is a valid starting point. Infer a primary shape only after modelling inputs, outputs, capabilities, state, failure boundaries, invariants, unknowns, and evidence. Hybrid capability composition is valid. Low confidence means inspect or run a bounded proof; it does not mean ask Shaun to program through you.\n\n## Folder ownership\n\n- Plan in \`00-PLANNING/\`.\n- Write canonical product code only in \`${sourcePath}/\`.\n- Put proof in \`tests/\`.\n- Treat \`build/\` as disposable assembly.\n- Put only verified delivery artifacts in \`dist/\`.\n\n## Development behaviour\n\nDo not start product code until all eight Alignment Ladder gates are YES, the system model is confirmed, the architecture hypothesis is accepted, and \`node scripts/project-ready.mjs\` passes. Never merge, deploy, publish, spend credits, or mutate production without explicit approval.\n`,
    '00-PLANNING/PROJECT-INTAKE.md': `# Project Intake\n\nProject: ${project.name}\nSlug: \`${project.slug}\`\nInitial type hint: \`${project.type}\`\n\nA natural-language brief is enough to begin discovery.\n\n1. **Purpose and commercial reason:**\n2. **Initial shape hint:** known preset, \`infer\`, or \`hybrid\`.\n3. **First useful working slice:**\n4. **Known constraints:** runtime/language/storage/providers/cost/deployment, or \`infer from evidence\`.\n5. **Done condition:**\n\nOptional: integrations, auth/users, hard constraints, data volume, existing system to preserve.\n`,
    '00-PLANNING/SYSTEM-MODEL.md': `# System Model\n\nMODEL_STATUS: DRAFT\n\nPromote the status only when each section is evidence-backed and blocking unknowns are resolved or assigned under decision rights.\n\n## Goal\nDescribe the outcome without prescribing implementation.\n\n## Inputs\nList data, commands, events, files, users, or external sources.\n\n## Outputs\nList observable outputs and delivery destinations.\n\n## Capabilities\nCompose required capabilities freely.\n\n## Data flow\nDescribe information movement without naming classes.\n\n## State and persistence\nWhat must survive retries, crashes, reruns, or sessions?\n\n## Failure boundaries\nList partial failures, retry/fallback routes, and stop conditions.\n\n## Invariants\nState facts that must remain true regardless of route.\n\n## Unknowns\nRecord unresolved questions and how each will be resolved.\n\n## Evidence\nList repository/runtime/provider/test evidence supporting the model.\n`,
    '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md': `# Architecture Hypothesis\n\nHYPOTHESIS_STATUS: DRAFT\n\nPromote the status only after the system model is confirmed, alternatives are compared, bounded proof is run where needed, and consequential choices are approved.\n\n## Primary shape\nState preset/hybrid/custom shape and confidence.\n\n## Capabilities\nMap capabilities to responsibilities.\n\n## Candidate patterns\nList only patterns that solve observed problems.\n\n## Assumptions\nList assumptions that could invalidate the route.\n\n## Alternatives considered\nRecord credible alternatives and trade-offs.\n\n## Bounded proof\nState the smallest experiment and observed result.\n\n## Proposed architecture\nDescribe components, boundaries, ownership, storage, dependencies, and flow.\n\n## Approval evidence\nRecord consequential approval or why the choice is routine/reversible.\n`,
    'scripts/project-ready.mjs': generatedReadinessScript(),
    'docs/NORTH-STAR.md': `# North Star\n\n## Project purpose\n\nTo be completed from \`00-PLANNING/PROJECT-INTAKE.md\` before execution.\n\n## Invariants\n\n- Product code remains inside \`${sourcePath}/\`.\n- Build and distribution output never becomes canonical source.\n- Consequential decisions remain with Shaun; routine development remains with Athena.\n- Unfamiliar work is modelled before architecture is locked.\n\n## Success condition\n\nTo be defined during intake.\n`,
    'docs/CURRENT-STATE.md': `# Current State\n\nLast verified: ${createdAt}\n\n## Current truth\n\nThe lifecycle scaffold exists. No product implementation has started; the initial type is a hint only.\n\n## Known boundaries\n\n- Intake and North Star are incomplete.\n- System model and architecture hypothesis are drafts.\n- Active task is blocked until the readiness contract passes.\n- Creation did not build, package, deploy, publish, or call providers.\n\n## Next action\n\nComplete intake, confirm the system model, then produce an evidence-backed architecture hypothesis.\n`,
  };
}

function createProjectScaffold(destination, project, layout) {
  const persistent = [
    layout.relative.planning, layout.relative.decisions, layout.relative.source,
    layout.relative.tests, layout.relative.scripts, path.join(layout.relative.harness, 'state', 'checkpoints'),
  ];
  const generated = [layout.relative.build, layout.relative.distribution];
  for (const relativePath of [...persistent, ...generated]) fs.mkdirSync(path.join(destination, relativePath), { recursive: true });
  for (const relativePath of [...persistent, ...generated]) fs.writeFileSync(path.join(destination, relativePath, '.gitkeep'), '');

  const gitignore = [
    '# Local secrets', '.env', '.env.*', '!.env.example', '',
    '# Dependencies and generated files', 'node_modules/', 'vendor/',
    `${layout.relative.build}/*`, `!${layout.relative.build}/.gitkeep`,
    `${layout.relative.distribution}/*`, `!${layout.relative.distribution}/.gitkeep`, '',
    '# Runtime files', 'logs/', '*.log', '*.sqlite', '*.sqlite3', '.DS_Store', 'Thumbs.db', '',
  ].join('\n');
  fs.writeFileSync(path.join(destination, '.gitignore'), gitignore, { flag: 'wx' });
  for (const [relativePath, content] of Object.entries(projectGuidanceFiles(project, layout))) {
    fs.writeFileSync(path.join(destination, relativePath), content, { flag: 'wx' });
  }
}

function destination(args) {
  const slug = args.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('destination requires a lowercase kebab-case --slug.');
  const workspaceInput = args['workspace-root'] ?? process.env.HARNESS_WORKSPACE_ROOT;
  if (!workspaceInput) throw new Error('Provide --workspace-root or HARNESS_WORKSPACE_ROOT.');
  if (typeof workspaceInput !== 'string' || !path.isAbsolute(workspaceInput)) throw new Error('Workspace root must be an absolute path.');
  if (args['deploy-root'] !== undefined && (typeof args['deploy-root'] !== 'string' || !path.isAbsolute(args['deploy-root']))) throw new Error('Deployment root must be an absolute path.');
  if (args.create !== undefined && args.create !== true) throw new Error('--create is a flag without a value; omit it for a preview.');

  const workspaceRoot = path.resolve(workspaceInput);
  const projectDestination = path.resolve(workspaceRoot, slug);
  const deployDestination = args['deploy-root'] ? path.resolve(args['deploy-root'], slug) : null;
  assertSafeDestination(workspaceRoot, projectDestination, deployDestination);
  const name = String(args.name ?? slug).replace(/\s+/g, ' ').trim() || slug;
  const type = args.type ?? 'infer';
  const layout = projectLayout(type, slug, projectDestination, deployDestination);
  const result = {
    name, slug, type, workspace_root: workspaceRoot, project_destination: projectDestination,
    deploy_destination: deployDestination, layout, action: args.create ? 'create' : 'preview',
  };

  if (args.create) {
    if (fs.existsSync(projectDestination) && fs.readdirSync(projectDestination).length > 0) throw new Error(`Destination already exists and is not empty: ${projectDestination}`);
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
