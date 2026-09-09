# Current State

Last verified: 2026-09-09
Working branch: `athena/harness-lifecycle-v0.5`
Pull request: #6 — `Harness v0.5: lifecycle updater and CLI operator`
Verification: GitHub Actions run #37 passed on Node 20, 22, and 24 with `npm test`, `npm run control:verify`, and `npm run memory:resume` green across the matrix.

## Current truth

Harness v0.3 is merged to `main`. Harness v0.4 remains implemented and verified on PR #5. Harness v0.5 is stacked on the v0.4 branch in PR #6 so its lifecycle/CLI diff stays isolated until Shaun decides on the merge order.

v0.5 adds a managed harness lifecycle rather than treating generated-project harness files as one-time copies. `HARNESS-MANIFEST.json` declares the managed surface. Generated projects retain exact upstream baselines under `.harness/baseline/` and schema-v2 lifecycle metadata in `.harness/handoff.json`.

`scripts/harness-update.js` provides deterministic doctor, adopt, non-mutating update check, and three-way apply behaviour. It compares installed baseline vs project-local file vs incoming harness file, automatically handles safe upstream-only/local-only/non-overlapping changes, preserves removed-upstream files as deprecated, and blocks real conflicts before replacement.

`scripts/harness.js` provides the human/model lifecycle entrypoint. Generated projects receive `scripts/harness.mjs` and `scripts/harness-update.mjs`. Natural-language instructions such as `harness update`, `upgrade this project to the latest harness`, `harness doctor`, or `/doctor` are defined as executable lifecycle work rather than questions for Shaun.

The update workflow now explicitly distinguishes two cases:

1. The reusable `ai-project-starter` source clone itself is updated with Git (`git status`, safe branch handling, `git switch main`, `git pull --ff-only origin main`, verification).
2. The embedded harness inside a product project is updated through doctor/check/apply and never by gutting or replacing the project directory.

Older projects that do not yet contain `scripts/harness.mjs` are bootstrapped from a freshly updated v0.5+ starter clone with `npm run harness -- <command> --cwd /absolute/project`. If lifecycle metadata already exists, adoption is skipped. If doctor reports `legacy-unmanaged`, `adopt` reconstructs a trusted historical baseline first, then update check/apply installs the current managed controllers.

The command line is an explicit routine engineering capability. The command-line skill covers evidence-based OS/shell/runtime/package-manager discovery, project-scoped installs/updates, non-interactive execution, verification, and secret-safe operation. Machine-wide/root-level changes remain consequential.

## Working capabilities

- Natural-language infer-before-implement discovery and eight readiness gates from v0.3.
- Engineering defaults, zero routine-question budget, deterministic skill binding, consolidated WordPress Way, deterministic VCS, generated-project handoff, and quality benchmark from v0.4.
- Managed embedded-harness lifecycle with exact baselines and three-way updates.
- `harness doctor`, `update --check`, `update --apply`, and `adopt`.
- Safe first upgrade of older projects from the updated starter clone without moving/deleting product code.
- Explicit source-repository-vs-embedded-project lifecycle routing in README, lifecycle docs, agent contract, and CLI usage.
- Deterministic command-line skill and package-manager/runtime discovery.
- Lifecycle update branches and focused checkpoints.
- Regression proof including safe three-way merge, conflict refusal, legacy adoption, handoff idempotency/customisation protection, VCS safety, and CLI capability checks.

## Known boundaries

- PR #5 (v0.4) and PR #6 (v0.5) remain unmerged until Shaun explicitly approves merge.
- PR #6 currently targets the v0.4 branch. After PR #5 is merged, retarget PR #6 to `main`, rerun CI, then present the final merge decision.
- Remote GitHub repository creation/deletion is not automatic.
- Force push, default-branch managed push, destructive history edits, merge, deployment, production mutation, provider spend, machine-wide/root package/runtime/service/kernel/firewall mutation, and release remain Shaun-owned.
- Legacy adoption only proceeds when the previous harness baseline can be established from trustworthy source history; otherwise it refuses to guess.
- Real three-way conflicts require explicit reconciliation before apply.

## Next action

Shaun reviews/decides PR #5 first. If PR #5 is merged, retarget PR #6 to `main`, verify the rebased/retargeted lifecycle branch, then present PR #6 for Shaun's merge decision. After v0.5 is merged, use the documented first-upgrade workflow on one real older harness-bearing project as the acceptance test before upgrading other projects.
