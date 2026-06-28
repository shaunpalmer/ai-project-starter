# RESEARCH-NOTES README

## Purpose

This folder is for rough research, collected ideas, competing options, examples, notes, links, drafts, AI outputs, and thinking-in-progress.

Research notes are not automatically instructions.

The AI’s job is not to obey everything in this folder.

The AI’s job is to process it.

Use this folder when Shaun is still working through a problem and has not yet decided the final architecture, stack, database, workflow, or implementation approach.

---

## Core Rule

Do not treat research as a decision.

Research informs the decision.

Confirmed decisions must be recorded in the correct planning file.

Final architecture belongs in `ARCHITECTURE.md`.

Final stack choices belong in `TECH-SPEC.md`.

Final database decisions belong in `DATABASE.md`.

Final build steps belong in `TASKS.md`.

Session notes, unresolved issues, and decision rationale belong in `AI-NOTES.md`.

---

## What Belongs Here

Put rough material here, including:

* Research notes
* Option comparisons
* Copied AI outputs
* Links and summaries
* Library or framework notes
* API notes
* Design alternatives
* Architecture sketches
* Database ideas
* Scraping strategy notes
* WordPress plugin ideas
* Automation ideas
* Open questions
* Rejected ideas
* “Maybe this could work” notes

This folder is allowed to be messy.

The final project files are not.

---

## What Does Not Belong Here

Do not use this folder as the final source of truth for:

* Approved architecture
* Final database schema
* Final stack decisions
* Final task order
* Production code
* Secrets or credentials
* Deployment instructions
* Confirmed business rules

If a research note becomes a decision, move the decision into the proper planning file and record the rationale in `AI-NOTES.md`.

---

## Research Note Classification

When reading this folder, the AI must classify each relevant item as one of:

| Type                 | Meaning                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| `CONFIRMED_DECISION` | A clear decision Shaun has deliberately approved                                |
| `RESEARCH_NOTE`      | Useful information, but not a decision                                          |
| `OPTION`             | A possible approach under consideration                                         |
| `ASSUMPTION`         | Something believed to be true but not confirmed                                 |
| `RISK`               | Something that could cause failure, delay, cost, confusion, or maintenance pain |
| `OPEN_QUESTION`      | Something that needs Shaun or further investigation                             |
| `REJECTED_IDEA`      | Something considered but not chosen                                             |
| `CONFLICT`           | Something that disagrees with another note, file, or decision                   |
| `EVIDENCE`           | A fact, example, test result, source, or observation that supports a decision   |

If the type is unclear, treat the item as `RESEARCH_NOTE`, not as a decision.

---

## Conflict and Research Loop

When this folder contains material relevant to the project, the agent must use this loop:

1. **Collect**

   * Read the relevant project files.
   * Read the relevant research notes.
   * Identify which notes affect the current project, feature, architecture, stack, data flow, or task.

2. **Classify**

   * Mark each important item as decision, option, assumption, risk, evidence, conflict, or unresolved question.
   * Do not promote rough notes into decisions.

3. **Compare**

   * Find contradictions, overlaps, trade-offs, missing context, hidden dependencies, and duplicated ideas.
   * Compare options against Shaun’s known stack, project type, maintainability, cost, and first useful build slice.

4. **Resolve**

   * Decide whether the issue is:

     * `SAFE_TO_RESOLVE`
     * `NEEDS_SHAUN`
     * `NEEDS_ARCHITECTURE_UPDATE`
     * `NEEDS_TECH_SPEC_UPDATE`
     * `NEEDS_DATABASE_UPDATE`
     * `NEEDS_PROTOTYPE`
     * `DEFERRED`
     * `REJECTED`

5. **Record**

   * Update the correct planning file.
   * Record the decision and rationale in `AI-NOTES.md`.
   * Record unresolved items clearly.

6. **Continue**

   * Continue only after each relevant conflict has a status.
   * Do not move to code while major conflicts remain unresolved.

---

## Decision Promotion Rule

A research note becomes a project decision only when:

* It solves a real project problem.
* It fits the project type.
* It does not conflict with approved architecture.
* It is maintainable by Shaun.
* It has acceptable complexity.
* It supports the first useful build slice or a clearly planned future slice.
* Shaun has confirmed it, or it is safely inferable from the approved planning docs.
* It is recorded in the correct source-of-truth file.

Until then, it remains research.

---

## Conflict Priority Rule

When research notes conflict with project files, use this priority:

1. Confirmed instruction from Shaun
2. `ARCHITECTURE.md` for system structure
3. `TECH-SPEC.md` for stack and tooling
4. `DATABASE.md` for storage and schema
5. `DATA-FLOW.md` for movement of data
6. `DECISIONS-TO-MAKE.md` for planning gates
7. `PRD.md` and `PROJECT-INTAKE.md` for intent and scope
8. `TASKS.md` for execution order
9. `AI-NOTES.md` for history, rationale, and unresolved issues
10. `RESEARCH-NOTES/` for rough material

Important: quality architecture beats casual comments.

If Shaun’s latest comment clearly changes the project, ask whether the architecture should be updated before implementing the change.

---

## File Naming Suggestions

Use simple names that show what the note is about.

Examples:

```text
database-options.md
plugin-structure-options.md
scraping-libraries.md
api-provider-notes.md
frontend-approach.md
rejected-ideas.md
open-questions.md
```

For larger projects, group notes by topic:

```text
RESEARCH-NOTES/
├── database-options.md
├── architecture-options.md
├── library-comparison.md
├── risks.md
├── rejected-ideas.md
└── open-questions.md
```

---

## Research Summary Template

When processing research notes, the AI should produce a short summary like this:

```md
## Research Summary

### Relevant Notes Read

- `filename.md` — why it matters

### Options Found

| Option | Pros | Cons | Fit |
|---|---|---|---|

### Conflicts Found

| Conflict | Files / Notes Involved | Status | Action |
|---|---|---|---|

### Recommended Decision

State the recommended decision.

### Rationale

Explain why this decision fits the project type, Shaun’s stack, architecture quality, maintainability, and first useful build slice.

### Updates Required

- [ ] `ARCHITECTURE.md`
- [ ] `TECH-SPEC.md`
- [ ] `DATABASE.md`
- [ ] `DATA-FLOW.md`
- [ ] `TASKS.md`
- [ ] `AI-NOTES.md`
```

---

## Final Rule

This folder is for thinking.

Planning files are for decisions.

Architecture is for structure.

Tasks are for execution.

Do not let messy research leak into clean architecture.

Process it first.
