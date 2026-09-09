#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GATES = ['destination', 'evidence', 'system_model', 'boundaries', 'ownership', 'minimum_slice', 'debt_control', 'proof'];
const NON_INTERACTIVE_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: '0',
  GH_PROMPT_DISABLED: '1',
  GCM_INTERACTIVE: 'Never',
};

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      i += 1;
    } else result[key] = true;
  }
  return result;
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function inventory(root, current = root, items = []) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const absolute = path.join(current, entry.name);
    const relative = slash(path.relative(root, absolute));
    if (entry.isDirectory()) {
      inventory(root, absolute, items);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(absolute);
      items.push({ path: relative, bytes: content.length, sha256: hashBuffer(content) });
    } else if (entry.isSymbolicLink()) {
      items.push({ path: relative, symlink: fs.readlinkSync(absolute) });
    }
  }
  return items.sort((a, b) => a.path.localeCompare(b.path));
}

function sameInventory(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function assertPaths(source, destination) {
  if (!path.isAbsolute(source) || !path.isAbsolute(destination)) throw new Error('--from and --to must be absolute paths.');
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) throw new Error(`Legacy project directory does not exist: ${source}`);
  if (source === destination || isWithin(source, destination) || isWithin(destination, source)) throw new Error('Migration source and destination must be separate, non-overlapping directories.');
  if (isWithin(ROOT, destination)) throw new Error('Standalone project destination cannot be inside the starter harness repository.');
  if (fs.existsSync(destination) && fs.readdirSync(destination).length > 0) throw new Error(`Migration destination already exists and is not empty: ${destination}`);
}

function assertLooksLikeProject(source) {
  const signals = [
    fs.existsSync(path.join(source, 'src')),
    fs.existsSync(path.join(source, 'AGENTS.md')),
    fs.existsSync(path.join(source, '00-PLANNING')),
    fs.existsSync(path.join(source, 'docs')),
    fs.existsSync(path.join(source, 'tests')),
  ].filter(Boolean).length;
  if (signals < 2) throw new Error('Legacy source does not look like a project root; expected at least two of src/, AGENTS.md, 00-PLANNING/, docs/, tests/.');
}

function phpFiles(root, current = root, files = []) {
  if (!fs.existsSync(current)) return files;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) phpFiles(root, absolute, files);
    else if (entry.isFile() && entry.name.endsWith('.php')) files.push(absolute);
  }
  return files;
}

function inferType(source) {
  const src = path.join(source, 'src');
  for (const file of phpFiles(src)) {
    const stat = fs.statSync(file);
    if (stat.size > 1024 * 1024) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (/^\s*\*?\s*Plugin Name\s*:/mi.test(content)) return 'wordpress-plugin';
  }
  return 'infer';
}

function titleFromSlug(slug) {
  return slug.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function projectLayout(destination, slug, type) {
  const wordpress = type === 'wordpress-plugin';
  const sourceCandidate = path.join(destination, 'src', slug);
  const source = wordpress && fs.existsSync(sourceCandidate) ? path.join('src', slug) : 'src';
  return {
    working_directory: destination,
    planning_root: path.join(destination, '00-PLANNING'),
    code_root: path.join(destination, source),
    test_root: path.join(destination, 'tests'),
    build_root: path.join(destination, 'build'),
    distribution_root: path.join(destination, 'dist'),
    deploy_destination: null,
    relative: {
      harness: '.harness', planning: '00-PLANNING', documentation: 'docs', decisions: path.join('docs', 'decisions'),
      source, tests: 'tests', scripts: 'scripts', build: 'build', distribution: 'dist',
    },
    release: wordpress
      ? { format: 'zip', artifact_pattern: `${slug}-{version}.zip`, archive_root: slug, ship_from: source }
      : { format: 'type-specific', artifact_pattern: `${slug}-{version}.{format}`, archive_root: null, ship_from: 'build' },
    next_action: `Reconcile the migrated project from existing evidence before changing product behaviour.`,
  };
}

function writeIfMissing(file, content) {
  if (fs.existsSync(file)) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, { flag: 'wx' });
  return true;
}

