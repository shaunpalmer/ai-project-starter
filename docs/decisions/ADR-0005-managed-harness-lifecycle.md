id: ADR-0005
title: Managed harness lifecycle with three-way updates
status: accepted

# ADR-0005 — Managed harness lifecycle with three-way updates

## Context

Generated/product projects may keep using an embedded copy of the harness for months while the reusable starter continues to improve. Blind replacement would overwrite project-local customisation; manual copy/merge work would make upgrades unreliable and would reintroduce the same human interruption the harness is meant to remove.

The v0.4 handoff already records source commit/version information and copies deterministic engineering/VCS controls into generated projects, providing a base for lifecycle management.

## Decision

Treat the embedded harness as managed software.

1. `HARNESS-MANIFEST.json` declares versioned managed/extensible files and project-owned boundaries.
2. Generated projects retain exact installed baselines under `.harness/baseline/` and lifecycle metadata in `.harness/handoff.json`.
3. Updates compare base/local/incoming and automatically resolve only deterministic cases.
4. Clean three-way merges are accepted automatically; true merge conflicts block replacement.
5. Upstream file removal is non-destructive: the local file is preserved/deprecated rather than deleted automatically.
6. `update --check` is non-mutating; `update --apply` requires a clean Git worktree and creates a dedicated lifecycle branch/checkpoint.
7. Legacy projects may reconstruct a trusted baseline from source history via `adopt`; unknown baselines are not guessed.
8. Natural-language requests such as `harness update` or `harness doctor` map to the project-local lifecycle controller.
9. Command-line operation is a routine engineering capability, while machine-wide/root-level mutations remain consequential.

## Alternatives considered

### Full replacement

Rejected. Fast but unsafe once an embedded harness or agent contract has project-specific edits.

### Copy only missing files

Rejected. It never upgrades existing managed rules/controllers and accumulates stale behaviour.

### Git patch only

Rejected as the primary model. A patch does not explicitly distinguish upstream-only, project-only, and overlapping changes or establish managed ownership.

### AI-only merge/update

Rejected. Deterministic file/version comparisons, baseline tracking, branching, and clean merges should be code-driven. AI should enter only when a semantic/real merge conflict remains.

## Consequences

- Generated projects gain a small amount of tracked baseline metadata.
- Future harness versions must update the manifest and add deterministic migrations when schema/structure changes.
- Lifecycle changes become testable and recoverable through Git.
- Projects can preserve customisation while still receiving upstream rule/controller improvements.
- Legacy projects without a provable baseline may require one explicit reconciliation before future updates become automatic.
