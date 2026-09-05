import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-proof-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function run(root, script, args = [], cwd = root) {
  return spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], {
    cwd, encoding: 'utf8', env: { ...process.env, HARNESS_WORKSPACE_ROOT: '' },
  });
}

function fixture(t) {
  const root = temporaryDirectory(t);
  for (const name of ['scripts', 'docs', '.harness', '00-PLANNING', 'package.json',
    'AGENTS.md', 'AI-NOTES.md', 'HARNESS-LOOP.md', 'PROJECT-INTAKE.md',
    'ARCHITECTURE.md', 'TECH-SPEC.md', 'TASKS.md']) {
    fs.cpSync(path.join(ROOT, name), path.join(root, name), { recursive: true });
  }
  return root;
}

test('destination requires explicit absolute workspace and deployment roots', (t) => {
  const workspace = temporaryDirectory(t);
  for (const args of [[], ['--workspace-root', '.'],
    ['--workspace-root', workspace, '--deploy-root', 'relative']]) {
    const result = run(ROOT, 'project-control.js', ['destination', '--slug', 'sample', ...args]);
    assert.notEqual(result.status, 0, result.stdout);
  }
});

test('destination refuses product paths inside the harness, including symlink aliases', (t) => {
  const workspace = temporaryDirectory(t);
  const alias = path.join(workspace, 'harness-alias');
  fs.symlinkSync(ROOT, alias, 'dir');
  for (const directory of [ROOT, path.join(alias, 'not-created')]) {
    const result = run(ROOT, 'project-control.js', [
      'destination', '--slug', 'sample', '--workspace-root', directory,
    ]);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, /harness/);
  }
});

test('destination refuses symlink escapes without writing into the target', (t) => {
  const workspace = temporaryDirectory(t);
  const target = temporaryDirectory(t);
  fs.symlinkSync(target, path.join(workspace, 'sample'), 'dir');
  const result = run(ROOT, 'project-control.js', [
    'destination', '--slug', 'sample', '--workspace-root', workspace, '--create',
  ]);
  assert.notEqual(result.status, 0, result.stdout);
  assert.deepEqual(fs.readdirSync(target), []);
});

test('destination refuses overlapping source and deployment locations', (t) => {
  const workspace = temporaryDirectory(t);
  for (const deploy of [workspace, path.join(workspace, 'sample')]) {
    const result = run(ROOT, 'project-control.js', [
      'destination', '--slug', 'sample', '--workspace-root', workspace,
      '--deploy-root', deploy, '--create',
    ]);
    assert.notEqual(result.status, 0, result.stdout);
    assert.equal(fs.existsSync(path.join(workspace, 'sample')), false);
  }
});

test('destination preserves an existing project and rejects valued create flags', (t) => {
  const workspace = temporaryDirectory(t);
  const destination = path.join(workspace, 'sample');
  fs.mkdirSync(destination);
  fs.writeFileSync(path.join(destination, 'keep.txt'), 'owner data');
  const result = run(ROOT, 'project-control.js', [
    'destination', '--slug', 'sample', '--workspace-root', workspace, '--create',
  ]);
  assert.notEqual(result.status, 0);
  assert.deepEqual(fs.readdirSync(destination), ['keep.txt']);
  assert.equal(fs.readFileSync(path.join(destination, 'keep.txt'), 'utf8'), 'owner data');
  const invalid = run(ROOT, 'project-control.js', [
    'destination', '--slug', 'other', '--workspace-root', workspace, '--create', 'false',
  ]);
  assert.notEqual(invalid.status, 0);
  assert.equal(fs.existsSync(path.join(workspace, 'other')), false);
});

