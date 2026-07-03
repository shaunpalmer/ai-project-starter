// memory-guard.js - Requires Node.js (No external dependencies needed)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

class AIMemoryEngine {
    constructor(dbPath = 'ai_memory.db') {
        // Initializes a persistent SQLite file on disk with zero npm packages
        this.db = new DatabaseSync(path.join(__dirname, dbPath));
        this.initSchema();
    }

    initSchema() {
        // Create planning tables and change logs with structured schemas
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS architectural_decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                component TEXT NOT NULL,
                decision TEXT NOT NULL,
                rationale TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS change_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT NOT NULL,
                change_description TEXT NOT NULL,
                impact_level TEXT NOT NULL, -- LOW, MEDIUM, CRITICAL
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    logDecision(component, decision, rationale) {
        const insert = this.db.prepare(`
            INSERT INTO architectural_decisions (component, decision, rationale) 
            VALUES (?, ?, ?);
        `);
        insert.run(component, decision, rationale);
        console.log(`💾 [MEMORY] Logged Core Decision for ${component}`);
    }

    logChange(filePath, description, impact = 'LOW') {
        const insert = this.db.prepare(`
            INSERT INTO change_log (file_path, change_description, impact_level) 
            VALUES (?, ?, ?);
        `);
        insert.run(filePath, description, impact);
    }

    // THE ANTI-LEAK VALVE: Dynamically builds a compact context block for the prompt
    getActivePromptContext(limit = 5) {
        const decisionQuery = this.db.prepare(`
            SELECT component, decision, rationale FROM architectural_decisions 
            ORDER BY timestamp DESC LIMIT ?
        `);
        const changeQuery = this.db.prepare(`
            SELECT file_path, change_description FROM change_log 
            ORDER BY timestamp DESC LIMIT ?
        `);

        const decisions = decisionQuery.all(limit);
        const changes = changeQuery.all(limit);

        // Serialize into a dense, token-efficient format for the model's prompt
        let contextBlock = "### SYSTEM MEMORY INJECTION (WARM CONTEXT)\n";
        contextBlock += "Active Architectural Constraints:\n";
        decisions.forEach(d => {
            contextBlock += `- [${d.component}]: ${d.decision} (Why: ${d.rationale})\n`;
        });

        contextBlock += "\nRecent High-Impact Modifications:\n";
        changes.forEach(c => {
            contextBlock += `- Modified ${c.file_path}: ${c.change_description}\n`;
        });

        return contextBlock;
    }
}

// Example usage within your execution loop
const memory = new AIMemoryEngine();

// 1. Seed your core structure right at the start of your project pass
memory.logDecision('MatrixCoordinator', 'Enforce strict Singleton pattern', 'Prevent dual-state allocation during multi-file scraping routines');
memory.logDecision('PacingValve', 'Switched loop execution from Python to Node.js', 'Eliminates cognitive load of venv activations inside VS Code tasks');

// 2. Log changes dynamically inside your automated file-writer script
memory.logChange('src/core/Pacing_the_Loop.js', 'Migrated sleep statements to Promise-based timeouts', 'MEDIUM');

// 3. Print what will be fed to the 400B model's system prompt
console.log("\n" + memory.getActivePromptContext());
