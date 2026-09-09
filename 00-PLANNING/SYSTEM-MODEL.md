# System Model

MODEL_STATUS: CONFIRMED

## Goal

Make the reusable harness capable of receiving a natural-language software goal and reliably modelling unfamiliar or hybrid systems before it commits to architecture or implementation.

## Inputs

- Shaun's natural-language project intent.
- Existing repository contracts, project presets, skills, tests, and Git history.
- Evidence gathered from the target project and bounded technical proofs.

## Outputs

- A confirmed system model.
- A primary project shape plus capability composition and confidence.
- An architecture hypothesis with alternatives, proof, and approval evidence.
- A machine-checkable readiness state before execution.

## Capabilities

- Project discovery and evidence ingestion.
- Hybrid capability classification.
- Known-project preset reuse.
- Bounded proof for material uncertainty.
- Persistent decision and task state.
- Generated-project handoff.
- Structural verification and CI proof.

## Data flow

Natural-language intent → evidence gathering → system model → project shape/capability composition → architecture hypothesis → consequential approval → smallest useful slice → execution → verification → checkpoint.

## State and persistence

Stable purpose lives in `docs/NORTH-STAR.md`; current truth in `docs/CURRENT-STATE.md`; the system model and architecture hypothesis live in `00-PLANNING/`; accepted reasons live in ADRs; active readiness lives in `.harness/state/active-task.json`; Git preserves exact history.

## Failure boundaries

- Low classification confidence must not silently choose architecture.
- A project-type preset must not force database/framework/pattern choices unsupported by evidence.
- Missing system-model or architecture-hypothesis status blocks ready/in-progress/completed verification.
- Generated projects must remain blocked until local readiness checks pass.
- CI failure keeps the change unproven and unmerged.

## Invariants

- Shaun retains consequential architecture, provider, financial, security, merge, deployment, and release decisions.
- Athena retains routine and reversible implementation decisions.
- The harness remains planning-first and source/destination boundaries remain unchanged.
- No new runtime dependency is required for the harness controller.

## Unknowns

No blocking domain unknown remains for this slice. The material uncertainty is whether the implementation passes the existing and new regression suite on supported Node versions; that is resolved by PR CI.

## Evidence

- `AGENTS.md` already delegates bounded proofs and routine decisions to Athena.
- `PROJECT-TYPES.md` previously forced one type to route pattern, storage, structure, and skills.
- `HARNESS-LOOP.md` discovery previously focused on repository audit rather than explicit domain/system modelling.
- `docs/HARNESS-REVIEW.md` identifies legacy controls as unsupported and recommends reconciling interfaces rather than adding another orchestration layer.
- The supported controller is `scripts/project-control.js` with regression coverage and GitHub Actions checks.
