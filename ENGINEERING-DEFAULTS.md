# Engineering Defaults

These defaults are the harness's engineering operating system. Their purpose is to maximise correct pre-decisions and minimise human interruption without turning defaults into cages.

## Authority and precedence

When rules disagree, use this order:

1. Existing project configuration and accepted ADRs.
2. Confirmed system-model evidence and an accepted architecture hypothesis.
3. Ecosystem-specific skills such as The WordPress Way.
4. These engineering defaults.
5. Generic model preference.

A default may be overridden by evidence. A deviation that materially changes architecture, language, framework, database, cost, security, or deployment remains a consequential decision under `docs/DECISION-RIGHTS.md`.

## Question budget

Routine engineering question budget: **0**.

The agent must not ask Shaun to choose ordinary language syntax, naming, loop form, helper boundaries, file layout, OOP versus procedural style, test organisation, lint rules, or an ecosystem's established conventions.

For genuinely consequential ambiguity, aim for **0-2 compact questions for the whole project**, not a stream of implementation questions. Before asking, inspect the repository, runtime, relevant skills, accepted decisions, and run the smallest bounded proof that could resolve the uncertainty.

A question is justified only when the missing answer belongs to Shaun under the Decision Rights Contract or cannot be established safely from evidence.

## Language and runtime defaults

| Confirmed project evidence | Default |
|---|---|
| WordPress plugin/theme/runtime extension | PHP for server-side WordPress code; JavaScript/TypeScript only where WordPress editor/browser work requires it |
| Scraping, crawling, enrichment, ingestion, data-cleaning pipeline | Python |
| Browser-heavy scraping/automation | Python + Playwright unless the existing stack provides stronger evidence for Node/TypeScript |
| General cross-platform automation | Python |
| Small Linux/macOS shell glue | Bash |
| Windows administration or Windows-native automation | PowerShell |
| Browser/front-end application | TypeScript |
| Existing project | Preserve its established language/runtime unless evidence justifies a change |
| Hybrid system | Choose per component responsibility; do not force one language across unrelated responsibilities |

Do not install a new system runtime merely because it appears in this table. Inspect what is available first. A material environment/runtime installation follows the Decision Rights Contract.

## Command-line operating defaults

The command line is a normal engineering interface, not a special escalation path.

- Inspect OS, shell, PATH, runtimes, lockfiles, package manager, virtual environments, Git state, and existing tooling before changing the machine or project.
- Use the project's existing package manager and lockfile. Do not switch ecosystems/package managers because of model preference.
- Project-scoped dependency installation/update required by the accepted plan is routine when it does not introduce a consequential provider, runtime, licence, security boundary, or production mutation.
- Prefer local/user-scoped tools over global/system mutation when either solves the problem.
- `sudo`, root/system package installation, service/kernel/firewall changes, and machine-wide runtime replacement require explicit approval because they change the host beyond the project.
- Do not pipe an unreviewed remote script directly into a shell.
- Run commands non-interactively where practical, with explicit timeouts for commands that may wait indefinitely.
- Reuse authorised Git/SSH/GitHub CLI/provider authentication already present on the machine. Never request, print, persist, or embed secrets merely to automate a command.
- After an install/update, verify the resulting version, lockfile/config changes, tests, and Git status.

Use `.github/skills/command-line/SKILL.md` when terminal operation, dependency installation, runtime/tool inspection, or environment updates are part of the work.

Natural-language lifecycle requests are executable instructions. If Shaun says `harness update`, `upgrade the harness`, `update to the latest harness`, or `/harness update`, run the project-local lifecycle controller. If he says `harness doctor`, `/doctor`, or asks whether the harness is healthy/current, run the doctor command rather than guessing.

