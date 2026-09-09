# Version-Control Contract

Version control is a normal execution primitive for the harness.

## Supported controller

Use:

```bash
node scripts/vcs-control.js <command>
```

or the package shortcuts:

```bash
npm run vcs:status
npm run vcs:preflight
npm run vcs -- <command> [options]
```

## Normal flow

```text
preflight
  -> init local repository if needed
  -> create/switch to non-default work branch
  -> implement
  -> verify
  -> checkpoint only intended files
  -> verify remote with existing machine authentication
  -> push authorised non-default branch
  -> owner decides merge/release
```

## Commands

- `status` — machine-readable repository facts without remote network access.
- `preflight [--require-remote]` — validates repository state, Git identity, and optionally remote authentication/reachability.
- `init [--branch work/bootstrap]` — initialises a new local repository on a safe non-default branch.
- `branch --name <name>` — creates/switches to a non-protected branch.
- `checkpoint --message "..." --file <path> [--file <path>]` — stages only named files and commits the verified slice.
- `connect --url <git-url> [--remote origin]` — attaches an explicitly supplied remote and verifies it using existing machine credentials.
- `push [--remote origin]` — pushes the current non-protected branch after remote verification.

## Authentication

The controller does not own credentials.

It uses whatever Git already has available on the machine: SSH agent/keys, Git credential manager, or GitHub CLI-backed credentials. Network checks run with interactive prompting disabled so a missing/expired credential becomes an explicit failure instead of freezing an agent loop.

Never place a PAT/token/password in a remote URL, environment template, project file, log, checkpoint, or commit.

## Hard safety boundaries

The controller intentionally has no force-push mode and no broad `git add .` mode.

Managed writes refuse `main` and `master`. Remote repository creation/deletion, default-branch policy changes, history rewrites, merge, deployment, and release remain owner-controlled under `docs/DECISION-RIGHTS.md`.

## Why the legacy helper is not used

`scripts/git-checkpoint.js` is a legacy experiment. It uses an interactive terminal question, broad `git add .`, timestamp commit messages, and unconditional `git push`. It is not part of the supported v0.4 execution path.
