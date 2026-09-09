#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HANDOFF_RELATIVE = '.harness/handoff.json';
const BASELINE_ROOT = '.harness/baseline';
const MANIFEST_NAME = 'HARNESS-MANIFEST.json';
const DEFAULT_REPOSITORY = 'https://github.com/shaunpalmer/ai-project-starter.git';
const DEFAULT_REF = 'main';
const PROTECTED_BRANCHES = new Set(['main', 'master']);
const NON_INTERACTIVE_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: '0',
  GH_PROMPT_DISABLED: '1',
  GCM_INTERACTIVE: 'Never',
};

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

function run(command, args, cwd = ROOT, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: NON_INTERACTIVE_ENV,
    timeout: options.timeout ?? 30000,
  });
  if (result.error) throw new Error(`${command} failed: ${result.error.message}`);
  if (result.status !== 0 && !options.allowFailure) {
    const detail = (result.stderr || result.stdout || `exit ${result.status}`).trim();
    throw new Error(`${command} ${args.join(' ')} failed: ${detail}`);
  }
  return {
    status: result.status,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  };
}

function git(args, cwd = ROOT, options = {}) {
  return run('git', args, cwd, options);
}

function commandAvailable(command, args = ['--version']) {
  return run(command, args, ROOT, { allowFailure: true, timeout: 5000 }).status === 0;
}

