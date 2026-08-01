import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const ROOT = path.resolve(import.meta.dirname, '..');
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
  assert.equal(fs.existsSync(output.project_destination), false);
});

test('destination create writes bounded project state', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-create-'));
  const result = run(['destination', '--slug', 'safe-project', '--workspace-root', workspaceRoot, '--create']);
  assert.equal(result.status, 0, result.stderr);
  const destination = path.join(workspaceRoot, 'safe-project');
  assert.equal(fs.existsSync(path.join(destination, '.harness', 'project.json')), true);
  const task = JSON.parse(fs.readFileSync(path.join(destination, '.harness', 'state', 'active-task.json'), 'utf8'));
  assert.equal(task.status, 'blocked');
  assert.equal(task.alignment.length, 7);
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
