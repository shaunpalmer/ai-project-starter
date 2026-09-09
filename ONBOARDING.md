# Project Onboarding — Intent to Evidence Before Code

## Start with the outcome

A natural-language brief is enough. Shaun does not need to choose the architecture, database, framework, pattern, or exact project type before handing work to the harness.

Capture five things in `PROJECT-INTAKE.md`:

1. outcome and commercial/user reason;
2. initial shape hint (`infer`, `hybrid`, or a known preset);
3. first useful observable slice;
4. hard constraints that are actually known;
5. done condition.

## Read order

1. `docs/NORTH-STAR.md`
2. `docs/CURRENT-STATE.md`
3. `.harness/state/active-task.json`
4. `PROJECT-INTAKE.md`
5. `00-PLANNING/SYSTEM-MODEL.md`
6. `PROJECT-TYPES.md`
7. `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`
8. accepted ADRs relevant to the task
9. relevant source, tests, dependencies, external contracts, and Git history

## Discovery output

Before architecture becomes current truth, produce:

### System Model

`00-PLANNING/SYSTEM-MODEL.md` must describe goal, inputs, outputs, capabilities, data flow, persistent state/idempotency, failure boundaries, invariants, unknowns, and evidence.

Set `MODEL_STATUS: CONFIRMED` only when blocking unknowns are resolved or assigned under decision rights.

### Architecture Hypothesis

`00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` must record primary shape + confidence, capability composition, candidate patterns, assumptions, alternatives, bounded proof, proposed architecture, and approval evidence.

Set `HYPOTHESIS_STATUS: ACCEPTED` only after consequential architecture decisions have Shaun's approval.

## When coding may start

All of these must be true:

- active task schema is version 2;
- all eight Alignment Ladder gates are `YES`;
- system model is confirmed;
- architecture hypothesis is accepted;
- first useful slice is explicit;
- proof/stop condition is explicit;
- source ownership is known.

Run `npm run control:verify` in the harness. For generated projects, run `node scripts/project-ready.mjs` before execution.

## What UNKNOWN means

`UNKNOWN` does not automatically mean `ask Shaun`.

- Internal/reversible unknown → inspect evidence or run a bounded proof and proceed.
- Consequential architecture/provider/cost/security/scope choice → recommend one route and ask Shaun once.
- Missing credentials or production authority → stop at the boundary; do not invent or consume.

## Final rule

**Intent first. Evidence second. System model third. Architecture fourth. Code fifth. Proof sixth. Stop when done.**