function readJson(absolutePath, required = true) {
  if (!fs.existsSync(absolutePath)) {
    if (required) throw new Error(`Missing required file: ${absolutePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${absolutePath}: ${error.message}`);
  }
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function ensureInside(root, relativePath) {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Managed path escapes project root: ${relativePath}`);
  }
  return absolute;
}

function projectRoot(args) {
  const candidate = path.resolve(args.cwd || process.cwd());
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) throw new Error(`Project directory does not exist: ${candidate}`);
  return candidate;
}

function repoRoot(cwd) {
  const result = git(['rev-parse', '--show-toplevel'], cwd, { allowFailure: true });
  return result.status === 0 ? path.resolve(result.stdout) : null;
}

function currentBranch(root) {
  const result = git(['branch', '--show-current'], root, { allowFailure: true });
  return result.status === 0 ? result.stdout : '';
}

function gitClean(root) {
  return git(['status', '--porcelain'], root).stdout === '';
}

function gitIdentity(root) {
  const name = git(['config', '--get', 'user.name'], root, { allowFailure: true });
  const email = git(['config', '--get', 'user.email'], root, { allowFailure: true });
  return {
    name: name.status === 0 ? name.stdout : null,
    email: email.status === 0 ? email.stdout : null,
  };
}

function loadManifest(sourceRoot) {
  const manifest = readJson(path.join(sourceRoot, MANIFEST_NAME));
  if (manifest.schema_version !== 1 || typeof manifest.harness_version !== 'string' || !Array.isArray(manifest.files)) {
    throw new Error(`Unsupported ${MANIFEST_NAME}.`);
  }
  const targets = new Set();
  for (const item of manifest.files) {
    if (!item?.source_path || !item?.target_path || !['managed', 'extensible'].includes(item.ownership)) {
      throw new Error(`Malformed managed-file entry in ${MANIFEST_NAME}.`);
    }
    if (targets.has(item.target_path)) throw new Error(`Duplicate managed target: ${item.target_path}`);
    targets.add(item.target_path);
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
    if (!fs.existsSync(path.join(root, MANIFEST_NAME))) throw new Error(`Source root has no ${MANIFEST_NAME}: ${root}`);
    return { root, cleanup: () => {}, repository: 'local-filesystem', ref: 'local', commit: sourceCommit(root) };
  }

  if (!commandAvailable('git')) throw new Error('Git is required to retrieve the latest harness.');
  const repository = String(args.repository || handoff?.source?.repository || DEFAULT_REPOSITORY);
  const ref = String(args.ref || handoff?.source?.ref || DEFAULT_REF);
  if (/^https?:\/\/[^/]*@/i.test(repository)) throw new Error('Harness source URL must not contain embedded credentials.');

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-source-'));
  const cleanup = () => fs.rmSync(temp, { recursive: true, force: true });
  try {
    git(['clone', '--quiet', '--no-checkout', repository, temp], ROOT, { timeout: 120000 });
    git(['fetch', '--quiet', 'origin', ref], temp, { timeout: 120000 });
    git(['checkout', '--quiet', '--detach', 'FETCH_HEAD'], temp);
    return { root: temp, cleanup, repository, ref, commit: sourceCommit(temp) };
  } catch (error) {
    cleanup();
    throw error;
  }
}

function baselinePath(project, targetPath) {
  return ensureInside(project, path.join(BASELINE_ROOT, targetPath));
}

function fileContent(absolutePath) {
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()
    ? fs.readFileSync(absolutePath)
    : null;
}

function sourceContent(sourceRoot, sourcePath) {
  return fileContent(ensureInside(sourceRoot, sourcePath));
}

function gitShow(sourceRoot, commit, sourcePath) {
  if (!commit || commit === 'filesystem') return null;
  const result = git(['show', `${commit}:${slash(sourcePath)}`], sourceRoot, { allowFailure: true, timeout: 20000 });
  return result.status === 0 ? Buffer.from(result.stdout + (result.stdout ? '\n' : ''), 'utf8') : null;
}

function bufferEqual(a, b) {
  if (a === null || b === null) return a === b;
  return a.equals(b);
}

function mergeThreeWay(local, base, incoming) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-merge-'));
  try {
    const localPath = path.join(temp, 'local');
    const basePath = path.join(temp, 'base');
    const incomingPath = path.join(temp, 'incoming');
    fs.writeFileSync(localPath, local);
    fs.writeFileSync(basePath, base);
    fs.writeFileSync(incomingPath, incoming);
    const result = run('git', ['merge-file', '-p', localPath, basePath, incomingPath], temp, { allowFailure: true });
    return {
      clean: result.status === 0,
      content: Buffer.from(result.stdout, 'utf8'),
      evidence: result.status === 0 ? 'git-merge-file-clean' : 'git-merge-file-conflict',
    };
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function normalizeHandoff(project, source) {
  const handoffPath = path.join(project, HANDOFF_RELATIVE);
  const handoff = readJson(handoffPath, false);
  if (!handoff) return null;
  if (handoff.schema_version === 2 && Array.isArray(handoff.files)) return handoff;
  if (handoff.schema_version !== 1) throw new Error(`Unsupported handoff schema: ${handoff.schema_version}`);

  const latestManifest = loadManifest(source.root);
  const previousCommit = handoff.harness_head || null;
  const installedTargets = new Set(Array.isArray(handoff.installed) ? handoff.installed : []);
  const files = [];
  for (const item of latestManifest.files) {
    if (!installedTargets.has(item.target_path)) continue;
    const local = fileContent(ensureInside(project, item.target_path));
    let base = null;
    if (previousCommit && previousCommit !== 'unavailable') base = gitShow(source.root, previousCommit, item.source_path);
    files.push({
      source_path: item.source_path,
      target_path: item.target_path,
      ownership: item.ownership,
      baseline_sha256: base ? sha256(base) : null,
      baseline_origin: base ? 'reconstructed-source-commit' : 'unknown',
      local_sha256_at_migration: local ? sha256(local) : null,
    });
    if (base) {
      const target = baselinePath(project, item.target_path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, base);
    }
  }
  return {
    schema_version: 2,
    installed_version: handoff.handoff_version || '0.4',
    source: {
      repository: latestManifest.source?.repository || DEFAULT_REPOSITORY,
      ref: latestManifest.source?.ref || DEFAULT_REF,
      commit: previousCommit,
    },
    files,
    migrated_from_schema: 1,
  };
}

function planUpdate(project, source, handoff, manifest) {
  const previous = new Map((handoff?.files || []).map((item) => [item.target_path, item]));
  const currentTargets = new Set(manifest.files.map((item) => item.target_path));
  const plan = [];

  for (const item of manifest.files) {
    const localPath = ensureInside(project, item.target_path);
    const local = fileContent(localPath);
    const incoming = sourceContent(source.root, item.source_path);
    if (incoming === null) throw new Error(`Latest manifest points to missing source file: ${item.source_path}`);

    let base = fileContent(baselinePath(project, item.target_path));
    const prior = previous.get(item.target_path);
    if (base === null && prior?.baseline_sha256 && handoff?.source?.commit) {
      base = gitShow(source.root, handoff.source.commit, prior.source_path || item.source_path);
    }

    let action = 'unchanged';
    let result = local;
    let reason = 'local-and-incoming-match';

    if (base === null) {
      if (local === null) {
        action = 'add';
        result = incoming;
        reason = 'new-upstream-managed-file';
      } else if (bufferEqual(local, incoming)) {
        action = 'baseline';
        result = local;
        reason = 'local-matches-incoming';
      } else {
        action = 'conflict';
        result = null;
        reason = 'no-trusted-baseline-for-existing-local-file';
      }
    } else if (local === null) {
      if (bufferEqual(incoming, base)) {
        action = 'preserve-local-deletion';
        result = null;
        reason = 'project-deleted-file-upstream-unchanged';
      } else {
        action = 'conflict';
        result = null;
        reason = 'project-deleted-file-and-upstream-changed';
      }
    } else if (bufferEqual(local, incoming)) {
      action = 'unchanged';
      result = local;
      reason = 'already-current';
    } else if (bufferEqual(local, base)) {
      action = 'replace';
      result = incoming;
      reason = 'upstream-only-change';
    } else if (bufferEqual(incoming, base)) {
      action = 'preserve-local';
      result = local;
      reason = 'project-only-change';
    } else {
      const merge = mergeThreeWay(local, base, incoming);
      action = merge.clean ? 'merge' : 'conflict';
      result = merge.clean ? merge.content : null;
      reason = merge.evidence;
    }

    plan.push({
      source_path: item.source_path,
      target_path: item.target_path,
      ownership: item.ownership,
      action,
      reason,
      base_sha256: base ? sha256(base) : null,
      local_sha256: local ? sha256(local) : null,
      incoming_sha256: sha256(incoming),
      result,
      incoming,
    });
  }

  for (const prior of previous.values()) {
    if (!currentTargets.has(prior.target_path)) {
      plan.push({
        ...prior,
        action: 'deprecated',
        reason: 'removed-from-latest-manifest-preserved-locally',
        result: fileContent(ensureInside(project, prior.target_path)),
        incoming: null,
      });
    }
  }
  return plan;
}

function planSummary(plan) {
  const counts = {};
  for (const item of plan) counts[item.action] = (counts[item.action] || 0) + 1;
  const conflicts = plan.filter((item) => item.action === 'conflict').map((item) => ({ path: item.target_path, reason: item.reason }));
  const changes = plan.filter((item) => ['add', 'replace', 'merge'].includes(item.action)).map((item) => ({ path: item.target_path, action: item.action, reason: item.reason }));
  return { counts, changes, conflicts, safe_to_apply: conflicts.length === 0 };
}

function ensureUpdateBranch(project, version) {
  const root = repoRoot(project);
  if (!root || root !== path.resolve(project)) throw new Error('Harness update requires the project root to be its own Git repository.');
  if (!gitClean(root)) throw new Error('Harness update requires a clean worktree. Checkpoint product work first.');
  const identity = gitIdentity(root);
  if (!identity.name || !identity.email) throw new Error('Git user.name and user.email must be configured before harness update.');
  const branch = currentBranch(root);
  if (!branch) throw new Error('Detached HEAD is not supported for harness update.');
  const updateBranch = `harness/update-${version}`;
  if (branch === updateBranch) return { root, branch, action: 'already-on-update-branch' };
  const exists = git(['show-ref', '--verify', '--quiet', `refs/heads/${updateBranch}`], root, { allowFailure: true }).status === 0;
  if (exists) throw new Error(`Update branch already exists: ${updateBranch}. Resolve or remove it before retrying.`);
  git(['switch', '-c', updateBranch], root);
  return { root, branch: updateBranch, action: PROTECTED_BRANCHES.has(branch) ? 'branched-from-protected' : 'isolated-update-branch' };
}

function writeBaseline(project, targetPath, incoming) {
  const target = baselinePath(project, targetPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (incoming === null) return;
  fs.writeFileSync(target, incoming);
}

function handoffFromPlan(source, manifest, plan) {
  return {
    schema_version: 2,
    installed_version: manifest.harness_version,
    source: {
      repository: source.repository === 'local-filesystem' ? (manifest.source?.repository || DEFAULT_REPOSITORY) : source.repository,
      ref: source.ref === 'local' ? (manifest.source?.ref || DEFAULT_REF) : source.ref,
      commit: source.commit,
    },
    files: plan.filter((item) => item.incoming !== null).map((item) => ({
      source_path: item.source_path,
      target_path: item.target_path,
      ownership: item.ownership,
      baseline_sha256: item.incoming ? sha256(item.incoming) : null,
      baseline_origin: 'upstream',
    })),
    updated_at: new Date().toISOString(),
  };
}

function applyPlan(project, source, manifest, plan) {
  const summary = planSummary(plan);
  if (!summary.safe_to_apply) throw new Error(`Harness update has ${summary.conflicts.length} unresolved conflict(s); no project files were changed.`);
  const vcs = ensureUpdateBranch(project, manifest.harness_version);
  const touched = [];

  for (const item of plan) {
    if (['add', 'replace', 'merge'].includes(item.action)) {
      const target = ensureInside(project, item.target_path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, item.result);
      touched.push(item.target_path);
    }
    if (item.incoming !== null) {
      writeBaseline(project, item.target_path, item.incoming);
      touched.push(slash(path.relative(project, baselinePath(project, item.target_path))));
    }
  }

  const handoff = handoffFromPlan(source, manifest, plan);
  const handoffPath = path.join(project, HANDOFF_RELATIVE);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, `${JSON.stringify(handoff, null, 2)}\n`);
  touched.push(HANDOFF_RELATIVE);

  const diffCheck = git(['diff', '--check'], project, { allowFailure: true });
  if (diffCheck.status !== 0) throw new Error(`Update produced invalid whitespace/conflict evidence: ${diffCheck.stdout || diffCheck.stderr}`);

  const unique = [...new Set(touched)];
  git(['add', '--', ...unique], project);
  const staged = git(['diff', '--cached', '--name-only'], project).stdout.split(/\r?\n/).filter(Boolean);
  const unexpected = staged.filter((file) => !unique.includes(file));
  if (unexpected.length) throw new Error(`Harness update staging escaped the managed file set: ${unexpected.join(', ')}`);
  if (staged.length) git(['commit', '-m', `Update harness to ${manifest.harness_version}`], project);

  return {
    action: 'updated',
    version: manifest.harness_version,
    source_commit: source.commit,
    branch: vcs.branch,
    files_changed: summary.changes,
    checkpoint: staged.length ? git(['rev-parse', 'HEAD'], project).stdout : null,
  };
}

function localPackageVersion(project) {
  const packagePath = path.join(project, 'package.json');
  const packageJson = readJson(packagePath, false);
  return packageJson?.version || null;
}

function findCommitForVersion(sourceRoot, version) {
  if (!version || sourceCommit(sourceRoot) === 'filesystem') return null;
  const log = git(['log', '--format=%H', '--all', '--', 'package.json'], sourceRoot, { allowFailure: true, timeout: 30000 });
  if (log.status !== 0) return null;
  for (const commit of log.stdout.split(/\r?\n/).filter(Boolean)) {
    const shown = git(['show', `${commit}:package.json`], sourceRoot, { allowFailure: true });
    if (shown.status !== 0) continue;
    try {
      if (JSON.parse(shown.stdout).version === version) return commit;
    } catch {
      // Ignore historical malformed package metadata.
    }
  }
  return null;
}

function adopt(project, source) {
  if (fs.existsSync(path.join(project, HANDOFF_RELATIVE))) throw new Error('This project already has a harness handoff manifest; run update --check instead.');
  const manifest = loadManifest(source.root);
  const version = localPackageVersion(project);
  const baselineCommit = findCommitForVersion(source.root, version);
  if (!baselineCommit) throw new Error('Cannot establish a trusted legacy baseline automatically. Provide a project with a recognisable harness package version or migrate manually; no files were changed.');

  const files = [];
  for (const item of manifest.files) {
    const base = gitShow(source.root, baselineCommit, item.source_path);
    const local = fileContent(ensureInside(project, item.target_path));
    if (base === null && local === null) continue;
    if (base !== null) {
      writeBaseline(project, item.target_path, base);
      files.push({
        source_path: item.source_path,
        target_path: item.target_path,
        ownership: item.ownership,
        baseline_sha256: sha256(base),
        baseline_origin: 'legacy-version-reconstruction',
      });
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
  const handoffPath = path.join(project, HANDOFF_RELATIVE);
  fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
  fs.writeFileSync(handoffPath, `${JSON.stringify(handoff, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ action: 'adopted', installed_version: version, baseline_commit: baselineCommit, managed_files: files.length, next: 'Run harness update --check.' }, null, 2));
}

