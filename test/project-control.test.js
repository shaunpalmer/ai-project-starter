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

test('destination create writes bounded project state and lifecycle folders', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-create-'));
  const deployRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-deploy-'));
  const result = run([
    'destination', '--slug', 'safe-project', '--type', 'wordpress-plugin',
    '--workspace-root', workspaceRoot, '--deploy-root', deployRoot, '--create',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const destination = path.join(workspaceRoot, 'safe-project');
  assert.equal(fs.existsSync(path.join(destination, '.harness', 'project.json')), true);
  assert.equal(fs.existsSync(path.join(destination, 'AGENTS.md')), true);
  assert.equal(fs.existsSync(path.join(destination, '00-PLANNING', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, '00-PLANNING', 'PROJECT-INTAKE.md')), true);
  assert.equal(fs.existsSync(path.join(destination, 'docs', 'NORTH-STAR.md')), true);
  assert.equal(fs.existsSync(path.join(destination, 'docs', 'CURRENT-STATE.md')), true);
  assert.equal(fs.existsSync(path.join(destination, 'docs', 'decisions', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'src', 'safe-project', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'tests', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'build', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, 'dist', '.gitkeep')), true);
  assert.equal(fs.existsSync(path.join(destination, '.gitignore')), true);
  const task = JSON.parse(fs.readFileSync(path.join(destination, '.harness', 'state', 'active-task.json'), 'utf8'));
  assert.equal(task.status, 'blocked');
  assert.equal(task.alignment.length, 7);
  const project = JSON.parse(fs.readFileSync(path.join(destination, '.harness', 'project.json'), 'utf8'));
  assert.equal(project.layout.relative.source, path.join('src', 'safe-project'));
  assert.equal(project.layout.release.ship_from, path.join('src', 'safe-project'));
  const agentContract = fs.readFileSync(path.join(destination, 'AGENTS.md'), 'utf8');
  assert.match(agentContract, /src\/safe-project/);
  assert.match(agentContract, /dist\//);
  assert.equal(fs.existsSync(path.join(deployRoot, 'safe-project')), false);
});

test('non-WordPress projects use src as their code root', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-generic-'));
  const result = run([
    'destination', '--slug', 'queue-worker', '--type', 'python-automation',
    '--workspace-root', workspaceRoot,
  ]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
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

test('repository control state verifies', () => {
  const result = run(['verify']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /verification passed/);
});
