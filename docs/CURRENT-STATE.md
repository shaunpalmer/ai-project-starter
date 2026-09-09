# Current State

Last verified: 2026-09-09
Working branch: `athena/harness-lifecycle-v0.5`
Pull request: #6 — `Harness v0.5: lifecycle updater and CLI operator`
Base: `athena/engineering-defaults-v0.4` / PR #5 (still unmerged)
Verification: PR #6 Actions run #25 passed on Node 20, 22, and 24 after the updater/CLI regression repairs; final documentation/state reconciliation remains subject to the same PR CI gate.

## Current truth

Harness v0.3 is merged to `main`. Harness v0.4 is implemented and verified on PR #5 but remains unmerged. Harness v0.5 is implemented on stacked PR #6 so its lifecycle-specific diff can be reviewed independently.

v0.5 treats an embedded/generated harness as managed software rather than a one-time copy. `HARNESS-MANIFEST.json` declares the managed surface and current harness version. Generated projects keep exact installed upstream contents under `.harness/baseline/` and schema-v2 lifecycle metadata in `.harness/handoff.json`.

`scripts/harness-update.js` provides deterministic `doctor`, `update --check`, `update --apply`, and `adopt` behaviour. Update planning compares installed baseline vs project-local file vs latest upstream file. Upstream-only changes replace, project-only changes remain, non-overlapping changes merge with Git's three-way merge primitive, real conflicts block replacement, new managed files add, and removed-upstream files are preserved/deprecated rather than blindly deleted.

Generated projects receive `scripts/harness.mjs`, `scripts/harness-update.mjs`, the deterministic VCS controller, the command-line skill, engineering defaults, ecosystem skills, lifecycle baselines, and a managed `AGENTS.md` handoff block. Natural-language instructions such as `harness update`, `upgrade to the latest harness`, `harness doctor`, and `/doctor` are defined as executable lifecycle requests rather than prompts for manual copy instructions.

The command line is now an explicit routine engineering capability. The harness inspects OS/shell/PATH/runtimes/package managers/lockfiles/tool availability, preserves an established project package manager, and may perform justified project-scoped installs/updates without asking routine questions. `sudo`, root/system package installation, services/kernel/firewall changes, machine-wide runtime replacement, and similar host-wide changes remain owner-controlled.

## Working capabilities

- Natural-language infer-before-implement discovery and eight readiness gates from v0.3.
- Engineering defaults and zero routine-question budget from v0.4.
- WordPress -> PHP/The WordPress Way defaults and deterministic ecosystem skill binding.
- Scraping/ingestion -> Python default unless stronger project evidence overrides it.
- Deterministic VCS preflight, safe branches, explicit-file checkpoints, remote verification, and authorised non-default-branch pushes.
- Versioned managed harness manifest and exact project-local baseline snapshots.
- Non-mutating harness update checks.
- Safe automatic upstream-only replacement, project-only preservation, new-file addition, and clean three-way merging.
- Fail-closed conflict handling before project-file replacement.
- Isolated `harness/update-<version>` branches and focused update checkpoints.
- Legacy `adopt` route that reconstructs the final source commit carrying the installed package version and refuses unknown baselines.
- `doctor` capability reporting for Git/GitHub CLI, Node/npm/pnpm/yarn, Python/uv/poetry/pipx, Composer, Bash, and PowerShell without crashing when optional tools are absent.
- Generated-project bootstrap Git checkpoint when identity is already configured; otherwise an explicit identity blocker rather than invented credentials.

## Known boundaries

- PR #5 must be merged before PR #6 can ultimately be retargeted/merged cleanly to `main`; both merge decisions remain Shaun-owned.
- Online updates require the configured upstream Git source to be reachable through existing machine authentication/network access.
- A legacy project whose installed baseline cannot be proven from handoff/source history is intentionally not auto-upgraded; it requires explicit reconciliation once, after which future updates can be managed.
- The updater currently manages text/source control files declared in the manifest; future schema/structural changes may require explicit deterministic migration scripts in addition to file reconciliation.
- Force push, default-branch managed push, remote repository creation/deletion, destructive history rewrites, merge, deployment, production mutation, provider spend, release, and root/system host changes remain outside routine authority.
- The three golden acceptance briefs (WordPress, scraping/ingestion, automation) still need to be run against the merged release chain to measure real-world question count and output quality.

## Next action

Keep PR #6 green after final reconciliation. Shaun reviews/merges PR #5 first when satisfied; then PR #6 can be retargeted to `main`, reverified, and presented for Shaun's merge decision. After the release chain is merged, exercise the lifecycle on an existing embedded-harness project and run the three fixed quality benchmark briefs.
