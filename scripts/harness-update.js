#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HANDOFF = '.harness/handoff.json';
const BASELINE_ROOT = '.harness/baseline';
const MANIFEST = 'HARNESS-MANIFEST.json';
const DEFAULT_REPOSITORY = 'https://github.com/shaunpalmer/ai-project-starter.git';
const DEFAULT_REF = 'main';
const NON_INTERACTIVE_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: '0',
  GH_PROMPT_DISABLED: '1',
  GCM_INTERACTIVE: 'Never',
};

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
    } else result[key] = true;
  }
  return result;
}

function execText(command, args, cwd = ROOT, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: NON_INTERACTIVE_ENV,
    timeout: options.timeout ?? 30000,
  });
  if (result.error) {
    if (options.allowFailure) return { status: 127, stdout: '', stderr: result.error.message };
    throw new Error(`${command} failed: ${result.error.message}`);
  }
  if (result.status !== 0 && !options.allowFailure) {
    const detail = (result.stderr || result.stdout || `exit ${result.status}`).trim();
    throw new Error(`${command} ${args.join(' ')} failed: ${detail}`);
  }
  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function execBuffer(command, args, cwd = ROOT, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: null,
    env: NON_INTERACTIVE_ENV,
    timeout: options.timeout ?? 30000,
  });
  if (result.error) {
    if (options.allowFailure) return { status: 127, stdout: Buffer.alloc(0), stderr: Buffer.from(result.error.message) };
    throw new Error(`${command} failed: ${result.error.message}`);
  }
  if (result.status !== 0 && !options.allowFailure) {
    const detail = Buffer.concat([result.stderr || Buffer.alloc(0), result.stdout || Buffer.alloc(0)]).toString('utf8').trim();
    throw new Error(`${command} ${args.join(' ')} failed: ${detail || `exit ${result.status}`}`);
  }
  return {
    status: result.status,
    stdout: result.stdout || Buffer.alloc(0),
    stderr: result.stderr || Buffer.alloc(0),
  };
}

function git(args, cwd = ROOT, options = {}) {
  return execText('git', args, cwd, options);
}

function available(command, args = ['--version']) {
  return execText(command, args, ROOT, { allowFailure: true, timeout: 5000 }).status === 0;
}

function readJson(file, required = true) {
  if (!fs.existsSync(file)) {
    if (required) throw new Error(`Missing required file: ${file}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
  }
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function inside(root, relativePath) {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Managed path escapes root: ${relativePath}`);
  }
  return absolute;
}

function getProjectRoot(args) {
  const project = path.resolve(args.cwd || process.cwd());
  if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) throw new Error(`Project directory does not exist: ${project}`);
  return project;
}

function repoRoot(cwd) {
  const result = git(['rev-parse', '--show-toplevel'], cwd, { allowFailure: true });
  return result.status === 0 ? path.resolve(result.stdout) : null;
}

function currentBranch(cwd) {
  const result = git(['branch', '--show-current'], cwd, { allowFailure: true });
  return result.status === 0 ? result.stdout : '';
}

function clean(cwd) {
  return git(['status', '--porcelain'], cwd, { allowFailure: true }).stdout === '';
}

function identity(cwd) {
  const name = git(['config', '--get', 'user.name'], cwd, { allowFailure: true });
  const email = git(['config', '--get', 'user.email'], cwd, { allowFailure: true });
  return { name: name.status === 0 ? name.stdout : null, email: email.status === 0 ? email.stdout : null };
}

function loadManifest(sourceRoot) {
  const manifest = readJson(path.join(sourceRoot, MANIFEST));
  if (manifest.schema_version !== 1 || !manifest.harness_version || !Array.isArray(manifest.files)) throw new Error(`Unsupported ${MANIFEST}.`);
  const targets = new Set();
  for (const file of manifest.files) {
    if (!file?.source_path || !file?.target_path || !['managed', 'extensible'].includes(file.ownership)) throw new Error(`Malformed entry in ${MANIFEST}.`);
    if (targets.has(file.target_path)) throw new Error(`Duplicate managed target: ${file.target_path}`);
    targets.add(file.target_path);
  }
  return manifest;
}

function sourceCommit(sourceRoot) {
  const result = git(['rev-parse', 'HEAD'], sourceRoot, { allowFailure: true });
  return result.status === 0 ? result.stdout : 'filesystem';
}

