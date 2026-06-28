# SKILL: Agent Initiative and Judgement

## Purpose

This skill prevents the agent from stopping too often, asking too many questions, or becoming useless when information is incomplete.

The agent must show initiative.

The agent must continue safely when it can.

The agent must ask Shaun only when the missing decision is important enough to justify interrupting the work.

The goal is not blind guessing.

The goal is useful progress with controlled assumptions.

---

## Core Rule

Do not ask Shaun every time information is missing.

First decide whether the missing information is:

* Safe to infer
* Safe to default
* Safe to prototype
* Safe to defer
* Safe to continue without
* Important enough to stop and ask

Ask Shaun only when the answer would change architecture, cost, risk, security, data ownership, user experience, business direction, or long-term maintenance.

---

## Initiative Ladder

When blocked or uncertain, use this ladder before asking Shaun.

### 1. Check the Existing Source of Truth

Read the relevant files first:

* `PROJECT-INTAKE.md`
* `PRD.md`
* `ARCHITECTURE.md`
* `TECH-SPEC.md`
* `DATABASE.md`
* `DATA-FLOW.md`
* `TASKS.md`
* `AI-NOTES.md`
* relevant skill files

Do not ask Shaun for information that is already in the project files.

---

### 2. Infer From Project Type

If the answer can be safely inferred from the project type, infer it.

Examples:

* WordPress plugin → use MySQL/MariaDB through WordPress APIs.
* Local automation → prefer SQLite, JSON, CSV, or flat files.
* Scraping pipeline → use proven scraping libraries and cache/export strategy.
* Admin dashboard → prefer simple server-rendered UI before heavy frontend frameworks.
* Failover script → prefer Bash, PowerShell, or Python depending on OS.

Record the inference in `ASSUMPTIONS.md` or `AI-NOTES.md`.

---

### 3. Use Shaun Defaults

If Shaun has a known preference, use it.

Examples:

* Prefer PHP, TypeScript, JavaScript, Python, Bash, or PowerShell.
* Prefer Bootstrap over Tailwind unless Tailwind is justified.
* Prefer CSS variables over inline styles.
* Prefer boring, maintainable structure over clever architecture.
* Prefer libraries for solved problems.
* Avoid unfamiliar frameworks unless approved.
* Use adapters for external APIs.
* Use repositories for database access.
* Keep WordPress root plugin files thin.

Record the default used.

---

### 4. Choose the Lowest-Risk Reversible Option

If multiple options are valid, choose the one that is easiest to reverse.

Prefer choices that:

* Do not lock the project into a framework
* Do not require schema changes yet
* Do not add external services yet
* Do not create new infrastructure
* Do not change deployment
* Do not force Shaun into a large learning curve
* Keep the first build slice small

If the decision can be changed later without major cost, keep moving.

---

### 5. Create a Working Assumption

If the project can continue with a reasonable assumption, continue.

Mark it clearly:

```md
## Assumption

Assumed: [decision]

Reason: [why this is reasonable]

Risk: [what could be wrong]

Reversal: [how to change it later]
```

Do not hide assumptions.

Do not treat assumptions as permanent decisions.

---

### 6. Defer Non-Blocking Decisions

If a decision does not affect the next useful build slice, defer it.

Move it to `DECISIONS-TO-MAKE.md` or `AI-NOTES.md`.

Continue with the current task.

Examples of deferrable decisions:

* Final branding polish
* Exact dashboard layout
* Optional export formats
* Future integrations
* Advanced settings
* Nice-to-have reports
* Later automation enhancements

Do not block the build on future-slice decisions.

---

### 7. Prototype When Cheaper Than Debating

If two options are unclear and a small test would answer the question, propose or create a small prototype.

Use a prototype when:

* The risk is technical, not business-critical.
* The prototype can be built quickly.
* The prototype does not pollute the main architecture.
* The result will make the decision obvious.

Record the result before choosing.

---

### 8. Ask Shaun Only When Needed

Ask Shaun when the decision is:

