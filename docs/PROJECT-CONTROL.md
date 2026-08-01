# Project Control Contract

## Alignment Ladder

Every active task records seven evidence-backed gates. Valid answers are `YES`, `NO`, and `UNKNOWN`.

1. `destination` — the intended outcome and project destination are explicit.
2. `evidence` — relevant code, documents, tests, and recent decisions were inspected.
3. `boundaries` — the work fits approved scope and architecture.
4. `ownership` — the owning component and folder are known.
5. `minimum_slice` — this is the smallest safe, useful step.
6. `debt_control` — reuse, security, testing, and future-change risks are addressed.
7. `proof` — a concrete verification and stop condition exist.

A ready task requires `YES` on every gate. `NO` routes back to planning. `UNKNOWN` triggers evidence gathering and asks Shaun only if the missing answer belongs to him under the Decision Rights Contract.

## Controlled Pivot Loop

When evidence invalidates an implementation route:

1. Freeze the affected slice.
2. Record the failed assumption and evidence.
3. Confirm which North Star invariants remain unchanged.
4. Map affected code, tests, configuration, and documents.
5. Compare credible alternatives against actual constraints.
6. Prove the preferred route with a bounded spike.
7. Ask Shaun if the pivot changes a consequential decision.
8. Unwind or migrate the failed route.
9. Reconcile current documentation, tests, and task state.
10. Supersede the old ADR and create a verified checkpoint.

Git can restore code. The pivot record explains why the route changed and which truth is current.

## Memory layers

| Layer | Purpose |
|---|---|
| `docs/NORTH-STAR.md` | Stable purpose and invariants |
| `docs/CURRENT-STATE.md` | Concise current truth and next action |
| `docs/decisions/` | Immutable reasons, including superseded decisions |
| `.harness/state/active-task.json` | Machine-checkable task and alignment state |
| `.harness/state/checkpoints/` | Generated repository facts at meaningful handoffs |
| `CHANGELOG.md` | User-visible completed changes |
| Git | Exact file history |

Conversation summaries and context compaction are useful transport, not authoritative memory.

## Session protocol

### Resume

1. Read operating rules, North Star, current state, and active task.
2. Load only accepted ADRs and architecture relevant to the task.
3. Inspect code, Git, and tests to verify the documents.
4. Report contradictions before editing.

### Checkpoint

1. Update current truth and the exact next action.
2. Create or supersede ADRs when a consequential decision changed.
3. Update the active task and verification evidence.
4. Run `npm run control:verify`.
5. Capture repository facts with `npm run memory:checkpoint -- --summary "..."`.

### Reconcile

The agent repairs stale semantic documentation. The control script detects structural contradictions and invalid state; it does not invent explanations.

## Destination contract

The canonical workspace is not the runtime deployment folder:

```text
workspace root/project-slug/      canonical source and Git repository
deployment root/project-slug/     optional local runtime target
```

Preview a destination before creating it. Creation refuses path traversal, refuses the harness repository itself, and refuses a non-empty destination.