function migrationSystemModel(source) {
  return `# System Model\n\nMODEL_STATUS: DRAFT\n\nThis project was migrated from an earlier harness generation. Preserve existing behaviour; reconcile this model from the existing source, tests, planning and documentation before changing architecture.\n\n## Goal\nPreserve the existing working product while moving it into a standalone, version-controlled project with the current harness lifecycle.\n\n## Inputs\nExisting legacy project source, tests, planning documents, release artifacts and project-specific instructions copied from \`${source}\`.\n\n## Outputs\nThe same product behaviour and artifacts, now owned by a standalone project with recoverable Git and managed harness lifecycle metadata.\n\n## Capabilities\nInfer and confirm current capabilities from the migrated code, tests and documentation; do not invent new features during migration.\n\n## Data flow\nTreat the existing implementation and documented flows as authoritative evidence until this model is reconciled.\n\n## State and persistence\nPreserve all project-owned state and files; add only migration evidence, Git history and harness lifecycle state.\n\n## Failure boundaries\nThe legacy source remains untouched. Migration must fail without replacing the source, and managed handoff conflicts must stop rather than overwrite project customisations.\n\n## Invariants\nProduct behaviour is unchanged by migration; project-owned source/docs/tests remain project-owned; build/dist are not canonical source; no merge, deploy or release occurs.\n\n## Unknowns\nReconcile architecture, dependencies, runtime assumptions and active work from existing project evidence before the next product change.\n\n## Evidence\nLegacy project directory, copied file inventory, existing tests, docs, planning files and source tree.\n`;
}

function migrationHypothesis() {
  return `# Architecture Hypothesis\n\nHYPOTHESIS_STATUS: DRAFT\n\nThis file is intentionally draft after legacy migration. The migration does not redesign the product.\n\n## Primary shape\nPreserve the established project shape until existing evidence is reconciled.\n\n## Capabilities\nDerive current capabilities from source, tests and documentation.\n\n## Candidate patterns\nRetain established patterns unless a later evidence-backed task justifies change.\n\n## Assumptions\nThe migrated project was working before lifecycle migration and its product-owned files are authoritative.\n\n## Alternatives considered\nBlind replacement and rebuilding from scratch are rejected because they risk losing project-specific work.\n\n## Bounded proof\nRun the existing project test suite and harness doctor after migration before product changes.\n\n## Proposed architecture\nNo product architecture change during migration; only project separation, Git recovery and managed harness lifecycle are added.\n\n## Approval evidence\nLifecycle migration is reversible and preserves the existing product; consequential architecture changes remain owner-controlled.\n`;
}

function readinessScript() {
  return `#!/usr/bin/env node\n\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');\nconst GATES = ${JSON.stringify(GATES)};\nconst task = JSON.parse(fs.readFileSync(path.join(ROOT, '.harness/state/active-task.json'), 'utf8'));\nconst failures = [];\nconst executionStatuses = new Set(['ready', 'in_progress', 'completed']);\nconst hasExactLine = (content, marker) => content.split(/\\r?\\n/).some((line) => line.trim() === marker);\nif (task.schema_version !== 2) failures.push('active-task.json requires schema_version 2');\nif (!executionStatuses.has(task.status)) failures.push('task is not execution-ready: ' + task.status);\nconst gates = new Map(Array.isArray(task.alignment) ? task.alignment.map((gate) => [gate.gate, gate]) : []);\nfor (const name of GATES) { const gate = gates.get(name); if (!gate) failures.push('missing gate: ' + name); else if (gate.answer !== 'YES') failures.push('blocking gate: ' + name); else if (!String(gate.evidence ?? '').trim()) failures.push('missing evidence: ' + name); }\nfor (const [relativePath, marker] of [['00-PLANNING/SYSTEM-MODEL.md', 'MODEL_STATUS: CONFIRMED'], ['00-PLANNING/ARCHITECTURE-HYPOTHESIS.md', 'HYPOTHESIS_STATUS: ACCEPTED']]) { const absolutePath = path.join(ROOT, relativePath); if (!fs.existsSync(absolutePath)) failures.push('missing artifact: ' + relativePath); else if (!hasExactLine(fs.readFileSync(absolutePath, 'utf8'), marker)) failures.push(relativePath + ' requires ' + marker); }\nif (failures.length) { console.error('Project readiness failed:\\n- ' + failures.join('\\n- ')); process.exit(1); }\nconsole.log('Project readiness passed.');\n`;
}

