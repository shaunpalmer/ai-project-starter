#!/usr/bin/env node
/**
 * Compliance Pattern Guard (Double Gate + AST Architecture Check)
 * Inspects generated code for strict OOP standards, mandatory docblocks,
 * and structural compliance before allowing the AI execution loop to finish.
 */

const fs = require('fs');
const path = require('path');

let acorn;
try {
    acorn = require('acorn');
} catch (e) {
    // Graceful warning fallback if acorn isn't installed yet
    acorn = null;
}

const ROOT = path.resolve(__dirname, '..');
const targetFile = process.argv[2];

if (!targetFile) {
    console.error("❌ Usage: node scripts/verify_patterns.js [relative/path/to/file]");
    process.exit(1);
}

const fullPath = path.join(ROOT, targetFile);

// Skip markdown assets, configurations, or vendor files entirely
if (targetFile.endsWith('.md') || targetFile.includes('node_modules') || targetFile.endsWith('.json')) {
    process.exit(0);
}

if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: Target file does not exist at ${targetFile}`);
    process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf8');

function runComplianceCheck() {
    const issues = [];

    // ==========================================
    // GATE 1: TEXT-BASED & METADATA SANITY CHECKS
    // ==========================================

    // 1. Enforce Shaun's OOP Architectural Docblock Standards
    const requiredTokens = ['@description', '@responsibility', '@architecture', '@problem'];
    const missingTokens = [];

    requiredTokens.forEach(token => {
        if (!content.includes(token)) {
            missingTokens.push(token);
        }
    });

    if (missingTokens.length > 0) {
        issues.push(`OOP Standard Violation: Missing architectural documentation tokens: ${missingTokens.join(', ')}`);
    }

    // 2. Check for Forgotten or Leaked TODOs/FIXMEs
    const lingeringTodos = content.match(/\b(TODO|FIXME)\b/gi);
    if (lingeringTodos) {
        issues.push(`Found ${lingeringTodos.length} unresolved placeholder(s) (TODO/FIXME). Clear these out before declaring the file finished.`);
    }

    // 3. Hygiene Check: Silent Catch Blocks (Violates Fail Loudly Principle)
    if (content.includes('catch') && !content.includes('console.error') && !content.includes('logger.') && !content.includes('throw ')) {
        issues.push("Empty or silent 'catch' block detected. You must log or propagate errors according to System Rule #27 (Fail Loudly).");
    }

    // ==========================================
    // GATE 2: AST / STRUCTURAL COMPLIANCE CHECK
    // ==========================================
    if (acorn) {
        try {
            const ast = acorn.parse(content, { ecmaVersion: 'latest', sourceType: 'module' });
            let hasClass = false;
            let hasConstructor = false;

            // Helper function to recursively walk the AST nodes
            function walk(node) {
                if (!node) return;
                
                if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
                    hasClass = true;
                    // Look inside the class body for a constructor definition
                    if (node.body && node.body.type === 'ClassBody') {
                        node.body.body.forEach(method => {
                            if (method.type === 'MethodDefinition' && method.kind === 'constructor') {
                                hasConstructor = true;
                            }
                        });
                    }
                }

                // Recursively check child nodes
                for (const key in node) {
                    if (node[key] && typeof node[key] === 'object') {
                        if (Array.isArray(node[key])) {
                            node[key].forEach(walk);
                        } else {
                            walk(node[key]);
                        }
                    }
                }
            }

            walk(ast);

            if (!hasClass) {
                issues.push("Structural Violation: Procedural code rejected. Code must be wrapped in an Object-Oriented class structure.");
            } else if (!hasConstructor) {
                issues.push("Dependency Injection Violation: Your class is missing an explicit constructor block to handle object instantiation and dependencies.");
            }

        } catch (parseError) {
            issues.push(`Syntax Error: The generated code failed mechanical compilation parsing: ${parseError.message}`);
        }
    } else {
        // Fallback structural string checks if acorn isn't available
        if (!content.includes('class ')) {
            issues.push("Structural Violation (Fallback Match): No class declaration found. Code must be Object-Oriented.");
        }
        if (content.includes('class ') && !content.includes('constructor')) {
            issues.push("Dependency Injection Violation (Fallback Match): Class found, but no explicit constructor block was detected.");
        }
    }

    // ==========================================
    // EVALUATE INTERCEPTIONS
    // ==========================================
    if (issues.length > 0) {
        console.error(`\n🤖 [COMPLIANCE REVIEW] Code patterns did not meet project standards for: ${targetFile}`);
        issues.forEach((issue, index) => {
            console.error(`   ${index + 1}. ⚠️ ${issue}`);
        });
        console.error(`\nAction Required: Modify the file to meet these structural rules.`);
        process.exit(1); 
    }

    // ==========================================
    // GATE 3: THE RANDOM ACTIVE AUDIT POOL (15%)
    // ==========================================
    if (Math.random() < 0.15) {
        console.log(`\n🚨 [AUDIT TRIGGERED] Random compliance audit activated for ${targetFile}!`);
        console.log(`The code is structurally sound, but you must pass an intellectual inspection defense.`);
        
        // EXIT CODE 10: Tell your master harness script that this is a random quiz event, 
        // not a hard code failure.
        process.exit(10);
    }

    console.log(`✅ [COMPLIANCE PASSED] ${targetFile} adheres to architecture rules.`);
    process.exit(0);
}

runComplianceCheck();


const { execSync } = require('child_process');

try {
    execSync('node scripts/verify_patterns.js src/services/UserService.js');
    console.log("File saved and completed cleanly!");
} catch (error) {
    if (error.status === 10) {
        // INTERCEPT THE 15% RANDOM QUIZ
        console.log("Harness intercepted code 10. Pausing pipeline to issue a pop quiz to the model...");
        
        // Pass a command back to the model:
        // "Your code passed syntax checks, but you hit a random audit. Explain exactly how this class honors the principles of High Cohesion and Low Coupling."
    } else {
        // Treat it as a standard rule rejection (Exit Code 1)
        console.log("Code rejected due to actual rule violations. Forcing rewrite loop.");
    }
}
