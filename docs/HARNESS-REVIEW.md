# Harness review — 2026-09-05

## Opinion

Keep this harness and use one current checkout as the working copy. Its strongest parts are explicit source ownership, readable Markdown/JSON memory, small dependency-free commands, and a clear split between routine developer decisions and owner decisions. The WordPress skill is substantial and already present in GitHub main; this update does not replace it.

The supported scaffold and memory commands are useful for agent-assisted development. The repository as a whole is not yet a proven autonomous build/release system. Older experiments, repeated planning instructions, and incompatible gate formats make it look more complete than its executable evidence supports. The next improvement should simplify and reconcile these interfaces, not add another orchestration layer.

## Review scope

Reviewed the existing Node CLI, operating contracts, test suite, planning templates, and WordPress skill. The original seven tests were the baseline; added regression cases exercise failure paths and the supported project scaffold.

## Confirmed findings repaired

| Severity | Finding | Repair and proof |
|---|---|---|
| High | Destination accepted relative workspace paths, children of the harness, and symlink escapes | Validate absolute inputs before resolving; compare canonical paths against the harness and workspace; reject overlapping deployment paths. Regression cases check rejection before writes. |
| High | Changing a task to in-progress/completed bypassed the ready-state gate checks; duplicate gates and blank evidence could pass | Validate schema, non-empty state fields, unique known gates, and all-YES alignment throughout execution/completion. Blocked intake remains valid. |
| Medium | Denied unlock and unknown commands returned success | Return nonzero on failure and preserve the existing lock. Describe the lock as advisory. |
| Medium | Setup/lock targeted the caller's working directory; setup claimed success with missing core files | Anchor commands to their script's harness root; validate core files before setup writes. Test execution from an unrelated directory and incomplete copies. |

## Remaining review findings

1. **High — legacy planning checker and templates disagree.** `scripts/ensure_planning.js` searches for five `STATUS: RESOLVED` strings while the supplied decision template uses checkbox gates. Its generic placeholder scan includes standing instructions/history, so a normal `UNRESOLVED` heading in `AI-NOTES.md` can block it. A blank new-project intake should fail; a completed template needs its own passing fixture before the planning/unlock workflow can be called proven end to end. Do not delete decision history merely to make this scan pass.
2. **High — legacy helpers are not reliable enforcement.** Several `.js` files use CommonJS in an ES-module package (`guarded-writer`, `harness-loop`, `harness-flip-os`, and others). `git-checkpoint.js` broadly stages and pushes; `run-linter.js` invokes an undeclared tool through `npx`; router/pacing scripts simulate outputs. The README now identifies them as unsupported experiments. Do not use them as production controls.
3. **Medium — generated projects receive documents, not the controller.** The scaffold does not install the CLI, copy skills, initialise Git, package a plugin, or deploy it. Running the harness CLI from a product directory still targets the harness. The next project needs an explicit skill/memory handoff and a real WordPress activation/package trial.
4. **Medium — validation has practical limits.** `control:verify` checks structural consistency, not whether evidence is true or business intent is correct. The lock does not prevent arbitrary filesystem writes. Destination checks assume a trusted local filesystem, without hostile concurrent symlink replacement. Scaffold creation can leave a partial directory after an I/O failure; it is not a transaction.

Follow-ups are recorded in `TASKS.md`. They are not hidden behind a blanket “everything passed” claim.

## Proof

- Baseline: 7 existing tests passed on Node 22.23.2.
- Reproduction: 10 added regression scenarios failed against the baseline, then passed after repair.
- Final local suite: `npm test` — 18 tests passed, including resume/checkpoint round-trip proof.
- `npm run control:verify` passed. `npm run memory:resume` returned repository state and accepted ADRs.
- Separate disposable WordPress walkthrough: preview wrote nothing; creation used `src/harness-proof`; intake remained blocked with seven UNKNOWN gates; deployment stayed absent; a second creation was refused. The temporary project was removed afterward.
- Added `.github/workflows/harness-checks.yml` for Node 20/22/24, tests, control verification, and resume. Actual hosted results belong to the PR checks; merely adding this file is not proof they ran.

The workflow pins the verified v7 commits of the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) actions, disables persisted credentials/caching, and uses read-only repository permissions.

## Recommended use

Use this repository's README commands to preview and create a separate product workspace. Open that workspace, complete its intake, and let the agent build within the documented source boundary. Keep the harness free of product code and distributions. Prefer the supported commands and explicit tests while the legacy cleanup is pending.
