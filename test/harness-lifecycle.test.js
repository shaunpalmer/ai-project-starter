import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function temp(t, prefix = 'harness-lifecycle-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GH_PROMPT_DISABLED: '1', GCM_INTERACTIVE: 'Never' },
  });
  if (!allowFailure) assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

function git(cwd, args, allowFailure = false) {
  return run('git', args, cwd, allowFailure);
}

function initRepo(dir, branch = 'main') {
  git(dir, ['init', '-b', branch]);
  git(dir, ['config', 'user.name', 'Harness Test']);
  git(dir, ['config', 'user.email', 'harness@example.test']);
}

function commitAll(dir, message) {
  git(dir, ['add', '--all']);
  git(dir, ['commit', '-m', message]);
  return git(dir, ['rev-parse', 'HEAD']).stdout.trim();
}

function writeManifest(source, version, entries) {
  fs.writeFileSync(path.join(source, 'HARNESS-MANIFEST.json'), `${JSON.stringify({
    schema_version: 1,
    harness_version: version,
    source: { repository: 'local-test', ref: 'main' },
    files: entries,
  }, null, 2)}\n`);
}

function lifecycle(project, args, allowFailure = false) {
  return run(process.execPath, [path.join(ROOT, 'scripts', 'harness-update.js'), ...args, '--cwd', project], ROOT, allowFailure);
}

function makeManagedProject(t) {
  const source = temp(t, 'harness-source-');
  const project = temp(t, 'harness-project-');
  initRepo(source);
  initRepo(project);

  const entries = [
    { source_path: 'managed.txt', target_path: 'managed.txt', ownership: 'managed' },
    { source_path: 'extensible.txt', target_path: 'extensible.txt', ownership: 'extensible' },
    { source_path: 'new.txt', target_path: 'new.txt', ownership: 'managed' },
  ];

  fs.writeFileSync(path.join(source, 'managed.txt'), 'managed base\n');
  fs.writeFileSync(path.join(source, 'extensible.txt'), 'first\nshared\nlast\n');
  writeManifest(source, '0.5.0', entries.slice(0, 2));
  const baseCommit = commitAll(source, 'source 0.5');

  fs.writeFileSync(path.join(project, 'managed.txt'), 'managed base\n');
  fs.writeFileSync(path.join(project, 'extensible.txt'), 'first\nshared\nlast\n');
  fs.mkdirSync(path.join(project, '.harness', 'baseline'), { recursive: true });
  fs.writeFileSync(path.join(project, '.harness', 'baseline', 'managed.txt'), 'managed base\n');
  fs.writeFileSync(path.join(project, '.harness', 'baseline', 'extensible.txt'), 'first\nshared\nlast\n');
  fs.writeFileSync(path.join(project, '.harness', 'handoff.json'), `${JSON.stringify({
    schema_version: 2,
    installed_version: '0.5.0',
    source: { repository: 'local-test', ref: 'main', commit: baseCommit },
    files: entries.slice(0, 2).map((item) => ({ ...item, baseline_sha256: 'fixture', baseline_origin: 'upstream' })),
  }, null, 2)}\n`);
  commitAll(project, 'project baseline');

  return { source, project, entries };
}

test('update check is non-mutating and apply performs replace, add, clean three-way merge, branch, and checkpoint', (t) => {
  const { source, project, entries } = makeManagedProject(t);

  fs.writeFileSync(path.join(project, 'extensible.txt'), 'first local\nshared\nlast\n');
  commitAll(project, 'project customisation');

  fs.writeFileSync(path.join(source, 'managed.txt'), 'managed upstream\n');
  fs.writeFileSync(path.join(source, 'extensible.txt'), 'first\nshared\nlast upstream\n');
  fs.writeFileSync(path.join(source, 'new.txt'), 'new upstream file\n');
  writeManifest(source, '0.6.0', entries);
  commitAll(source, 'source 0.6');

  const beforeHead = git(project, ['rev-parse', 'HEAD']).stdout.trim();
  const beforeManaged = fs.readFileSync(path.join(project, 'managed.txt'), 'utf8');
  const check = lifecycle(project, ['update', '--check', '--source-root', source]);
  const checked = JSON.parse(check.stdout);
  assert.equal(checked.safe_to_apply, true);
  assert.equal(checked.counts.replace, 1);
  assert.equal(checked.counts.merge, 1);
  assert.equal(checked.counts.add, 1);
  assert.equal(git(project, ['rev-parse', 'HEAD']).stdout.trim(), beforeHead);
  assert.equal(fs.readFileSync(path.join(project, 'managed.txt'), 'utf8'), beforeManaged);
  assert.equal(git(project, ['branch', '--show-current']).stdout.trim(), 'main');

  const apply = lifecycle(project, ['update', '--apply', '--source-root', source]);
  const applied = JSON.parse(apply.stdout);
  assert.equal(applied.action, 'updated');
  assert.equal(applied.version, '0.6.0');
  assert.equal(git(project, ['branch', '--show-current']).stdout.trim(), 'harness/update-0.6.0');
  assert.equal(fs.readFileSync(path.join(project, 'managed.txt'), 'utf8'), 'managed upstream\n');
  assert.equal(fs.readFileSync(path.join(project, 'new.txt'), 'utf8'), 'new upstream file\n');
  assert.equal(fs.readFileSync(path.join(project, 'extensible.txt'), 'utf8'), 'first local\nshared\nlast upstream\n');
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, '.harness', 'handoff.json'), 'utf8')).installed_version, '0.6.0');
  assert.match(git(project, ['log', '-1', '--pretty=%s']).stdout, /Update harness to 0\.6\.0/);
  assert.equal(git(project, ['status', '--porcelain']).stdout.trim(), '');
});

