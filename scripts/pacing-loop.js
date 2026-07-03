// ==========================================
// 1. THE SINGLETON: GLOBAL HARNESS STATE
// ==========================================
class HarnessState {
    static _instance = null;

    constructor() {
        if (HarnessState._instance) {
            return HarnessState._instance;
        }
        this.currentPass = 1;
        this.totalTokens = 0;
        this.requestCount = 0;
        this.startTime = Date.now();
        HarnessState._instance = this;
    }

    logRequest(tokens) {
        this.requestCount++;
        this.totalTokens += tokens;
        console.log(`📊 [STATE] Requests: ${this.requestCount} | Tokens Processed: ${this.totalTokens}`);
    }
}

// ==========================================
// 2. THE CIRCUIT BREAKER: RATE LIMIT GUARD
// ==========================================
class RateLimitCircuitBreaker {
    constructor(maxFailures = 2, recoveryTimeMs = 30000) {
        this.maxFailures = maxFailures;
        this.recoveryTimeMs = recoveryTimeMs;
        this.failureCount = 0;
        this.state = "CLOSED"; // CLOSED, OPEN, HALF-OPEN
    }

    handleFailure() {
        this.failureCount++;
        console.log(`\n⚠️ [BREAKER] Failure detected (${this.failureCount}/${this.maxFailures}).`);
        if (this.failureCount >= this.maxFailures) {
            this.trip();
        }
    }

    async trip() {
        this.state = "OPEN";
        console.log(`🚨 [BREAKER TRIPPED] NVIDIA Ceiling hit. Locking down for ${this.recoveryTimeMs / 1000}s...`);
        
        // Non-blocking asynchronous countdown
        for (let remaining = this.recoveryTimeMs / 1000; remaining > 0; remaining--) {
            process.stdout.write(`\r⏳ Cooling down: ${remaining}s remaining... `);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log("\n⚡ [BREAKER] Resetting to HALF-OPEN. Testing API stream...");
        this.state = "HALF-OPEN";
        this.failureCount = 0;
    }

    success() {
        this.failureCount = 0;
        this.state = "CLOSED";
    }
}

// ==========================================
// 3. POLYMORPHIC PIPELINE STRATEGIES (Passes)
// ==========================================
class BasePassStrategy {
    async execute(state) {
        throw new Error("Strategy must implement execute().");
    }
}

class CodeGenerationPass extends BasePassStrategy {
    async execute(state) {
        console.log(`🚀 Running Pass ${state.currentPass}: Materializing Large-Scale Architecture...`);
        // Simulating heavy token payload from a 400B+ model
        return 28000; 
    }
}

class PatternValidationPass extends BasePassStrategy {
    async execute(state) {
        console.log(`🔍 Running Pass ${state.currentPass}: Checking Factory & Interface Compliance...`);
        return 6000;
    }
}

// ==========================================
// 4. THE PACING VALVE (Adaptive Cooldown)
// ==========================================
class PacingValve {
    static async pace(passNum, tokensProcessed) {
        // Massive structural payloads require longer digestion times to avoid 429s
        const baseWaitMs = tokensProcessed < 20000 ? 2000 : 5000;
        const jitter = Math.random() * 500; // Breaks synchronization patterns
        const totalWait = baseWaitMs + jitter;

        console.log(`⏱️ [PACING] Stabilizing loop execution window...`);
        
        const steps = 10;
        for (let i = steps; i > 0; i--) {
            const remaining = ((totalWait / steps) * i) / 1000;
            process.stdout.write(`\r⏳ Hold: ${remaining.toFixed(1)}s until API window clears... `);
            await new Promise(resolve => setTimeout(resolve, totalWait / steps));
        }
        console.log("\r✅ Window clear. Proceeding safely.                            \n");
    }
}

// ==========================================
// MAIN ASYNC EXECUTION ENGINE
// ==========================================
async function runHarness() {
    const state = new HarnessState();
    const breaker = new RateLimitCircuitBreaker();
    
    // Your interchangeable pipeline array
    const pipeline = [
        new CodeGenerationPass(),
        new PatternValidationPass()
    ];

    console.log("🏁 JavaScript Pattern Harness Initialized. Zero-venv overhead.\n");

    for (const currentStrategy of pipeline) {
        while (true) {
            if (breaker.state === "OPEN") {
                await breaker.trip();
            }

            try {
                // 1. Process the current polymorphic pass
                const tokens = await currentStrategy.execute(state);
                state.logRequest(tokens);
                
                breaker.success();

                // 2. Pace the loop dynamically before advancing
                await PacingValve.pace(state.currentPass, tokens);
                state.currentPass++;
                break; // Break the retry loop, move to next strategy in pipeline
                
            } catch (error) {
                console.error(`Execution block error: ${error.message}`);
                breaker.handleFailure();
            }
        }
    }
}

runHarness();
