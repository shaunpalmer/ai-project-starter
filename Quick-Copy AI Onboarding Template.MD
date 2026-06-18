# AI Onboarding Reference — Project Entry Protocol

> Run this on entry, before writing any code. It establishes the five parameters that bound all implementation in this project.

## Procedure

1. Resolve each of the five parameters below from the project documents.
2. Record the resolved value in the **Resolved Brief** block at the bottom.
3. If a parameter cannot be resolved, mark it `UNRESOLVED`, park it in `AI-NOTES.md`, and ask the owner. Do not infer it. Do not write code that depends on it.
4. Once all five are resolved, proceed to the task.

Secondary parameters (error strategy, logging, testing, security, performance, dependencies, conventions, state, concurrency, rollback, read-first, done-verification) are listed under **Extended Parameters** in `AI-NOTES.md`. Resolve them when the task is sensitive to them.

## Source Priority

When parameters appear in more than one place, the higher source wins:

1. Owner's direct instruction in the current request
2. `PROJECT-INTAKE.md`
3. `PROJECT-TYPES.md` / `TECH-SPEC.md` / `ARCHITECTURE.md`
4. `SHAUN_DEV_PROFILE.md` (defaults when nothing else specifies)

---

## The Five Parameters

| # | Parameter | Resolves the question | Look in |
|---|---|---|---|
| 1 | **ENVIRONMENT** | What runtime, versions, and tools are fixed? | `TECH-SPEC.md`, `PROJECT-INTAKE.md` |
| 2 | **DATA CONTRACT** | What shape enters, what shape leaves? | `DATA-FLOW.md`, task request |
| 3 | **ARCHITECTURE** | Standalone, plugin, module, or integration? | `PROJECT-TYPES.md`, `ARCHITECTURE.md` |
| 4 | **GUARDRAILS** | What is required, what is forbidden? | `SHAUN_DEV_PROFILE.md`, `TECH-SPEC.md` |
| 5 | **TASK AT HAND** | What single feature is being written now? | Owner's current request, `TASKS.md` |

---

## 1. ENVIRONMENT

**Resolves:** the fixed runtime, language versions, database, and local tools.

**Why it bounds the work:** training data spans many versions; an undefined runtime mixes incompatible syntax and produces deprecated calls or path errors.

**Resolved when:** every version is explicit, not assumed.

- Operating system and distribution
- Language(s) and exact version(s)
- Database and version
- Local tools, frameworks, or "none"

> Example: Fedora Linux · PHP 8.2 · MySQL 8.0 · vanilla JavaScript · no front-end frameworks.

---

## 2. DATA CONTRACT

**Resolves:** the input shape and the required output shape.

**Why it bounds the work:** code transforms data. The shape in and the shape out determine query structure, payloads, and return types. Intent behind the data is irrelevant to implementation.

**Resolved when:** both shapes are concrete and typed.

- Input: source, format, named fields
- Output: structure, format, destination

> Example:
> **In** — raw JSON webhook string with `lead_id`, `phone`, `utm_source`.
> **Out** — sanitised associative array ready for a database insert.

---

## 3. ARCHITECTURE

**Resolves:** where the code lives and what it must respect.

**Why it bounds the work:** an isolated script and a component inside an existing system have different rules. Inside an ecosystem, use existing hooks, globals, and classes instead of reinventing them.

**Resolved when:** placement and integration points are named.

- Standalone script / plugin / module / legacy integration
- What triggers it (cron, hook, route, CLI, event)
- Existing components it must use, if any

> Example: standalone utility class, does not boot the application, triggered by a local cron job.

---

## 4. GUARDRAILS

**Resolves:** the required style and the forbidden choices.

**Why it bounds the work:** without limits the default output is generic and verbose. What is forbidden constrains as much as what is required.

**Resolved when:** performance priority, style rules, and prohibitions are explicit.

- Performance priority (speed / memory / readability)
- Required style (typing, patterns, naming)
- Forbidden (packages, loops, APIs, approaches)

> Example: priority is raw execution speed · no external packages · native array functions over loops · strict type hinting required.

---

## 5. TASK AT HAND

**Resolves:** the single deliverable for this step.

**Why it bounds the work:** broad instructions ("build the pipeline") cause loss of focus and hallucination. One isolated milestone keeps attention on the logic at hand.

**Resolved when:** scope is one deliverable, with out-of-scope items named.

- The one feature being written now
- What is explicitly deferred

> Example: write only the regex engine that extracts UTM parameters from the raw string. Database saving logic is out of scope for this step.

---

## Resolved Brief

> Fill this block once all five parameters are resolved. Carry it into the implementation.

```yaml
environment:   # OS, language+version, database+version, tools
data_contract:
  input:       # source, format, fields
  output:      # structure, format, destination
architecture:  # type + trigger + integration points
guardrails:    # priority + required style + forbidden
task_at_hand:  # single deliverable
out_of_scope:  # deferred items
```

If any field above is `UNRESOLVED`, park it in `AI-NOTES.md`, then stop and ask the owner before writing code.
