// scripts/lock-project.js
const fs = require('fs');
const path = require('path');

const LOCK_FILE = path.join(process.cwd(), '.planning-lock');
const TARGET_DIR = path.join(process.cwd(), 'src');

function ensurePlanning() {
    try {
        // Run your planning verification script
        const { execSync } = require('child_process');
        execSync('node scripts/ensure_planning.js', { stdio: 'inherit' });
        return true;
    } catch (err) {
        return false;
    }
}

function lock() {
    try {
        fs.writeFileSync(LOCK_FILE, 'LOCKED - Complete planning gates first\n', 'utf8');
        console.log('🔒 Project locked. Source changes blocked until planning is complete.');
        console.log('   Run: node scripts/lock-project.js unlock');
    } catch (e) {
        console.error('Failed to create lock file.');
    }
}

function unlock() {
    console.log('🛡️ Checking planning status...');
    
    if (ensurePlanning()) {
        if (fs.existsSync(LOCK_FILE)) {
            fs.unlinkSync(LOCK_FILE);
        }
        console.log('🔓 Unlock successful. Source directory is now open.');
    } else {
        console.log('❌ Planning incomplete. Unlock denied.');
        console.log('   Finish your 5 gates in 00-PLANNING/ first.');
    }
}

function status() {
    if (fs.existsSync(LOCK_FILE)) {
        console.log('🔒 Project is LOCKED (planning required)');
    } else {
        console.log('🔓 Project is unlocked');
    }
}

// CLI handling
const action = process.argv[2] || 'status';

if (action === 'lock') lock();
else if (action === 'unlock') unlock();
else if (action === 'status') status();
else {
    console.log('Usage: node scripts/lock-project.js [lock|unlock|status]');
}