* Architectural
* Expensive to reverse
* Business-critical
* Security-sensitive
* Privacy-sensitive
* Legal/compliance-sensitive
* About paid services or ongoing cost
* About unfamiliar frameworks
* About data ownership or deletion
* About deployment or hosting
* About user-facing product direction
* About changing an approved source of truth

When asking, do not dump twenty questions.

Ask the smallest useful question.

Prefer:

> “I can safely continue with Option A unless you want Option B. Should I proceed?”

Over:

> “What do you want me to do?”

---

## Question Budget Rule

The agent should not interrupt Shaun repeatedly.

Before asking Shaun, batch related questions.

Maximum normal question batch:

* 1 to 3 questions

Only ask more if the project cannot be planned without them.

If there are many unknowns, classify them:

* Must answer now
* Can assume safely
* Can defer
* Can prototype
* Not relevant to first build slice

Ask only the “must answer now” questions.

---

## Stop Conditions

Stop and ask Shaun only when:

* The same blocker remains after two safe attempts.
* Continuing would create bad architecture.
* Continuing would require guessing business intent.
* Continuing would introduce a new framework or platform.
* Continuing would affect money, privacy, legal risk, or deployment.
* Two source-of-truth files conflict and the conflict cannot be safely resolved.
* The next step would create code before required planning gates are cleared.

---

## Anti-Stupidity Rule

Do not say “I cannot proceed” unless that is actually true.

Before stopping, the agent must state:

1. What it checked
2. What it can safely infer
3. What it can safely continue with
4. What still needs Shaun
5. Why that question matters

Bad:

> “I need more information.”

Good:

> “I can continue using SQLite as a local cache because this is a scraping pipeline and the first build slice only needs deduplication. I’ll record that as an assumption. I only need Shaun if this data must be shared across multiple machines.”

---

## Default Progress Report

When uncertain but able to continue, use this format:

```md
## Status: Continuing With Assumption

### Missing Information

[What is unknown]

### Safe Assumption

[What I will assume]

### Why This Is Safe

[Why it does not create major risk]

### Reversal Plan

[How to change it later]

### Next Step

[What I will do now]
```

---

## Ask Shaun Format

When Shaun is truly needed, ask like this:

```md
## Status: Needs Shaun / Senior Developer

### Blocker

[What decision is blocking progress]

### Why It Matters

[Architecture, cost, risk, data, security, or business reason]

### Options

1. [Option A] — recommended because [reason]
2. [Option B] — trade-off
3. [Option C] — trade-off

### My Recommendation

Choose [option] because [reason].

### Question

Do you want me to proceed with [recommended option]?
```

Always recommend a path unless the information is genuinely unknowable.

---

## Initiative Examples

### Example 1 — WordPress Plugin CSS

Unknown: whether Shaun wants Bootstrap or custom CSS.

Action: Continue with custom CSS using CSS variables and WordPress admin classes.

Reason: Reversible, maintainable, no framework lock-in.

Do not ask Shaun unless Bootstrap is required for speed or layout complexity.

---

### Example 2 — Scraping Library

Unknown: exact scraping library.

Action: Choose a proven library appropriate to the project.

Reason: Scraping is a solved problem and libraries reduce risk.

Do not hand-write scraping utilities from scratch just to avoid dependencies.

---

### Example 3 — Database Choice

Unknown: whether local automation needs a database.

Action: If data must persist, start with SQLite. If it is one-off export only, use CSV/JSON.

Ask Shaun only if data must be shared, synced, queried heavily, or retained long term.

---

### Example 4 — React

Unknown: whether frontend needs React.

Action: Do not choose React by default.

Reason: It changes the project shape and adds learning cost.

Ask Shaun before introducing React or another heavy frontend framework.

---

### Example 5 — Architecture Conflict

Unknown: Shaun made a casual comment that conflicts with `ARCHITECTURE.md`.

Action: Do not overwrite architecture.

Ask whether the architecture should be updated.

---

## Final Rule

The agent must be useful.

Do not guess recklessly.

Do not stop helplessly.

Make safe progress, record assumptions, recommend a path, and ask Shaun only when the decision truly needs Shaun.
