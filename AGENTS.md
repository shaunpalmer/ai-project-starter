# AGENTS.md — AI Operating Contract

This repository is Shaun Palmer's project harness. Act as a competent developer inside an approved design envelope: preserve the destination, choose the route, prove the work, and stop when the stated outcome is complete.

## Entry protocol

Read in this order:

1. `docs/NORTH-STAR.md`
2. `docs/CURRENT-STATE.md`
3. `.harness/state/active-task.json`
4. `PROJECT-INTAKE.md`
5. `PROJECT-TYPES.md`
6. Accepted records in `docs/decisions/` relevant to the task
7. Relevant architecture, code, tests, and Git history

Run `npm run memory:resume` for a compact reconstruction, then verify its claims against the repository. Report contradictions before editing.

## Competency and decision rights

Use `docs/DECISION-RIGHTS.md` as the authority.

- Decide routine and reversible implementation details without asking Shaun.
- When uncertain about an internal choice, inspect evidence or run a bounded proof and proceed.
- Ask only when a choice materially changes purpose, architecture, language, framework, database, provider, cost, security boundary, scope, production data, destructive risk, merge, deployment, or release.
- For a consequential fork, recommend one best option in a compact Decision Card. Do not make Shaun program through you.
- Never merge, deploy, spend credits, call a live provider, or mutate production without explicit approval.

## Alignment Ladder

Before execution, maintain the seven evidence-backed gates in `.harness/state/active-task.json`:

1. destination
2. evidence
3. boundaries
4. ownership
5. minimum_slice
6. debt_control
7. proof

Valid answers are `YES`, `NO`, and `UNKNOWN`. A task marked `ready` requires every gate to be `YES`. `NO` returns to planning. Resolve `UNKNOWN` autonomously unless the Decision Rights Contract assigns it to Shaun.

## Planning and execution

1. Classify the project before selecting patterns or storage.
2. Establish the project type, architecture shape, source of truth, data flow, and first useful slice.
3. Write a tangible plan before code.
4. Run the complexity brake before adding dependencies, layers, classes, tables, or build tooling.
5. Implement the smallest safe useful slice.
6. Run relevant tests, linting, builds, and scenario checks.
7. Repair only failed parts; do not rewrite unrelated work.
8. Reconcile memory and decisions in the same change.
9. Stop when the outcome and proof condition pass.

Security, validation, escaping, permissions, error handling, accessibility, and data protection are never optional simplifications.

## Controlled pivots

Follow `docs/PROJECT-CONTROL.md` when an assumption fails. Keep the North Star stable unless Shaun changes it. Freeze the affected slice, record evidence, prove the replacement, obtain consequential approval, unwind or migrate, reconcile documentation and tests, and supersede the old ADR.

Do not confuse Git rollback with decision memory. Git restores files; ADRs preserve why the route changed.

## Persistent memory

- `docs/NORTH-STAR.md` holds stable purpose and invariants.
- `docs/CURRENT-STATE.md` holds current truth and the exact next action.
- `docs/decisions/` preserves reasons and superseded history.
- `.harness/state/active-task.json` holds machine-checkable work state.
- Checkpoints capture repository facts at meaningful handoffs.
- Git records exact file history.

Use the `project-memory` skill for resume, checkpoint, reconcile, and pivot work. Conversation history and compaction summaries are not authoritative project memory.

## Destination rules

The harness repository, canonical project source, build output, distribution artifacts, and deployment target are different concerns. Follow `docs/PROJECT-LAYOUT.md`.

- Resolve and preview an absolute workspace destination before creating project files.
- Open the returned project root as the VS Code workspace; do not continue product development from the harness directory.
- Plan in `00-PLANNING/`. After the Alignment Ladder passes, write authored product code only under the configured `code_root`.
- Treat `build/` as disposable assembly and `dist/` as verified delivery output. Never hand-edit either as canonical source.
- Never generate a project into whichever directory happens to be active.
- Never deploy as a side effect of project creation or packaging.

## Prohibited actions

- Do not invent business rules, architecture, credentials, external services, or production targets.
- Do not ask Shaun to choose ordinary syntax, naming, loops, helper methods, or internal class organisation.
- Do not treat a superseded ADR or stale changelog entry as current truth.
- Do not push directly to the default branch.
- Do not stage unrelated files or use broad automatic staging in a mixed worktree.
- Do not expose secrets in code, logs, examples, memory, or commits.
- Do not keep polishing after the approved proof condition passes.

## Completion contract

Before reporting completion:

- The stated goal and smallest useful slice are complete.
- `npm run control:verify` passes.
- Task-specific verification passes.
- Current state, active task, and decisions agree with code and tests.
- No known blocker is hidden.
- The exact next action is recorded.
- Merging or releasing is left to Shaun unless he explicitly authorises it.
