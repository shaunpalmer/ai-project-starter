# SKILL: Command-Line Operator

## Purpose

Use the local command line as a normal engineering interface. Detect the host and existing tools, run non-interactive commands, install project-scoped dependencies when justified, and verify every change. Do not turn routine shell work into questions for Shaun.

## Operating rules

1. Inspect before changing: OS, shell, PATH, repository root, runtime versions, package manager, lockfiles, virtual environments, and relevant config.
2. Prefer the project's existing package manager and lockfile. Do not swap npm/pnpm/yarn, pip/uv/poetry, Composer, or equivalent without evidence.
3. Project-local installs and updates required by the accepted plan are routine when they do not introduce a new consequential provider, runtime, licence, security boundary, or production mutation.
4. Prefer local/user-scoped tools over global/system mutation when either satisfies the job.
5. `sudo`, root/system package installation, kernel/service changes, firewall changes, destructive filesystem operations, and machine-wide runtime replacement are consequential. Explain the exact host mutation and obtain approval first.
6. Never pipe an unreviewed remote script directly into a shell. Fetch/read/checksum or use the ecosystem package manager instead.
7. Run commands non-interactively where possible. Set explicit timeouts for commands that may hang and fail loudly rather than waiting on hidden prompts.
8. Never print, persist, or embed credentials. Reuse authorised Git/SSH/GitHub CLI or provider authentication already present on the machine.
9. After install/update commands, verify the resulting version, lockfile/config changes, tests, and Git status.
10. Record material CLI changes in the current-state/checkpoint evidence.

## Default command selection

- Linux/macOS shell glue: Bash.
- Windows-native administration: PowerShell.
- Cross-platform scripting/data work: Python unless existing project evidence says otherwise.
- Node/TypeScript project commands: use the lockfile-selected package manager.
- PHP/WordPress dependencies: Composer only when the project already uses it or the accepted architecture requires it.

## Harness lifecycle phrases

When Shaun says any equivalent of `harness update`, `upgrade the harness`, `update to the latest harness`, or `/harness update`, run the project-local harness updater rather than improvising file copies.

When Shaun says `harness doctor`, `/doctor`, or asks whether the harness is healthy/current, run the project-local doctor command and report only actionable findings.

The canonical generated-project commands are:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
```

If the project predates the managed lifecycle manifest, run doctor first; the updater may adopt/reconstruct the legacy baseline before any replacement is attempted.

## Completion evidence

A CLI operation is not complete because the command exited zero. Verify the intended artifact/state, relevant tests, and version-control status.