function ensureMigrationScaffold(destination, source, name, slug, type, sourceInventory) {
  fs.mkdirSync(path.join(destination, '.harness', 'state'), { recursive: true });
  fs.mkdirSync(path.join(destination, '00-PLANNING'), { recursive: true });
  fs.mkdirSync(path.join(destination, 'docs', 'decisions'), { recursive: true });
  fs.mkdirSync(path.join(destination, 'scripts'), { recursive: true });

  const layout = projectLayout(destination, slug, type);
  writeIfMissing(path.join(destination, '.harness', 'project.json'), `${JSON.stringify({
    schema_version: 1,
    name,
    slug,
    type,
    workspace_root: path.dirname(destination),
    project_destination: destination,
    deploy_destination: null,
    layout,
    migrated_from: source,
  }, null, 2)}\n`);

  const activeTask = path.join(destination, '.harness', 'state', 'active-task.json');
  if (fs.existsSync(activeTask)) {
    let current = null;
    try { current = JSON.parse(fs.readFileSync(activeTask, 'utf8')); } catch { current = null; }
    if (current?.schema_version !== 2) {
      const backup = path.join(destination, '.harness', 'legacy', 'active-task.pre-v05.json');
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.copyFileSync(activeTask, backup, fs.constants.COPYFILE_EXCL);
      fs.rmSync(activeTask);
    }
  }
  writeIfMissing(activeTask, `${JSON.stringify({
    schema_version: 2,
    id: 'legacy-project-migration',
    goal: 'Reconcile the migrated project with the current harness without changing product behaviour.',
    status: 'blocked',
    alignment: GATES.map((gate) => ({
      gate,
      answer: ['destination', 'evidence', 'ownership', 'debt_control'].includes(gate) ? 'YES' : 'UNKNOWN',
      evidence: gate === 'destination' ? `Standalone destination: ${destination}`
        : gate === 'evidence' ? `Legacy source inventory captured from ${source}`
          : gate === 'ownership' ? 'Legacy product files remain project-owned; harness-managed files are installed separately.'
            : gate === 'debt_control' ? 'Migration is behaviour-preserving and blocks product execution until reconciliation.'
              : 'Requires post-migration reconciliation.',
    })),
  }, null, 2)}\n`);

  writeIfMissing(path.join(destination, '00-PLANNING', 'SYSTEM-MODEL.md'), migrationSystemModel(source));
  writeIfMissing(path.join(destination, '00-PLANNING', 'ARCHITECTURE-HYPOTHESIS.md'), migrationHypothesis());
  writeIfMissing(path.join(destination, 'scripts', 'project-ready.mjs'), readinessScript());

  const migrationRecord = {
    schema_version: 1,
    migrated_at: new Date().toISOString(),
    source,
    destination,
    name,
    slug,
    inferred_type: type,
    source_file_count: sourceInventory.length,
    source_total_bytes: sourceInventory.reduce((total, item) => total + (item.bytes || 0), 0),
    source_inventory: sourceInventory,
    invariants: ['legacy source remains untouched', 'product behaviour is not redesigned during migration', 'managed harness files are added through project handoff'],
  };
  fs.writeFileSync(path.join(destination, '.harness', 'migration.json'), `${JSON.stringify(migrationRecord, null, 2)}\n`, { flag: 'wx' });
  return layout;
}

function runHandoff(destination) {
  const script = path.join(ROOT, 'scripts', 'project-handoff.js');
  const result = spawnSync(process.execPath, [script, '--project-root', destination], {
    cwd: ROOT,
    encoding: 'utf8',
    env: NON_INTERACTIVE_ENV,
    timeout: 120000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `project handoff exited ${result.status}`).trim());
  return JSON.parse(result.stdout);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.from || !args.to) throw new Error('Usage: node scripts/project-migrate.js --from /absolute/legacy-project --to /absolute/standalone-project [--name "..."] [--slug slug] [--type wordpress-plugin|infer]');
  const source = path.resolve(args.from);
  const destination = path.resolve(args.to);
  assertPaths(source, destination);
  assertLooksLikeProject(source);

  const slug = String(args.slug || path.basename(destination));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Migration --slug must be lowercase kebab-case.');
  const name = String(args.name || titleFromSlug(slug));
  const type = String(args.type || inferType(source));
  const before = inventory(source);

  let destinationCreated = false;
  try {
    fs.mkdirSync(destination, { recursive: true });
    destinationCreated = true;
    fs.cpSync(source, destination, { recursive: true, force: false, errorOnExist: true, dereference: false, filter: (candidate) => path.basename(candidate) !== '.git' });
    const copied = inventory(destination);
    if (!sameInventory(before, copied)) throw new Error('Copied project does not match the legacy source inventory.');

    const layout = ensureMigrationScaffold(destination, source, name, slug, type, before);
    const handoff = runHandoff(destination);
    console.log(JSON.stringify({
      action: 'legacy-project-migrated',
      source,
      destination,
      source_untouched: sameInventory(before, inventory(source)),
      name,
      slug,
      type,
      layout,
      handoff,
      next: `Open ${destination}, run the existing project tests, then run node scripts/harness.mjs doctor.`,
    }, null, 2));
  } catch (error) {
    if (destinationCreated) fs.rmSync(destination, { recursive: true, force: true });
    throw new Error(`${error.message} Migration rolled back; legacy source was not modified.`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Project migration failed: ${error.message}`);
  process.exitCode = 1;
}
