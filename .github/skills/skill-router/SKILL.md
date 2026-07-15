# Skill Router Output

The Skill Router must produce a Skill Load Plan before specialist work begins.

The plan must identify:

1. What project context was read
2. What phase the agent is in
3. Which skills are required
4. Which skills are optional
5. Which skills are explicitly excluded
6. What execution pipeline applies
7. What promotion gate must be passed before output is considered final

---

# Skill Load Plan: [Phase Name]

## 1. Project Context Ingestion

### Intake Assessment

Read `PROJECT-INTAKE.md`.

Summarise:

* Project goal
* Project type
* User/business reason
* First useful outcome
* Any limits or constraints

### Type Constraints

Read `PROJECT-TYPES.md`.

Confirm:

* Matching project type
* Required architecture pattern
* Expected stack/database direction
* Relevant specialist skills
* Skills that do not apply

### Active Target

Read `TASKS.md`.

Identify:

* Current task or first build slice
* Expected output
* Dependencies
* Verification method if already listed

---

## 2. Active Phase Identification

Select one current operational phase:

* `[ ]` Planning
* `[ ]` Architecture
* `[ ]` Build
* `[ ]` Review
* `[ ]` Repair
* `[ ]` Documentation

The phase determines which skills are loaded.

Do not load build skills during planning unless planning requires their rules.

Do not load review skills until there is an artifact, diff, or completed plan to review.

---

## 3. Skill Allocation Matrix

### Required Skills

| Skill        | Why it is required  |
| ------------ | ------------------- |
| `skill-name` | Required because... |

Required skills are loaded immediately because the current project type, phase, task, or blocker depends on them.

### Optional Skills

| Skill        | Activation condition |
| ------------ | -------------------- |
| `skill-name` | Load only if...      |

Optional skills are not loaded unless their condition becomes true.

### Excluded Skills

| Skill        | Why it is excluded  |
| ------------ | ------------------- |
| `skill-name` | Excluded because... |

Excluded skills are explicitly deactivated for this execution block to prevent context bloat, focus drift, and accidental pattern mixing.

---

## 4. Execution Pipeline

After routing skills, use this pipeline:

```text
route skills
  ↓
plan slice
  ↓
generate candidate
  ↓
verify artifact
  ↓
repair in place
  ↓
recheck
  ↓
promote only when checked
```

Generated work is only a candidate artifact until verification passes.

The agent must not present candidate work as final.

---

## 5. Promotion Gate

Before output is considered final, define the promotion gate.

| Item                | Answer                                |
| ------------------- | ------------------------------------- |
| Candidate artifact  | What will be produced?                |
| Verification method | How will it be checked?               |
| Failure evidence    | What error/log/output proves failure? |
| Repair rule         | What should be repaired in place?     |
| Promotion condition | What must pass before shipping?       |

If no verification method exists, create the smallest useful one.

Examples:

* PHP syntax check
* TypeScript compile check
* Unit or smoke test
* WordPress hook/load-order check
* Browser render check
* Accessibility scan
* Database schema inspection
* Exact source text comparison
* Git diff review for accidental rewrites

---

## 6. Skill Load Plan Template

```md
# Skill Load Plan: [Phase Name]

## Project Type

[WordPress plugin / scraping pipeline / PHP tool / TypeScript automation / Python automation / API / dashboard / other]

## Current Phase

[Planning / Architecture / Build / Review / Repair / Documentation]

## Active Target

[Current task or first build slice from TASKS.md]

## Required Skills

| Skill | Why it is required |
|---|---|
| `wordpress-plugin` | Project type is WordPress plugin |
| `database-selection` | Storage decision is required |
| `complexity-brake` | New files/classes/tables are being proposed |

## Optional Skills

| Skill | Activation condition |
|---|---|
| `interface-design` | Load if admin UI or frontend UI is part of this slice |
| `testing-plan` | Load if verification is not already defined |

## Excluded Skills

| Skill | Why it is excluded |
|---|---|
| `scraping-pipeline` | Project is not scraping data |
| `api-design` | No external/public API is planned yet |

## Execution Pipeline

route skills → plan slice → generate candidate → verify artifact → repair in place → recheck → promote only when checked

## Promotion Gate

| Item | Answer |
|---|---|
| Candidate artifact |  |
| Verification method |  |
| Failure evidence |  |
| Repair rule | Repair existing files in place. Do not restart or rewrite unrelated files. |
| Promotion condition |  |

## Status

`SKILLS_SELECTED`
```

---

## Final Rule 

The Skill Router does not do the specialist work.

It chooses the right skills, excludes the wrong ones, defines the execution path, and names the promotion gate.

Specialist skills do the work after routing is complete.
