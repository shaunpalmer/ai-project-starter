# Changelog

This file records meaningful user-facing harness changes. Git remains the source for exact file history.

## Unreleased

### Added

- `HARNESS-MANIFEST.json` as the versioned managed-file manifest for embedded harness lifecycle updates.
- `scripts/harness.js` and `scripts/harness-update.js` with doctor, adopt, three-way update check/apply, lifecycle branches, baseline refresh, and focused update checkpoints.
- `.github/skills/command-line/SKILL.md` for deterministic terminal, runtime, package-manager, install/update, and verification behaviour.
- Exact generated-project lifecycle baselines under `.harness/baseline/` and schema-v2 `.harness/handoff.json` metadata.
- Regression coverage for non-mutating update checks, safe replace/add/three-way merge, real-conflict refusal, doctor capability reporting, legacy adoption, and generated handoff lifecycle installation.
- ADR-0005 and `docs/HARNESS-LIFECYCLE.md` documenting managed harness ownership, three-way updates, legacy adoption, and command-line capability.
- `ENGINEERING-DEFAULTS.md` as the routine engineering operating policy, including language/runtime defaults, architecture defaults, testing/failure rules, question budget, and version-control expectations.
- Deterministic `scripts/vcs-control.js` for non-interactive Git status, preflight, local init, safe work branches, focused checkpoints, existing-credential remote verification, and non-default branch push.
- Regression coverage for VCS branch safety, explicit staging, protected-branch refusal, preflight failure, and credential-bearing remote URLs.
- ADR-0004 documenting engineering defaults and deterministic version control.
- Infer-before-implement discovery flow for natural-language and unfamiliar projects.
- `SYSTEM-MODEL.md` and `ARCHITECTURE-HYPOTHESIS.md` planning artifacts.
- Eighth `system_model` Alignment Ladder gate and task schema v2.
- Hybrid capability composition and confidence-based project-shape reasoning.
- Generated-project `scripts/project-ready.mjs` readiness verifier.
- Regression coverage for draft discovery artifacts, hybrid/infer scaffolds, and eight-gate readiness.
- ADR-0003 documenting the infer-before-implement architecture.

### Changed

- Package version advanced to 0.5.0 on the v0.5 lifecycle branch.
- README, lifecycle docs, CLI help, and agent operating contract now distinguish updating the reusable starter/source Git clone from updating the embedded harness inside a product project.
- Existing older projects are explicitly bootstrapped from a freshly updated v0.5+ starter clone using `npm run harness -- <command> --cwd /project`; projects are never gutted/replaced just to upgrade the embedded harness.
- Natural-language lifecycle requests such as `harness update`, `upgrade this project to the latest harness`, `harness doctor`, and `/doctor` are routed according to whether the workspace is the starter source or a generated project.
- The WordPress Way is consolidated into one authoritative rule set with runtime, architecture, WPCS, security, REST/AJAX, persistence, admin UI, performance, error-handling, and test guidance.
- Skill routing automatically binds obvious ecosystem skills from confirmed capabilities rather than asking Shaun to activate them.
- Decision rights distinguish applying an established default from materially deviating from a stack/architecture.
- The agent contract enforces a zero routine-question budget and treats version control as part of execution.
- `PROJECT-TYPES.md` is a preset library rather than a mandatory pattern/database/folder router.
- Natural-language intake no longer requires Shaun to preselect exactly one project type.
- Scraping guidance describes responsibilities and failure modes rather than mandatory modules.
- Supported advisory unlock no longer calls the incompatible legacy planning checker and requires a non-blocked execution state.

### Preserved

- Source/destination separation and WordPress packaging boundaries.
- Shaun owns consequential architecture deviations, providers, cost, security, merge, deploy, release, destructive history, and remote-repository lifecycle decisions.
- Athena owns routine/reversible work, established engineering defaults, focused commits/checkpoints, authorised non-default-branch pushes, project-scoped CLI work, and conflict-free embedded harness lifecycle updates.
- Machine-wide/root package/runtime/service/kernel/firewall mutation remains consequential.
- Legacy experimental scripts remain explicitly unsupported rather than silently promoted into the control plane.
