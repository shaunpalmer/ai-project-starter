HARNESS-LOOP.md
Purpose

This loop controls how the AI works inside this project starter.

The AI must not keep improving forever. It must move through clear phases, verify the result, and stop when the work is good enough to ship.

Core Loop

## LOOP

| Step | Phase | Purpose |
|---:|---|---|
| 1 | Discovery | Identify what information is missing. |
| 2 | Planning | Break the work into clear steps. |
| 3 | Execution | Complete the next useful step. |
| 4 | Verification | Check the result against the goal. |
| 5 | Iteration | Improve anything that failed. |
| 6 | Ship | Give the final version only when it is good enough. |For every project, task, or feature, follow this loop:


# Discovery

Audit the entire project structure to establish a complete baseline of the current state.

Do not limit reading to assumed "relevant" files; verify the full context first.

Identify exactly what logic, information, or files are missing to achieve the goal.

Ask Shaun only for information that cannot be safely inferred.
Planning
Break the work into clear steps.
Choose the next useful step.
Do not plan the whole dream if a smaller first slice can ship.
Execution
Complete one useful step at a time.
Do not rewrite unrelated code.
Do not change architecture unless the planning gate allows it.
Verification
Check the result against the goal.
Run available tests, linting, build commands, or manual checks.
Confirm that the output matches the project type, architecture, and success criteria.
Iteration
If verification fails, fix only the failed part.
Re-run verification.
Record what changed.
Ship
Provide the final version only when the done rules pass.
Stop improving once the result is good enough.
Do not add extra features unless Shaun asks for them.
Done Rules

A task is finished when all of these are true:

The stated goal is met.
No known blocker remains.
The result matches the approved architecture.
The smallest useful version has been completed.
Verification has passed.
Any changed decisions are recorded in AI-NOTES.md.
The next step is clear.

If these are not true, the loop continues.

Stop Rules

The AI must stop and ask Shaun when:

The project goal is unclear.
The architecture choice is unsafe or ambiguous.
The source of truth is unknown.
A database/storage decision cannot be safely inferred.
The next step would create code before the planning gates are cleared.
Two verification attempts fail for the same reason.
Anti-Loop Rule

The AI must not keep polishing.

Once the done rules pass, stop, summarize what changed, and give Shaun the next practical step.


## Detailed Phase Directives

### Discovery
* **Full Structural Audit:** Audit the entire project structure to establish a complete baseline of the current state.
* **No Guessing:** Do not limit reading to assumed "relevant" files; verify the full context first.
* **Dependency Check:** Audit `package.json` (or environment equivalents) to understand current dependencies and versions before proposing solutions.
* **Identify Gaps:** Identify exactly what logic, information, or files are missing to achieve the goal.
* **Information Request:** Ask Shaun only for information that cannot be safely inferred.

### Planning
* **Task Definition:** Break the work into clear, actionable steps.
* **Tangible Artifact:** Output the plan as a clear checklist (e.g., `CURRENT-PLAN.md` or a markdown checkbox list) *before* starting Execution.
* **Incremental Progress:** Choose the next useful step. Do not plan the whole dream if a smaller first slice can ship.

### Execution
* **Focus:** Complete one useful step at a time.
* **Integrity:** Provide complete, working code blocks. Never use placeholders like `// ... rest of code here ...` or truncate existing logic unless explicitly instructed.
* **Consistency:** Do not rewrite unrelated code. Do not change architecture unless the planning gate allows it.

### Verification
* **Goal Alignment:** Check the result against the goal.
* **Rigorous Testing:** Run available tests, linting, build commands, or manual checks.
* **Confirmation:** Confirm that the output matches the project type, architecture, and success criteria.

### Iteration
* **Targeted Fixes:** If verification fails, fix only the failed part.
* **Record Keeping:** Re-run verification and record what changed in `AI-NOTES.md`.

### Ship
* **Condition:** Provide the final version only when the "Done Rules" pass.
* **Scope:** Do not add extra features unless Shaun asks for them.
* **Efficiency:** Stop improving once the result is good enough.

## Done Rules
A task is finished when **all** of these are true:
* The stated goal is met.
* No known blocker remains.
* The result matches the approved architecture.
* The smallest useful version has been completed.
* Verification has passed.
* All temporary debug code or `console.log` statements used during Verification have been removed.
* Any changed decisions are recorded in `AI-NOTES.md`.
* The next step is clear.

*If these are not true, the loop continues.*

## Stop Rules
The AI must stop and ask Shaun when:
* The project goal is unclear.
* The architecture choice is unsafe or ambiguous.
* The source of truth is unknown.
* A database/storage decision cannot be safely inferred.
* The next step would create code before the planning gates are cleared.
* Two verification attempts fail for the same reason.

## Anti-Loop Rule
The AI must not keep polishing. Once the "Done Rules" pass, stop, summarize what changed, and give Shaun the next practical step.

## Resolution Status
| Status |
| :--- |
| RESOLVED |
| NEEDS SHAUN/Senior Developer |
| NEEDS ARCHITECTURE UPDATE |
| NEEDS PROTOTYPE |
| DEFERRED |
| REJECTED |
