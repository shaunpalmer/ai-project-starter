#!/usr/bin/env node
/**
 * Lineage & Debugging Guard
 * Enforces that an AI must write a diagnostic analysis before modifying existing code.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/**
 * Validates whether the AI has permission to modify or create a specific file.
 * @param {string} targetRelativePath - Example: 'src/core/Matrix.js'
 */
function verifyDebuggingGate(targetRelativePath) {
    const fullTargetPath = path.join(ROOT, targetRelativePath);
    
    // Normalize path separators to forward slashes for unified checking
    const normalizedPath = targetRelativePath.replace(/\\/g, '/');

    // WHITELIST: The AI can always edit planning documents, skills, or any markdown context
    if (
        normalizedPath.startsWith('00-PLANNING/') || 
        normalizedPath.startsWith('.github/skills/') || 
        normalizedPath.endsWith('.md')
    ) {
        return true;
    }

    // GATE 1: If it's a brand new file, allow creation, but ensure it's not a sneaky overwrite
    if (!fs.existsSync(fullTargetPath)) {
        console.log(`🆕 [LINEAGE] Permitting creation of a brand new asset: ${targetRelativePath}`);
        return true;
    }

    // GATE 2: The file exists. The AI is trying to modify it. Check for a Debug Session Log.
    console.log(`⚠️ [LINEAGE] Warning: Target file [${targetRelativePath}] already exists.`);
    console.log(`🛡️ Looking for active diagnostic verification credentials...`);

    // The script expects a matching hidden session log file: e.g., src/core/.Matrix.js.debug-session
    const dir = path.dirname(fullTargetPath);
    const baseName = path.basename(fullTargetPath);
    const sessionLogPath = path.join(dir, `.${baseName}.debug-session`);

    if (!fs.existsSync(sessionLogPath)) {
        console.error(`\n❌ [GUARD DENIED] Wholesale modification blocked!`);
        console.error(`Reason: You are attempting to alter an existing codebase asset without an active debugging verification.`);
        console.error(`\nFix Action Required by AI:`);
        console.error(`1. Read your operational protocol rules in: \`.github/skills/guard_debugging.md\``);
        console.error(`2. You must first create a diagnostic file at: \`${path.relative(ROOT, sessionLogPath)}\``);
        console.error(`3. Document the exact error, the root cause, and your targeted in-place fix inside that file.`);
        console.error(`4. Once that file is populated, this gate will unlock for editing.`);
        process.exit(1);
    }

    // GATE 3: Verify the debug log isn't just empty placeholder text
    const sessionContent = fs.readFileSync(sessionLogPath, 'utf8').trim();
    if (sessionContent.length < 50 || sessionContent.includes('TODO')) {
        console.error(`\n❌ [GUARD DENIED] The debug session log at [\`${path.relative(ROOT, sessionLogPath)}\`] is empty or a placeholder.`);
        console.error(`You must provide a real structural analysis before coding permissions are granted.`);
        process.exit(1);
    }

    console.log(`✅ [GUARD GRANTED] Verified active debug session for ${targetRelativePath}. Modifications unlocked.`);
    return true;
}

// Command line entry point execution
const targetFile = process.argv[2];
if (!targetFile) {
    console.error("Usage: node scripts/guard_debugging.js [relative/path/to/file]");
    process.exit(1);
}

verifyDebuggingGate(targetFile);
