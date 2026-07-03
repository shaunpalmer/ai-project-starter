# File: `ONBOARDING.md`

# Project Onboarding — Planning Before Code

## Purpose

This repo uses a planning-first harness.

No human or AI agent should write code until the project has been classified, the planning files have been read, the key gates are resolved, and the first useful build slice is clear.

The goal is simple:

> Build inside the rails before writing files.

---

## Mandatory Read List

Before writing code, read these files in order:

1. `PROJECT-INTAKE.md`
2. `AGENTS.md`
3. `HARNESS-LOOP.md`
4. `PROJECT-TYPES.md`
5. `00-PLANNING/DECISIONS-TO-MAKE.md`
6. `ARCHITECTURE.md`
7. `TECH-SPEC.md`
8. `DATABASE.md` if storage is needed
9. `DATA-FLOW.md` if the project moves data
10. `TASKS.md`
11. `AI-NOTES.md`
12. `00-PLANNING/RESEARCH-NOTES/` if research notes exist

Do not skip the read order.

Do not write code from memory.

Do not assume the architecture.

---

## Required Planning Summary

Before code begins, the agent must produce a Planning Summary.

The Planning Summary must include:

* Files read
* 1-line summary of each required file
* Key constraints found
* Conflicts found
* Unresolved decisions
* First useful build slice
* 3 immediate tasks
* Files that must be updated before or during implementation
* Final status

Allowed final statuses:

* `READY FOR CODE`
* `NEEDS SHAUN`
* `NEEDS SENIOR DEVELOPER`
* `NEEDS ONE MORE PLANNING LOOP`
* `BLOCKED`

---

## Copyable AI Handoff Prompt

Use this prompt when handing a new project to an AI agent:

```md
Do not write any code yet.

Read these files first:

- PROJECT-INTAKE.md
- AGENTS.md
- HARNESS-LOOP.md
- PROJECT-TYPES.md
- 00-PLANNING/DECISIONS-TO-MAKE.md
- ARCHITECTURE.md
- TECH-SPEC.md
- DATABASE.md if storage is needed
- DATA-FLOW.md if the project moves data
- TASKS.md
- AI-NOTES.md
- 00-PLANNING/RESEARCH-NOTES/ if research notes exist

For each file, give:

1. A 1-line summary
2. 2–3 key facts or constraints
3. Any conflicts or unresolved decisions

Then produce a Planning Summary with:

- Exact files read
- Required unresolved decisions
- Proposed first useful build slice
- 3 next tasks
- Any questions that truly require Shaun
- Whether the project is READY FOR CODE

Do not write code until the planning gates are resolved.
```

---

## Short Pre-Code Verification Prompt

Before an AI agent writes code, ask:

```md
Confirm before coding:

1. Which planning files did you read?
2. What lines, headings, or checklist items prove coding can start?
3. Are all required gates in DECISIONS-TO-MAKE.md resolved?
4. Is ARCHITECTURE.md clear enough to know where files go?
5. Is TECH-SPEC.md clear enough to know the stack?
6. Is the first useful build slice named in TASKS.md?
7. Are there any NEEDS_SHAUN or NEEDS SENIOR DEVELOPER blockers?

If any required gate is unresolved, stop.
```

---

## Planning Gate Markers

Use clear markers so humans, agents, and CI checks can understand the project state.

Recommended marker at the top of `PROJECT-INTAKE.md`:

```md
COMPLETED: true
FILLED_BY: Shaun Palmer
DATE: YYYY-MM-DD
```

Recommended gate format in `00-PLANNING/DECISIONS-TO-MAKE.md`:

```md
Gate: Project type
STATUS: RESOLVED
DECIDED: WordPress plugin
RATIONALE: The project installs into WordPress and uses WP admin screens.

Gate: Architecture shape
STATUS: RESOLVED
DECIDED: Modular WordPress plugin with thin root file, main plugin class, services, repositories, and adapters.
RATIONALE: Keeps WordPress hooks at the edge and business logic testable.
```

Allowed gate statuses:

* `STATUS: RESOLVED`
* `STATUS: NEEDS_SHAUN`
* `STATUS: NEEDS_SENIOR_DEVELOPER`
* `STATUS: DEFERRED`

Do not use vague statuses such as “maybe”, “sort of”, “probably”, or “later”.

---

## When Coding May Start

Coding may start only when:

* `PROJECT-INTAKE.md` is completed.
* `DECISIONS-TO-MAKE.md` has all required gates marked `STATUS: RESOLVED`, or non-blocking gates are clearly marked `STATUS: DEFERRED`.
* `ARCHITECTURE.md` defines where files belong.
* `TECH-SPEC.md` defines the stack and runtime.
* `DATABASE.md` is filled if storage is needed.
* `DATA-FLOW.md` is filled if data moves through the system.
* `TASKS.md` names the first useful build slice.
* `AI-NOTES.md` records unresolved items and planning decisions.
* The agent has produced a Planning Summary.
* No blocker remains with `NEEDS_SHAUN` or `NEEDS_SENIOR_DEVELOPER`.

---

## Final Rule

Read first.

Plan second.

Verify third.

Code fourth.

If the project is unclear, use the harness loop.

If the blocker is small and safe, make a recorded assumption.

If the blocker changes architecture, cost, risk, stack, data, or security, ask Shaun.
