#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

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
    const value = next && !next.startsWith('--') ? next : true;
    if (value !== true) i += 1;
    if (result[key] === undefined) result[key] = value;
    else if (Array.isArray(result[key])) result[key].push(value);
    else result[key] = [result[key], value];
  }
  return result;
}

function run(command, args, cwd = process.cwd(), options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: NON_INTERACTIVE_ENV,
    timeout: options.timeout ?? 15000,
  });
  if (result.error) {
    if (options.allowFailure) {
      return {
        status: result.error.code === 'ENOENT' ? 127 : 1,
        stdout: '',
        stderr: result.error.message,
      };
    }
    throw new Error(`${command} failed: ${result.error.message}`);
  }
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

function git(args, cwd = process.cwd(), options = {}) {
  return run('git', args, cwd, options);
}

function gitAvailable() {
  return run('git', ['--version'], process.cwd(), { allowFailure: true }).status === 0;
}

function repoRoot(cwd = process.cwd()) {
  const result = git(['rev-parse', '--show-toplevel'], cwd, { allowFailure: true });
  return result.status === 0 ? path.resolve(result.stdout) : null;
}

function currentBranch(root) {
  return git(['branch', '--show-current'], root).stdout;
}

function ensureRepository(cwd = process.cwd()) {
  if (!gitAvailable()) throw new Error('Git is not installed or not available on PATH.');
  const root = repoRoot(cwd);
  if (!root) throw new Error('Current directory is not inside a Git repository. Run `vcs-control.js init` for a new local project.');
  return root;
}

function ensureSafeBranch(branch) {
  if (!branch) throw new Error('Detached HEAD is not allowed for managed execution. Create a work branch first.');
  if (PROTECTED_BRANCHES.has(branch)) throw new Error(`Refusing managed write on protected branch: ${branch}`);
}

function configuredValue(root, key) {
  const result = git(['config', '--get', key], root, { allowFailure: true });
  return result.status === 0 ? result.stdout : null;
}

function remoteUrl(root, remote) {
  const result = git(['remote', 'get-url', remote], root, { allowFailure: true });
  return result.status === 0 ? result.stdout : null;
}

function upstream(root) {
  const result = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], root, { allowFailure: true });
  return result.status === 0 ? result.stdout : null;
}

function aheadBehind(root) {
  if (!upstream(root)) return { ahead: null, behind: null };
  const result = git(['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'], root, { allowFailure: true });
  if (result.status !== 0) return { ahead: null, behind: null };
  const [ahead, behind] = result.stdout.split(/\s+/).map(Number);
  return { ahead, behind };
}

function remoteAuth(root, remote) {
  if (!remoteUrl(root, remote)) return { configured: false, reachable: false, evidence: 'remote-not-configured' };
  const result = git(['ls-remote', '--exit-code', remote, 'HEAD'], root, { allowFailure: true, timeout: 12000 });
  return {
    configured: true,
    reachable: result.status === 0,
    evidence: result.status === 0 ? 'git-ls-remote-passed' : (result.stderr || result.stdout || `exit-${result.status}`),
  };
}

function ghAuth() {
  const exists = run('gh', ['--version'], process.cwd(), { allowFailure: true }).status === 0;
  if (!exists) return { installed: false, authenticated: null };
  const result = run('gh', ['auth', 'status', '--hostname', 'github.com'], process.cwd(), { allowFailure: true, timeout: 8000 });
  return { installed: true, authenticated: result.status === 0 };
}

function statusFacts(root, remote = 'origin', checkRemote = false) {
  const branch = currentBranch(root);
  const status = git(['status', '--short'], root).stdout;
  const head = git(['rev-parse', '--short', 'HEAD'], root, { allowFailure: true });
  const identity = {
    name: configuredValue(root, 'user.name'),
    email: configuredValue(root, 'user.email'),
  };
  return {
    repo_root: root,
    branch,
    protected_branch: PROTECTED_BRANCHES.has(branch),
    head: head.status === 0 ? head.stdout : null,
    clean: status === '',
    status: status || 'clean',
    identity,
    remote: {
      name: remote,
      url: remoteUrl(root, remote),
      ...(checkRemote ? remoteAuth(root, remote) : { configured: Boolean(remoteUrl(root, remote)), reachable: null, evidence: 'not-checked' }),
    },
    upstream: upstream(root),
    ...aheadBehind(root),
    github_cli: ghAuth(),
  };
}

