#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AGENT_MARKER = '## Harness v0.4 operating handoff';

const HANDOFF_PATHS = [
  'ENGINEERING-DEFAULTS.md',
  '.github/skills/skill-router',
  '.github/skills/complexity-brake',
  '.github/skills/project-memory',
  '.github/skills/architecture-canvas',
  '.github/skills/scraping-pipeline',
  '.github/skills/wordpress-plugin',
  '.github/skills/wordpress-way.md',
  '.github/skills/oop-standards.md',
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

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function assertProjectRoot(projectRoot) {
  if (!path.isAbsolute(projectRoot)) throw new Error('--project-root must be an absolute path.');
  if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) throw new Error(`Project root does not exist: ${projectRoot}`);
  const canonicalHarness = fs.realpathSync(ROOT);
  const canonicalProject = fs.realpathSync(projectRoot);
  if (isWithin(canonicalHarness, canonicalProject)) throw new Error('Project handoff target cannot be inside the harness repository.');
  for (const required of ['.harness/project.json', '.harness/state/active-task.json', '00-PLANNING/SYSTEM-MODEL.md', 'AGENTS.md']) {
    if (!fs.existsSync(path.join(canonicalProject, required))) throw new Error(`Target is not a generated harness project; missing ${required}.`);
  }
  return canonicalProject;
}

function sameFile(source, destination) {
  return fs.existsSync(destination)
    && fs.statSync(destination).isFile()
    && fs.readFileSync(source).equals(fs.readFileSync(destination));
}

function copyFileSafe(source, destination, copied, unchanged) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) {
    if (!sameFile(source, destination)) throw new Error(`Refusing to overwrite project-customised file: ${destination}`);
    unchanged.push(path.relative(destinationRoot, destination).split(path.sep).join('/'));
    return;
  }
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  copied.push(path.relative(destinationRoot, destination).split(path.sep).join('/'));
}

let destinationRoot = null;

function copyPathSafe(relativePath, copied, unchanged) {
  const source = path.join(ROOT, relativePath);
  if (!fs.existsSync(source)) throw new Error(`Harness handoff source is missing: ${relativePath}`);
  const destination = path.join(destinationRoot, relativePath);
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      copyPathSafe(path.join(relativePath, entry.name), copied, unchanged);
    }
    return;
  }
  copyFileSafe(source, destination, copied, unchanged);
}

function copyVcsController(copied, unchanged) {
  const source = path.join(ROOT, 'scripts', 'vcs-control.js');
  const destination = path.join(destinationRoot, 'scripts', 'vcs-control.mjs');
  copyFileSafe(source, destination, copied, unchanged);
}

function appendAgentHandoff(projectRoot) {
  const agentsPath = path.join(projectRoot, 'AGENTS.md');
  const current = fs.readFileSync(agentsPath, 'utf8');
  if (current.includes(AGENT_MARKER)) return 'already-present';
  const block = `\n${AGENT_MARKER}\n\n- Read \`ENGINEERING-DEFAULTS.md\` before making routine implementation choices.\n- Use \`.github/skills/skill-router/SKILL.md\` after the system model is confirmed.\n- Confirmed WordPress work automatically binds \`.github/skills/wordpress-way.md\` and the WordPress plugin skill.\n- Confirmed scraping/ingestion work automatically binds the scraping-pipeline skill.\n- Routine engineering question budget is zero; ask only for consequential decisions under the project's decision-right contract.\n- Use \`node scripts/vcs-control.mjs\` for Git preflight, safe branches, focused checkpoints, remote verification, and authorised non-default-branch pushes.\n- Never store credentials, broadly stage the worktree, force push, push managed work directly to main/master, merge, deploy, or release without the required authority.\n`;
  fs.appendFileSync(agentsPath, block);
  return 'appended';
}

function runNode(scriptPath, args, cwd) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GH_PROMPT_DISABLED: '1',
      GCM_INTERACTIVE: 'Never',
    },
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `Node exited ${result.status}`).trim());
  return result.stdout.trim();
}

function ensureLocalGit(projectRoot) {
  const gitCheck = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: projectRoot, encoding: 'utf8' });
  if (gitCheck.status === 0) return { action: 'already-initialized', repo_root: gitCheck.stdout.trim() };
  const vcsScript = path.join(projectRoot, 'scripts', 'vcs-control.mjs');
  return JSON.parse(runNode(vcsScript, ['init', '--cwd', projectRoot, '--branch', 'work/bootstrap'], projectRoot));
}

function harnessHead() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : 'unavailable';
}

function writeHandoffRecord(projectRoot, copiedPaths) {
  const recordPath = path.join(projectRoot, '.harness', 'handoff.json');
  if (fs.existsSync(recordPath)) return JSON.parse(fs.readFileSync(recordPath, 'utf8'));
  const record = {
    schema_version: 1,
    handoff_version: '0.4',
    harness_head: harnessHead(),
    installed: copiedPaths,
    rules: {
      engineering_defaults: 'ENGINEERING-DEFAULTS.md',
      skill_root: '.github/skills',
      vcs_controller: 'scripts/vcs-control.mjs',
      agent_contract: 'AGENTS.md',
    },
  };
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  return record;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args['project-root'] || typeof args['project-root'] !== 'string') {
    throw new Error('Usage: node scripts/project-handoff.js --project-root /absolute/path');
  }
  destinationRoot = assertProjectRoot(path.resolve(args['project-root']));
  const copied = [];
  const unchanged = [];
  for (const relativePath of HANDOFF_PATHS) copyPathSafe(relativePath, copied, unchanged);
  copyVcsController(copied, unchanged);
  const agents = appendAgentHandoff(destinationRoot);
  const git = ensureLocalGit(destinationRoot);
  const record = writeHandoffRecord(destinationRoot, copied);
  console.log(JSON.stringify({
    project_root: destinationRoot,
    copied,
    unchanged,
    agent_contract: agents,
    git,
    handoff: record,
    next_action: 'Open the generated project workspace. Complete/confirm its system model, apply the copied engineering defaults and deterministic skill bindings, then work on a safe non-default Git branch.',
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`Project handoff failed: ${error.message}`);
  process.exitCode = 1;
}
