# SKILL: Documentation

## Purpose

Produce documentation that is accurate, minimal, and maintained alongside the code — not a separate project that rots.

## When to Use

- When completing a feature ready for other developers to use
- When setting up a new repo
- When existing docs are out of date

## Inputs Required

- [ ] `ARCHITECTURE.md` — system overview
- [ ] `TECH-SPEC.md` — stack
- [ ] `PRD.md` — user-facing features

## Documentation Types

### 1. README.md

The entry point. Must answer these questions in order:

1. What is this? (1 paragraph)
2. How do I run it locally? (numbered steps, copy-pasteable commands)
3. How do I run the tests?
4. How do I deploy it?
5. Where do I find more detail? (links to other docs)

**Rule:** If a developer can't be running locally within 10 minutes of reading the README, it's not done.

### 2. API Documentation

Auto-generated from source where possible (OpenAPI, JSDoc, docstrings).

Manually document:
- Authentication flow
- Rate limits
- Error codes and their meanings
- Pagination conventions
- Versioning policy

### 3. Architecture Decision Records (ADRs)

Stored in `ARCHITECTURE.md` or `docs/adr/`.

Format:
```markdown
## ADR-[N]: [Short title]
**Status:** Accepted | Deprecated | Superseded by ADR-[N]
**Date:** YYYY-MM-DD
**Context:** Why was this decision needed?
**Decision:** What was decided?
**Consequences:** What does this enable or constrain?
```

**Rule:** Every significant architectural decision gets an ADR. Future developers must understand why, not just what.

### 4. Runbook

Operational documentation for whoever runs this in production.

Sections:
- How to deploy (step by step)
- How to roll back
- Common errors and how to fix them
- How to check system health
- Escalation path

### 5. Code Comments

**When to comment:**
- Complex algorithms — explain the approach, not the syntax
- Non-obvious business rules — explain the "why"
- Workarounds — explain what's wrong and link to the issue

**When NOT to comment:**
- Obvious code (`// increment counter` on `i++`)
- Type information already in the type signature
- Commented-out code (delete it, git has history)

## Process

### Step 1 — README First

Before any other docs, get the README to the 10-minute standard.

### Step 2 — API Docs

Set up auto-generation. Then manually fill in authentication, errors, and versioning.

### Step 3 — ADRs for Past Decisions

Backfill ADRs for any significant decisions already made in `ARCHITECTURE.md`.

### Step 4 — Runbook

Write the runbook at the same time as the deployment pipeline, not after.

## Output

- `README.md` at repo root
- `docs/api/` for API docs
- ADRs in `ARCHITECTURE.md` or `docs/adr/`
- `docs/runbook.md`

## Quality Check

- [ ] README gets a new developer running in under 10 minutes
- [ ] All API endpoints documented with error codes
- [ ] Every ADR has context (why), not just decision (what)
- [ ] Runbook covers deploy, rollback, and common errors
- [ ] No commented-out code in the codebase
