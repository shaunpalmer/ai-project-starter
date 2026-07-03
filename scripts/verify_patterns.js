#!/usr/bin/env node
/**
 * Compliance Pattern Guard
 * Inspects generated code for professional standards (Docblocks, Clean Todo management)
 * before letting an AI finish a task loop.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const targetFile = process.argv[2];

if (!targetFile) {
    console.error("❌ Usage: node scripts/verify_patterns.js [relative/path/to/file]");
    process.exit(1);
}

const fullPath = path.join(ROOT, targetFile);

// Skip markdown assets or configuration files entirely
if (targetFile.endsWith('.md') || targetFile.includes('node_modules')) {
    process.exit(0);
}

if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: Target file does not exist at ${targetFile}`);
    process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf8');

/**
 * Compliance Check Evaluator
 */
function runComplianceCheck() {
    const issues = [];

    // 1. Check for Docblocks / Meaningful Comments
    // Looks for standard /** ... */ or dense line comment blocks
    const hasDocblock = /\/\*\*([\s\S]*?)\*\//.test(content);
    const hasLineComments = (content.match(/\/\/ .+/g) || []).length > 3;

    if (!hasDocblock && !hasLineComments) {
        issues.push("Missing descriptive documentation. You must include a JSDoc block or inline comments explaining the intent of this logic.");
    }

    // 2. Check for Forgotten or Leaked TODOs
    // If the AI left a temporary marker, catch it before it saves
    const lingeringTodos = content.match(/\b(TODO|FIXME)\b/gi);
    if (lingeringTodos) {
        issues.push(`Found ${lingeringTodos.length} unresolved placeholder(s) (TODO/FIXME). Clear these out before declaring the file finished.`);
    }

    // 3. Structural Sanity Check (e.g., tracking missing error handling blocks)
    if (content.includes('catch') && !content.includes('console.error') && !content.includes('logger.')) {
        issues.push("Empty or silent 'catch' block detected. Ensure you are logging or propagating errors properly according to system standards.");
    }

    // Return results to the harness loop
    if (issues.length > 0) {
        console.error(`\n🤖 [COMPLIANCE REVIEW] Code patterns did not meet project standards for: ${targetFile}`);
        issues.forEach((issue, index) => {
            console.error(`   ${index + 1}. ⚠️ ${issue}`);
        });
        
        console.error(`\nAction Required: Modify the file to meet these structural rules.`);
        process.exit(1);
    }

    console.log(`✅ [COMPLIANCE PASSED] ${targetFile} adheres to architecture rules.`);
    process.exit(0);
}

runComplianceCheck();

/**
 * @description [Clear, concise summary of what this function/class does]
 * @responsibility [Single Responsibility: The ONE reason this code should change]
 * @architecture [How this fits into the wider system/harness pipeline]
 * @problem [The specific business or technical problem this block solves]
 */

// 1. Enforce Shaun's OOP Architectural Docblock Standards
const requiredTokens = ['@description', '@responsibility', '@architecture', '@problem'];
const missingTokens = [];

requiredTokens.forEach(token => {
    if (!content.includes(token)) {
        missingTokens.push(token);
    }
});

if (missingTokens.length > 0) {
    issues.push(`OOP Standard Violation: Missing architectural documentation tokens: ${missingTokens.join(', ')}.`);
}
