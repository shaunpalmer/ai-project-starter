import { execSync } from 'child_process';

/**
 * Runs a linter and returns a dense summary for the AI.
 * Usage: node run-linter.js
 */
function runLinter() {
    try {
        // Run ESLint with JSON output for structured parsing
        // We use --format json to keep it machine-readable for the AI
        const output = execSync('npx eslint . --format json', { encoding: 'utf8' });
        return { success: true, message: "Linting passed. No issues found." };
    } catch (error) {
        // The linter exits with code 1 if errors are found, which triggers the catch block
        const lintResults = JSON.parse(error.stdout);
        
        // Extract only the critical/error messages to keep feedback dense
        const denseFeedback = lintResults.flatMap(file => 
            file.messages.map(m => `Line ${m.line}:${m.column} - ${m.message} (${m.ruleId})`)
        ).slice(0, 5); // Only send the first 5 errors to avoid context bloat

        return { 
            success: false, 
            message: `Linting failed with ${denseFeedback.length} errors:\n${denseFeedback.join('\n')}` 
        };
    }
}

const result = runLinter();
console.log(JSON.stringify(result));
