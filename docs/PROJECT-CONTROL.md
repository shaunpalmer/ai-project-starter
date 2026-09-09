# Project Control Contract

## Infer-before-implement discovery

A project may start as a natural-language outcome. Before architecture is treated as current truth, the agent must confirm two planning artifacts:

- `00-PLANNING/SYSTEM-MODEL.md` — outcome, inputs, outputs, capabilities, data flow, persistent state, failure boundaries, invariants, unknowns, and evidence.
- `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` — primary shape, capability composition, candidate patterns, assumptions, alternatives, bounded proof, proposed architecture, and approval evidence.

Known project presets accelerate familiar work. Hybrid or unfamiliar work is composed from capabilities. Low confidence triggers evidence gathering or a bounded proof, not premature architecture and not routine questions to Shaun.

## Alignment Ladder

Every active task records eight evidence-backed gates. Valid answers are `YES`, `NO`, and `UNKNOWN`.

1. `destination` — the intended outcome and project destination are explicit.
2. `evidence` — relevant code, documents, tests, dependencies, and recent decisions were inspected.
3. `system_model` — responsibilities, data/state movement, failure boundaries, invariants, and material unknowns are understood from evidence.
4. `boundaries` — the work fits approved scope and accepted architecture.
5. `ownership` — the owning component and folder are known.
6. `minimum_slice` — this is the smallest safe, useful step.
7. `debt_control` — reuse, security, testing, cost/rate controls, and future-change risks are addressed.
8. `proof` — a concrete verification and stop condition exist.

A `ready`, `in_progress`, or `completed` task requires `YES` on every gate, `MODEL_STATUS: CONFIRMED`, and `HYPOTHESIS_STATUS: ACCEPTED`. Each gate must occur exactly once with non-empty evidence. State uses `schema_version: 2`. A `blocked` task can record `NO` or `UNKNOWN`; changing its status cannot bypass unresolved gates. `UNKNOWN` triggers evidence gathering and asks Shaun only if the missing answer belongs to him under the Decision Rights Contract.

## Controlled Pivot Loop

When evidence invalidates an implementation route:

1. Freeze the affected slice.
2. Record the failed assumption and evidence.
3. Confirm which North Star invariants remain unchanged.
4. Update the system model if the discovered responsibility or boundary changed.
5. Map affected code, tests, configuration, and documents.
6. Compare credible alternatives against actual constraints.
7. Prove the preferred route with a bounded spike.
8. Ask Shaun if the pivot changes a consequential decision.
9. Unwind or migrate the failed route.
10. Reconcile current documentation, tests, task state, and ADR history.
11. Supersede the old ADR and create a verified checkpoint.

Git can restore code. The pivot record explains why the route changed and which truth is current.

## Memory layers

| Layer | Purpose |
|---|---|
| `docs/NORTH-STAR.md` | Stable purpose and invariants |
| `docs/CURRENT-STATE.md` | Concise current truth and next action |
| `00-PLANNING/SYSTEM-MODEL.md` | Current evidence-backed model of the problem/system |
| `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` | Candidate route, alternatives, proof, and approval evidence |
| `docs/decisions/` | Immutable reasons, including superseded decisions |
| `.harness/state/active-task.json` | Machine-checkable task and eight-gate alignment state |
| `.harness/state/checkpoints/` | Generated factual handoffs |
| `CHANGELOG.md` | User-visible completed changes |
| Git | Exact file history |

Conversation summaries and context compaction are useful transport, not authoritative memory.

## Session protocol

### Resume

1. Read operating rules, North Star, current state, active task, and discovery artifacts.
2. Load only accepted ADRs and architecture relevant to the task.
3. Inspect code, dependencies, Git, and tests to verify the documents.
4. Report contradictions before editing.

### Checkpoint

1. Update current truth and the exact next action.
2. Reconcile the system model and architecture hypothesis with evidence.
3. Create or supersede ADRs when a consequential decision changed.
4. Update the active task and verification evidence.
5. Run `npm run control:verify`.
6. Capture repository facts with `npm run memory:checkpoint -- --summary "..."`.

### Reconcile

The agent repairs stale semantic documentation. The control script detects structural contradictions and invalid state; it does not invent explanations.

## Destination contract

The harness, canonical workspace, release staging, distribution, and runtime deployment are separate:

```text
harness root/                     reusable controller; no product code
workspace root/project-slug/      canonical project and Git repository
project root/src/                 authored product source
project root/build/               disposable release staging
project root/dist/                verified distribution artifacts
deployment root/project-slug/     optional external runtime target
```

Preview a destination before creating it. Workspace and optional deployment roots must be absolute. The CLI resolves existing symlinks, rejects destinations inside the harness or outside the configured workspace, rejects overlapping source/deployment paths, and refuses a non-empty destination. `--create` is a valueless flag; omitting it previews without writing. Creation follows `docs/PROJECT-LAYOUT.md`.

These checks are for a trusted local filesystem. They are not an OS sandbox and do not defend against another process swapping symlinks during a command. The `.planning-lock` file is advisory; it cannot prevent an editor or another tool from writing source. The supported unlock path uses `project-control.js verify`; the legacy planning checker is no longer part of that gate.
