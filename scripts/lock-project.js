// scripts/lock-project.js
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK_FILE = path.join(ROOT, '.planning-lock');

function ensurePlanning() {
  try {
    execFileSync(process.execPath, ['scripts/project-control.js', 'verify'], { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

function lock() {
  try {
    fs.writeFileSync(LOCK_FILE, 'LOCKED - Complete project-control gates first\n', 'utf8');
    console.log('🔒 Planning lock recorded. This is an advisory marker, not filesystem enforcement.');
    console.log('   Run: node scripts/lock-project.js unlock');
  } catch {
    console.error('Failed to create lock file.');
    process.exitCode = 1;
  }
}

function unlock() {
  console.log('🛡️ Checking supported project-control state...');
  if (ensurePlanning()) {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
    console.log('🔓 Project control verified; advisory lock removed.');
  } else {
    console.log('❌ Project control incomplete. Unlock denied.');
    console.log('   Resolve the Alignment Ladder and discovery artifacts first.');
    process.exitCode = 1;
  }
}

function status() {
  if (fs.existsSync(LOCK_FILE)) console.log('🔒 Project is LOCKED (planning required)');
  else console.log('🔓 Project is unlocked');
}

const action = process.argv[2] || 'status';
if (action === 'lock') lock();
else if (action === 'unlock') unlock();
else if (action === 'status') status();
else {
  console.log('Usage: node scripts/lock-project.js [lock|unlock|status]');
  process.exitCode = 1;
}
