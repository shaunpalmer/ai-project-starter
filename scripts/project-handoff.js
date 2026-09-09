#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'HARNESS-MANIFEST.json');
const AGENT_BEGIN = '<!-- HARNESS:BEGIN -->';
const AGENT_END = '<!-- HARNESS:END -->';
const NON_INTERACTIVE_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: '0',
  GH_PROMPT_DISABLED: '1',
  GCM_INTERACTIVE: 'Never',
};

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      i += 1;
    } else result[key] = true;
  }
  return result;
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
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

function readManifest() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (manifest.schema_version !== 1 || !manifest.harness_version || !Array.isArray(manifest.files)) throw new Error('HARNESS-MANIFEST.json is malformed.');
  return manifest;
}

function safeTarget(root, relativePath) {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`Managed path escapes project root: ${relativePath}`);
  return absolute;
}

function sameFile(source, destination) {
  return fs.existsSync(destination)
    && fs.statSync(destination).isFile()
    && fs.readFileSync(source).equals(fs.readFileSync(destination));
}

function copyManagedFile(projectRoot, entry, copied, unchanged) {
  const source = path.join(ROOT, entry.source_path);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error(`Harness handoff source is missing: ${entry.source_path}`);
  const destination = safeTarget(projectRoot, entry.target_path);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) {
    if (!sameFile(source, destination)) throw new Error(`Refusing to overwrite project-customised file: ${entry.target_path}. Use the harness updater for three-way reconciliation.`);
    unchanged.push(entry.target_path);
  } else {
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    copied.push(entry.target_path);
  }
  return fs.readFileSync(source);
}

function writeBaseline(projectRoot, targetPath, content) {
  const destination = safeTarget(projectRoot, path.join('.harness', 'baseline', targetPath));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) {
    if (!fs.readFileSync(destination).equals(content)) throw new Error(`Existing harness baseline differs for ${targetPath}; use harness update instead of handoff.`);
    return;
  }
  fs.writeFileSync(destination, content, { flag: 'wx' });
}

function agentBlock() {
  return `${AGENT_BEGIN}\n## Harness operating handoff\n\n- Read \`ENGINEERING-DEFAULTS.md\` before routine implementation choices.\n- Use \`.github/skills/skill-router/SKILL.md\` after the system model is confirmed.\n- Confirmed WordPress work automatically binds The WordPress Way and the WordPress plugin skill.\n- Confirmed scraping/ingestion work automatically binds the scraping-pipeline skill.\n- Use the command-line operator skill for terminal discovery, project-scoped installs/updates, and non-interactive verification.\n- Routine engineering question budget is zero; ask only for consequential decisions under the project decision-right contract.\n- Use \`node scripts/harness.mjs doctor\` for lifecycle health and \`node scripts/harness.mjs update --check\` / \`--apply\` for managed harness upgrades.\n- Use \`node scripts/harness.mjs vcs ...\` for Git preflight, safe branches, focused checkpoints, remote verification, and authorised non-default-branch pushes.\n- Never store credentials, broadly stage the worktree, force push, push managed work directly to main/master, merge, deploy, or release without the required authority.\n${AGENT_END}`;
}

function appendAgentHandoff(projectRoot) {
  const agentsPath = path.join(projectRoot, 'AGENTS.md');
  const current = fs.readFileSync(agentsPath, 'utf8');
  if (current.includes(AGENT_BEGIN) && current.includes(AGENT_END)) return 'already-present';
  if (current.includes('## Harness v0.4 operating handoff')) throw new Error('Legacy v0.4 agent handoff detected. Use harness update so the project can be reconciled safely.');
  fs.appendFileSync(agentsPath, `\n${agentBlock()}\n`);
  return 'appended';
}

