import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts', 'project-control.js');

function run(args, env = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function runFile(file, cwd) {
  return spawnSync(process.execPath, [file], { cwd, encoding: 'utf8' });
}

test('decision rights keep routine choices with Athena', () => {
  const result = run(['decision', '--kind', 'routine']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).owner, 'ATHENA');
});

test('decision rights reserve architectural choices for Shaun', () => {
  const result = run(['decision', '--kind', 'architecture']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).owner, 'SHAUN');
});

test('destination preview separates source and deployment paths', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-preview-'));
  const result = run([
    'destination', '--slug', 'super-clean-deals', '--name', 'Super Clean Deals',
    '--type', 'wordpress-plugin', '--workspace-root', workspaceRoot,
    '--deploy-root', '/var/www/html/wordpress/wp-content/plugins',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.project_destination, path.join(workspaceRoot, 'super-clean-deals'));
  assert.equal(output.deploy_destination, '/var/www/html/wordpress/wp-content/plugins/super-clean-deals');
  assert.equal(output.layout.working_directory, path.join(workspaceRoot, 'super-clean-deals'));
  assert.equal(output.layout.planning_root, path.join(workspaceRoot, 'super-clean-deals', '00-PLANNING'));
  assert.equal(output.layout.code_root, path.join(workspaceRoot, 'super-clean-deals', 'src', 'super-clean-deals'));
  assert.equal(output.layout.distribution_root, path.join(workspaceRoot, 'super-clean-deals', 'dist'));
  assert.equal(output.layout.release.artifact_pattern, 'super-clean-deals-{version}.zip');
  assert.equal(output.layout.release.archive_root, 'super-clean-deals');
  assert.equal(fs.existsSync(output.project_destination), false);
});

test('destination create scaffolds infer-before-implement state and lifecycle folders', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-create-'));
  const deployRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-deploy-'));
  const result = run([
    'destination', '--slug', 'safe-project', '--type', 'wordpress-plugin',
    '--workspace-root', workspaceRoot, '--deploy-root', deployRoot, '--create',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const destination = path.join(workspaceRoot, 'safe-project');
  for (const required of [
    '.harness/project.json',
    'AGENTS.md',
    '00-PLANNING/PROJECT-INTAKE.md',
    '00-PLANNING/SYSTEM-MODEL.md',
    '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md',
    'docs/NORTH-STAR.md',
    'docs/CURRENT-STATE.md',
    'scripts/project-ready.mjs',
    '.gitignore',
  ]) {
    assert.equal(fs.existsSync(path.join(destination, required)), true, required);
  }
  assert.equal(fs.existsSync(path.join(destination, 'src', 'safe-project', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'tests', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'build', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'dist', '.gitkeep')), true);
  const task = JSON.parse(fs.readFileSync(path.join(destination, '.harness/state/active-task.json'), 'utf8'));
  assert.equal(task.schema_version, 2);
  assert.equal(task.status, 'blocked');
  assert.equal(task.alignment.length, 8);
  assert.ok(task.alignment.some((gate) => gate.gate === 'system_model'));
  const project = JSON.parse(fs.readFileSync(path.join(destination, '.harness/project.json'), 'utf8'));
  assert.equal(project.layout.relative.source, path.join('src', 'safe-project'));
  assert.equal(project.layout.release.ship_from, path.join('src', 'safe-project'));
  const agentContract = fs.readFileSync(path.join(destination, 'AGENTS.md'), 'utf8');
  assert.match(agentContract, /Infer before implement/);
  assert.equal(fs.existsSync(path.join(deployRoot, 'safe-project')), false);
});

test('generated project readiness blocks draft discovery and passes after promotion', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-ready-'));
  const result = run(['destination', '--slug', 'hybrid-worker', '--workspace-root', workspaceRoot, '--create']);
  assert.equal(result.status, 0, result.stderr);
  const destination = path.join(workspaceRoot, 'hybrid-worker');
  const taskPath = path.join(destination, '.harness/state/active-task.json');
  const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
  task.status = 'ready';
  task.alignment = task.alignment.map((gate) => ({ ...gate, answer: 'YES', evidence: `proved ${gate.gate}` }));
  fs.writeFileSync(taskPath, `${JSON.stringify(task, null, 2)}\n`);

  const readiness = path.join(destination, 'scripts', 'project-ready.mjs');
  const before = runFile(readiness, destination);
  assert.notEqual(before.status, 0);
  assert.match(before.stderr, /MODEL_STATUS: CONFIRMED|HYPOTHESIS_STATUS: ACCEPTED/);

  const modelPath = path.join(destination, '00-PLANNING/SYSTEM-MODEL.md');
  const hypothesisPath = path.join(destination, '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md');
  fs.writeFileSync(modelPath, fs.readFileSync(modelPath, 'utf8').replace('MODEL_STATUS: DRAFT', 'MODEL_STATUS: CONFIRMED'));
  fs.writeFileSync(hypothesisPath, fs.readFileSync(hypothesisPath, 'utf8').replace('HYPOTHESIS_STATUS: DRAFT', 'HYPOTHESIS_STATUS: ACCEPTED'));

  const after = runFile(readiness, destination);
  assert.equal(after.status, 0, after.stderr);
  assert.match(after.stdout, /readiness passed/);
});

test('unspecified projects default to infer and use src as their code root', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-generic-'));
  const result = run(['destination', '--slug', 'queue-worker', '--workspace-root', workspaceRoot]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.type, 'infer');
  assert.equal(output.layout.relative.source, 'src');
  assert.equal(output.layout.code_root, path.join(workspaceRoot, 'queue-worker', 'src'));
  assert.equal(output.layout.release.format, 'type-specific');
});

test('destination rejects unsafe slugs', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-reject-'));
  const result = run(['destination', '--slug', '../escape', '--workspace-root', workspaceRoot]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /kebab-case/);
});

test('repository control state verifies while proof is pending', () => {
  const result = run(['verify']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /verification passed/);
});
