# Changelog

This file records meaningful user-facing harness changes. Git remains the source for exact file history.

## Unreleased

### Added

- `HARNESS-MANIFEST.json` as the versioned managed-file/ownership contract for embedded harness updates.
- Project-local lifecycle commands: `harness doctor`, `harness update --check`, `harness update --apply`, and `harness adopt`.
- Three-way harness updates using installed baseline vs project-local file vs latest upstream file.
- `.harness/baseline/` snapshots and schema-v2 `.harness/handoff.json` lifecycle metadata in generated projects.
- Legacy harness adoption that reconstructs a trusted baseline from the final source commit carrying the installed package version.
- `.github/skills/command-line/SKILL.md` for non-interactive CLI inspection, project-scoped installs/updates, and safe host-boundary rules.
- `docs/HARNESS-LIFECYCLE.md` and ADR-0005 documenting the managed lifecycle/updater model.
- Regression coverage for non-mutating update checks, automatic replacement/addition, clean three-way merges, blocking conflicts, CLI doctor behaviour, legacy adoption, and lifecycle-aware project handoff.
- `ENGINEERING-DEFAULTS.md` as the routine engineering operating policy, including language/runtime defaults, architecture defaults, testing/failure rules, question budget, version-control expectations, command-line operation, and harness lifecycle rules.
- Deterministic `scripts/vcs-control.js` for non-interactive Git status, preflight, local init, safe work branches, focused checkpoints, existing-credential remote verification, and non-default branch push.
- ADR-0004 documenting engineering defaults and deterministic version control.
- Infer-before-implement discovery flow for natural-language and unfamiliar projects.
- `SYSTEM-MODEL.md` and `ARCHITECTURE-HYPOTHESIS.md` planning artifacts.
- Eighth `system_model` Alignment Ladder gate and task schema v2.
- Hybrid capability composition and confidence-based project-shape reasoning.
- Generated-project `scripts/project-ready.mjs` readiness verifier.
- ADR-0003 documenting the infer-before-implement architecture.

### Changed

- Package version advanced to 0.5.0.
- Generated-project handoff now installs lifecycle controls, command-line skill, exact baselines, schema-v2 lifecycle state, and a managed agent-contract block.
- Generated projects create a bootstrap Git checkpoint when Git identity is already configured; otherwise handoff reports the exact identity blocker instead of inventing credentials.
- Skill routing automatically binds command-line/lifecycle work as well as WordPress and scraping ecosystem rules.
- Natural-language phrases such as `harness update`, `upgrade the harness`, `harness doctor`, and `/doctor` map to deterministic lifecycle commands instead of manual copy instructions.
- The WordPress Way is consolidated into one authoritative rule set with runtime, architecture, WPCS, security, REST/AJAX, persistence, admin UI, performance, error-handling, and test guidance.
- Decision rights distinguish applying an established default from materially deviating from a stack/architecture.
- The agent contract enforces a zero routine-question budget and treats version control as part of execution.
- `PROJECT-TYPES.md` is a preset library rather than a mandatory pattern/database/folder router.
- Natural-language intake no longer requires Shaun to preselect exactly one project type.
- Scraping guidance describes responsibilities and failure modes rather than mandatory modules.
- Supported advisory unlock no longer calls the incompatible legacy planning checker and requires a non-blocked execution state.

### Safety behaviour

- `update --check` is non-mutating.
- Real three-way conflicts block replacement rather than writing conflict markers into the project.
- Project-only edits are preserved; removed-upstream files are preserved/deprecated rather than blindly deleted.
- Lifecycle apply requires a clean project Git worktree and configured identity, creates an isolated `harness/update-<version>` branch, stages only intended lifecycle files, verifies the diff, and creates a focused checkpoint.
- Missing optional command-line tools are reported as unavailable rather than crashing doctor or waiting on hidden prompts.

### Preserved

- Source/destination separation and WordPress packaging boundaries.
- Shaun owns consequential architecture deviations, providers, cost, security, machine-wide/root-level mutation, merge, deploy, release, destructive history, and remote-repository lifecycle decisions.
- Athena owns routine/reversible work, established engineering defaults, project-scoped CLI work, focused commits/checkpoints, and authorised non-default-branch pushes.
- Legacy experimental scripts remain explicitly unsupported rather than silently promoted into the control plane.
