# Harness Lifecycle

The harness is managed software embedded into generated projects. It must be upgradeable without treating the project as disposable or blindly replacing project-local work.

## First distinction: source repository vs embedded harness

There are two separate update jobs.

### Updating the reusable `ai-project-starter` source repository

The starter/source clone is ordinary Git source and is updated with Git, for example:

```bash
cd /path/to/ai-project-starter
git status
git switch main
git pull --ff-only origin main
npm test
```

If the worktree is not clean, checkpoint or move the local work to a safe branch first. Do not force-reset or delete local work just to obtain the latest starter.

The embedded-project lifecycle updater is **not** the mechanism for updating the starter repository itself.

### Updating the embedded harness inside a product project

The product project stays in place. Do not gut it, move product code out, or replace the project directory.

The updater modifies only manifest-declared harness-managed files. Project-owned source, planning, decisions, state and unrelated local work are outside the managed replacement surface.

## User/model commands

From a generated project that already has the lifecycle controller:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
node scripts/harness.mjs adopt
```

Natural-language equivalents such as `harness update`, `upgrade the harness`, `update to the latest harness`, `harness doctor`, or `/doctor` are executable lifecycle instructions. The agent should run the correct controller rather than ask Shaun how to copy files.

If the current workspace is the reusable starter/source repository and Shaun asks to update **that source**, the agent should use the safe Git-source workflow instead of treating the starter as an embedded project.

## Bootstrapping an older project

An older project may not yet contain `scripts/harness.mjs`. Use a freshly updated v0.5+ starter clone as the bootstrap controller and target the project with `--cwd`:

```bash
cd /path/to/ai-project-starter
npm run harness -- doctor --cwd /absolute/path/to/existing-project
```

Then follow the diagnosed state.

### Existing lifecycle metadata is present

If `.harness/handoff.json` exists, skip adoption and run:

```bash
npm run harness -- update --check --cwd /absolute/path/to/existing-project
npm run harness -- update --apply --cwd /absolute/path/to/existing-project
```

Legacy schema-v1 handoff metadata is understood and can be reconstructed into the current baseline model during update planning.

### No lifecycle metadata is present

If doctor reports `legacy-unmanaged`, establish a trusted baseline before updating:

```bash
npm run harness -- adopt --cwd /absolute/path/to/existing-project
npm run harness -- update --check --cwd /absolute/path/to/existing-project
npm run harness -- update --apply --cwd /absolute/path/to/existing-project
```

After a successful v0.5+ update the project receives the local lifecycle controllers, so future updates can be run directly from the project with `node scripts/harness.mjs ...`.

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

Projects created before lifecycle metadata may run `harness adopt` through the freshly updated starter controller.

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