function runGit(args, cwd, allowFailure = false) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', env: NON_INTERACTIVE_ENV, timeout: 30000 });
  if (result.error) throw new Error(`git failed: ${result.error.message}`);
  if (result.status !== 0 && !allowFailure) throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout).trim()}`);
  return { status: result.status, stdout: (result.stdout || '').trim(), stderr: (result.stderr || '').trim() };
}

function ensureLocalGit(projectRoot) {
  const check = runGit(['rev-parse', '--show-toplevel'], projectRoot, true);
  if (check.status === 0) return { action: 'already-initialized', repo_root: check.stdout };
  const vcsScript = path.join(projectRoot, 'scripts', 'vcs-control.mjs');
  const result = spawnSync(process.execPath, [vcsScript, 'init', '--cwd', projectRoot, '--branch', 'work/bootstrap'], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: NON_INTERACTIVE_ENV,
    timeout: 30000,
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || 'VCS init failed').trim());
  return JSON.parse(result.stdout);
}

function harnessHead() {
  const result = runGit(['rev-parse', 'HEAD'], ROOT, true);
  return result.status === 0 ? result.stdout : 'filesystem';
}

function existingHandoff(projectRoot) {
  const handoffPath = path.join(projectRoot, '.harness', 'handoff.json');
  if (!fs.existsSync(handoffPath)) return null;
  return JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
}

function writeHandoff(projectRoot, manifest, files) {
  const handoffPath = path.join(projectRoot, '.harness', 'handoff.json');
  const existing = existingHandoff(projectRoot);
  if (existing) {
    if (existing.schema_version === 2 && existing.installed_version === manifest.harness_version) return existing;
    throw new Error('A different/legacy harness handoff already exists. Use harness update rather than reinstalling over it.');
  }
  const record = {
    schema_version: 2,
    installed_version: manifest.harness_version,
    source: {
      repository: manifest.source?.repository || 'https://github.com/shaunpalmer/ai-project-starter.git',
      ref: manifest.source?.ref || 'main',
      commit: harnessHead(),
    },
    files,
    rules: {
      engineering_defaults: 'ENGINEERING-DEFAULTS.md',
      skill_root: '.github/skills',
      command_line_skill: '.github/skills/command-line/SKILL.md',
      vcs_controller: 'scripts/vcs-control.mjs',
      lifecycle_controller: 'scripts/harness.mjs',
      agent_contract: 'AGENTS.md',
    },
    installed_at: new Date().toISOString(),
  };
  fs.writeFileSync(handoffPath, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  return record;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args['project-root'] || typeof args['project-root'] !== 'string') throw new Error('Usage: node scripts/project-handoff.js --project-root /absolute/path');
  const projectRoot = assertProjectRoot(path.resolve(args['project-root']));
  const manifest = readManifest();
  const existing = existingHandoff(projectRoot);
  if (existing && !(existing.schema_version === 2 && existing.installed_version === manifest.harness_version)) {
    throw new Error('Project already has a different harness lifecycle state. Run its harness doctor/update commands instead.');
  }

  const copied = [];
  const unchanged = [];
  const files = [];
  for (const entry of manifest.files) {
    const content = copyManagedFile(projectRoot, entry, copied, unchanged);
    writeBaseline(projectRoot, entry.target_path, content);
    files.push({
      source_path: entry.source_path,
      target_path: entry.target_path,
      ownership: entry.ownership,
      baseline_sha256: sha256(content),
      baseline_origin: 'upstream',
    });
  }

  const agentContract = appendAgentHandoff(projectRoot);
  const git = ensureLocalGit(projectRoot);
  const handoff = writeHandoff(projectRoot, manifest, files);
  console.log(JSON.stringify({
    project_root: projectRoot,
    harness_version: manifest.harness_version,
    copied,
    unchanged,
    agent_contract: agentContract,
    git,
    handoff,
    next_action: 'Run node scripts/harness.mjs doctor, then continue project discovery/execution on a safe non-default Git branch.',
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`Project handoff failed: ${error.message}`);
  process.exitCode = 1;
}
