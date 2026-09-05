// scripts/harness-init.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredDirs = [
  'src',
  '00-PLANNING',
  '.github/skills',
];

const requiredFiles = [
  'PROJECT-INTAKE.md',
  'AGENTS.md',
  'AI-NOTES.md',
  'HARNESS-LOOP.md',
];

function ensureDirectory(dir) {
  const fullPath = path.join(PROJECT_ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

function checkRequiredFiles() {
  console.log('\n🔍 Checking required files...');
  let missing = [];

  requiredFiles.forEach(file => {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
      console.log(`   ❌ Missing: ${file}`);
    } else {
      console.log(`   ✅ Found: ${file}`);
    }
  });

  if (missing.length > 0) {
    console.log('\n⚠️  Some required files are missing. Run setup again after adding them.');
  } else {
    console.log('\n✅ All core files present.');
  }
  return missing.length === 0;
}

function main() {
  console.log('🚀 Initializing AI Project Harness...\n');

  // Validate before making changes so incomplete copies fail without a success message.
  if (!checkRequiredFiles()) {
    process.exitCode = 1;
    return;
  }

  // Create required directories
  console.log('📁 Ensuring directory structure...');
  requiredDirs.forEach(ensureDirectory);

  // Create lock file by default (forces planning first)
  const lockFile = path.join(PROJECT_ROOT, '.planning-lock');
  if (!fs.existsSync(lockFile)) {
    fs.writeFileSync(lockFile, 'LOCKED - Complete planning before coding\n');
    console.log('🔒 Initial lock applied (planning required)');
  }

  console.log('\n🎉 Harness initialization complete!');
  console.log('\nNext steps:');
  console.log('   1. Fill out PROJECT-INTAKE.md');
  console.log('   2. Run: node scripts/lock-project.js status');
  console.log('   3. Start working with your AI agent');
}

main();
