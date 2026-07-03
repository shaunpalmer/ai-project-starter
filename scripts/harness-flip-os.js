#!/usr/bin/env node
/**
 * OS-Level Permission Gate Flash Controller
 * Handles hard locking/unlocking of the source directories.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.join(ROOT, 'src');

// Ensure the target directory exists before we try to manipulate its permissions
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const action = process.argv[2];

if (!action || (action !== 'lock' && action !== 'unlock')) {
    console.error("❌ Error: You must specify an action. Usage: node scripts/harness-flip-os.js [lock|unlock]");
    process.exit(1);
}

/**
 * Detects the platform and strips write permissions at the OS level
 */
function lockDirectory() {
    console.log(`🔒 [OS KERNEL] Stripping write privileges from: ${TARGET_DIR}`);
    try {
        if (process.platform === 'win32') {
            // Windows: Sets the Read-Only attribute recursively (+R)
            execSync(`attrib +R "${TARGET_DIR}\\*.*" /S /D`, { stdio: 'ignore' });
        } else {
            // Linux (Fedora) / macOS: Removes user write permissions (u-w)
            execSync(`chmod -R u-w "${TARGET_DIR}"`, { stdio: 'ignore' });
        }
        console.log("✅ OS Gate Locked. Source files are now read-only to all tools.");
    } catch (error) {
        console.error(`🚨 Failed to enforce OS lock: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Detects the platform and restores write permissions if the planning check passes
 */
function unlockDirectory() {
    console.log("🛡️ [OS KERNEL] Evaluating planning integrity before unlocking...");

    // 1. Force run the validation gate script first
    try {
        execSync('node scripts/ensure_planning.js', { stdio: 'pipe', cwd: ROOT });
        console.log("✅ Planning check passed. Validation criteria met.");
    } catch (error) {
        const output = error.stdout ? error.stdout.toString() : error.message;
        console.error("\n❌ [UNLOCK DENIED] Structural planning validation failed:\n");
        console.error(output);
        process.exit(1);
    }

    // 2. If the validation script passed, restore write permissions at the OS level
    try {
        console.log(`🔓 [OS KERNEL] Restoring write privileges to: ${TARGET_DIR}`);
        if (process.platform === 'win32') {
            // Windows: Clears the Read-Only attribute (-R)
            execSync(`attrib -R "${TARGET_DIR}\\*.*" /S /D`, { stdio: 'ignore' });
        } else {
            // Linux (Fedora) / macOS: Adds user write permissions back (u+w)
            execSync(`chmod -R u+w "${TARGET_DIR}"`, { stdio: 'ignore' });
        }
        console.log("🚀 OS Gate Unlocked. Production environment is open for active builds.");
    } catch (error) {
        console.error(`🚨 Failed to lift OS lock: ${error.message}`);
        process.exit(1);
    }
}

// Main execution switch
if (action === 'lock') {
    lockDirectory();
} else if (action === 'unlock') {
    unlockDirectory();
}
