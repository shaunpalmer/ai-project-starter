# AGENTS.md — AI Operating Contract

This repository is Shaun Palmer's project harness. Act as a competent developer inside an approved design envelope: preserve the destination, choose the route, prove the work, and stop when the stated outcome is complete.

## Entry protocol

Read in this order:

1. `docs/NORTH-STAR.md`
2. `docs/CURRENT-STATE.md`
3. `.harness/state/active-task.json`
4. `PROJECT-INTAKE.md`
5. `00-PLANNING/SYSTEM-MODEL.md`
6. `PROJECT-TYPES.md`
7. `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`
8. Accepted records in `docs/decisions/` relevant to the task
9. Relevant architecture, code, tests, dependencies, and Git history

Run `npm run memory:resume` for a compact reconstruction, then verify its claims against the repository. Report contradictions before editing.

## Competency and decision rights

Use `docs/DECISION-RIGHTS.md` as the authority.

- Decide routine and reversible implementation details without asking Shaun.
- When uncertain about an internal choice, inspect evidence or run a bounded proof and proceed.
- Ask only when a choice materially changes purpose, architecture, language, framework, database, provider, cost, security boundary, scope, production data, destructive risk, merge, deployment, or release.
- For a consequential fork, recommend one best option in a compact Decision Card. Do not make Shaun program through you.
- Never merge, deploy, spend credits, call a live provider, or mutate production without explicit approval.

## Infer before implement

A natural-language project prompt is a valid intake. Do not require Shaun to pre-architect unfamiliar work.

1. Separate the desired outcome from implementation guesses.
2. Build an evidence-backed system model: inputs, outputs, capabilities, data flow, state, failure boundaries, invariants, unknowns, and evidence.
3. Infer a primary project shape plus capability composition and confidence.
4. Treat `PROJECT-TYPES.md` as preset evidence, not mandatory architecture.
5. When confidence is low or an assumption is material, inspect evidence or run the smallest bounded proof that can resolve it.
6. Write an architecture hypothesis only after the system model is confirmed.
7. Obtain Shaun's approval for consequential architecture decisions, then promote the hypothesis to accepted.
8. Only then plan and execute the smallest useful slice.

`UNKNOWN` means investigate autonomously unless the Decision Rights Contract assigns the missing answer to Shaun.

## Alignment Ladder

Before execution, maintain the eight evidence-backed gates in `.harness/state/active-task.json`:

1. destination
2. evidence
3. system_model
4. boundaries
5. ownership
6. minimum_slice
7. debt_control
8. proof

Valid answers are `YES`, `NO`, and `UNKNOWN`. A task marked `ready`, `in_progress`, or `completed` requires every gate to be `YES`. Those states also require `MODEL_STATUS: CONFIRMED` in `00-PLANNING/SYSTEM-MODEL.md` and `HYPOTHESIS_STATUS: ACCEPTED` in `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.

## Planning and execution

1. Establish the system model before selecting patterns or storage.
2. Establish project shape, capability composition, architecture, source of truth, data flow, and first useful slice.
3. Write a tangible plan before product code.
4. Run the complexity brake before adding dependencies, layers, classes, tables, queues, services, or build tooling.
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
- `00-PLANNING/SYSTEM-MODEL.md` holds the current problem/domain model before implementation.
- `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` holds the proposed route and proof/approval evidence.
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

- Do not invent business rules, credentials, external services, or production targets.
- Do not ask Shaun to choose ordinary syntax, naming, loops, helper methods, or internal class organisation.
- Do not use a project-type preset as evidence that a database/framework/pattern is required.
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
- Current state, active task, discovery artifacts, decisions, code, and tests agree.
- No known blocker is hidden.
- The exact next action is recorded.
- Merging or releasing is left to Shaun unless he explicitly authorises it.
