# SKILL: PRD Writer

## Purpose

Guide the architect model through producing a complete, unambiguous Product Requirements Document that a worker model can act on without follow-up questions.

## When to Use

- Starting a new project
- Pivoting an existing product
- Scoping a major new feature

## Inputs Required

Before running this skill, gather (from PROJECT-INTAKE.md):

- [ ] One-line pitch
- [ ] Project type (from PROJECT-INTAKE.md, routed via PROJECT-TYPES.md)
- [ ] Target user (specific, not generic)
- [ ] The one most important thing it must do (first slice)
- [ ] "Done means" sentence
- [ ] Known constraints (time, budget, tech, compliance)

---

## Process

### Step 1 — Problem Framing

Read what exists in PROJECT-INTAKE.md. Do NOT re-ask questions already answered there.
Fill gaps with reasonable inferences for the project type — flag each inference clearly.

Confirm the problem is real by checking:
- Is there a named user?
- Is there a named pain?
- Is there a specific outcome the user wants?

If any of these is missing, ask one focused question. One, not five.

### Step 2 — User Stories

Write at least one story per user type. Format:

```
As a [specific user], I want to [specific action] so that [specific outcome].

Acceptance criteria:
  - Given [context], when [event], then [result].
  - Given [context], when [edge case], then [result].
```

Do not write generic stories ("As a user, I want to log in").
Write stories that are specific to this project's problem.

### Step 3 — Success Metrics

Define at least one quantitative metric per goal. Each metric must be:
- Measurable without manual effort
- Time-bounded or countable
- Realistic for the project size

Examples of good metrics:
- "Scraper completes 100 URLs in under 2 minutes"
- "Admin can add a new product in under 30 seconds"
- "Zero manual steps required to produce the daily report"

### Step 4 — Non-Goals

Explicitly list what this project will NOT do. Common ones to check:
- Multi-user / multi-tenant (if it's a solo tool)
- Mobile app version
- Real-time features (if not needed)
- Internationalisation / multiple languages
- Public-facing features (if it's internal)

### Step 5 — Open Questions

List any unresolved decisions that would block architecture or implementation.
Each open question must have an owner and a resolution method.

---

## Output

A completed `PRD.md` at the repo root.

---

## Worked Example

**Input from PROJECT-INTAKE.md:**
- Q1: "Price Tracker is a scraper that monitors competitor product prices for small e-commerce shops."
- Q2: Scraper / data pipeline
- Q3: Me (shop owner), daily, non-technical
- Q4: Python
- Q5: "Scrape prices from 3 URLs and save to CSV."
- Q6: In = list of URLs. Out = CSV file.
- Q7: No database needed (CSV is fine for now)
- Q10: "Done means: I run one command each morning and get a CSV of competitor prices, without opening a browser."

**Resulting PRD.md (abbreviated):**

```markdown
## Problem Statement

Small e-commerce shop owners manually check competitor prices by visiting multiple
websites each morning. This takes 20–30 minutes per day, is error-prone, and often
gets skipped when busy.

## Target Users

| User type | Description | Key pain point |
|-----------|-------------|---------------|
| Primary | Solo e-commerce shop owner | Wastes 30 min/day checking prices manually |

## Goals

1. Automatically collect prices from a user-defined list of product URLs
2. Produce a single CSV file per run with date-stamped prices
3. Run with a single command, no browser required

## Non-Goals

- No dashboard or visualisation (CSV only, for now)
- No scheduling — user runs it manually each morning
- No multi-user support
- No alerting or notifications

## User Stories

### Core Flow

As a shop owner,
I want to run one command that fetches prices from my competitor URLs,
So that I get a timestamped CSV without opening a browser.

Acceptance criteria:
  - Given a URLs file exists, when I run `python scraper.py`, then a CSV is created in /output/.
  - Given a URL is unreachable, when the scraper runs, then it logs the failure and continues.
  - Given the scraper completes, when I open the CSV, then each row has: URL, product name, price, date.

## Success Metrics

| Metric | Target |
|--------|--------|
| Scraper completes for 10 URLs | Under 60 seconds |
| CSV produced per run | Yes, always |
| Manual browser visits needed | Zero |
```

---

## Quality Check

Before marking the PRD done, verify:

- [ ] Problem statement is one paragraph max
- [ ] Every user story has at least 2 acceptance criteria (happy path + one failure)
- [ ] Every goal has a metric
- [ ] Non-goals are listed
- [ ] No open questions remain unassigned
- [ ] Nothing in the PRD contradicts PROJECT-INTAKE.md answers