function acquireSource(args, handoff = null) {
  if (typeof args['source-root'] === 'string') {
    const root = path.resolve(args['source-root']);
    if (!fs.existsSync(path.join(root, MANIFEST))) throw new Error(`Source root has no ${MANIFEST}: ${root}`);
    return { root, repository: 'local-filesystem', ref: 'local', commit: sourceCommit(root), cleanup: () => {} };
  }

  if (!available('git')) throw new Error('Git is required to retrieve the latest harness.');
  const repository = String(args.repository || handoff?.source?.repository || DEFAULT_REPOSITORY);
  const ref = String(args.ref || handoff?.source?.ref || DEFAULT_REF);
  if (/^https?:\/\/[^/]*@/i.test(repository)) throw new Error('Harness source URL must not contain embedded credentials.');

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-source-'));
  const cleanup = () => fs.rmSync(temp, { recursive: true, force: true });
  try {
    git(['clone', '--quiet', '--no-checkout', repository, temp], ROOT, { timeout: 120000 });
    git(['fetch', '--quiet', 'origin', ref], temp, { timeout: 120000 });
    git(['checkout', '--quiet', '--detach', 'FETCH_HEAD'], temp);
    return { root: temp, repository, ref, commit: sourceCommit(temp), cleanup };
  } catch (error) {
    cleanup();
    throw error;
  }
}

function content(file) {
  return fs.existsSync(file) && fs.statSync(file).isFile() ? fs.readFileSync(file) : null;
}

function baselinePath(project, target) {
  return inside(project, path.join(BASELINE_ROOT, target));
}

function gitShow(sourceRoot, commit, sourcePath) {
  if (!commit || ['filesystem', 'unavailable'].includes(commit)) return null;
  const result = execBuffer('git', ['show', `${commit}:${slash(sourcePath)}`], sourceRoot, { allowFailure: true, timeout: 20000 });
  return result.status === 0 ? result.stdout : null;
}

function equal(left, right) {
  if (left === null || right === null) return left === right;
  return left.equals(right);
}

