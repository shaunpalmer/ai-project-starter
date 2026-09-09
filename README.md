# AI Project Starter

A planning-first development harness that accepts a clear natural-language outcome, models unfamiliar systems before architecture is locked, and keeps routine programming decisions with the AI instead of handing them back to Shaun.

## Infer before implement

The supported flow is:

```text
intent → evidence → system model → project shape + capabilities → architecture hypothesis → first slice → execute → verify → stop
```

Known WordPress work can classify quickly. Hybrid work such as scraping + browser automation + API integration + persistent state is allowed to remain hybrid; `PROJECT-TYPES.md` provides presets rather than mandatory boxes.

Ready/in-progress/completed work requires:

- task schema v2;
- eight evidence-backed Alignment Ladder gates;
- `MODEL_STATUS: CONFIRMED` in `00-PLANNING/SYSTEM-MODEL.md`;
- `HYPOTHESIS_STATUS: ACCEPTED` in `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.

## Requirements

- Node.js 20 or newer
- Git

No npm dependencies are required for the project-control foundation.

## Start a session

```bash
npm run memory:resume
npm run status
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
| `npm run destination -- --slug example --workspace-root /absolute/path` | Preview a canonical project destination |
| `npm test` | Run automated behaviour tests |

## Create a bounded project destination

Known type:

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

For WordPress, authored source remains bounded under `src/<plugin-slug>/`; other types use `src/` until the accepted architecture refines ownership.

## Memory model

| File | Authority |
|---|---|
| `docs/NORTH-STAR.md` | Stable purpose and invariants |
| `docs/CURRENT-STATE.md` | Current truth and next action |
| `00-PLANNING/SYSTEM-MODEL.md` | Evidence-backed model before implementation |
| `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md` | Candidate route, alternatives, bounded proof, approval |
| `docs/decisions/` | Accepted and superseded technical decisions |
| `.harness/state/active-task.json` | Active task and eight-gate Alignment Ladder |
| `.harness/state/checkpoints/` | Generated factual handoffs |
| Git | Exact code history |

## Supported vs legacy controls

Use `project-control.js`, `lock-project.js`, the generated `project-ready.mjs`, tests, and GitHub checks as the supported control path.

Older scripts such as `guarded-writer.js`, `harness-flip-os.js`, `harness-loop.js`, `router.js`, `pacing-loop.js`, and `git-checkpoint.js` remain unverified legacy experiments. They are not production enforcement or publication commands. The supported unlock path no longer depends on the known-incompatible legacy planning checker.

See `docs/PROJECT-CONTROL.md`, `docs/DECISION-RIGHTS.md`, and `docs/HARNESS-REVIEW.md` for the contracts and known boundaries.
