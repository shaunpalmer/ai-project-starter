# Current State

Last verified: 2026-09-09
Working branch: `athena/engineering-defaults-v0.4`
Pull request: #5 — `Harness v0.4: engineering defaults and deterministic VCS`
Verification: GitHub Actions run #17 passed on Node 20, 22, and 24 with `npm test`, `npm run control:verify`, and `npm run memory:resume` green across the matrix.

## Current truth

Harness v0.3 is merged to `main`. Harness v0.4 is implemented and verified on PR #5.

`ENGINEERING-DEFAULTS.md` defines the routine engineering operating policy: rule precedence, zero routine-question budget, language/runtime defaults, architecture defaults, dependency/persistence/failure/testing rules, and version-control expectations.

The WordPress Way has been consolidated into one authoritative non-duplicated rule set. The skill router automatically binds mature ecosystem guidance from confirmed capabilities instead of asking Shaun to activate obvious skills.

`scripts/vcs-control.js` provides non-interactive Git status/preflight/init/branch/checkpoint/connect/push controls. It uses existing machine authentication, stages only explicitly declared files, refuses managed writes on protected default branches, rejects credential-bearing HTTPS remotes, and fails explicitly rather than waiting for hidden terminal prompts.

`scripts/project-handoff.js` installs the proven v0.4 operating layer into a separately generated product project. It copies engineering defaults and required specialist skills, provides `scripts/vcs-control.mjs`, appends the v0.4 rules to the generated `AGENTS.md`, records `.harness/handoff.json`, and initialises local Git on `work/bootstrap` if the project is not already under version control. Existing project-customised handoff files are never silently overwritten.

## Working capabilities

- Natural-language infer-before-implement discovery and eight readiness gates from v0.3.
- Routine engineering question budget of zero.
- WordPress -> PHP/The WordPress Way default behaviour.
- Scraping/ingestion -> Python default unless stronger evidence overrides it.
- General automation/runtime defaults with ecosystem precedence.
- Automatic skill binding from confirmed responsibilities.
- Deterministic local Git preflight, init, safe work-branch creation, focused checkpoint commits, remote verification, and authorised non-default-branch push policy.
- Generated product projects receive the proven engineering/VCS operating handoff without being created inside the reusable starter.
- Quality benchmark defined for WordPress, scraping/ingestion, and automation families.

## Known boundaries

- Remote GitHub repository creation/deletion is not automatic.
- Force push, default-branch managed push, destructive history edits, merge, deployment, production mutation, provider spend, and release remain Shaun-owned.
- `destination --create` and `handoff` are currently two explicit controller steps rather than one combined command; the harness can run both without asking Shaun routine engineering questions.
- The benchmark contract is defined, but the three real-world golden benchmark briefs have not yet been executed against a merged v0.4 release.
- Legacy experimental helpers remain unsupported; the old interactive `git-checkpoint.js` is not part of the v0.4 execution path.

## Next action

PR #5 is ready for Shaun's review and merge decision. After merge, run three fixed acceptance briefs — WordPress plugin, scraping/ingestion pipeline, and automation tool — and score question count, architecture fit, completeness, verification, manual corrections, and Git recoverability against `docs/QUALITY-BENCHMARK.md`.
