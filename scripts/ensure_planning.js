#!/usr/bin/env node
/**
 * Planning gate checker for ai-project-starter.
 * * This script intentionally uses simple marker checks.
 * It does not use fuzzy AI validation.
 * * It fails when required planning files are missing, empty, or still unresolved.
 */

const fs = require('fs');
const path = require('path');

// Replicates Path(__file__).resolve().parents[1] assuming script lives in /scripts
const ROOT = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
    "PROJECT-INTAKE.md",
    "AGENTS.md",
    "HARNESS-LOOP.md",
    "00-PLANNING/DECISIONS-TO-MAKE.md",
    "ARCHITECTURE.md",
    "TECH-SPEC.md",
    "TASKS.md",
    "AI-NOTES.md",
];

const OPTIONAL_CONTEXT_FILES = [
    "DATABASE.md",
    "DATA-FLOW.md",
];

const PLACEHOLDER_PATTERNS = [
    /\bTODO\b/i,
    /\bTBD\b/i,
    /\bFILL\s+THIS\b/i,
    /\bPLACEHOLDER\b/i,
    /\bUNRESOLVED\b/i,
    /_Describe/i,
    /_One paragraph/i,
    /___________/i,
];

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return "";
    }
}

function fail(message, failures) {
    failures.push(`- ${message}`);
}

function fileHasRealContent(content, minNonEmptyLines = 5) {
    const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    return lines.length >= minNonEmptyLines;
}

function containsBadPlaceholder(content) {
    const found = [];
    for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(content)) {
            // Source extracts the text representation of the regex pattern
            found.push(`\\b${pattern.source}\\b`);
        }
    }
    return found;
}

function checkRequiredFiles(failures) {
    const missingFiles = [];

    for (const relativePath of REQUIRED_FILES) {
        const filePath = path.join(ROOT, relativePath);

        if (!fs.existsSync(filePath)) {
            fail(`Missing required file: \`${relativePath}\``, failures);
            missingFiles.push(relativePath);
            continue;
        }

        const content = readFile(filePath);

        if (!fileHasRealContent(content)) {
            fail(`\`${relativePath}\` appears empty or too thin.`, failures);
            continue;
        }

        const placeholders = containsBadPlaceholder(content);
        if (placeholders.length > 0) {
            fail(`\`${relativePath}\` still contains placeholder markers: ${placeholders.join(', ')}`, failures);
        }
    }

    return missingFiles.length > 0;
}

function checkProjectIntake(failures) {
    const filePath = path.join(ROOT, "PROJECT-INTAKE.md");
    if (!fs.existsSync(filePath)) return;

    const content = readFile(filePath);
    if (!content.includes("COMPLETED: true")) {
        fail(`\`PROJECT-INTAKE.md\` must include \`COMPLETED: true\` before coding.`, failures);
    }
}

function checkDecisionGates(failures) {
    const filePath = path.join(ROOT, "00-PLANNING/DECISIONS-TO-MAKE.md");
    if (!fs.existsSync(filePath)) return;

    const content = readFile(filePath);
    const unresolvedMarkers = [
        "STATUS: UNRESOLVED",
        "STATUS: NEEDS_SHAUN",
        "STATUS: NEEDS_SENIOR_DEVELOPER",
        "NEEDS SHAUN",
        "NEEDS SENIOR DEVELOPER",
    ];

    for (const marker of unresolvedMarkers) {
        if (content.includes(marker)) {
            fail(`\`DECISIONS-TO-MAKE.md\` still contains blocker marker: \`${marker}\``, failures);
        }
    }

    // Dynamic global match count to replicate python content.count()
    const resolvedMatches = content.match(/STATUS: RESOLVED/g);
    const resolvedCount = resolvedMatches ? resolvedMatches.length : 0;

    if (resolvedCount < 5) {
        fail(
            `\`DECISIONS-TO-MAKE.md\` should contain at least 5 resolved gates: ` +
            `Project type, Architecture shape, Stack choice, Database choice, Data flow (or alternatives).`,
            failures
        );
    }
}

function checkTechSpec(failures) {
    const filePath = path.join(ROOT, "TECH-SPEC.md");
    if (!fs.existsSync(filePath)) return;

    const content = readFile(filePath);
    const requiredMarkers = [
        "Runtime:",
        "Language:",
        "Database:",
        "Dependencies:",
    ];

    for (const marker of requiredMarkers) {
        if (!content.includes(marker)) {
            fail(`\`TECH-SPEC.md\` should include \`${marker}\` in Machine-Readable Stack Markers.`, failures);
        }
    }
}

function checkArchitecture(failures) {
    const filePath = path.join(ROOT, "ARCHITECTURE.md");
    if (!fs.existsSync(filePath)) return;

    const content = readFile(filePath);
    const requiredMarkers = [
        "System Overview",
        "Architecture Style",
        "Directory Structure",
    ];

    for (const marker of requiredMarkers) {
        if (!content.includes(marker)) {
            fail(`\`ARCHITECTURE.md\` should include \`${marker}\`.`, failures);
        }
    }
}

function checkTaskSlice(failures) {
    const filePath = path.join(ROOT, "TASKS.md");
    if (!fs.existsSync(filePath)) return;

    const content = readFile(filePath);
    if (!content.includes("FIRST BUILD SLICE:")) {
        fail(`\`TASKS.md\` must include \`FIRST BUILD SLICE:\` before coding.`, failures);
    }
}

function checkContextFiles(failures) {
    const archPath = path.join(ROOT, "ARCHITECTURE.md");
    if (!fs.existsSync(archPath)) return;

    const archContent = readFile(archPath).toLowerCase();

    if (archContent.includes("database") && !fs.existsSync(path.join(ROOT, "DATABASE.md"))) {
        fail(`\`ARCHITECTURE.md\` mentions database but \`DATABASE.md\` is missing.`, failures);
    }

    if (archContent.includes("data flow") && !fs.existsSync(path.join(ROOT, "DATA-FLOW.md"))) {
        fail(`\`ARCHITECTURE.md\` mentions data movement but \`DATA-FLOW.md\` is missing.`, failures);
    }
}

function printFailureInstructions(failures) {
    console.log("Planning check failed.\n");
    console.log("Fix these items before coding or merging:\n");
    console.log(failures.join("\n"));
    console.log("\nNext steps:");
    console.log("1. Read ONBOARDING.md for the two-phase workflow and planning checklist");
    console.log("2. Fill the missing or incomplete files listed above");
    console.log("3. Push your changes to trigger the check again");
    console.log("4. Run: node scripts/ensure_planning.js (locally to verify)");
}

function main() {
    const failures = [];

    // Core file assertions
    const coreFilesMissing = checkRequiredFiles(failures);

    // Early exit if the foundational layout is physically missing
    if (coreFilesMissing || failures.length > 0) {
        printFailureInstructions(failures);
        process.exit(1);
    }

    // Run structural inner gate verifications
    checkProjectIntake(failures);
    checkDecisionGates(failures);
    checkTechSpec(failures);
    checkArchitecture(failures);
    checkTaskSlice(failures);
    checkContextFiles(failures);

    if (failures.length > 0) {
        printFailureInstructions(failures);
        process.exit(1);
    }

    console.log("Planning check passed.");
    process.exit(0);
}

// Kick off run
main();
