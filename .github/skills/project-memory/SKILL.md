---
name: project-memory
description: Reconstruct, checkpoint, and reconcile durable project context across sessions, compaction, and controlled pivots.
---

# Project Memory

Use this skill at session entry, before context compaction, after a meaningful verified change, or when project documents disagree with code.

## Resume

1. Run `npm run memory:resume`.
2. Read `docs/NORTH-STAR.md`, `docs/CURRENT-STATE.md`, and `.harness/state/active-task.json` completely.
3. Read accepted ADRs relevant to the active task.
4. Inspect the referenced code and tests.
5. Report contradictions before editing.

## Checkpoint

1. Update `docs/CURRENT-STATE.md` with current truth and the exact next action.
2. Update the active task and its evidence.
3. Create or supersede an ADR if a consequential decision changed.
4. Run `npm run control:verify` and the task-specific tests.
5. Run `npm run memory:checkpoint -- --summary "what changed and why" --next "exact next action" --verification "commands and results"`.

## Reconcile

- Treat code and passing tests as implementation evidence, not as an explanation of intent.
- Preserve old ADRs and mark them superseded; never silently rewrite history.
- Replace stale statements in current-state and architecture documents.
- Do not copy every Git edit into the changelog.
- Do not store secrets, credentials, or raw sensitive data in memory files.

## Pivot

Follow `docs/PROJECT-CONTROL.md`. Freeze the affected slice, record the failed assumption, prove the alternative, request approval when decision rights require it, then reconcile code and memory in the same change.
