# Architecture Hypothesis

HYPOTHESIS_STATUS: ACCEPTED

## Primary shape

Extend the existing zero-dependency Node harness with a small managed-lifecycle controller rather than introducing a package manager/plugin framework for the harness itself. Confidence: high.

## Capabilities

- Versioned upstream manifest for managed/extensible files.
- Project-local installed baseline snapshots.
- Three-way base/local/incoming planning.
- Safe apply path with Git isolation/checkpointing.
- Legacy adoption/migration.
- Natural-language lifecycle command routing.
- Command-line capability policy and tool discovery.

## Candidate patterns

- Manifest-driven ownership.
- Three-way merge.
- Migration/adoption adapter for legacy state.
- Command router for `doctor`, `update`, `adopt`, and VCS operations.
- Fail-closed transaction boundary: conflicts prevent apply.

## Assumptions

- Node 20+ and Git remain available for managed lifecycle operations.
- Generated projects remain real Git repositories or can be initialised safely.
- The upstream harness repository remains reachable through existing Git/SSH/GitHub authentication when an online update is requested.
- Project-local planning/source files are not harness-managed update targets.

## Alternatives considered

1. Blind file replacement — rejected because it destroys project customisation.
2. Copy-only-missing files — rejected because stale harness files never receive fixes.
3. Patch-only upgrades — rejected because patches do not explicitly model project-only vs upstream-only edits.
4. AI-only reconciliation — rejected because deterministic comparison/merging/version control should not depend on model memory or judgement.
5. Full external updater framework — rejected as unnecessary complexity for a small text/Node harness.

## Bounded proof

Regression fixtures create source/project repositories and prove:

- update check makes no changes;
- upstream-only files replace;
- new managed files add;
- non-overlapping local/upstream edits merge cleanly;
- overlapping edits block apply without branch/file mutation;
- doctor tolerates absent optional tools;
- legacy adoption chooses the final commit carrying the installed version rather than the first version-bump commit;
- generated-project handoff installs lifecycle scripts, baselines, and agent instructions idempotently.

GitHub Actions must pass the complete suite on Node 20, 22, and 24.

## Proposed architecture

`HARNESS-MANIFEST.json` declares the latest managed surface. `scripts/project-handoff.js` installs that surface into generated projects and snapshots exact baselines under `.harness/baseline/`. `.harness/handoff.json` schema v2 records installed version/source commit/file hashes. `scripts/harness.js` is the command router; generated projects receive it as `scripts/harness.mjs`. `scripts/harness-update.js` owns doctor/adopt/update planning and uses Git's three-way merge primitive. `scripts/vcs-control.js` remains the dedicated ordinary VCS controller. Project-owned source/planning/state is outside the lifecycle manifest.

## Approval evidence

Shaun explicitly approved the three-way lifecycle model and instructed Athena to proceed without routine assistance. He also specified that natural-language/model commands should understand harness update/doctor operations and that command-line installation/update capability is desirable. Merge/release remain Shaun-owned.
