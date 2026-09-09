# Harness Lifecycle

The harness is managed software embedded into generated projects. It must be upgradeable without treating the project as disposable or blindly replacing project-local work.

## User/model commands

From a generated project:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
node scripts/harness.mjs adopt
```

Natural-language equivalents such as `harness update`, `upgrade the harness`, `update to the latest harness`, `harness doctor`, or `/doctor` are executable lifecycle instructions. The agent should run the local controller rather than ask Shaun how to copy files.

## Ownership model

Harness-managed files are declared by `HARNESS-MANIFEST.json`.

- **managed**: the harness owns the upstream baseline. Local edits are still preserved through three-way reconciliation.
- **extensible**: the harness provides a baseline but project-local extension is expected; three-way reconciliation is mandatory when both sides change.
- **project-owned**: product code, project planning, project state, and project decisions are never replaced by the harness updater.

Generated projects store the installed baseline under `.harness/baseline/` and lifecycle metadata in `.harness/handoff.json`.

## Three-way update model

For every managed/extensible file the updater compares:

1. **base** — the exact harness content installed previously;
2. **local** — the project's current copy;
3. **incoming** — the latest upstream harness copy.

The deterministic outcomes are:

| State | Result |
|---|---|
| local == base; incoming changed | replace automatically |
| incoming == base; local changed | preserve local |
| local == incoming | already current |
| both changed, merge is clean | three-way merge automatically |
| both changed, merge conflicts | stop before replacement |
| incoming is new; local absent | add automatically |
| upstream manifest removed a previously managed file | preserve locally and mark deprecated |

`update --check` is non-mutating. `update --apply` refuses to proceed when any unresolved conflict exists.

## Version-control safety

Applying lifecycle changes requires:

- the project root to be its own Git repository;
- a clean worktree;
- configured Git identity;
- a non-detached HEAD.

The updater creates an isolated `harness/update-<version>` branch, stages only the managed lifecycle files/baselines/manifest state it touched, runs `git diff --check`, and creates a focused checkpoint commit.

No updater operation force-pushes, pushes the default branch, merges, deploys, releases, creates/deletes a remote repository, or mutates production.

## Existing/legacy projects

Projects created before lifecycle metadata may run `harness adopt`.

Adoption:

1. reads the installed package version;
2. searches source history for the **latest commit that still carried that version**;
3. reconstructs baseline snapshots from that commit;
4. records schema-v2 lifecycle metadata;
5. does not replace product/harness files during adoption;
6. creates a dedicated `harness/adopt-<version>` checkpoint.

If a trusted historical baseline cannot be established, adoption refuses to guess. The model must inspect/reconcile the project explicitly before managed replacement is allowed.

Legacy v0.4 handoff schema is also understood: its recorded source commit is used to reconstruct the previous managed baseline during update planning.

## Command-line capability

The command line is part of ordinary execution. The agent may inspect runtimes, package managers, versions, Git state, lockfiles, and project-local environments without asking Shaun to choose routine commands.

Project-scoped dependency installation/update required by an accepted plan is routine. Machine-wide mutation (`sudo`, root/system package installation, services, kernel, firewall, global runtime replacement) remains consequential and requires approval.

The command-line skill requires non-interactive execution, existing authentication, explicit verification, and no credential leakage.

## Doctor

`harness doctor` reports:

- lifecycle manifest/version state;
- Git repository/branch/cleanliness/identity;
- managed-file or baseline drift;
- availability of common tools (`git`, `gh`, Node/npm/pnpm/yarn, Python/uv/poetry/pipx, Composer, Bash, PowerShell);
- optional upstream reachability with `--online`.

Doctor is diagnostic only; it does not install or mutate anything.