test('active work cannot bypass an unresolved gate by changing its status', (t) => {
  const root = fixture(t);
  const statePath = path.join(root, '.harness/state/active-task.json');
  const task = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  task.alignment[0].answer = 'UNKNOWN';
  for (const status of ['ready', 'in_progress', 'completed']) {
    task.status = status;
    fs.writeFileSync(statePath, JSON.stringify(task));
    assert.notEqual(run(root, 'project-control.js', ['verify']).status, 0, status);
  }
  task.status = 'blocked';
  fs.writeFileSync(statePath, JSON.stringify(task));
  assert.equal(run(root, 'project-control.js', ['verify']).status, 0);
});

test('control verification rejects malformed, duplicate, and unsupported state', (t) => {
  const root = fixture(t);
  const statePath = path.join(root, '.harness/state/active-task.json');
  const original = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const variants = [
    { ...original, schema_version: 99 },
    { ...original, id: ' ' },
    { ...original, alignment: {} },
    { ...original, alignment: [...original.alignment, original.alignment[0]] },
    { ...original, alignment: original.alignment.map((gate) => ({ ...gate, evidence: ' ' })) },
  ];
  for (const task of variants) {
    fs.writeFileSync(statePath, JSON.stringify(task));
    const result = run(root, 'project-control.js', ['verify']);
    assert.notEqual(result.status, 0, JSON.stringify(task));
    assert.match(result.stderr, /verification failed/);
  }
});

test('denied unlock and unknown lock commands fail, preserving the lock', (t) => {
  const root = fixture(t);
  const lock = path.join(root, '.planning-lock');
  fs.writeFileSync(lock, 'keep locked');
  const result = run(root, 'lock-project.js', ['unlock']);
  assert.notEqual(result.status, 0, result.stdout);
  assert.equal(fs.readFileSync(lock, 'utf8'), 'keep locked');
  assert.notEqual(run(root, 'lock-project.js', ['unknown']).status, 0);
});

test('setup and lock commands target their own harness from another directory', (t) => {
  const root = fixture(t);
  const unrelated = temporaryDirectory(t);
  const result = run(root, 'harness-init.js', [], unrelated);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(root, '.planning-lock')), true);
  assert.deepEqual(fs.readdirSync(unrelated), []);
  const status = run(root, 'lock-project.js', ['status'], unrelated);
  assert.match(status.stdout, /LOCKED/);
});

test('setup fails before creating anything when core files are missing', (t) => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, 'PROJECT-INTAKE.md'));
  const result = run(root, 'harness-init.js');
  assert.notEqual(result.status, 0, result.stdout);
  assert.equal(fs.existsSync(path.join(root, '.planning-lock')), false);
  assert.equal(fs.existsSync(path.join(root, 'src')), false);
});

test('resume and checkpoint preserve the current task and explicit handoff', (t) => {
  const root = fixture(t);
  const resume = run(root, 'project-control.js', ['resume']);
  assert.equal(resume.status, 0, resume.stderr);
  const context = JSON.parse(resume.stdout);
  assert.deepEqual(context.active_task, JSON.parse(fs.readFileSync(path.join(root, '.harness/state/active-task.json'), 'utf8')));
  assert.ok(context.active_decisions.some((decision) => decision.id === 'ADR-0002'));
  const checkpointDir = path.join(root, '.harness/state/checkpoints');
  const before = new Set(fs.readdirSync(checkpointDir));
  const result = run(root, 'project-control.js', [
    'checkpoint', '--summary', 'Disposable proof completed',
    '--next', 'Complete the new project intake', '--verification', 'Fixture checks passed',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const created = fs.readdirSync(checkpointDir).filter((name) => !before.has(name));
  assert.equal(created.length, 1);
  const record = JSON.parse(fs.readFileSync(path.join(checkpointDir, created[0]), 'utf8'));
  assert.equal(record.summary, 'Disposable proof completed');
  assert.equal(record.next_action, 'Complete the new project intake');
  assert.equal(record.verification, 'Fixture checks passed');
  assert.equal(record.git.head, 'unavailable');
  assert.notEqual(run(root, 'project-control.js', ['checkpoint']).status, 0);
});
