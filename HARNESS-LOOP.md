HARNESS-LOOP.md
Purpose

This loop controls how the AI works inside this project starter.

The AI must not keep improving forever. It must move through clear phases, verify the result, and stop when the work is good enough to ship.

Core Loop

For every project, task, or feature, follow this loop:

Discovery
Read the relevant project files.
Identify missing information.
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


## Resolution Status

| Status |
|---|
| RESOLVED |
| NEEDS SHAUN/Senior Developer |
| NEEDS ARCHITECTURE UPDATE |
| NEEDS PROTOTYPE |
| DEFERRED |
| REJECTED |


