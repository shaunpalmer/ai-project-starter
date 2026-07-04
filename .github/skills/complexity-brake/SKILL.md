# SKILL: Complexity Brake

## Purpose

This skill prevents the agent from overbuilding.

It must be used before writing new code, adding files, adding dependencies, creating abstractions, introducing build tooling, or creating database structures.

The goal is not tiny code.

The goal is the smallest correct implementation that fits the approved architecture, solves the current build slice, and stays maintainable for Shaun.

---

## When to Use

Load this skill when:

* A new feature is about to be implemented.
* A new file, class, table, dependency, framework, API route, cron job, adapter, factory, strategy, or build tool is proposed.
* The project is a WordPress plugin, scraping pipeline, automation tool, dashboard, API, or database-backed utility.
* The agent is reviewing code for over-engineering.
* The agent is unsure whether to build custom logic or reuse existing tools.

---

## Core Rule

Before adding code, prove the code needs to exist.

Do not create architecture theatre.

Do not add files, classes, abstractions, services, dependencies, or database tables just because they sound professional.

Use the simplest safe design that can survive the next likely change.

---

## Minimum Useful Code Ladder

Before writing code, stop at the first rung that works:

1. **Does this need to exist?**

   * If no, skip it.

2. **Does this already exist in the project?**

   * Reuse the existing helper, service, utility, pattern, table, or component.

3. **Does the language standard library already do this?**

   * Use built-in PHP, Python, JavaScript, TypeScript, Bash, or PowerShell features where appropriate.

4. **Does the platform already provide it?**

   * For WordPress, use WordPress core APIs before inventing custom infrastructure.
   * For browsers, use native HTML/CSS/JavaScript features before adding frontend libraries.
   * For operating-system scripts, use native shell/system tools where they are reliable.

5. **Does an approved dependency already solve it?**

   * Use existing dependencies before adding new ones.

6. **Can this be one clear function or utility?**

   * Prefer one understandable function over a premature class hierarchy.

7. **Only then, write the minimum code that works.**

---

## Not Lazy About

The agent must never simplify away:

* Security
* Escaping
* Sanitization
* Validation
* Nonces
* Capability checks
* Error handling
* Data-loss protection
* Privacy rules
* Accessibility
* Database integrity
* Tests or smoke checks for non-trivial logic

Small unsafe code is not good code.

---

## New File Rule

Before creating a new file, ask:

* What responsibility does this file own?
* Does an existing file already own that responsibility?
* Will this file be used by the first useful build slice?
* Is this file needed now, or is it future architecture theatre?
* Where does `ARCHITECTURE.md` say this file belongs?

If the file is not needed for the first useful slice, do not create it yet.

---

## New Class or Pattern Rule

Before creating a new class, factory, strategy, adapter, repository, pipeline, validator, or service, ask:

* What problem does this pattern solve?
* Is there more than one implementation now or likely soon?
* Does it reduce complexity or add ceremony?
* Does it make testing easier?
* Does it protect a real future change?
* Would a simple function be clearer?

Patterns are good when they clarify responsibility.

Patterns are bad when they create pretend architecture.

---

## Dependency Rule

Before adding a dependency, ask:

* Is this a focused library or a framework that changes the project shape?
* Is the dependency mature and appropriate?
* Does the project already have something that solves this?
* Can the standard library or platform solve it cleanly?
* Does the dependency reduce code and risk?
* Does Shaun need to approve the learning or maintenance cost?

Use libraries boldly for solved problems.

Use frameworks carefully.

---

## Database Table Rule

Before creating a new database table, ask:

* Can WordPress options, post meta, user meta, terms, SQLite, JSON, or CSV solve this first slice?
* Is the data high-volume?
* Does it need reporting, filtering, indexing, or long-term ownership?
* Does the data have its own lifecycle?
* Has the schema been recorded in `DATABASE.md`?

Do not create custom tables just because the project has data.

Create them when the data shape earns them.

---

## Build Tooling Rule

Before adding Composer, npm, Vite, Webpack, Tailwind, React, Vue, Docker, queues, workers, or CI tooling, ask:

* Does the first useful slice need this?
* Is the maintenance cost justified?
* Can Shaun run and debug it easily?
* Is there a simpler version?
* Has the choice been recorded in `TECH-SPEC.md`?

Do not add build tooling to make a project look modern.

Add it only when it earns its place.

---

## Debt Marker Rule

If the agent deliberately chooses a simple solution with a known ceiling, mark it clearly.

Use this format:

```text
shaun-debt: [simple choice]; upgrade when [specific trigger]
```

Examples:

```text
shaun-debt: settings stored in wp_options; upgrade to custom table when records exceed 500 or reporting needs indexed queries.
```

```text
shaun-debt: CSV export is synchronous; move to background job when export regularly exceeds 10,000 rows.
```

Debt markers are allowed.

Hidden shortcuts are not.

---

## Complexity Brake Report

Before execution, the agent should produce this short check:

```md
## Complexity Brake Check

### Proposed Build

[What is about to be built]

### Can Anything Be Reused?

[Existing files, APIs, utilities, platform features, or dependencies]

### What We Are Not Building Yet

[Deferred files, abstractions, dependencies, tables, frameworks, or tooling]

### Smallest Safe Version

[The minimum implementation for the first useful build slice]

### Debt Markers

[Any known limits and upgrade triggers]

### Verdict

`LEAN ENOUGH` or `SIMPLIFY BEFORE CODING`
```

---

## Final Rule

Build less, but build correctly.

Do not remove structure that protects maintainability.

Do not add structure that only decorates the project.

The best implementation is the smallest safe implementation that fits the architecture and lets Shaun keep moving.
