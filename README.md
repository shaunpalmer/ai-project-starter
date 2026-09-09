# AI Project Starter

A planning-first engineering harness that accepts a natural-language outcome, models unfamiliar systems before architecture is locked, applies mature engineering defaults automatically, and keeps routine programming decisions with the AI instead of handing them back to Shaun.

## Operating model

The supported flow is:

```text
intent → evidence → system model → engineering defaults + required skills → architecture hypothesis → safe Git branch → first slice → execute → verify → checkpoint → stop/continue
```

The quality target is **maximum correct pre-decisions with minimum human interruption**. Routine engineering question budget is zero. Mature ecosystem choices such as WordPress conventions, normal naming/style, and obvious implementation defaults should not become user questions.

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
- Existing projects preserve their established stack unless evidence justifies a consequential change.

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
```

Then read `AGENTS.md` and the files named by the active task.

## Core commands

| Command | Purpose |
|---|---|
| `npm run setup` | Initialise required harness folders and advisory planning lock |
| `npm run status` | Show planning lock status |
| `npm run unlock` | Remove the advisory lock only when control state verifies and the task is execution-ready |
| `npm run memory:resume` | Reconstruct compact current context, including discovery status |
| `npm run control:verify` | Validate memory, decisions, schema v2 alignment, and discovery artifacts |
| `npm run memory:checkpoint -- --summary "..."` | Capture a factual handoff checkpoint |
| `npm run decision -- --kind routine` | Resolve who owns a decision category |
| `npm run destination -- --slug example --workspace-root /absolute/path` | Preview/create a bounded product workspace |
| `npm run handoff -- --project-root /absolute/path` | Install proven engineering defaults, skills, VCS control, agent rules, and local Git into a generated project |
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

Then install the proven v0.4 operating handoff:

```bash
npm run handoff -- --project-root /absolute/path/to/project
```

The handoff safely copies `ENGINEERING-DEFAULTS.md`, the relevant routing/core specialist skills, and `scripts/vcs-control.mjs`; appends the v0.4 operating rules to the generated `AGENTS.md`; records `.harness/handoff.json`; and initialises local Git on `work/bootstrap` if the project is not already a repository. Existing project-customised handoff files are never silently overwritten.

For WordPress, authored source remains bounded under `src/<plugin-slug>/`; other types use `src/` until the accepted architecture refines ownership.

## Version-control contract

Version control is part of execution rather than an optional final step.

The supported VCS controller is non-interactive and uses existing machine Git/SSH/GitHub credentials. It never requests or stores tokens, has no force-push mode, refuses managed writes on `main`/`master`, and requires explicit file lists for checkpoint staging.

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
| `ENGINEERING-DEFAULTS.md` | Routine language/style/architecture/testing/failure/VCS defaults |
| `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` | Candidate route, alternatives, bounded proof, approval |
| `docs/decisions/` | Accepted and superseded technical decisions |
| `.harness/state/active-task.json` | Active task and eight-gate Alignment Ladder |
| `.harness/state/checkpoints/` | Generated factual handoffs |
| Git | Exact code history |

## Supported vs legacy controls

Use `project-control.js`, `lock-project.js`, `project-handoff.js`, `vcs-control.js`, generated `project-ready.mjs`, tests, and GitHub checks as the supported control path.

Older scripts such as `guarded-writer.js`, `harness-flip-os.js`, `harness-loop.js`, `router.js`, `pacing-loop.js`, and `git-checkpoint.js` remain unverified legacy experiments. They are not production enforcement or publication commands. The old Git helper is specifically replaced by the deterministic VCS controller because it used interactive prompting, broad staging, and unconditional push behaviour.

See `docs/PROJECT-CONTROL.md`, `docs/DECISION-RIGHTS.md`, `docs/VERSION-CONTROL.md`, `docs/QUALITY-BENCHMARK.md`, and `docs/HARNESS-REVIEW.md` for the current contracts and known boundaries.
