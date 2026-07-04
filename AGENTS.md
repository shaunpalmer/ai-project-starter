# AGENTS.md — AI Operating Manual
Eg:

# Project Intake & Boundary Blueprint

## 1. Core Objective
<!-- Replace this text with a single sentence explaining exactly what this project does. -->

## 2. Technical Stack Constraints
- **Runtime Environment:** Node.js (Latest LTS)
- **Frontend Infrastructure:** 
- **Backend Infrastructure:** 
- **Allowed Third-Party Dependencies:** None (Unless explicitly authorized by the user)

## 3. Strict Project Boundaries (The Anti-SPA Rules)
- DO NOT create complex multi-page routing unless specified.
- DO NOT install global framework wrappers (e.g., heavy state managers) arbitrarily.
- Keep all functional logic isolated to clean, single-purpose files inside `src/`.

## 4. Definition of Done
- Code must run locally without terminal warnings or runtime errors.
- Any new functions must be documented in a local markdown log before a git commit.


## You are working in Shaun's project-starter system.

This folder is yours. You will classify the project, load the right patterns, and plan before writing code. **Do not invent missing architecture. Do not guess. Ask.**

---

## Your Task

You have one job: **Plan the project before any code is written.**

Planning means:
1. Read PROJECT-INTAKE.md (Shaun has filled this)
2. Classify the project type (from PROJECT-TYPES.md)
3. Load the relevant rules and patterns
4. Fill the planning documents (PRD, ARCHITECTURE, TECH-SPEC, TASKS)
5. Stop and ask before writing code

---

## Read Order (in this order, exactly)

1. **PROJECT-INTAKE.md** — Shaun's 5-answer brief. What type is it?
2. **PROJECT-TYPES.md** — Find your project type. What patterns, database, and skills apply?
3. **SHAUN_DEV_PROFILE.md** — Canonical profile: how Shaun thinks, builds, what stack.
4. **00-PLANNING/DECISIONS-TO-MAKE.md** — The 5 gates that must be cleared before coding
5. **ARCHITECTURE-TEMPLATES.md** — Visual OOP + pipeline + DI diagrams to copy from
6. **SHAUN-BUILD-PROFILE.md** — (As needed) concrete code standards
7. **SHAUN_PROJECT_CANVAS.md** — (Optional deeper read) full style guide with examples
8. **AI-NOTES.md** — Working memory: prior change log, decisions, and unresolved questions

Note: the human follows `DAY-1-FLOWCHART.md` to get to handoff. You start at step 1 above.

Then fill the planning docs:

- Fill **PRD.md** using the prd-writer skill (if needed)
- Fill **ARCHITECTURE.md** using the architecture-canvas skill + ARCHITECTURE-TEMPLATES.md diagrams
- Fill **TECH-SPEC.md** using the stack-selector skill (if needed)
- Fill **DATA-FLOW.md** (if the project moves data)
- Fill **DATABASE.md** (if storage is needed)
- Fill **TASKS.md** — the build backlog, first slice first

---

## Key Rules

**Rule 1: Classify before recommending**
Look up the project type in PROJECT-TYPES.md. That tells you:
- What architecture pattern to use
- What database fits
- What skills are relevant
- What structure to recommend

Never prescribe a pattern or database before knowing the project type.

**Rule 2: The 5 gates are non-negotiable**
No code may be written until these are cleared in `00-PLANNING/DECISIONS-TO-MAKE.md`:
1. Project type is known
2. Architecture shape is chosen
3. Source of truth is defined
4. Data flow is mapped
5. First build slice is named

If you cannot clear a gate, ask. Do not invent answers.

**Rule 3: Load skills, don't hard-code trendy choices**
- Do not say "we should use MongoDB" because it's popular
- Do say "this project is document-heavy, so MongoDB makes sense here" (if true)
- Load the skill file only if the project type needs it
- If unsure whether a skill applies, ask Shaun

**Rule 4: Database choice is determined by project type**
From PROJECT-TYPES.md:
- WordPress plugin → MariaDB/MySQL (required by WordPress)
- Local automation → SQLite (simple, zero setup)
- Scraping pipeline → SQLite for cache, CSV/JSON for export
- Web app → MySQL/MariaDB or PostgreSQL (depends on scale)
- Pure data processing → in-memory or CSV
- Document-heavy app → MongoDB only if flexible JSON schema truly helps

Do not choose based on what sounds interesting.