function threeWay(local, base, incoming) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-merge-'));
  try {
    const localFile = path.join(temp, 'local');
    const baseFile = path.join(temp, 'base');
    const incomingFile = path.join(temp, 'incoming');
    fs.writeFileSync(localFile, local);
    fs.writeFileSync(baseFile, base);
    fs.writeFileSync(incomingFile, incoming);
    const result = execBuffer('git', ['merge-file', '-p', localFile, baseFile, incomingFile], temp, { allowFailure: true });
    return { clean: result.status === 0, result: result.stdout };
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function normalizeHandoff(project, source) {
  const handoff = readJson(path.join(project, HANDOFF), false);
  if (!handoff) return null;
  if (handoff.schema_version === 2 && Array.isArray(handoff.files)) return handoff;
  if (handoff.schema_version !== 1) throw new Error(`Unsupported handoff schema: ${handoff.schema_version}`);

  const manifest = loadManifest(source.root);
  const installed = new Set(Array.isArray(handoff.installed) ? handoff.installed : []);
  const previousCommit = handoff.harness_head || null;
  const reconstructed = {};
  const files = [];

  for (const file of manifest.files) {
    if (!installed.has(file.target_path)) continue;
    const base = gitShow(source.root, previousCommit, file.source_path);
    if (base) reconstructed[file.target_path] = base.toString('base64');
    files.push({
      source_path: file.source_path,
      target_path: file.target_path,
      ownership: file.ownership,
      baseline_sha256: base ? hash(base) : null,
      baseline_origin: base ? 'reconstructed-source-commit' : 'unknown',
    });
  }

  return {
    schema_version: 2,
    installed_version: handoff.handoff_version || '0.4',
    source: {
      repository: manifest.source?.repository || DEFAULT_REPOSITORY,
      ref: manifest.source?.ref || DEFAULT_REF,
      commit: previousCommit,
    },
    files,
    reconstructed_baselines: reconstructed,
    migrated_from_schema: 1,
  };
}

function trustedBase(project, source, handoff, previous, file) {
  const snapshot = content(baselinePath(project, file.target_path));
  if (snapshot) return snapshot;
  const encoded = handoff?.reconstructed_baselines?.[file.target_path];
  if (encoded) return Buffer.from(encoded, 'base64');
  if (previous?.baseline_sha256 && handoff?.source?.commit) return gitShow(source.root, handoff.source.commit, previous.source_path || file.source_path);
  return null;
}

function buildPlan(project, source, handoff, manifest) {
  const previous = new Map((handoff.files || []).map((file) => [file.target_path, file]));
  const latestTargets = new Set(manifest.files.map((file) => file.target_path));
  const plan = [];

  for (const file of manifest.files) {
    const local = content(inside(project, file.target_path));
    const incoming = content(inside(source.root, file.source_path));
    if (!incoming) throw new Error(`Latest manifest points to missing source: ${file.source_path}`);
    const base = trustedBase(project, source, handoff, previous.get(file.target_path), file);

    let action;
    let result = local;
    let reason;

    if (!base) {
      if (!local) {
        action = 'add'; result = incoming; reason = 'new-upstream-managed-file';
      } else if (equal(local, incoming)) {
        action = 'baseline'; reason = 'local-matches-incoming';
      } else {
        action = 'conflict'; result = null; reason = 'no-trusted-baseline-for-existing-local-file';
      }
    } else if (!local) {
      if (equal(incoming, base)) {
        action = 'preserve-local-deletion'; result = null; reason = 'project-deleted-upstream-unchanged';
      } else {
        action = 'conflict'; result = null; reason = 'project-deleted-and-upstream-changed';
      }
    } else if (equal(local, incoming)) {
      action = 'unchanged'; reason = 'already-current';
    } else if (equal(local, base)) {
      action = 'replace'; result = incoming; reason = 'upstream-only-change';
    } else if (equal(incoming, base)) {
      action = 'preserve-local'; reason = 'project-only-change';
    } else {
      const merged = threeWay(local, base, incoming);
      action = merged.clean ? 'merge' : 'conflict';
      result = merged.clean ? merged.result : null;
      reason = merged.clean ? 'clean-three-way-merge' : 'three-way-conflict';
    }

    plan.push({ ...file, action, reason, result, incoming, base_sha256: base ? hash(base) : null, local_sha256: local ? hash(local) : null, incoming_sha256: hash(incoming) });
  }

  for (const file of previous.values()) {
    if (!latestTargets.has(file.target_path)) plan.push({ ...file, action: 'deprecated', reason: 'removed-upstream-preserved-locally', result: content(inside(project, file.target_path)), incoming: null });
  }
  return plan;
}

function summarise(plan) {
  const counts = {};
  for (const file of plan) counts[file.action] = (counts[file.action] || 0) + 1;
  const changes = plan.filter((file) => ['add', 'replace', 'merge'].includes(file.action)).map((file) => ({ path: file.target_path, action: file.action, reason: file.reason }));
  const conflicts = plan.filter((file) => file.action === 'conflict').map((file) => ({ path: file.target_path, reason: file.reason }));
  return { counts, changes, conflicts, safe_to_apply: conflicts.length === 0 };
}

function lifecycleBranch(project, name) {
  const root = repoRoot(project);
  if (!root || root !== path.resolve(project)) throw new Error('Harness lifecycle requires the project root to be its own Git repository.');
  if (!clean(project)) throw new Error('Harness lifecycle requires a clean worktree. Checkpoint product work first.');
  const who = identity(project);
  if (!who.name || !who.email) throw new Error('Git user.name and user.email must be configured before lifecycle writes.');
  const current = currentBranch(project);
  if (!current) throw new Error('Detached HEAD is not supported for lifecycle writes.');
  if (current === name) return name;
  const exists = git(['show-ref', '--verify', '--quiet', `refs/heads/${name}`], project, { allowFailure: true }).status === 0;
  if (exists) throw new Error(`Lifecycle branch already exists: ${name}`);
  git(['switch', '-c', name], project);
  return name;
}

function writeBaseline(project, target, incoming) {
  const file = baselinePath(project, target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, incoming);
  return slash(path.relative(project, file));
}

function checkpoint(project, message, files) {
  const unique = [...new Set(files)];
  git(['add', '--', ...unique], project);
  const staged = git(['diff', '--cached', '--name-only'], project).stdout.split(/\r?\n/).filter(Boolean);
  const escaped = staged.filter((file) => !unique.includes(file));
  if (escaped.length) throw new Error(`Lifecycle staging escaped intended files: ${escaped.join(', ')}`);
  if (!staged.length) return null;
  git(['commit', '-m', message], project);
  return git(['rev-parse', 'HEAD'], project).stdout;
}

function handoffFor(source, manifest, plan) {
  return {
    schema_version: 2,
    installed_version: manifest.harness_version,
    source: {
      repository: source.repository === 'local-filesystem' ? (manifest.source?.repository || DEFAULT_REPOSITORY) : source.repository,
      ref: source.ref === 'local' ? (manifest.source?.ref || DEFAULT_REF) : source.ref,
      commit: source.commit,
    },
    files: plan.filter((file) => file.incoming !== null).map((file) => ({
      source_path: file.source_path,
      target_path: file.target_path,
      ownership: file.ownership,
      baseline_sha256: hash(file.incoming),
      baseline_origin: 'upstream',
    })),
    updated_at: new Date().toISOString(),
  };
}

function apply(project, source, manifest, plan) {
  const summary = summarise(plan);
  if (!summary.safe_to_apply) throw new Error(`Harness update has ${summary.conflicts.length} unresolved conflict(s); no project files were changed.`);
  const branch = lifecycleBranch(project, `harness/update-${manifest.harness_version}`);
  const touched = [];

  for (const file of plan) {
    if (['add', 'replace', 'merge'].includes(file.action)) {
      const target = inside(project, file.target_path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.result);
      touched.push(file.target_path);
    }
    if (file.incoming !== null) touched.push(writeBaseline(project, file.target_path, file.incoming));
  }

  const handoff = handoffFor(source, manifest, plan);
  const handoffFile = path.join(project, HANDOFF);
  fs.mkdirSync(path.dirname(handoffFile), { recursive: true });
  fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`);
  touched.push(HANDOFF);

  const diffCheck = git(['diff', '--check'], project, { allowFailure: true });
  if (diffCheck.status !== 0) throw new Error(`Update failed git diff --check: ${diffCheck.stdout || diffCheck.stderr}`);
  const commit = checkpoint(project, `Update harness to ${manifest.harness_version}`, touched);
  return { action: 'updated', version: manifest.harness_version, source_commit: source.commit, branch, checkpoint: commit, files_changed: summary.changes };
}

function localPackageVersion(project) {
  return readJson(path.join(project, 'package.json'), false)?.version || null;
}

function commitForVersion(sourceRoot, version) {
  if (!version || sourceCommit(sourceRoot) === 'filesystem') return null;
  const commits = git(['rev-list', '--first-parent', 'HEAD'], sourceRoot, { allowFailure: true, timeout: 30000 });
  if (commits.status !== 0) return null;
  for (const commit of commits.stdout.split(/\r?\n/).filter(Boolean)) {
    const packageFile = execBuffer('git', ['show', `${commit}:package.json`], sourceRoot, { allowFailure: true });
    if (packageFile.status !== 0) continue;
    try {
      if (JSON.parse(packageFile.stdout.toString('utf8')).version === version) return commit;
    } catch {
      // Historical malformed package metadata is not a trusted baseline.
    }
  }
  return null;
}

function adopt(project, source) {
  if (fs.existsSync(path.join(project, HANDOFF))) throw new Error('Lifecycle handoff already exists; run update --check instead.');
  const manifest = loadManifest(source.root);
  const version = localPackageVersion(project);
  const baselineCommit = commitForVersion(source.root, version);
  if (!baselineCommit) throw new Error('Cannot establish a trusted legacy baseline automatically. No files were changed.');
  const branch = lifecycleBranch(project, `harness/adopt-${version}`);
  const files = [];
  const touched = [];

  for (const file of manifest.files) {
    const base = gitShow(source.root, baselineCommit, file.source_path);
    const local = content(inside(project, file.target_path));
    if (!base && !local) continue;
    if (base) {
      touched.push(writeBaseline(project, file.target_path, base));
      files.push({ source_path: file.source_path, target_path: file.target_path, ownership: file.ownership, baseline_sha256: hash(base), baseline_origin: 'legacy-version-reconstruction' });
    }
  }

  const handoff = {
    schema_version: 2,
    installed_version: version,
    source: {
      repository: source.repository === 'local-filesystem' ? (manifest.source?.repository || DEFAULT_REPOSITORY) : source.repository,
      ref: source.ref === 'local' ? (manifest.source?.ref || DEFAULT_REF) : source.ref,
      commit: baselineCommit,
    },
    files,
    adopted_at: new Date().toISOString(),
  };
  const handoffFile = path.join(project, HANDOFF);
  fs.mkdirSync(path.dirname(handoffFile), { recursive: true });
  fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`, { flag: 'wx' });
  touched.push(HANDOFF);
  const commit = checkpoint(project, `Adopt harness lifecycle baseline ${version}`, touched);
  console.log(JSON.stringify({ action: 'adopted', installed_version: version, baseline_commit: baselineCommit, branch, checkpoint: commit, managed_files: files.length, next: 'Run harness update --check.' }, null, 2));
}

