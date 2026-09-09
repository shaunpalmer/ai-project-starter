#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const command = args[0];

function run(script, forwarded) {
  const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts', script), ...forwarded], {
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
  console.log(`Harness lifecycle commands:\n\n  harness doctor\n  harness update --check\n  harness update --apply\n  harness adopt [--source-root /path | --repository <git-url>]\n  harness vcs <status|preflight|branch|checkpoint|connect|push> ...\n\nFrom a generated project use: node scripts/harness.mjs <command>.\nFrom the starter repository use: npm run harness -- <command>.`);
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  usage();
} else if (command === 'doctor') {
  run('harness-update.js', ['doctor', ...args.slice(1)]);
} else if (command === 'update') {
  run('harness-update.js', ['update', ...args.slice(1)]);
} else if (command === 'adopt') {
  run('harness-update.js', ['adopt', ...args.slice(1)]);
} else if (command === 'vcs') {
  const local = path.join(ROOT, 'scripts', 'vcs-control.mjs');
  run(path.basename((await import('node:fs')).existsSync(local) ? local : path.join(ROOT, 'scripts', 'vcs-control.js')), args.slice(1));
} else {
  console.error(`Unknown harness command: ${command}`);
  usage();
  process.exitCode = 1;
}
