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


## Repair In Place Rule

When code fails, the agent must repair the existing implementation before starting over.

Do not delete, rewrite, or replace working structure just because one part is broken.

Debugging is a core development skill.

The agent must diagnose the fault, patch the smallest responsible area, and verify the fix.

### Core Rule

Prefer surgical correction over full rewrite.

When a bug appears:

1. Identify the exact failing behavior.
2. Locate the smallest likely cause.
3. Check names, paths, imports, hooks, SQL fields, request keys, function signatures, and data shape.
4. Patch the existing file in place.
5. Re-run the relevant check.
6. Only widen the change if the first fix proves the issue is structural.

Do not start again unless the existing implementation is fundamentally wrong.

---

## No Thrashing Rule

The agent must not repeatedly abandon code and recreate it.

Bad behavior:

* “This did not work, so I rewrote the whole file.”
* “The form failed, so I created a new form.”
* “The SQL failed, so I rebuilt the plugin structure.”
* “The hook did not fire, so I moved everything into another file.”
* “The class name failed, so I changed all class names.”

Good behavior:

* “The form field name does not match the SQL column. I will fix the mapping.”
* “The nonce check is failing. I will verify the nonce action and field name.”
* “The repository insert expects `event_type`, but the form sends `type`. I will normalize the input.”
* “The hook callback is not firing because the class is loaded after the hook registration. I will fix load order.”
* “The table name is wrong because the prefix constant is inconsistent. I will correct the constant.”

---

## Debugging Ladder

Before rewriting code, use this ladder:

### 1. Read the Error

Check the actual failure:

* PHP fatal error
* PHP warning or notice
* JavaScript console error
* Failed SQL query
* Failed test
* Missing hook callback
* Missing file path
* Wrong class name
* Wrong request key
* Wrong database column
* Wrong nonce action
* Wrong capability check

Do not guess before reading the failure.

### 2. Compare Expected vs Actual

Ask:

* What did the code expect?
* What did it receive?
* Where did the value change shape?
* Which name does the form use?
* Which name does the database expect?
* Which name does the service expect?
* Which class or file is actually loaded?

### 3. Patch the Smallest Area

Fix the smallest responsible area first.

Examples:

* Rename one mismatched form field.
* Correct one SQL column name.
* Fix one function signature.
* Add one missing `require_once`.
* Correct one hook name.
* Correct one namespace/class name.
* Fix one path constant.
* Add one sanitizing or escaping call.
* Update one repository method.

### 4. Verify

After patching, verify the specific issue.

Do not make unrelated improvements during debugging.

### 5. Escalate Only If Needed

Only widen the fix when the bug proves the current design is structurally wrong.

---

## Rewrite Permission Rule

The agent may only rewrite a file when one of these is true:

* The file is a throwaway prototype.
* The file is shorter and safer to replace than patch.
* The current file violates approved architecture.
* The code is duplicated beyond safe repair.
* The implementation is fundamentally pointed at the wrong responsibility.
* Shaun explicitly approves the rewrite.
* The agent first explains why repair-in-place is worse than replacement.

Before rewriting, the agent must state:

```md
## Rewrite Justification

### Existing Problem

[What is wrong]

### Why Repair In Place Is Not Enough

[Why a small patch will not solve it]

### Risk Of Rewriting

[What could break]

### Files Affected

[List files]

### Recommendation

[Rewrite or repair]
```

If this justification is weak, repair in place.

---

## Preserve Structure Rule

When fixing bugs, preserve the approved architecture unless the architecture itself is the problem.

Do not move logic between layers just to make the immediate error disappear.

Examples:

* Do not move SQL into an admin page because the repository insert failed.
* Do not put business logic in the root plugin file because a class failed to load.
* Do not add inline styles because the CSS file did not enqueue.
* Do not bypass a service because the adapter has a bug.
* Do not duplicate a utility because the import path is wrong.

Fix the architecture path.

Do not route around it.

---

## Name Consistency Rule

Before rewriting, check for naming mismatch.

Many bugs are not design failures.

They are naming failures.

Check:

* Form field names
* Request keys
* Database column names
* Array keys
* JSON keys
* Function names
* Class names
* File names
* Hook names
* Action names
* Nonce names
* Option names
* Table names
* Slugs
* Text domains

If a PHP form does not save correctly because the SQL field names do not match the form names, fix the mapping.

Do not rebuild the form.

---

## Change Discipline Rule

One debugging pass should have one clear purpose.

Do not combine:

* bug fix
* refactor
* rename
* new feature
* style cleanup
* architecture change

unless Shaun explicitly asked for that combined change.

Prefer:

```text
Fix the save bug first.
Then refactor if needed.
Then improve UI if needed.
```

---

## Patch Report Format

When repairing code, report like this:

```md
## Repair Report

### Problem

[What failed]

### Cause

[Root cause or best-supported cause]

### Fix

[Smallest change made]

### Files Changed

- `path/to/file.php`

### Verification

[How it was checked]

### Follow-up

[Any optional improvement, not done automatically]
```

---

## Final Rule

Do not panic-rewrite.

Debug like a developer.

Repair in place first.

Rewrite only when the current design is genuinely wrong, unsafe, or more expensive to repair than replace.

## General Engineering Judgement Rules

The agent must code like a senior developer, not like an autocomplete machine.

When building or repairing code, the agent must watch for common AI failure points: confused load order, mismatched names, weak database design, poor normalization, bad async flow, missing promises, unclear class responsibility, careless CSS, and patterns used either too late or for no reason.

If a pattern is needed, use it deliberately. Pair patterns when they make the design clearer: Factory with Strategy for swappable behavior, Adapter with Service for external APIs, Repository with Service for database-backed business logic, Pipeline with Envelope for staged data processing, and Specification or Validator objects for reusable rules.

Do not write flat procedural code when the project clearly needs structure. Do not write heavy architecture when a simple function is enough. Choose the smallest clean design that can survive the next likely change.

### Common Failure Checks

Before handing back code, check:

* Does load order make sense?
* Are imports, requires, hooks, and bootstraps in the right place?
* Do form field names, request keys, database columns, and array keys match?
* Is database structure normalized enough for the job?
* Are tables, indexes, and relationships named clearly?
* Is async TypeScript using `Promise`, `async`, and `await` correctly?
* Are errors handled instead of silently swallowed?
* Are classes doing one clear job?
* Are paired classes working together cleanly?
* Are utilities extracted when logic repeats?
* Are dependencies imported at the top?
* Is CSS modern, maintainable, and free of inline styles?
* Are CSS variables used for repeated design values?
* Is Flexbox or Grid used for layout instead of layout hacks?
* Are libraries used for solved problems instead of weak custom rewrites?
* Has the agent repaired in place before considering a rewrite?

### Final Engineering Rule

Do not guess your way through engineering.

Trace the flow.

Check the names.

Check the contracts.

Check the data shape.

Check the load order.

Then patch the smallest responsible part.

If the design itself is wrong, explain why, recommend the better architecture, and record the decision before changing direction.


## Final Rule

The agent must be useful.

Do not guess recklessly.

Do not stop helplessly.

Make safe progress, record assumptions, recommend a path, and ask Shaun only when the decision truly needs Shaun.
