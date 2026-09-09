# Changelog

This file records meaningful user-facing harness changes. Git remains the source for exact file history.

## Unreleased

### Added

- Infer-before-implement discovery flow for natural-language and unfamiliar projects.
- `SYSTEM-MODEL.md` and `ARCHITECTURE-HYPOTHESIS.md` planning artifacts.
- Eighth `system_model` Alignment Ladder gate and task schema v2.
- Hybrid capability composition and confidence-based project-shape reasoning.
- Generated-project `scripts/project-ready.mjs` readiness verifier.
- Regression coverage for draft discovery artifacts, hybrid/infer scaffolds, and eight-gate readiness.
- ADR-0003 documenting the infer-before-implement architecture.

### Changed

- `PROJECT-TYPES.md` is now a preset library rather than a mandatory pattern/database/folder router.
- Natural-language intake no longer requires Shaun to preselect exactly one project type.
- Scraping guidance describes responsibilities and failure modes rather than mandatory modules.
- Skill routing now uses confirmed capabilities as evidence.
- Supported advisory unlock no longer calls the incompatible legacy planning checker and requires a non-blocked execution state.
- Package version advanced to 0.3.0.

### Preserved

- Source/destination separation and WordPress packaging boundaries.
- Decision rights: Athena owns routine/reversible work; Shaun owns consequential architecture, providers, cost, security, merge, deploy, and release.
- Legacy experimental scripts remain explicitly unsupported rather than silently promoted into the control plane.
