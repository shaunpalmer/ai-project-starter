# Architecture Hypothesis

HYPOTHESIS_STATUS: ACCEPTED

## Primary shape

Evolve the existing zero-dependency Node control plane with an engineering-default policy layer and a deterministic Git controller. Do not embed another Python harness or orchestration framework inside DSH. Confidence: high.

## Capabilities

- Central engineering-default precedence and question budget.
- Automatic ecosystem skill binding from confirmed capabilities.
- Consolidated authoritative WordPress rules.
- Deterministic non-interactive Git status/preflight/init/branch/checkpoint/connect/push commands.
- Existing-machine authentication only; no credential storage.
- Regression tests for branch safety, explicit staging, protected-branch refusal, and credential-bearing URL rejection.
- Existing infer-before-implement discovery, readiness gates, memory, destination, and CI remain unchanged unless integration evidence requires a focused extension.

## Candidate patterns

- Policy/default table for routine decisions.
- Capability-to-skill routing.
- Deterministic command controller around Git rather than prompt-driven shell improvisation.
- Fail-closed guards for protected branches, broad staging, embedded credentials, and remote verification.
- Focused checkpoint commits rather than whole-worktree commits.

## Assumptions

- Git is available on normal development machines and GitHub Actions runners.
- DSH can invoke ordinary Node scripts in the project/harness workspace.
- Existing Git/SSH/GitHub CLI credentials are the correct authentication source; the harness should never manage secrets itself.
- A mature ecosystem default such as WordPress->PHP is a routine choice; departing materially from it remains owner-controlled.

## Alternatives considered

1. Install BMad/BMad Loop inside the harness — rejected because it creates a harness-inside-a-harness-inside-a-harness and duplicates control responsibilities.
2. Rewrite the control plane in Python — rejected because the existing Node controller is tested, dependency-free, and the implementation language of the controller does not dictate product languages.
3. Keep Git as an agent prompt convention — rejected because interactive prompts and broad staging already caused unreliable behaviour.
4. Let the agent choose any stack each run — rejected because mature ecosystems already provide high-quality defaults and repeated questions are part of the observed failure mode.

## Bounded proof

- Existing 21-test v0.3 suite must remain green.
- Add VCS tests that prove local init uses a non-protected branch, preflight fails explicitly when identity/required remote are absent, safe branch creation works, focused checkpoints stage only declared files, broad implicit staging is refused, protected branches are refused, and credential-bearing remote URLs are rejected before persistence/network use.
- Run the complete suite plus `control:verify` and `memory:resume` on Node 20/22/24 in GitHub Actions.

## Proposed architecture

`ENGINEERING-DEFAULTS.md` owns routine language/style/architecture/testing/failure/version-control defaults. `AGENTS.md` and `docs/DECISION-RIGHTS.md` establish zero routine-question behaviour and distinguish applying a default from materially deviating from one. `.github/skills/skill-router/SKILL.md` automatically binds ecosystem rules when capabilities are confirmed. `.github/skills/wordpress-way.md` becomes one non-duplicated authoritative WordPress contract.

`scripts/vcs-control.js` is a zero-dependency, non-interactive Git control surface. It uses `GIT_TERMINAL_PROMPT=0`, existing machine credentials, explicit file lists for staging, safe non-default branches, remote verification via `git ls-remote`, and hard refusal of force/default-branch managed writes. `package.json` exposes the controller without replacing project-control.

A follow-up integration step may copy/hand off these defaults and VCS controls into generated product projects once the controller itself is proven; that integration should be evidence-driven rather than bundled blindly into the first VCS proof.

## Approval evidence

On 2026-09-09 Shaun explicitly approved the v0.4 direction: engineering defaults, automatic WordPress/scraping/automation decisions, version-control integration using authorised GitHub access, and consolidation of the duplicate WordPress Way. He authorised Athena to proceed without further routine implementation questions. Merge/release remains separately owner-controlled.