function doctor(project, args) {
  const handoff = readJson(path.join(project, HANDOFF), false);
  const root = repoRoot(project);
  const cli = {};
  for (const [name, command, versionArgs] of [
    ['git', 'git', ['--version']], ['gh', 'gh', ['--version']], ['node', 'node', ['--version']],
    ['npm', 'npm', ['--version']], ['pnpm', 'pnpm', ['--version']], ['yarn', 'yarn', ['--version']],
    ['python', 'python3', ['--version']], ['uv', 'uv', ['--version']], ['poetry', 'poetry', ['--version']],
    ['pipx', 'pipx', ['--version']], ['composer', 'composer', ['--version']], ['bash', 'bash', ['--version']],
    ['powershell', 'pwsh', ['--version']],
  ]) cli[name] = available(command, versionArgs);

  const findings = [];
  if (!cli.git) findings.push({ severity: 'error', code: 'git-missing', message: 'Git is required for managed harness lifecycle operations.' });
  if (!cli.node) findings.push({ severity: 'error', code: 'node-missing', message: 'Node is required for the harness controller.' });
  if (!root) findings.push({ severity: 'error', code: 'repo-missing', message: 'Project is not under Git.' });
  if (root && root !== project) findings.push({ severity: 'warning', code: 'nested-repo', message: 'Project root is nested inside another Git repository.' });
  if (!handoff) findings.push({ severity: 'warning', code: 'legacy-unmanaged', message: 'No lifecycle handoff manifest found. Run harness adopt before update.' });
  if (handoff?.schema_version === 1) findings.push({ severity: 'warning', code: 'handoff-v1', message: 'Legacy v0.4 handoff will be reconstructed during update check.' });
  if (handoff?.schema_version === 2) {
    for (const file of handoff.files || []) {
      if (!content(inside(project, file.target_path))) findings.push({ severity: 'warning', code: 'managed-file-missing', path: file.target_path, message: 'Managed file is missing locally.' });
      if (!content(baselinePath(project, file.target_path))) findings.push({ severity: 'warning', code: 'baseline-missing', path: file.target_path, message: 'Managed file has no local three-way baseline.' });
    }
  }

  let sourceReachable = null;
  if (args.online && cli.git) {
    const repository = handoff?.source?.repository || DEFAULT_REPOSITORY;
    const ref = handoff?.source?.ref || DEFAULT_REF;
    sourceReachable = git(['ls-remote', '--exit-code', repository, ref], project, { allowFailure: true, timeout: 15000 }).status === 0;
    if (!sourceReachable) findings.push({ severity: 'warning', code: 'source-unreachable', message: 'Latest harness source could not be reached non-interactively.' });
  }

  console.log(JSON.stringify({
    ok: findings.every((finding) => finding.severity !== 'error'),
    project_root: project,
    installed_version: handoff?.installed_version || localPackageVersion(project),
    handoff_schema: handoff?.schema_version || null,
    git: root ? { root, branch: currentBranch(project), clean: clean(project), identity: identity(project) } : null,
    cli,
    source_reachable: sourceReachable,
    findings,
  }, null, 2));
  if (findings.some((finding) => finding.severity === 'error')) process.exitCode = 1;
}

