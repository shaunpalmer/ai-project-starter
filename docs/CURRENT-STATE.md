# Current State

Last verified: 2026-09-09
Working branch: `athena/engineering-defaults-v0.4`
Verification: pending GitHub Actions for v0.4

## Current truth

Harness v0.3 is merged to `main`. v0.4 is now implementing the next layer: routine engineering defaults, automatic ecosystem skill binding, a consolidated WordPress Way, and deterministic version-control operations.

`ENGINEERING-DEFAULTS.md` defines the zero-routine-question policy, language/runtime defaults, architecture defaults, dependency/persistence/failure/testing rules, and version-control expectations. `docs/DECISION-RIGHTS.md` now distinguishes applying an established default from materially departing from one.

The WordPress skill has been consolidated into one authoritative rule set. The skill router automatically binds WordPress rules for confirmed WordPress work and scraping guidance for confirmed scraping/ingestion work instead of asking Shaun whether to activate obvious skills.

`scripts/vcs-control.js` provides non-interactive Git status/preflight/init/branch/checkpoint/connect/push controls. It is designed to use existing machine authentication, stage only declared files, refuse protected branches/force-style behaviour, and fail explicitly instead of waiting for hidden terminal prompts.

## Working capabilities

- Infer-before-implement discovery and eight readiness gates from v0.3.
- Routine engineering question budget of zero.
- WordPress -> PHP/The WordPress Way default behaviour.
- Scraping/ingestion -> Python default unless stronger evidence overrides it.
- General automation/runtime defaults with ecosystem precedence.
- Deterministic Git local init and safe work-branch creation.
- Focused checkpoint commits with explicit file lists.
- Existing-credential remote verification and safe feature-branch push policy.

## Known boundaries

- v0.4 proof is not complete until the full CI matrix passes.
- The new VCS controller does not create/delete remote GitHub repositories, force push, merge, deploy, or release.
- Generated-project handoff of v0.4 defaults/VCS controls is a follow-up integration step after the controller proof is green.
- Legacy experimental scripts, including the old interactive git checkpoint helper, remain unsupported unless deliberately retired/replaced in a later cleanup slice.

## Next action

Open the v0.4 pull request, run the full Node 20/22/24 Actions matrix, repair any regression in place, then reconcile the active task/current state to completed proof. After that, integrate the proven defaults/VCS controls into generated product-project scaffolds and add a representative WordPress/scraping/automation acceptance benchmark.