test('conflicting local and upstream edits block apply without changing branch or files', (t) => {
  const { source, project } = makeManagedProject(t);
  fs.writeFileSync(path.join(project, 'managed.txt'), 'local conflict\n');
  commitAll(project, 'local conflict');
  fs.writeFileSync(path.join(source, 'managed.txt'), 'upstream conflict\n');
  writeManifest(source, '0.6.0', [
    { source_path: 'managed.txt', target_path: 'managed.txt', ownership: 'managed' },
    { source_path: 'extensible.txt', target_path: 'extensible.txt', ownership: 'extensible' },
  ]);
  commitAll(source, 'upstream conflict');

  const check = lifecycle(project, ['update', '--check', '--source-root', source]);
  const report = JSON.parse(check.stdout);
  assert.equal(report.safe_to_apply, false);
  assert.equal(report.conflicts.length, 1);

  const apply = lifecycle(project, ['update', '--apply', '--source-root', source], true);
  assert.notEqual(apply.status, 0);
  assert.match(apply.stderr, /unresolved conflict/);
  assert.equal(git(project, ['branch', '--show-current']).stdout.trim(), 'main');
  assert.equal(fs.readFileSync(path.join(project, 'managed.txt'), 'utf8'), 'local conflict\n');
  assert.equal(git(project, ['status', '--porcelain']).stdout.trim(), '');
});

test('doctor reports CLI capability and legacy projects without mutating them', (t) => {
  const project = temp(t, 'harness-doctor-');
  initRepo(project);
  fs.writeFileSync(path.join(project, 'package.json'), '{"version":"0.4.0"}\n');
  commitAll(project, 'legacy project');
  const before = git(project, ['rev-parse', 'HEAD']).stdout.trim();
  const result = lifecycle(project, ['doctor']);
  const report = JSON.parse(result.stdout);
  assert.equal(report.cli.git, true);
  assert.equal(report.cli.node, true);
  assert.ok(report.findings.some((item) => item.code === 'legacy-unmanaged'));
  assert.equal(git(project, ['rev-parse', 'HEAD']).stdout.trim(), before);
  assert.equal(git(project, ['status', '--porcelain']).stdout.trim(), '');
});

test('legacy adopt chooses the final commit carrying the installed package version', (t) => {
  const source = temp(t, 'harness-adopt-source-');
  const project = temp(t, 'harness-adopt-project-');
  initRepo(source);
  initRepo(project);

  fs.writeFileSync(path.join(source, 'package.json'), '{"version":"0.4.0"}\n');
  fs.writeFileSync(path.join(source, 'managed.txt'), 'early 0.4\n');
  writeManifest(source, '0.4.0', [{ source_path: 'managed.txt', target_path: 'managed.txt', ownership: 'managed' }]);
  commitAll(source, 'start 0.4');
  fs.writeFileSync(path.join(source, 'managed.txt'), 'final 0.4\n');
  const final04 = commitAll(source, 'finish 0.4');
  fs.writeFileSync(path.join(source, 'package.json'), '{"version":"0.5.0"}\n');
  fs.writeFileSync(path.join(source, 'managed.txt'), '0.5 upstream\n');
  writeManifest(source, '0.5.0', [{ source_path: 'managed.txt', target_path: 'managed.txt', ownership: 'managed' }]);
  commitAll(source, 'source 0.5');

  fs.writeFileSync(path.join(project, 'package.json'), '{"version":"0.4.0"}\n');
  fs.writeFileSync(path.join(project, 'managed.txt'), 'final 0.4\n');
  commitAll(project, 'legacy installed project');

  const adopted = lifecycle(project, ['adopt', '--source-root', source]);
  const report = JSON.parse(adopted.stdout);
  assert.equal(report.baseline_commit, final04);
  assert.equal(fs.readFileSync(path.join(project, '.harness', 'baseline', 'managed.txt'), 'utf8'), 'final 0.4\n');
  assert.equal(git(project, ['branch', '--show-current']).stdout.trim(), 'harness/adopt-0.4.0');

  const check = lifecycle(project, ['update', '--check', '--source-root', source]);
  assert.equal(JSON.parse(check.stdout).counts.replace, 1);
});
