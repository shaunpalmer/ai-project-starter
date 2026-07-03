const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GuardedFileSystem {
    /**
     * Writes code files ONLY if the planning gate is completely verified.
     */
    static safeWriteCodeFile(targetPath, fileContent) {
        const resolvedPath = path.resolve(targetPath);
        const relativeFromRoot = path.relative(path.resolve(__dirname, '..'), resolvedPath);

        // 1. White-list the planning directory. The AI can ALWAYS modify its plans.
        if (relativeFromRoot.startsWith('00-PLANNING') || relativeFromRoot.endsWith('.md')) {
            fs.writeFileSync(resolvedPath, fileContent, 'utf8');
            console.log(`📝 [PERMISSIONS] Granted: Modified planning asset [${relativeFromRoot}]`);
            return true;
        }

        // 2. For any functional code file (JS, TS, PHP), force-run the planning gate script
        try {
            console.log(`🛡️ [GUARD] Evaluating planning criteria before altering code...`);
            
            // Runs your validation script. Throws an error if process.exit(1) occurs.
            execSync('node scripts/ensure_planning.js', { stdio: 'pipe' });
            
            // If it didn't throw, the gate passed!
            fs.writeFileSync(resolvedPath, fileContent, 'utf8');
            console.log(`✅ [PERMISSIONS] Granted: Successfully compiled [${relativeFromRoot}]`);
            return true;

        } catch (error) {
            // 3. Fail loudly. This exact string error is piped back to the AI context window.
            const failureContext = error.stdout ? error.stdout.toString() : error.message;
            
            console.error(`❌ [GUARD DENIED] Attempted code generation blocked.`);
            
            // We throw a hard error back to the harness runner loop
            throw new Error(
                `ACCESS_DENIED: You are forbidden from creating or modifying source code files.\n` +
                `Reason: The project architectural planning phase is incomplete.\n` +
                `Review the following gates you failed to pass:\n${failureContext}`
            );
        }
    }
}

// ==========================================
// EXAMPLE IMPLEMENTATION INSIDE THE HARNESS LOOP
// ==========================================
try {
    // Simulated AI behavior: Trying to build an app class before resolving planning markers
    GuardedFileSystem.safeWriteCodeFile('./src/core/Matrix.js', 'class Matrix { // TODO: implement }');
} catch (err) {
    console.log(`\n🤖 System Response Sent to AI:\n"${err.message}"`);
}
