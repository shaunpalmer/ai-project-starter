import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'vcs-control.js');

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-vcs-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function run(args, cwd, envOverrides = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GH_PROMPT_DISABLED: '1',
      GCM_INTERACTIVE: 'Never',
      ...envOverrides,
    },
  });
}

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function configureIdentity(cwd) {
  git(['config', 'user.name', 'Harness Test'], cwd);
  git(['config', 'user.email', 'harness@example.test'], cwd);
}

function commandPath(command) {
  for (const directory of (process.env.PATH || '').split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, command);
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {
      // Keep searching PATH.
    }
  }
  return null;
}

test('vcs init creates a non-protected work branch without prompting', (t) => {
  const cwd = temporaryDirectory(t);
  const result = run(['init'], cwd);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.action, 'initialized');
  assert.equal(output.branch, 'work/bootstrap');
  assert.equal(git(['branch', '--show-current'], cwd), 'work/bootstrap');
});

test('vcs init treats missing GitHub CLI as optional', (t) => {
  if (process.platform === 'win32') {
    t.skip('PATH-isolation fixture is POSIX-specific.');
    return;
  }

  const cwd = temporaryDirectory(t);
  const bin = path.join(cwd, 'bin');
  fs.mkdirSync(bin);
  const gitBinary = commandPath('git');
  assert.ok(gitBinary, 'git must be available for the VCS test suite');
  fs.symlinkSync(gitBinary, path.join(bin, 'git'));

  const result = run(['init'], cwd, { PATH: bin });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.action, 'initialized');
  assert.deepEqual(output.github_cli, { installed: false, authenticated: null });
});

test('vcs preflight reports missing identity and required remote as explicit failures', (t) => {
  const cwd = temporaryDirectory(t);
  assert.equal(run(['init'], cwd).status, 0);
  const result = run(['preflight', '--require-remote'], cwd);
  assert.notEqual(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, false);
  assert.ok(output.failures.some((failure) => failure.includes('user.name')));
  assert.ok(output.failures.some((failure) => failure.includes('Required remote is missing')));
});

test('vcs branch creates and switches to a safe feature branch', (t) => {
  const cwd = temporaryDirectory(t);
  assert.equal(run(['init'], cwd).status, 0);
  const result = run(['branch', '--name', 'feature/scraper-proof'], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(['branch', '--show-current'], cwd), 'feature/scraper-proof');
});

test('checkpoint stages only declared files and leaves unrelated work untouched', (t) => {
  const cwd = temporaryDirectory(t);
  assert.equal(run(['init'], cwd).status, 0);
  configureIdentity(cwd);
  fs.writeFileSync(path.join(cwd, 'wanted.txt'), 'wanted\n');
  fs.writeFileSync(path.join(cwd, 'unrelated.txt'), 'leave me alone\n');

  const result = run(['checkpoint', '--message', 'Add wanted fixture', '--file', 'wanted.txt'], cwd);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output.files, ['wanted.txt']);
  assert.equal(git(['show', '--pretty=', '--name-only', 'HEAD'], cwd), 'wanted.txt');
  assert.match(git(['status', '--short'], cwd), /\?\? unrelated\.txt/);
});

test('checkpoint refuses broad implicit staging', (t) => {
  const cwd = temporaryDirectory(t);
  assert.equal(run(['init'], cwd).status, 0);
  configureIdentity(cwd);
  fs.writeFileSync(path.join(cwd, 'file.txt'), 'data\n');
  const result = run(['checkpoint', '--message', 'Should fail'], cwd);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /at least one --file/);
  assert.equal(git(['status', '--short'], cwd), '?? file.txt');
});

test('checkpoint refuses protected default branches before staging', (t) => {
  const cwd = temporaryDirectory(t);
  git(['init', '-b', 'main'], cwd);
  configureIdentity(cwd);
  fs.writeFileSync(path.join(cwd, 'file.txt'), 'data\n');
  const result = run(['checkpoint', '--message', 'Do not commit to main', '--file', 'file.txt'], cwd);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /protected branch: main/);
  assert.equal(git(['status', '--short'], cwd), '?? file.txt');
});

test('connect rejects credential-bearing HTTPS remotes without persisting them', (t) => {
  const cwd = temporaryDirectory(t);
  assert.equal(run(['init'], cwd).status, 0);
  const result = run(['connect', '--url', 'https://user:secret@example.com/owner/repo.git'], cwd);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not contain embedded credentials/);
  const remotes = spawnSync('git', ['remote'], { cwd, encoding: 'utf8' });
  assert.equal(remotes.status, 0);
  assert.equal(remotes.stdout.trim(), '');
});

test('push refuses a protected branch before any remote/network operation', (t) => {
  const cwd = temporaryDirectory(t);
  git(['init', '-b', 'main'], cwd);
  const result = run(['push'], cwd);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /protected branch: main/);
});
