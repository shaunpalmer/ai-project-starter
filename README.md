# AI Project Starter

A planning-first engineering harness that accepts a natural-language outcome, models unfamiliar systems before architecture is locked, applies mature engineering defaults automatically, uses command-line and version-control tools deterministically, and keeps routine programming decisions with the AI instead of handing them back to Shaun.

## Operating model

```text
intent → evidence → system model → engineering defaults + required skills → architecture hypothesis → safe Git branch → execute → verify → checkpoint → stop/continue
```

The quality target is **maximum correct pre-decisions with minimum human interruption**. Routine engineering question budget is zero. Mature ecosystem choices such as WordPress conventions, normal naming/style, package-manager evidence, and obvious implementation defaults should not become user questions.

Known WordPress work can classify quickly. Hybrid work such as scraping + browser automation + API integration + persistent state is allowed to remain hybrid; `PROJECT-TYPES.md` provides presets rather than mandatory boxes.

## Engineering defaults

`ENGINEERING-DEFAULTS.md` is the baseline engineering operating policy. Rule precedence is:

1. existing project configuration and accepted ADRs;
2. confirmed system-model evidence and accepted architecture hypothesis;
3. ecosystem-specific skills;
4. engineering defaults;
5. generic model preference.

Examples:

- WordPress server-side work defaults to PHP and automatically binds The WordPress Way.
- New scraping/ingestion work defaults to Python unless stronger repository/runtime evidence establishes another stack.
- General cross-platform automation defaults to Python; small shell glue may use Bash; Windows-native administration may use PowerShell.
- Existing projects preserve their established stack/package manager unless evidence justifies a consequential change.
- CLI inspection and project-scoped install/update work is routine; machine-wide/root-level mutation is consequential.

Defaults are starting evidence, not cages. Material deviations remain subject to `docs/DECISION-RIGHTS.md`.

## Readiness contract

Ready/in-progress/completed work requires:

- task schema v2;
- eight evidence-backed Alignment Ladder gates;
- `MODEL_STATUS: CONFIRMED` in `00-PLANNING/SYSTEM-MODEL.md`;
- `HYPOTHESIS_STATUS: ACCEPTED` in `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.

## Requirements

- Node.js 20 or newer
- Git

No npm runtime dependencies are required for the supported harness controls.

## Start a session

```bash
npm run memory:resume
npm run status
npm run vcs:status
npm run doctor
```

Then read `AGENTS.md` and the files named by the active task.

## Core commands

| Command | Purpose |
|---|---|
| `npm run setup` | Initialise required harness folders and advisory planning lock |
| `npm run status` | Show planning lock status |
| `npm run unlock` | Remove the advisory lock only when control state verifies and the task is execution-ready |
| `npm run memory:resume` | Reconstruct compact current context, including discovery status |
| `npm run control:verify` | Validate memory, decisions, schema-v2 alignment, and discovery artifacts |
| `npm run memory:checkpoint -- --summary "..."` | Capture a factual handoff checkpoint |
| `npm run decision -- --kind routine` | Resolve who owns a decision category |
| `npm run destination -- --slug example --workspace-root /absolute/path` | Preview/create a bounded product workspace |
| `npm run handoff -- --project-root /absolute/path` | Install the managed engineering/skills/VCS/lifecycle layer into a generated project |
| `npm run doctor` | Diagnose local lifecycle, Git and common CLI capability without mutation |
| `npm run update -- --check` | Compare installed harness against the latest source without changing the project |
| `npm run update -- --apply` | Apply a conflict-free managed update on an isolated lifecycle branch |
| `npm run adopt` | Establish a trusted lifecycle baseline for a recognisable legacy harness |
| `npm run vcs:preflight` | Validate local Git identity/repository state without interactive prompts |
| `npm run vcs -- branch --name work/example` | Create/switch to a safe non-default work branch |
| `npm run vcs -- checkpoint --message "..." --file path` | Commit only explicitly named verified files |
| `npm run vcs -- connect --url <git-url>` | Attach and verify an explicitly supplied remote using existing machine authentication |
| `npm run vcs -- push` | Push an already-authorised non-default branch |
| `npm test` | Run automated behaviour tests |

## Create and hand off a project

Known WordPress type:

```bash
npm run destination -- \
  --name "Super Clean Deals" \
  --slug super-clean-deals \
  --type wordpress-plugin \
  --workspace-root /home/shaun-prime/Development/projects
```

Unknown/hybrid type:

```bash
npm run destination -- \
  --name "Prospecting Pipeline" \
  --slug prospecting-pipeline \
  --workspace-root /home/shaun-prime/Development/projects
```

Omitting `--type` records `infer`. Add `--create` only after the previewed paths are correct.

Creation writes a project-local contract, intake, `SYSTEM-MODEL.md`, `ARCHITECTURE-HYPOTHESIS.md`, task state, `scripts/project-ready.mjs`, and the standard `00-PLANNING/`, `docs/`, `src/`, `tests/`, `build/`, and `dist/` lifecycle folders. It does not deploy or call providers.

Then install the managed operating handoff:

```bash
npm run handoff -- --project-root /absolute/path/to/project
```

The handoff copies the manifest-declared engineering defaults, specialist skills and controllers; creates exact baselines under `.harness/baseline/`; appends a managed harness block to `AGENTS.md`; records schema-v2 `.harness/handoff.json`; initialises local Git on `work/bootstrap` when needed; and creates an explicit bootstrap checkpoint when Git identity is already configured. Existing project-customised managed files are never silently overwritten.

For WordPress, authored source remains bounded under `src/<plugin-slug>/`; other types use `src/` until the accepted architecture refines ownership.

## Harness lifecycle and self-update

An embedded harness is managed software, not a one-time folder copy.

From a generated project the model/user can run:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
node scripts/harness.mjs adopt
```