function commandStatus(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  console.log(JSON.stringify(statusFacts(root, args.remote || 'origin', false), null, 2));
}

function commandPreflight(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  const requireRemote = Boolean(args['require-remote']);
  const facts = statusFacts(root, args.remote || 'origin', requireRemote);
  const failures = [];
  if (!facts.identity.name || !facts.identity.email) failures.push('Git user.name and user.email must be configured before checkpoint commits.');
  if (!facts.branch) failures.push('Detached HEAD is not supported for managed execution.');
  if (requireRemote && !facts.remote.configured) failures.push(`Required remote is missing: ${facts.remote.name}`);
  if (requireRemote && !facts.remote.reachable) failures.push(`Remote authentication/reachability check failed for ${facts.remote.name}.`);
  console.log(JSON.stringify({ ...facts, ok: failures.length === 0, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
}

function validateBranchName(name) {
  if (!name || typeof name !== 'string') throw new Error('A branch name is required.');
  if (PROTECTED_BRANCHES.has(name)) throw new Error(`Refusing protected branch name: ${name}`);
  const check = run('git', ['check-ref-format', '--branch', name], process.cwd(), { allowFailure: true });
  if (check.status !== 0) throw new Error(`Invalid Git branch name: ${name}`);
}

function commandInit(args) {
  if (!gitAvailable()) throw new Error('Git is not installed or not available on PATH.');
  const cwd = path.resolve(args.cwd || process.cwd());
  const existing = repoRoot(cwd);
  if (existing) {
    console.log(JSON.stringify({ action: 'already-initialized', ...statusFacts(existing) }, null, 2));
    return;
  }
  const branch = typeof args.branch === 'string' ? args.branch : 'work/bootstrap';
  validateBranchName(branch);
  fs.mkdirSync(cwd, { recursive: true });
  git(['init', '-b', branch], cwd);
  const root = ensureRepository(cwd);
  console.log(JSON.stringify({ action: 'initialized', ...statusFacts(root) }, null, 2));
}

function commandBranch(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  const name = args.name || args.branch;
  validateBranchName(name);
  const current = currentBranch(root);
  if (current === name) {
    console.log(JSON.stringify({ action: 'already-on-branch', branch: name, repo_root: root }, null, 2));
    return;
  }
  const exists = git(['show-ref', '--verify', '--quiet', `refs/heads/${name}`], root, { allowFailure: true }).status === 0;
  git(exists ? ['switch', name] : ['switch', '-c', name], root);
  console.log(JSON.stringify({ action: exists ? 'switched' : 'created-and-switched', branch: name, repo_root: root }, null, 2));
}

function normalizeFiles(value) {
  const raw = Array.isArray(value) ? value : value === undefined ? [] : [value];
  return raw.flatMap((item) => String(item).split(',')).map((item) => item.trim()).filter(Boolean);
}

function repoRelativeFile(root, candidate) {
  const absolute = path.resolve(root, candidate);
  const relative = path.relative(root, absolute);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`File is outside the repository: ${candidate}`);
  }
  return relative.split(path.sep).join('/');
}

function commandCheckpoint(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  const branch = currentBranch(root);
  ensureSafeBranch(branch);
  if (!args.message || typeof args.message !== 'string') throw new Error('checkpoint requires --message "descriptive commit message".');
  const files = [...new Set(normalizeFiles(args.file).map((item) => repoRelativeFile(root, item)))];
  if (!files.length) throw new Error('checkpoint requires at least one --file path. Broad automatic staging is intentionally unsupported.');

  const alreadyStaged = git(['diff', '--cached', '--name-only'], root).stdout.split(/\r?\n/).filter(Boolean);
  const unrelatedStaged = alreadyStaged.filter((file) => !files.includes(file));
  if (unrelatedStaged.length) throw new Error(`Refusing checkpoint with unrelated pre-staged files: ${unrelatedStaged.join(', ')}`);

  for (const file of files) {
    const exists = fs.existsSync(path.join(root, file));
    const tracked = git(['ls-files', '--error-unmatch', '--', file], root, { allowFailure: true }).status === 0;
    if (!exists && !tracked) throw new Error(`Cannot checkpoint missing untracked path: ${file}`);
  }

  git(['add', '--', ...files], root);
  const staged = git(['diff', '--cached', '--name-only'], root).stdout.split(/\r?\n/).filter(Boolean);
  if (!staged.length) throw new Error('No staged changes were produced for the requested files.');
  const unexpected = staged.filter((file) => !files.includes(file));
  if (unexpected.length) throw new Error(`Staging escaped the requested file set: ${unexpected.join(', ')}`);

  git(['commit', '-m', args.message], root);
  const head = git(['rev-parse', 'HEAD'], root).stdout;
  console.log(JSON.stringify({ action: 'checkpoint-created', branch, head, files: staged, message: args.message }, null, 2));
}

function rejectCredentialBearingUrl(value) {
  if (!/^https?:\/\//i.test(value)) return;
  const parsed = new URL(value);
  if (parsed.username || parsed.password) throw new Error('Remote URL must not contain embedded credentials or tokens. Use existing Git/SSH/GitHub authentication.');
}

function commandConnect(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  const remote = typeof args.remote === 'string' ? args.remote : 'origin';
  const url = args.url;
  if (!url || typeof url !== 'string') throw new Error('connect requires --url <git-remote-url>.');
  rejectCredentialBearingUrl(url);
  const existing = remoteUrl(root, remote);
  if (existing && existing !== url) throw new Error(`Remote ${remote} already points somewhere else: ${existing}`);
  if (!existing) git(['remote', 'add', remote, url], root);
  const auth = remoteAuth(root, remote);
  if (!auth.reachable) {
    if (!existing) git(['remote', 'remove', remote], root, { allowFailure: true });
    throw new Error(`Remote ${remote} could not be verified with existing machine authentication: ${auth.evidence}`);
  }
  console.log(JSON.stringify({ action: existing ? 'remote-verified' : 'remote-added-and-verified', remote, url, authentication: auth }, null, 2));
}

function commandPush(args) {
  const root = ensureRepository(args.cwd || process.cwd());
  const branch = currentBranch(root);
  ensureSafeBranch(branch);
  const remote = typeof args.remote === 'string' ? args.remote : 'origin';
  const auth = remoteAuth(root, remote);
  if (!auth.configured) throw new Error(`Remote is not configured: ${remote}`);
  if (!auth.reachable) throw new Error(`Remote authentication/reachability check failed for ${remote}: ${auth.evidence}`);
  const existingUpstream = upstream(root);
  if (existingUpstream) git(['push', remote, branch], root, { timeout: 30000 });
  else git(['push', '-u', remote, branch], root, { timeout: 30000 });
  console.log(JSON.stringify({ action: 'pushed', remote, branch, upstream: upstream(root) }, null, 2));
}

function usage() {
  console.log(`Usage: node scripts/vcs-control.js <command> [options]\n\nCommands:\n  status [--remote origin]\n  preflight [--require-remote] [--remote origin]\n  init [--branch work/bootstrap] [--cwd /path]\n  branch --name work/topic\n  checkpoint --message "..." --file path [--file another]\n  connect --url <git-url> [--remote origin]\n  push [--remote origin]\n\nThe controller is non-interactive. It never force pushes, pushes protected branches, embeds credentials, or stages the whole worktree.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  if (!command) return usage();
  if (command === 'status') return commandStatus(args);
  if (command === 'preflight') return commandPreflight(args);
  if (command === 'init') return commandInit(args);
  if (command === 'branch') return commandBranch(args);
  if (command === 'checkpoint') return commandCheckpoint(args);
  if (command === 'connect') return commandConnect(args);
  if (command === 'push') return commandPush(args);
  throw new Error(`Unknown VCS command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`VCS control failed: ${error.message}`);
  process.exitCode = 1;
}