**Rule 5: Ask when source-of-truth is unclear**
Priority order when documents conflict:
1. PROJECT-INTAKE.md (Shaun's answers)
2. DECISIONS-TO-MAKE.md (gates already cleared)
3. PRD.md (product intent)
4. ARCHITECTURE.md (chosen shape)
5. TECH-SPEC.md (stack decisions)

If two documents contradict, ask Shaun which one is right before proceeding.

**Rule 6: Do not invent missing files or patterns**
If ARCHITECTURE.md doesn't say where the code goes, ask.
If the project type needs something not in PROJECT-TYPES.md, flag it.
If a decision is missing, fill the gap in the planning docs. Do not code around it.

**Rule 7: Maintain AI-NOTES.md (working memory)**
`AI-NOTES.md` is the project's persistent notebook. It is part of standing orders:
- Read it on entry — prior decisions and the change log live there.
- Append a Change Log row for every meaningful change (code, structure, schema, decision).
- Record each decision with a one-line rationale, so the next session does not re-derive it.
- Park anything UNRESOLVED there and flag it to Shaun. Do not guess past it.
- Keep entries short and dated. Newest first. Append; do not rewrite history.

---

## Skills Reference

Skills are available in `.github/skills/`. Load them only when the project type calls for them.

| Skill | Load when |
|-------|-----------|
| `prd-writer` | PRD needs to be filled |
| `architecture-canvas` | ARCHITECTURE needs design |
| `stack-selector` | TECH-SPEC stack choices need justification |
| `database-selection` | DATABASE choice needs reasoning |
| `wordpress-plugin` | Project type is WordPress plugin |
| `scraping-pipeline` | Project type is scraping pipeline |
| `api-design` | Project includes API design |
| `interface-design` | UI/UX contracts need definition |
| `code-review` | Code has been written and needs review |
| `testing-plan` | Test strategy needs to be written |
| `documentation` | Docs need to be written |

Do not load all skills. Load only what you need.

---

## What "Done" Looks Like (Planning Phase)

After you have read the four files and filled the planning docs:

- [ ] HARNESS-LOOP.md has been applied: Discovery, Planning, Verification, and either Ship or Blocked            status are clear
- [ ] PROJECT-INTAKE.md answers are clear enough to identify project type, commercial reason, scope, and          first useful outcome.
- [ ] PROJECT-TYPES.md has been followed for the correct project type, architecture pattern, database             direction, and relevant skills.
- [ ] All 5 gates in 00-PLANNING/DECISIONS-TO-MAKE.md are cleared:
      Project type is known.
      Architecture shape is chosen.
      Source of truth is defined.
      Data flow is mapped.
      First build slice is named.
- [ ] PRD.md is filled with the problem, users, goals, success metrics, constraints, and user stories.
- [ ] ARCHITECTURE.md shows system boundaries, layers, directory structure, dependencies, and integration         points
- [ ] TECH-SPEC.md lists the stack with justification
- [ ] DATA-FLOW.md is filled if the project moves, imports, exports, transforms,
- [ ] TECH-SPEC.md lists the chosen stack with practical justification.
- [ ] AI-NOTES.md has a Change Log entry for this planning session, with decisions and any UNRESOLVED items
- [ ] You have asked Shaun only the questions you could not answer from PROJECT-INTAKE.md
- [ ] The agent can clearly state one of these outcomes:
      READY FOR CODE
      BLOCKED — NEEDS SHAUN
      NEEDS ONE MORE PLANNING LOOP
     If any box is unchecked, keep planning. Do not move to code.

---

## ## Prohibited Actions

* Do not write code before the 5 planning gates are cleared.
* Do not move to code while the planning status is `BLOCKED` or `NEEDS ONE MORE PLANNING LOOP`.
* Do not skip `HARNESS-LOOP.md`.
* Do not keep looping indefinitely. After two failed attempts to resolve the same blocker, stop and ask Shaun.
* Do not invent missing architecture, source-of-truth rules, database choices, external services, credentials, deployment targets, or business logic.
* Do not prescribe stack choices that are not justified in `TECH-SPEC.md`.
* Do not choose a database because it is fashionable. Justify database choice by project type, data shape, data lifetime, and operational needs.
* Do not add patterns for their own sake. Use patterns only when they reduce complexity, improve testability, or protect future changes.
* Do not rewrite unrelated files while completing a planning, coding, or review task.
* Do not change architecture, stack, schema, or source-of-truth rules without updating the relevant planning document and `AI-NOTES.md`.
* Do not ignore conflicts between project files. Use the conflict-resolution rules before proceeding.
* Do not push directly to `main` if this is a git repository.
* Do not expose secrets in code, comments, docs, logs, examples, or commits. Use `.env` and safe placeholders only.
* Do not guess what Shaun wants when the next step changes project direction, cost, complexity, or risk. Ask.


---

## Shaun's Development Profile (Quick Reference)

**Project types you build:** WordPress plugins, PHP web tools, TypeScript/Python automation, scraping pipelines, dashboards, lead-gen tools, networking scripts.

**Stack:** PHP, JavaScript, TypeScript, Python, HTML, CSS, Bootstrap, Tailwind, WordPress, SQLite, MySQL/MariaDB, JSON, CSV.

**Preferred patterns:** OOP over procedural, single responsibility, adapter, factory, envelope, pipeline, clear contracts, clean folders.

**Database rule:** Choose by project type and data lifetime, not by fashion.

**Code philosophy:** Build the map first. Define patterns first. Let the AI write code inside the rails.

For details, read `SHAUN-BUILD-PROFILE.md`.

---

## Your Checklist Before Handing Back to Shaun

- [ ] I have read PROJECT-INTAKE.md
- [ ] I have looked up the project type in PROJECT-TYPES.md
- [ ] I have not invented missing architecture
- [ ] I have not prescribed a database without project-type reasoning
- [ ] I have cleared all 5 gates
- [ ] I have asked Shaun about gaps, not guessed answers
- [ ] I have updated AI-NOTES.md (change log + decisions + unresolved)
- [ ] I am ready for code to be written
## Add to Skills Reference

| Skill              | Load when                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `complexity-brake` | Before adding new files, classes, dependencies, database tables, build tooling, or abstractions |

---

## Add to Key Rules

**Rule 8: Run the complexity brake before execution**

Before writing code, the agent must check whether the proposed code, file, class, table, dependency, framework, or abstraction actually needs to exist.

Use `.github/skills/complexity-brake/SKILL.md` when the implementation might become larger than the first useful build slice requires.

The complexity brake must not remove security, validation, escaping, permissions, error handling, data protection, accessibility, or required verification.

Small unsafe code is not acceptable.

The goal is the smallest safe implementation that fits the approved architecture.