function update(project, args) {
  let source;
  try {
    const existing = readJson(path.join(project, HANDOFF), false);
    source = acquireSource(args, existing);
    const manifest = loadManifest(source.root);
    const handoff = normalizeHandoff(project, source);
    if (!handoff) throw new Error('Project has no lifecycle handoff manifest. Run `harness adopt` first.');
    const plan = buildPlan(project, source, handoff, manifest);
    const summary = summarise(plan);
    const report = { installed_version: handoff.installed_version, available_version: manifest.harness_version, source_commit: source.commit, ...summary };
    if (args.apply) console.log(JSON.stringify({ ...report, ...apply(project, source, manifest, plan) }, null, 2));
    else console.log(JSON.stringify({ action: 'check', ...report, next: summary.safe_to_apply ? 'Run harness update --apply.' : 'Resolve the reported conflict(s) before applying.' }, null, 2));
  } finally {
    source?.cleanup?.();
  }
}

function usage() {
  console.log(`Usage:\n  node scripts/harness-update.js doctor [--online] [--cwd /project]\n  node scripts/harness-update.js update --check [--source-root /harness | --repository <git-url> --ref main]\n  node scripts/harness-update.js update --apply [source options]\n  node scripts/harness-update.js adopt [source options]\n\nUpdates use three-way comparison: installed baseline vs project-local file vs latest upstream file. Real conflicts block replacement.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  const project = getProjectRoot(args);
  if (!command || command === 'help') return usage();
  if (command === 'doctor') return doctor(project, args);
  if (command === 'adopt') {
    const source = acquireSource(args);
    try { return adopt(project, source); } finally { source.cleanup(); }
  }
  if (command === 'update') {
    if (!args.check && !args.apply) args.check = true;
    if (args.check && args.apply) throw new Error('Choose either --check or --apply.');
    return update(project, args);
  }
  throw new Error(`Unknown harness lifecycle command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`Harness lifecycle failed: ${error.message}`);
  process.exitCode = 1;
}
