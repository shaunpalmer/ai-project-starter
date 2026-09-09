# System Model

MODEL_STATUS: CONFIRMED

## Goal

Make embedded/generated harnesses safely upgradeable while preserving project-local customisation, and make command-line operation a routine first-class capability of the harness.

## Inputs

- Shaun's natural-language lifecycle commands such as `harness update`, `upgrade the harness`, `harness doctor`, and `/doctor`.
- Existing project-local harness files and project-owned customisations.
- `.harness/handoff.json` lifecycle state when present.
- `.harness/baseline/` installed snapshots.
- Latest upstream `HARNESS-MANIFEST.json` and managed source files.
- Git repository state, identity, history, and existing machine authentication.
- Local OS/runtime/package-manager/tool evidence.

## Outputs

- Non-mutating lifecycle health/update reports.
- Deterministic base/local/incoming comparison for managed harness files.
- Automatic upstream-only replacement, project-only preservation, new-file addition, and clean three-way merge.
- Explicit blocking conflicts instead of destructive overwrite.
- Isolated lifecycle Git branches and focused checkpoints.
- Conservative legacy adoption from a trusted historical harness version.
- A command-line operating policy for project-scoped install/update work.

## Capabilities

- Versioned harness manifest and file ownership.
- Installed baseline snapshotting.
- Three-way merge planning.
- Conflict detection and non-destructive deprecation.
- Legacy handoff migration and package-version baseline reconstruction.
- Git branch/checkpoint safety.
- CLI/tool/runtime/package-manager discovery.
- Natural-language lifecycle command routing.
- Generated-project lifecycle handoff.
- Node 20+ regression proof.

## Data flow

Project request -> local doctor/state inspection -> latest harness source -> manifest comparison -> base/local/incoming plan -> safe/no-safe decision -> lifecycle Git branch -> apply deterministic changes -> refresh baselines/handoff -> verification -> focused checkpoint.

## State and persistence

- Upstream ownership/version declaration: `HARNESS-MANIFEST.json`.
- Project installed lifecycle state: `.harness/handoff.json`.
- Exact installed file baselines: `.harness/baseline/`.
- Routine engineering/CLI policy: `ENGINEERING-DEFAULTS.md` and `.github/skills/command-line/SKILL.md`.
- Lifecycle design: `docs/HARNESS-LIFECYCLE.md` and ADR-0005.
- Product/project truth remains in project-owned planning/state/source files.
- Exact history and recovery remain in Git.

## Failure boundaries

- `update --check` must not mutate project files, branches, or lifecycle state.
- Existing local edits must never be treated as disposable merely because the harness changed upstream.
- A real three-way conflict blocks replacement; no partial blind overwrite is allowed.
- Removed upstream files are preserved locally rather than automatically deleted.
- Updates require a clean project Git worktree and configured Git identity before writes.
- Missing command-line tools must be reported as unavailable rather than causing hidden prompts or crashes.
- Credentials are never embedded or requested for routine Git/CLI operation.
- `sudo`, machine-wide package/runtime mutation, force push, default-branch managed push, merge, deploy, release, and production mutation remain outside routine lifecycle authority.

## Invariants

- Project-owned product code, planning, decisions, and business state are never harness-update targets.
- Managed lifecycle operations remain zero-runtime-dependency Node 20+ plus Git.
- Existing v0.4 engineering defaults, skill binding, version-control safety, and infer-before-implement gates remain intact.
- Deterministic code handles version comparison, file ownership, branching, merging, and checkpoints; AI handles only unresolved semantic conflicts.
- Routine CLI use does not become a stream of questions to Shaun.

## Unknowns

No blocking design unknown remains. The remaining proof condition is the full regression/CI suite on Node 20, 22, and 24 after final documentation/state reconciliation.

## Evidence

- v0.4 generated-project handoff already recorded harness source/version information and copied managed rules/controllers.
- The existing handoff refusal to overwrite customised files proved the need for a real upgrade path rather than reinstall/copy semantics.
- Git provides a native deterministic three-way merge primitive (`git merge-file`) and recoverable lifecycle branches/checkpoints.
- PR #6 regression tests cover non-mutating checks, upstream-only replacement, new-file addition, clean three-way merge, blocking conflicts, doctor behaviour, legacy adoption, and generated-project lifecycle handoff.
- PR #6 Actions run #25 passed the implementation/test suite on Node 20, 22, and 24 before final documentation reconciliation.
