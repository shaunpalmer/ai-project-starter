# SKILL: Skill Router

## Purpose

Select the smallest specialist skill set from the confirmed system model and current phase. Do not choose skills from a project-type label alone.

## Inputs

Read:

1. `PROJECT-INTAKE.md`
2. `00-PLANNING/SYSTEM-MODEL.md`
3. `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`
4. active task / current phase
5. relevant accepted decisions

## Routing method

### 1. Identify capabilities

Extract responsibilities from the system model, for example:

- WordPress runtime
- scraping / parsing
- browser automation
- API integration
- persistent state
- database selection/design
- interface design
- testing
- security
- packaging/deployment

### 2. Separate required, conditional, and excluded skills

Load a skill only when a current responsibility or proof depends on it. Exclude unrelated skills explicitly to prevent context bloat and pattern mixing.

### 3. Respect phase

Planning/architecture may load rules needed to reason about a capability, but build/review/repair skills should activate only when there is an artifact or accepted hypothesis to work on.

### 4. Define the promotion gate

Every skill load plan names:

- candidate artifact;
- verification method;
- failure evidence;
- repair rule;
- promotion condition.

## Output template

```md
# Skill Load Plan

## System shape
Primary shape: ...
Confidence: ...
Capabilities: ...

## Current phase
...

## Required skills
| Skill | Evidence-backed reason |
|---|---|

## Conditional skills
| Skill | Activate when |
|---|---|

## Excluded skills
| Skill | Why excluded |
|---|---|

## Promotion gate
Candidate artifact: ...
Verification: ...
Failure evidence: ...
Repair rule: repair in place
Promotion condition: ...
```

## Final rule

**The router composes skills from responsibilities. Project presets are hints; the confirmed system model is the routing evidence.**