function doctor(project, args) {
  const handoff = readJson(path.join(project, HANDOFF_RELATIVE), false);
  const root = repoRoot(project);
  const tools = {};
  for (const [name, command, versionArgs] of [
    ['git', 'git', ['--version']], ['gh', 'gh', ['--version']], ['node', 'node', ['--version']],
    ['npm', 'npm', ['--version']], ['pnpm', 'pnpm', ['--version']], ['yarn', 'yarn', ['--version']],
    ['python', 'python3', ['--version']], ['uv', 'uv', ['--version']], ['poetry', 'poetry', ['--version']],
    ['pipx', 'pipx', ['--version']], ['composer', 'composer', ['--version']], ['bash', 'bash', ['--version']],
    ['powershell', 'pwsh', ['--version']],
  ]) tools[name] = commandAvailable(command, versionArgs);

  const findings = [];
  if (!tools.git) findings.push({ severity: 'error', code: 'git-missing', message: 'Git is required for managed harness lifecycle operations.' });
  if (!tools.node) findings.push({ severity: 'error', code: 'node-missing', message: 'Node is required for the harness controller.' });
  if (!root) findings.push({ severity: 'error', code: 'repo-missing', message: 'Project is not under Git.' });
  if (root && root !== project) findings.push({ severity: 'warning', code: 'nested-repo', message: 'Project root is nested inside another Git repository.' });
  if (!handoff) findings.push({ severity: 'warning', code: 'legacy-unmanaged', message: 'No lifecycle handoff manifest found. Run harness adopt before update.' });
  if (handoff?.schema_version === 1) findings.push({ severity: 'warning', code: 'handoff-v1', message: 'Legacy v0.4 handoff will be reconstructed during update check.' });
  if (handoff?.schema_version === 2) {
    for (const item of handoff.files || []) {
      const local = fileContent(ensureInside(project, item.target_path));
      const base = fileContent(baselinePath(project, item.target_path));
      if (!local) findings.push({ severity: 'warning', code: 'managed-file-missing', path: item.target_path, message: 'Managed file is missing locally.' });
      if (!base) findings.push({ severity: 'warning', code: 'baseline-missing', path: item.target_path, message: 'Managed file has no local three-way baseline.' });
    }
  }

  let sourceReachable = null;
  if (args.online && tools.git) {
    const repository = handoff?.source?.repository || DEFAULT_REPOSITORY;
    const ref = handoff?.source?.ref || DEFAULT_REF;
    const result = git(['ls-remote', '--exit-code', repository, ref], project, { allowFailure: true, timeout: 15000 });
    sourceReachable = result.status === 0;
    if (!sourceReachable) findings.push({ severity: 'warning', code: 'source-unreachable', message: 'Latest harness source could not be reached non-interactively.' });
  }

  console.log(JSON.stringify({
    ok: findings.every((item) => item.severity !== 'error'),
    project_root: project,
    installed_version: handoff?.installed_version || localPackageVersion(project),
    handoff_schema: handoff?.schema_version || null,
    git: root ? { root, branch: currentBranch(root), clean: gitClean(root), identity: gitIdentity(root) } : null,
    cli: tools,
    source_reachable: sourceReachable,
    findings,
  }, null, 2));
  if (findings.some((item) => item.severity === 'error')) process.exitCode = 1;
}