Natural-language requests such as **"harness update"**, **"upgrade to the latest harness"**, **"harness doctor"**, or **`/doctor`** are treated as executable lifecycle instructions. The agent should run the local controller rather than ask Shaun how to copy/merge files.

`HARNESS-MANIFEST.json` declares the managed surface. Generated projects store the exact previous upstream content under `.harness/baseline/`. Updates compare:

```text
installed baseline  ←→  project-local file  ←→  latest upstream file
```

| Comparison | Behaviour |
|---|---|
| only upstream changed | replace automatically |
| only project changed | preserve project copy |
| both changed without overlap | clean three-way merge |
| both changed with conflict | stop before replacement |
| new upstream managed file | add automatically |
| file removed upstream | preserve/deprecate locally; never blindly delete |

`update --check` is non-mutating. `update --apply` requires a clean project Git worktree and configured identity, creates `harness/update-<version>`, stages only lifecycle-owned changes, runs `git diff --check`, refreshes baselines/state, and creates a focused checkpoint.

Projects that predate lifecycle metadata may use `adopt`. Adoption reconstructs the baseline from the **latest historical source commit that still carried the installed harness version**. If a trusted baseline cannot be established, it refuses to guess.

See `docs/HARNESS-LIFECYCLE.md`.

## Command-line contract

The command line is part of ordinary engineering execution. The agent may inspect OS, shell, PATH, runtime versions, lockfiles, package managers, virtual environments, Git state, and installed tools without asking Shaun to choose routine commands.

Project-scoped dependency installation/update required by an accepted plan is routine. The harness preserves the project's existing package manager/lockfile and verifies resulting versions/config/tests/Git state.

`sudo`, root/system package installation, services, kernel/firewall changes, machine-wide runtime replacement, destructive filesystem changes, or other host-wide mutations remain consequential and require approval.

The command-line operator runs non-interactively where possible, uses timeouts, reuses existing authorised credentials, and never embeds/logs secrets or blindly pipes unreviewed remote scripts into a shell.

## Version-control contract

Version control is part of execution rather than an optional final step.

The supported VCS controller is non-interactive and uses existing machine Git/SSH/GitHub credentials. It never requests or stores tokens, has no force-push mode, refuses managed writes on `main`/`master`, and requires explicit file lists for ordinary checkpoint staging.

Remote repository creation/deletion, destructive history rewrites, merge, deployment, production mutation, and release remain owner-controlled.

See `docs/VERSION-CONTROL.md`.

## Quality benchmark

The harness is evaluated on more than whether code runs. `docs/QUALITY-BENCHMARK.md` measures routine question count, architecture fit, feature completeness, proof, unnecessary dependencies, manual corrections, and recoverable Git checkpoints across WordPress, scraping/ingestion, and automation benchmark families.

The reference experience is a substantial brief followed by at most a small number of genuinely consequential questions, then a complete verified implementation.

## Memory model

| File | Authority |
|---|---|
| `docs/NORTH-STAR.md` | Stable purpose and invariants |
| `docs/CURRENT-STATE.md` | Current truth and next action |
| `00-PLANNING/SYSTEM-MODEL.md` | Evidence-backed model before implementation |
| `ENGINEERING-DEFAULTS.md` | Routine language/style/architecture/testing/failure/CLI/VCS/lifecycle defaults |
| `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` | Candidate route, alternatives, bounded proof, approval |
| `docs/decisions/` | Accepted and superseded technical decisions |
| `.harness/state/active-task.json` | Active task and eight-gate Alignment Ladder |
| `.harness/state/checkpoints/` | Generated factual handoffs |
| `.harness/handoff.json` | Installed embedded-harness version/source/managed files |
| `.harness/baseline/` | Exact previous upstream contents for three-way updates |
| Git | Exact code and lifecycle history |

## Supported vs legacy controls

Use `project-control.js`, `lock-project.js`, `project-handoff.js`, `harness.js`, `harness-update.js`, `vcs-control.js`, generated `project-ready.mjs`, tests, and GitHub checks as the supported control path.

Older scripts such as `guarded-writer.js`, `harness-flip-os.js`, `harness-loop.js`, `router.js`, `pacing-loop.js`, and `git-checkpoint.js` remain unverified legacy experiments. They are not production enforcement or publication commands. The old Git helper is specifically replaced by the deterministic VCS controller because it used interactive prompting, broad staging, and unconditional push behaviour.

See `docs/PROJECT-CONTROL.md`, `docs/DECISION-RIGHTS.md`, `docs/VERSION-CONTROL.md`, `docs/HARNESS-LIFECYCLE.md`, `docs/QUALITY-BENCHMARK.md`, and `docs/HARNESS-REVIEW.md` for the current contracts and known boundaries.
