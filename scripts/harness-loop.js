#!/usr/bin/env node
/**
 * HARNESS-LOOP.md Implementation
 * Strict Cognitive Harness Orchestrator enforcing linear state progression.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const FILES = {
    plan: path.join(WORKSPACE_DIR, 'CURRENT-PLAN.md'),
    log: path.join(WORKSPACE_DIR, 'ACTIVITY-LOG.md'),
    notes: path.join(WORKSPACE_DIR, 'AI-NOTES.md')
};

// Pure State Machine Definitions
const PHASES = {
    DISCOVERY: 'Discovery',
    PLANNING: 'Planning',
    EXECUTION: 'Execution',
    VERIFICATION: 'Verification',
    SHIP: 'Ship'
};

class HarnessOrchestrator {
    constructor(targetFile) {
        this.targetFile = targetFile;
        this.currentPhase = PHASES.DISCOVERY;
        this.verificationAttempts = 0;
    }

    logActivity(action) {
        const entry = `[${new Date().toISOString()}] [PHASE: ${this.currentPhase}] ${action}\n`;
        fs.appendFileSync(FILES.log, entry, 'utf8');
    }

    /**
     * Phase 1: Discovery Gate
     */
    runDiscovery() {
        this.currentPhase = PHASES.DISCOVERY;
        console.log(`🔍 [LOOP] Phase 1: Auditing Baseline...`);
        
        // Contract: Audit dependencies and structure before moving forward
        if (!fs.existsSync(path.join(WORKSPACE_DIR, 'package.json'))) {
            throw new Error("Stop Rule Triggered: Environment baseline missing (package.json unknown).");
        }
        
        this.logActivity("Discovery phase completed. Baseline established.");
        return true;
    }

    /**
     * Phase 2: Planning Gate
     */
    verifyPlan() {
        this.currentPhase = PHASES.PLANNING;
        console.log(`📋 [LOOP] Phase 2: Checking Planning Gate...`);

        if (!fs.existsSync(FILES.plan) || fs.readFileSync(FILES.plan, 'utf8').trim() === '') {
            console.log("🛑 Stop Rule Triggered: CURRENT-PLAN.md is missing or unpopulated.");
            return false;
        }

        this.logActivity("Planning verified. CURRENT-PLAN.md is active.");
        return true;
    }

    /**
     * Phase 3 & 4: Execution & Verification Gates
     */
    executeAndVerify(compileCommand) {
        this.currentPhase = PHASES.EXECUTION;
        console.log(`⚡ [LOOP] Phase 3: Executing Change Log...`);
        this.logActivity(`Applying changes to target: ${this.targetFile}`);

        this.currentPhase = PHASES.VERIFICATION;
        console.log(`🛡️ [LOOP] Phase 4: Running Verification Gates...`);

        try {
            // Run the external AST and design pattern check script
            execSync(`node scripts/verify_patterns.js "${this.targetFile}"`, { stdio: 'pipe' });
            
            // Optional additional compiler execution loop passed in
            if (compileCommand) {
                execSync(compileCommand, { stdio: 'pipe' });
            }

            console.log("✅ [LOOP] Verification Passed.");
            this.logActivity("Verification successful. Code meets architectural criteria.");
            this.verificationAttempts = 0; // Reset
            return true;
        } catch (error) {
            this.verificationAttempts++;
            console.error(`❌ [LOOP] Verification Failed (Attempt #${this.verificationAttempts})`);
            
            // Stop Rule: Two verification attempts fail for the same reason -> Stop and ask Shaun
            if (this.verificationAttempts >= 2) {
                console.error("🛑 [STOP RULE] Two consecutive verification attempts failed. Aborting loop execution to prevent thrashing.");
                process.exit(102); 
            }

            // Capture stdout/stderr structural issues and feed it directly to AI-NOTES
            const issues = error.stdout ? error.stdout.toString() : error.message;
            fs.appendFileSync(FILES.notes, `\n[VERIFICATION FAILURE]:\n${issues}\n`, 'utf8');
            return false;
        }
    }

    /**
     * Phase 5: Ship Gate (The Anti-Loop)
     */
    ship() {
        this.currentPhase = PHASES.SHIP;
        console.log(`🚀 [LOOP] Phase 5: Done Rules Verified. Shipping.`);
        
        // Ensure no temporary debug logs or unresolved tasks remain
        const planContent = fs.readFileSync(FILES.plan, 'utf8');
        if (planContent.includes('- [ ]')) {
            console.log("⚠️ Cannot Ship: Unfinished checkboxes found inside CURRENT-PLAN.md.");
            return false;
        }

        console.log("\n✨ Task officially complete. Polishing prevented. Exiting execution safely.");
        return true;
    }
}

// Module Execution Wrapper
module.exports = HarnessOrchestrator;