function update(project, args) {
  let source = null;
  try {
    const existing = readJson(path.join(project, HANDOFF_RELATIVE), false);
    source = acquireSource(args, existing);
    const manifest = loadManifest(source.root);
    let handoff = normalizeHandoff(project, source);
    if (!handoff) throw new Error('Project has no lifecycle handoff manifest. Run `harness adopt` first.');
    const plan = planUpdate(project, source, handoff, manifest);
    const summary = planSummary(plan);
    const report = {
      installed_version: handoff.installed_version,
      available_version: manifest.harness_version,
      source_commit: source.commit,
      ...summary,
    };
    if (args.apply) {
      const result = applyPlan(project, source, manifest, plan);
      console.log(JSON.stringify({ ...report, ...result }, null, 2));
      return;
    }
    console.log(JSON.stringify({ action: 'check', ...report, next: summary.safe_to_apply ? 'Run harness update --apply.' : 'Resolve the reported conflict(s) before applying.' }, null, 2));
  } finally {
    source?.cleanup?.();
  }
}

function usage() {
  console.log(`Usage:\n  node scripts/harness-update.js doctor [--online] [--cwd /project]\n  node scripts/harness-update.js update --check [--source-root /harness | --repository <git-url> --ref main]\n  node scripts/harness-update.js update --apply [source options]\n  node scripts/harness-update.js adopt [source options]\n\nUpdate is three-way: installed baseline vs project-local file vs latest upstream file. Conflicts block all project-file replacement.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  const project = projectRoot(args);
  if (!command || command === 'help') return usage();
  if (command === 'doctor') return doctor(project, args);
  if (command === 'adopt') {
    const source = acquireSource(args, null);
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
