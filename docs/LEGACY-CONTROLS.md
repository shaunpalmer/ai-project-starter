# Legacy Control Scripts

The following scripts may remain in the repository for history or future cleanup, but they are not part of the supported v0.4 execution path unless another current document explicitly promotes them.

## `scripts/git-checkpoint.js`

Status: **legacy / unsupported**.

Reasons:

- interactive `readline` prompt can block an unattended agent loop;
- broad `git add .` can stage unrelated files;
- timestamp-only commit messages do not describe the engineering slice;
- unconditional `git push` has no protected-branch/remote policy;
- no machine-readable preflight or authentication failure evidence.

Replacement: `scripts/vcs-control.js`.

## General rule

Do not repair or route new automation through a legacy helper merely because it exists. Promote one supported control path, add proof around it, and retire old helpers deliberately in a bounded cleanup change.