Generated-project lifecycle commands:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
```

## Architecture defaults

### WordPress

- Bind The WordPress Way automatically.
- Prefer WordPress core APIs, hooks, filters, REST, metadata/options, enqueue APIs, capabilities, nonces, sanitisation, escaping, and WPCS before custom infrastructure.
- Procedural functions are appropriate for small hook glue and simple WPDB/WordPress integration logic.
- Use classes for stateful services, reusable domain logic, controllers, repositories, provider adapters, or responsibilities that benefit from encapsulation.
- Prefer composition over inheritance except where WordPress itself defines an extension base type.
- Do not create classes simply to make a plugin "more OOP".

### Python

- Use modules and functions for straightforward transformations and scripts.
- Use classes when state, lifecycle, pluggable providers, or explicit interfaces justify them.
- Add type hints to public functions and important data structures.
- Prefer `pathlib`, context managers, structured exceptions, and standard-library features before dependencies.
- Use `pytest` when a test framework is required unless the existing project establishes another standard.

### Automation

- Separate discovery, action, verification, and logging.
- Provide `--dry-run` for destructive or externally mutating operations where practical.
- Make reruns safe: prefer idempotent operations and explicit state over "hope it only runs once".
- Exit non-zero on failure and emit machine-readable evidence for orchestrated workflows.

### Scraping and ingestion

- Model acquire -> normalise -> dedupe -> validate -> enrich -> persist/export as responsibilities, not mandatory filenames.
- Put paid or rate-limited enrichment after cheap dedupe/validation whenever the data flow permits.
- Bound retries and concurrency.
- Define fallback behaviour, partial-failure handling, rerun safety, and persistence before scaling throughput.
- One representative source, one validated record, one safe rerun, and one handled failure make a useful first proof.

## Naming and style

Use the ecosystem's standard before personal preference.

- WordPress: WPCS and The WordPress Way.
- Python: PEP 8 conventions unless the existing repository says otherwise.
- TypeScript/JavaScript: repository lint/formatter rules first; otherwise common TypeScript/ESLint conventions.
- Bash: shell-safe quoting, `set -euo pipefail` where appropriate, and ShellCheck-compatible style.
- PowerShell: approved verb-noun functions, explicit parameters, `$ErrorActionPreference`/error handling appropriate to the script's risk.

Never ask Shaun "camelCase or snake_case?" when the ecosystem has already answered it.

## Dependency policy

Before adding a dependency, answer:

1. What observed problem does it solve?
2. Can the language/runtime/platform already solve it adequately?
3. What maintenance, security, deployment, or lock-in cost does it add?
4. Is it needed for the first useful slice?

Use the complexity brake. No dependency exists merely because it is fashionable.

## Data and persistence defaults

Choose persistence from the data lifecycle, not from a project label.

- WordPress settings: Options API.
- WordPress entity metadata: metadata APIs when the shape and volume fit.
- WordPress high-volume relational/event data: custom tables only when justified by query shape, volume, retention, or integrity requirements.
- Lightweight local automation state: JSON/CSV for transport and simple state; SQLite when transactional/queryable local persistence is warranted.
- Existing systems: preserve the existing source of truth unless a migration is explicitly justified.

## Failure handling defaults

- Remote calls get timeouts.
- Retry only transient failures and use bounded retry/backoff.
- Do not retry validation/authentication/configuration failures blindly.
- Record enough context to diagnose failures without exposing secrets.
- Partial failures must leave the system in a resumable or explicitly failed state.
- Destructive actions require a recovery route or explicit approval.

## Testing defaults

Testing follows risk and architecture, not ceremony.

- Pure business/transformation logic: fast unit tests.
- Persistence/provider boundaries: integration or contract tests.
- Browser/UI paths: targeted Playwright/E2E tests.
- WordPress permissions, REST, sanitisation, database and hooks: WordPress/PHP tests where the behaviour warrants them.
- Automation scripts: fixture/dry-run tests plus at least one failure-path test.
- Every repaired regression gets a regression test when it can be reproduced deterministically.

## Version-control defaults

Git is part of execution, not an optional afterthought.

- New local projects should be placed under Git before meaningful implementation begins.
- Work occurs on a non-default feature/work branch.
- Inspect status before and after each meaningful slice.
- Stage only intended files; never use broad automatic staging in a mixed worktree.
- Commit a verified slice with a descriptive message.
- Use the machine's existing Git/GitHub authentication. Never request, print, persist, or embed a token in project files.
- Pushing an already-authorised non-default branch is routine.
- Force push, default-branch push, merge, release, remote-repository creation/deletion, and destructive history edits remain explicit-owner actions.

Use `scripts/vcs-control.js` for deterministic preflight, branch, checkpoint, remote verification, and push behaviour in the starter; generated projects use `scripts/vcs-control.mjs` through `scripts/harness.mjs vcs ...`.

## Harness lifecycle defaults

An embedded/generated harness is managed software, not a one-time copy.

- `HARNESS-MANIFEST.json` defines the files the harness owns and the current harness version.
- Generated projects store the installed version, source commit, managed-file hashes, and local baseline snapshots under `.harness/`.
- Updates use a three-way comparison: installed baseline vs project-local file vs latest upstream file.
- Upstream-only changes replace automatically.
- Project-only changes are preserved.
- Non-overlapping upstream/local changes are merged automatically.
- Real conflicts stop before replacement and become explicit repair work.
- Newly managed files are added automatically.
- Files removed from the upstream manifest are preserved locally and treated as deprecated rather than silently deleted.
- Update checks are non-mutating.
- Applying an update requires a clean Git worktree, creates an isolated `harness/update-<version>` branch, stages only lifecycle-owned files, verifies the diff, and creates a focused checkpoint.
- Projects predating lifecycle metadata use `harness adopt` to reconstruct a trusted baseline before updating; if no trusted baseline can be established, the updater refuses replacement rather than guessing.

## Quality definition

For this harness, quality is not merely "the code runs". A high-quality run has:

- high routine-decision coverage;
- low human question count;
- architecture fitted to the actual system model;
- ecosystem-correct code and security practices;
- complete implementation against the stated brief;
- passing relevant proof;
- recoverable version-control checkpoints;
- repeatable behaviour across WordPress, scraping, and automation projects.

The target experience is a substantial brief followed by at most a small number of genuinely consequential questions, then a complete verified implementation.
