# System Model

MODEL_STATUS: CONFIRMED

## Goal

Make the harness behave like an engineering operating system: infer routine technical defaults, bind mature ecosystem rules automatically, keep meaningful work under recoverable version control, and minimise questions to Shaun without sacrificing architecture quality.

## Inputs

- Shaun's natural-language project brief and feature list.
- Confirmed system-model evidence from the target project.
- Existing repository/runtime conventions and accepted ADRs.
- `ENGINEERING-DEFAULTS.md`.
- Ecosystem skills such as The WordPress Way and scraping-pipeline guidance.
- Local Git state and existing machine Git/GitHub authentication.

## Outputs

- Routine engineering choices resolved without user interruption.
- Deterministic skill binding for evidenced capabilities.
- Ecosystem-correct implementation defaults for WordPress, scraping, and automation work.
- Non-interactive Git preflight, safe work branches, focused checkpoints, remote verification, and authorised feature-branch pushes.
- A measurable quality target based on low question count, complete implementation, proof, and recoverability.

## Capabilities

- Engineering-default resolution with explicit precedence.
- Zero-question handling of routine implementation choices.
- WordPress-specific rule binding.
- Scraping/automation runtime defaults.
- Version-control preflight and repository initialisation.
- Safe branch management.
- Focused file staging and checkpoint commits.
- Existing-credential remote verification.
- Non-default branch push policy.
- Regression proof across supported Node versions.

## Data flow

Natural-language intent -> confirmed system model -> engineering defaults + required skills -> architecture hypothesis -> safe Git work branch -> implementation slice -> verification -> focused checkpoint -> optional authorised feature-branch push -> next slice / owner merge decision.

## State and persistence

- Stable purpose: `docs/NORTH-STAR.md`.
- Current truth: `docs/CURRENT-STATE.md`.
- Problem/domain model: `00-PLANNING/SYSTEM-MODEL.md`.
- Proposed route: `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.
- Routine engineering policy: `ENGINEERING-DEFAULTS.md`.
- Decision authority: `docs/DECISION-RIGHTS.md`.
- Active readiness: `.harness/state/active-task.json`.
- Exact implementation history: Git.

## Failure boundaries

- A routine engineering choice must not be bounced back to Shaun when evidence/defaults already decide it.
- Defaults must not override stronger repository configuration or accepted ADRs.
- Skill binding must not be driven only by a project-type label.
- Version-control commands must not prompt interactively, expose credentials, stage the whole worktree, force push, or push managed work directly to `main`/`master`.
- Missing Git identity or required remote/authentication must fail explicitly rather than freeze the loop.
- Creating/deleting a remote repository, merging, releasing, deploying, and destructive history edits remain owner-controlled.

## Invariants

- Shaun keeps consequential product/architecture deviations, provider/cost/security boundaries, destructive operations, merge, deployment, and release authority.
- Athena decides routine/reversible implementation and established-default choices.
- WordPress work follows mature WordPress conventions by default.
- New scraping/ingestion work defaults to Python unless evidence establishes another stack.
- The harness controller remains zero-runtime-dependency Node 20+.
- Existing infer-before-implement discovery and eight readiness gates remain intact.

## Unknowns

No product-policy unknown blocks this slice. Implementation quality is bounded by regression tests and GitHub Actions. A later acceptance benchmark should run the same harness against representative WordPress, scraping, and automation briefs and score question count, completeness, architecture fit, and manual corrections.

## Evidence

- Shaun's successful WordPress run demonstrated the desired experience: a large brief, very few questions, and rapid complete implementation.
- Existing `.github/skills/wordpress-way.md` already contained strong WordPress defaults but duplicated its rule set internally.
- Existing `scripts/git-checkpoint.js` uses interactive `readline`, broad `git add .`, timestamp commits, and unconditional push, making it unsuitable for a deterministic agent loop.
- `docs/DECISION-RIGHTS.md` already delegates focused commits/checkpoints to Athena but previously treated every language choice as consequential, conflicting with mature ecosystem defaults.
- v0.3 established system modelling before architecture, capability composition, local readiness proof, and CI regression gates.
