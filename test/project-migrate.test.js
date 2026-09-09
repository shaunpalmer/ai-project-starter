import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'project-migrate.js');

function temporaryDirectory(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-migrate-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function write(root, relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function legacyWordPressProject(root) {
  fs.mkdirSync(root, { recursive: true });
  write(root, 'AGENTS.md', '# Legacy Agent Contract\n\nPreserve this project-specific instruction.\n');
  write(root, '00-PLANNING/PROJECT-INTAKE.md', '# Legacy Intake\n');
  write(root, 'docs/NORTH-STAR.md', '# North Star\n\nKeep the existing plugin behaviour.\n');
  write(root, 'docs/CURRENT-STATE.md', '# Current State\n\nLegacy project works.\n');
  write(root, 'src/link-optimizer/link-optimizer.php', '<?php\n/**\n * Plugin Name: Link Optimizer\n */\n');
  write(root, 'tests/run-tests.php', '<?php echo "ok\\n";\n');
  write(root, 'dist/link-optimizer-1.0.0.sha256', 'abc123\n');
  write(root, '.harness/state/active-task.json', '{"schema_version":1,"status":"legacy"}\n');
}

function run(args, cwd = ROOT) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GH_PROMPT_DISABLED: '1',
      GCM_INTERACTIVE: 'Never',
    },
    timeout: 120000,
  });
}

test('migrate copies a pre-lifecycle WordPress project into a standalone v0.5 managed project', (t) => {
  const workspace = temporaryDirectory(t);
  const source = path.join(workspace, 'old-harness', 'link-optimizer');
  const destination = path.join(workspace, 'projects', 'link-optimizer');
  legacyWordPressProject(source);
  const sourcePlugin = fs.readFileSync(path.join(source, 'src/link-optimizer/link-optimizer.php'), 'utf8');

  const result = run(['--from', source, '--to', destination, '--name', 'Link Optimizer', '--slug', 'link-optimizer']);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);

  assert.equal(output.action, 'legacy-project-migrated');
  assert.equal(output.type, 'wordpress-plugin');
  assert.equal(output.source_untouched, true);
  assert.equal(fs.readFileSync(path.join(source, 'src/link-optimizer/link-optimizer.php'), 'utf8'), sourcePlugin);
  assert.equal(fs.existsSync(path.join(source, '.git')), false);

  assert.equal(fs.readFileSync(path.join(destination, 'src/link-optimizer/link-optimizer.php'), 'utf8'), sourcePlugin);
  assert.match(fs.readFileSync(path.join(destination, 'AGENTS.md'), 'utf8'), /Legacy Agent Contract/);
  assert.match(fs.readFileSync(path.join(destination, 'AGENTS.md'), 'utf8'), /HARNESS:BEGIN/);
  assert.equal(fs.existsSync(path.join(destination, '.harness/legacy/active-task.pre-v05.json')), true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(destination, '.harness/state/active-task.json'), 'utf8')).schema_version, 2);
  assert.equal(JSON.parse(fs.readFileSync(path.join(destination, '.harness/project.json'), 'utf8')).type, 'wordpress-plugin');
  assert.equal(JSON.parse(fs.readFileSync(path.join(destination, '.harness/handoff.json'), 'utf8')).installed_version, '0.5.0');
  assert.equal(fs.existsSync(path.join(destination, '.harness/migration.json')), true);
  assert.equal(fs.existsSync(path.join(destination, 'scripts/harness.mjs')), true);
  assert.equal(fs.existsSync(path.join(destination, 'scripts/vcs-control.mjs')), true);
  assert.equal(fs.existsSync(path.join(destination, '.git')), true);
  assert.match(fs.readFileSync(path.join(destination, '00-PLANNING/SYSTEM-MODEL.md'), 'utf8'), /MODEL_STATUS: DRAFT/);
  assert.match(fs.readFileSync(path.join(destination, '00-PLANNING/ARCHITECTURE-HYPOTHESIS.md'), 'utf8'), /HYPOTHESIS_STATUS: DRAFT/);
});

test('migrate refuses a non-empty destination and leaves both trees untouched', (t) => {
  const workspace = temporaryDirectory(t);
  const source = path.join(workspace, 'legacy-project');
  const destination = path.join(workspace, 'existing-project');
  legacyWordPressProject(source);
  fs.mkdirSync(destination, { recursive: true });
  write(destination, 'keep.txt', 'do not replace\n');

  const result = run(['--from', source, '--to', destination, '--slug', 'link-optimizer']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /destination already exists and is not empty/);
  assert.equal(fs.readFileSync(path.join(destination, 'keep.txt'), 'utf8'), 'do not replace\n');
  assert.equal(fs.existsSync(path.join(source, 'src/link-optimizer/link-optimizer.php')), true);
});
