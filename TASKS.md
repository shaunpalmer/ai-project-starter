# TASKS.md — Task Backlog

> The worker model reads this to pick up work.
> The architect model writes tasks here after planning sessions.
> Tasks must map to acceptance criteria in PRD.md.

---

## Before You Pick Up a Task

If TASKS.md is empty (no tasks in "Active Sprint"), you are still in **PHASE 2: Fill Planning Files**.

Do NOT look for tasks yet. Instead:

1. Read `ONBOARDING.md` — understand the two-phase workflow
2. Produce a Planning Summary (see ONBOARDING.md)
3. Wait for Shaun's approval
4. Fill planning files in this order:
   - `ARCHITECTURE.md` (defines structure first)
   - `TECH-SPEC.md` (defines stack)
   - `DATABASE.md` (if architecture mentions database)
   - `DATA-FLOW.md` (if architecture mentions data movement)
   - `TASKS.md` (fill with first useful build slice + 3–5 tasks)
   - `AI-NOTES.md` (record key decisions)
5. Wait for Shaun's second approval
6. Only THEN proceed to **PHASE 3: Pick up a task**

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| `[ ]`  | Pending |
| `[~]`  | In progress |
| `[x]`  | Done |
| `[-]`  | Blocked |
| `[!]`  | Needs review |

---

## Instructions for the Worker Model (PHASE 3: Coding)

Before picking up any task:

1. Read `AGENTS.md` — understand your role and constraints.
2. Read `ARCHITECTURE.md` — know where code goes.
3. Read `TECH-SPEC.md` — know the stack you must use.
4. Pick the highest-priority `[ ]` task from the Active Sprint.
5. Mark it `[~]` before starting.
6. Do not deviate from the stack in `TECH-SPEC.md`.
7. Do not create files or folders not in `ARCHITECTURE.md` without updating it first.
8. Mark it `[x]` only when acceptance criteria are met and you have tested it.
9. If blocked, mark it `[-]` and add a row to the Blocked table.

---

## Active Sprint

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | | Architect | `[ ]` | Fill in after Phase 2 planning is complete |

---

## Backlog

| # | Task | Priority | Skill | Notes |
|---|------|----------|-------|-------|
| | | High | | |
| | | Medium | | |
| | | Low | | |

---

## Blocked

| # | Task | Blocker | Waiting on |
|---|------|---------|-----------|
| | | | |

---

## Done

| # | Task | Completed | Notes |
|---|------|-----------|-------|
| | | | |

---

## Task Template

When the architect adds a task, use this format:

```
### TASK-[N]: [Short title]

**Status:** [ ]
**Priority:** High / Medium / Low
**Skill:** [skill folder name, or n/a]
**Assigned to:** Worker / Architect / [person]
**Acceptance criteria from PRD:** [link to user story or criterion]

**Description:**
[What needs to be done — one paragraph max. Be specific about inputs and outputs.]

**Acceptance criteria:**
- [ ] [Specific, testable outcome]
- [ ] [Specific, testable outcome]
- [ ] [Edge case handled]

**Definition of done:**
- [ ] Code written and working
- [ ] Manual test passed
- [ ] No secrets in code
- [ ] ARCHITECTURE.md updated if new files/folders were created
- [ ] AI-NOTES.md updated if decisions/assumptions were made during this task
- [ ] TASKS.md status updated to [x]

**Notes:**
[Anything the worker needs to know that isn't obvious from the description.]
```

---

## Example Task (delete when replacing with real tasks)

```
### TASK-1: Set up project structure

**Status:** [ ]
**Priority:** High
**Skill:** architecture-canvas
**Assigned to:** Worker
**Acceptance criteria from PRD:** Core flow — system initialises without error

**Description:**
Create the folder structure defined in ARCHITECTURE.md.
Create placeholder files for each module.
Install dependencies from TECH-SPEC.md.

**Acceptance criteria:**
- [ ] Folder structure matches ARCHITECTURE.md exactly
- [ ] `pip install -r requirements.txt` (or `npm install`) runs without error
- [ ] Entry point file exists and runs without error
- [ ] .env.example exists with all variables from TECH-SPEC.md

**Definition of done:**
- [ ] Code written and working
- [ ] Manual test: entry point runs
- [ ] ARCHITECTURE.md updated if structure changed
- [ ] AI-NOTES.md updated if decisions were made
- [ ] TASKS.md status updated to [x]
```
