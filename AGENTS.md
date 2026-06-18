# AGENTS.md — AI Operating Manual

You are working in Shaun's project-starter system.

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

- [ ] PROJECT-INTAKE.md answers are clear (project type, commercial reason, scope)
- [ ] PROJECT-TYPES.md has been followed (correct patterns, database, structure)
- [ ] All 5 gates in DECISIONS-TO-MAKE.md are cleared
- [ ] PRD.md is filled with problem, users, goals, metrics, stories
- [ ] ARCHITECTURE.md shows system boundaries, layers, directory structure
- [ ] TECH-SPEC.md lists the stack with justification
- [ ] DATA-FLOW.md is filled (if project moves data)
- [ ] DATABASE.md has schema (if storage is needed)
- [ ] TASKS.md has the build backlog in priority order
- [ ] AI-NOTES.md has a Change Log entry for this planning session, with decisions and any UNRESOLVED items
- [ ] You have asked Shaun only the questions you could not answer from PROJECT-INTAKE.md

If any box is unchecked, keep planning. Do not move to code.

---

## Prohibited Actions

- Do not write code before the 5 gates are cleared
- Do not prescribe stack choices not in TECH-SPEC.md
- Do not invent architecture not chosen in DECISIONS-TO-MAKE.md or PROJECT-TYPES.md
- Do not skip database selection reasoning — justify it by project type
- Do not push to `main` directly (if this is a git repo)
- Do not expose secrets in code or comments — `.env` only
- Do not add patterns for their own sake — only when they reduce complexity
- Do not guess what Shaun wants — ask instead

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
