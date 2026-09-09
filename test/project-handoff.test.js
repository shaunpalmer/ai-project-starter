import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-handoff-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function runScript(script, args, cwd = ROOT) {
  return spawnSync(process.execPath, [path.join(ROOT, 'scripts', script), ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GH_PROMPT_DISABLED: '1', GCM_INTERACTIVE: 'Never' },
  });
}

function createGeneratedProject(t, type = 'infer') {
  const workspace = temporaryDirectory(t);
  const result = runScript('project-control.js', [
    'destination', '--slug', 'sample-project', '--name', 'Sample Project', '--type', type,
    '--workspace-root', workspace, '--create',
  ]);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout).project_destination;
}

test('handoff copies engineering defaults, required skills, VCS control, and binds the generated agent contract', (t) => {
  const project = createGeneratedProject(t);
  const result = runScript('project-handoff.js', ['--project-root', project]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);

  for (const relativePath of [
    'ENGINEERING-DEFAULTS.md',
    '.github/skills/wordpress-way.md',
    '.github/skills/wordpress-plugin/SKILL.md',
    '.github/skills/scraping-pipeline/SKILL.md',
    '.github/skills/skill-router/SKILL.md',
    'scripts/vcs-control.mjs',
    '.harness/handoff.json',
  ]) {
    assert.equal(fs.existsSync(path.join(project, relativePath)), true, relativePath);
  }

  assert.ok(output.copied.includes('ENGINEERING-DEFAULTS.md'));
  assert.equal(output.agent_contract, 'appended');
  assert.match(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8'), /Harness v0\.4 operating handoff/);
  assert.equal(output.git.branch, 'work/bootstrap');
  const branch = spawnSync('git', ['branch', '--show-current'], { cwd: project, encoding: 'utf8' });
  assert.equal(branch.status, 0, branch.stderr);
  assert.equal(branch.stdout.trim(), 'work/bootstrap');
});

test('handoff is idempotent when installed files are unchanged', (t) => {
  const project = createGeneratedProject(t, 'wordpress-plugin');
  const first = runScript('project-handoff.js', ['--project-root', project]);
  assert.equal(first.status, 0, first.stderr);
  const second = runScript('project-handoff.js', ['--project-root', project]);
  assert.equal(second.status, 0, second.stderr);
  const output = JSON.parse(second.stdout);
  assert.equal(output.copied.length, 0);
  assert.ok(output.unchanged.includes('ENGINEERING-DEFAULTS.md'));
  assert.equal(output.agent_contract, 'already-present');
  assert.equal(output.git.action, 'already-initialized');
  const agents = fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8');
  assert.equal((agents.match(/Harness v0\.4 operating handoff/g) ?? []).length, 1);
});

test('handoff refuses to overwrite a project-customised installed rule', (t) => {
  const project = createGeneratedProject(t);
  assert.equal(runScript('project-handoff.js', ['--project-root', project]).status, 0);
  const defaults = path.join(project, 'ENGINEERING-DEFAULTS.md');
  fs.appendFileSync(defaults, '\nproject-specific change\n');

  const result = runScript('project-handoff.js', ['--project-root', project]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to overwrite project-customised file/);
});

test('handoff refuses arbitrary directories that are not generated harness projects', (t) => {
  const directory = temporaryDirectory(t);
  const result = runScript('project-handoff.js', ['--project-root', directory]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not a generated harness project/);
});
