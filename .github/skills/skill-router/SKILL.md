# SKILL: Skill Router

## Purpose

Select the smallest specialist skill set from the confirmed system model and current phase. Do not choose skills from a project-type label alone, and do not ask Shaun to activate skills that the evidence already makes mandatory.

## Inputs

Read:

1. `ENGINEERING-DEFAULTS.md`
2. `PROJECT-INTAKE.md`
3. `00-PLANNING/SYSTEM-MODEL.md`
4. `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`
5. active task / current phase
6. relevant accepted decisions
7. existing repository configuration and conventions

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
- Linux/Windows automation
- CLI or scheduled execution
- dependency/tool installation or environment inspection
- harness lifecycle maintenance

### 2. Apply deterministic bindings

These bindings are routine decisions and require no user question when the evidence is clear:

| Confirmed capability | Required/default skill or rule |
|---|---|
| WordPress runtime/plugin/theme | `wordpress-way.md` + `wordpress-plugin/SKILL.md` |
| Scraping/crawling/parsing/ingestion | `scraping-pipeline/SKILL.md` |
| CLI, automation, package/runtime/tool inspection or project-scoped installs/updates | `command-line/SKILL.md` |
| Significant OOP/service architecture | `oop-standards.md` when classes/interfaces are actually justified |
| Architecture selection or major boundary work | `architecture-canvas/SKILL.md` |
| Complexity/dependency expansion | `complexity-brake/SKILL.md` |
| Project resume/checkpoint/pivot | `project-memory/SKILL.md` |

Harness lifecycle phrases such as `harness update`, `upgrade the harness`, `harness doctor`, `/doctor`, or equivalent instructions bind the command-line skill and the project-local lifecycle controller automatically.

A capability can bind several skills. A skill is not a substitute for the confirmed system model.

### 3. Separate required, conditional, and excluded skills

Load a skill only when a current responsibility or proof depends on it. Exclude unrelated skills explicitly to prevent context bloat and pattern mixing.

Required skills are loaded automatically. Do **not** ask, "Should I activate the WordPress skill?" when the system is demonstrably WordPress, or "Should I use the terminal?" when the accepted task is explicitly an install/update/automation operation.

Conditional skills activate only when their trigger becomes true. For example, do not load database-design guidance merely because a plugin might someday need storage.

### 4. Respect phase

Planning/architecture may load rules needed to reason about a capability, but build/review/repair skills should activate only when there is an artifact or accepted hypothesis to work on.

### 5. Respect rule precedence

Use this precedence:

1. existing project config + accepted ADRs;
2. confirmed system-model evidence + accepted architecture hypothesis;
3. ecosystem-specific skill;
4. `ENGINEERING-DEFAULTS.md`;
5. generic preference.

If a repository already establishes a language, formatter, framework, package manager, or test stack, preserve it unless there is evidence for a consequential change.

### 6. Enforce the question budget

Routine engineering question budget is zero. Before asking Shaun anything about skill selection, language, naming, OOP/procedural style, test organisation, package-manager choice, or normal framework conventions, verify that the answer is not already determined by the evidence or defaults.

Ask only when the missing answer belongs to Shaun under `docs/DECISION-RIGHTS.md` or a material ambiguity survives repository inspection and bounded proof.

### 7. Define the promotion gate

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

**Compose skills from responsibilities. Automatically bind ecosystem and command-line rules when evidence is decisive. Project presets accelerate recognition; they do not replace evidence or force architecture.**
