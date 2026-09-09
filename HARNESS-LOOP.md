# HARNESS-LOOP.md — Infer Before Implement

## Purpose

Move from intent to verified software without guessing unfamiliar architecture, handing routine engineering back to Shaun, or polishing forever.

## Core loop

```text
Intent
  ↓
Discovery
  ↓
System Model
  ↓
Architecture Hypothesis
  ↓
Planning
  ↓
Execution
  ↓
Verification
  ↓
Repair in place (only if proof fails)
  ↓
Ship / stop
```

## 1. Intent

Extract the desired outcome, user/business reason, first useful observable slice, hard constraints, and done condition. Separate those from implementation suggestions.

## 2. Discovery

Inspect the repository, dependencies, existing architecture, accepted decisions, tests, external contracts, and relevant runtime evidence. Do not limit discovery to files that look familiar.

When the domain is unfamiliar, investigate responsibilities and failure modes before selecting patterns. Ask Shaun only for information that cannot be safely inferred or proved and belongs to him under `docs/DECISION-RIGHTS.md`.

## 3. System Model

Maintain `00-PLANNING/SYSTEM-MODEL.md` with:

- goal;
- inputs and outputs;
- capability composition;
- data flow;
- state/persistence and idempotency;
- failure boundaries and fallbacks;
- invariants;
- unknowns;
- evidence.

Do not move beyond discovery until the model is evidence-backed. `UNKNOWN` means inspect or run a bounded proof unless it is a consequential owner decision.

## 4. Architecture Hypothesis

Infer a primary shape plus capabilities and confidence. Treat `PROJECT-TYPES.md` as preset evidence, not mandatory routing.

Compare credible alternatives. Run the smallest bounded proof needed to resolve material uncertainty. Obtain Shaun's approval when architecture, language, framework, database, provider, cost, or security boundary materially changes. Then promote `HYPOTHESIS_STATUS` to `ACCEPTED`.

## 5. Planning

Define the smallest safe useful slice and tangible acceptance criteria. Run the complexity brake before adding dependencies, services, queues, layers, tables, classes, or build tooling.

## 6. Execution

Complete one useful step at a time inside the accepted source boundary. Do not rewrite unrelated work or silently change architecture.

## 7. Verification

Run the strongest available proof: unit/integration tests, syntax checks, builds, smoke tests, scenario tests, filesystem inspection, API contract checks, or browser/runtime evidence.

## 8. Repair in place

If proof fails, repair only the failed responsibility. Re-run proof. If evidence invalidates the architecture, use the Controlled Pivot Loop instead of thrashing.

## 9. Ship / stop

Stop when the stated outcome, minimum slice, and proof condition pass. Do not add unrequested features. Merge, deployment, and release remain Shaun-owned actions unless explicitly authorised.

## Readiness contract

Before execution:

- all eight Alignment Ladder gates are `YES`;
- `MODEL_STATUS: CONFIRMED`;
- `HYPOTHESIS_STATUS: ACCEPTED`;
- the first slice and proof are explicit.

The supported structural verifier is `npm run control:verify`. The advisory unlock additionally requires the active task to be `ready`, `in_progress`, or `completed`.
