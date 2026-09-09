#!/usr/bin/env node

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const command = args[0];

function scriptPath(name) {
  const candidates = [
    path.join(ROOT, 'scripts', `${name}.mjs`),
    path.join(ROOT, 'scripts', `${name}.js`),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Missing harness script: ${name}.mjs or ${name}.js`);
  }
  return found;
}

function run(script, forwarded) {
  const result = spawnSync(process.execPath, [scriptPath(script), ...forwarded], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      GH_PROMPT_DISABLED: '1',
      GCM_INTERACTIVE: 'Never',
    },
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

function usage() {
  console.log(`Harness lifecycle commands:\n\n  harness doctor\n  harness update --check\n  harness update --apply\n  harness adopt [--source-root /path | --repository <git-url>]\n  harness migrate --from /legacy/project --to /standalone/project [--name \"...\"] [--slug slug] [--type wordpress-plugin|infer]\n  harness vcs <status|preflight|branch|checkpoint|connect|push> ...\n\nGenerated project:\n  node scripts/harness.mjs <command>\n\nStarter/source repository targeting an existing project:\n  npm run harness -- <command> --cwd /absolute/path/to/project\n\nLegacy project separation/migration:\n  npm run harness -- migrate --from /absolute/old/project --to /absolute/new/project\n\nImportant: the ai-project-starter source clone itself is updated with Git (normally git switch main && git pull --ff-only origin main). The embedded-project updater is for harness copies installed inside product projects. The migrate command is for pre-lifecycle projects that need to become standalone managed projects without gutting or overwriting the legacy source.`);
}

try {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    usage();
  } else if (command === 'doctor') {
    run('harness-update', ['doctor', ...args.slice(1)]);
  } else if (command === 'update') {
    run('harness-update', ['update', ...args.slice(1)]);
  } else if (command === 'adopt') {
    run('harness-update', ['adopt', ...args.slice(1)]);
  } else if (command === 'migrate') {
    run('project-migrate', args.slice(1));
  } else if (command === 'vcs') {
    run('vcs-control', args.slice(1));
  } else {
    console.error(`Unknown harness command: ${command}`);
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Harness command failed: ${error.message}`);
  process.exitCode = 1;
}
