# Project Onboarding — Planning Before Code

## Purpose

This repo uses a planning-first harness.

No human or AI agent should write code until the project has been classified, the planning files have been read, the key gates are resolved, and the first useful build slice is clear.

The goal is simple:

> Build inside the rails before writing files.

---

## Mandatory Read List

Before writing code, read these files **in order**:

1. `PROJECT-INTAKE.md`
2. `AGENTS.md`
3. `HARNESS-LOOP.md`
4. `PROJECT-TYPES.md`
5. `00-PLANNING/DECISIONS-TO-MAKE.md`
6. `ARCHITECTURE.md`
7. `TECH-SPEC.md`
8. `DATABASE.md` (if storage is needed)
9. `DATA-FLOW.md` (if the project moves data)
10. `TASKS.md`
11. `AI-NOTES.md`
12. `00-PLANNING/RESEARCH-NOTES/` (if research notes exist)

**Do not skip the read order.**

**Do not write code from memory.**

**Do not assume the architecture.**

---

## Required Planning Summary

Before code begins, the agent must produce a **Planning Summary**.

The Planning Summary must include:

- **Files read** — list each file with a 1-line summary
- **Key constraints found** — what must not be violated
- **Conflicts found** — any contradictions between files
- **Unresolved decisions** — what still needs Shaun
- **First useful build slice** — the exact name from TASKS.md
- **3 immediate tasks** — the next three things to build
- **Files that must be updated** — before or during implementation
- **Final status** — one of the allowed statuses below

### Allowed Final Statuses

- `READY FOR CODE`
- `NEEDS SHAUN`
- `NEEDS SENIOR DEVELOPER`
- `NEEDS ONE MORE PLANNING LOOP`
- `BLOCKED`

---

## Hands-On Prompts & Markers

### Copyable AI Handoff Prompt

Use this prompt when handing a new project to an AI agent:

```
Do not write any code yet.

Read these files first:

- PROJECT-INTAKE.md
- AGENTS.md
- HARNESS-LOOP.md
- PROJECT-TYPES.md
- 00-PLANNING/DECISIONS-TO-MAKE.md
- ARCHITECTURE.md
- TECH-SPEC.md
- DATABASE.md (if storage is needed)
- DATA-FLOW.md (if the project moves data)
- TASKS.md
- AI-NOTES.md
- 00-PLANNING/RESEARCH-NOTES/ (if research notes exist)

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

### Short Pre-Code Verification Prompt

Before an AI agent writes code, ask:

```
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

### Planning Gate Markers

Use clear markers so humans, agents, and CI checks can understand the project state.

**Recommended marker at the top of `PROJECT-INTAKE.md`:**

```
COMPLETED: true
FILLED_BY: Shaun Palmer
DATE: YYYY-MM-DD
```

**Recommended gate format in `00-PLANNING/DECISIONS-TO-MAKE.md`:**

```
Gate: Project type
STATUS: RESOLVED
DECIDED: WordPress plugin
RATIONALE: The project installs into WordPress and uses WP admin screens.
```

```
Gate: Architecture shape
STATUS: RESOLVED
DECIDED: Modular WordPress plugin with thin root file, main plugin class, services, repositories, and adapters.
RATIONALE: Keeps WordPress hooks at the edge and business logic testable.
```

**Allowed Gate Statuses:**

- `STATUS: RESOLVED`
- `STATUS: NEEDS_SHAUN`
- `STATUS: NEEDS_SENIOR_DEVELOPER`
- `STATUS: DEFERRED`

**Do not use vague statuses** such as "maybe", "sort of", "probably", or "later".

---

### AI-NOTES.md Format

Entries should include:

- **DATE** — when the note was created (YYYY-MM-DD)
- **DECISION** or **ASSUMPTION** — what was decided/assumed
- **RATIONALE** — why this decision was made
- **WHO DECIDED** — which agent or person made it

**Unresolved items go in an "Unresolved" section:**

```
## Unresolved

- DATE: 2026-07-03
  ASSUMPTION: Using SQLite for initial builds to avoid DevOps overhead
  RATIONALE: This is a single-user tool; schema is simple
  WHO DECIDED: Shaun + Claude
  STATUS: UNRESOLVED — needs DBAs for prod scaling plan
```

**Once resolved, move to a "Resolved" section with resolution date:**

```
## Resolved

- DATE: 2026-07-02 | RESOLVED: 2026-07-03
  DECISION: Authentication via JWT tokens (no sessions)
  RATIONALE: Stateless, scales, works with API clients
  WHO DECIDED: Shaun
```

Keep this file updated so context is never lost between agent calls.

---

## When Coding May Start

Coding may start only when **all** of these are true:

- [ ] `PROJECT-INTAKE.md` is completed (includes `COMPLETED: true`)
- [ ] `DECISIONS-TO-MAKE.md` has all required gates marked `STATUS: RESOLVED`, or non-blocking gates are clearly marked `STATUS: DEFERRED`
- [ ] `ARCHITECTURE.md` defines where files belong
- [ ] `TECH-SPEC.md` defines the stack and runtime (Machine-Readable Stack Markers are filled)
- [ ] `DATABASE.md` is filled (if storage is needed)
- [ ] `DATA-FLOW.md` is filled (if data moves through the system)
- [ ] `TASKS.md` names the first useful build slice (includes `FIRST BUILD SLICE:`)
- [ ] `AI-NOTES.md` records unresolved items and planning decisions
- [ ] The agent has produced a Planning Summary
- [ ] No blocker remains with `NEEDS_SHAUN` or `NEEDS_SENIOR_DEVELOPER`

---

## Final Rule

1. **Read first.**
2. **Plan second.**
3. **Verify third.**
4. **Code fourth.**

If the project is unclear, use the harness loop.

If the blocker is small and safe, make a recorded assumption (in AI-NOTES.md).

If the blocker changes architecture, cost, risk, stack, data, or security, ask Shaun.
