# AI-NOTES.md — Working Memory & Change Log

> The AI's persistent notebook for this project. Read on entry. Write on every meaningful change.
> This is a record to look up, not prose to read. Append; do not rewrite history.

---

## Standing Order

- Read this file on entry, after the entry protocol.
- Append a **Change Log** entry for every meaningful change: code, structure, schema, or decision.
- Record **Decisions** with a one-line rationale so the next session does not re-derive them.
- Park anything **UNRESOLVED** here and flag it to the owner. Do not guess past it.
- Keep entries short and dated. Newest at top.

---

## Change Log

> Append-only. Newest first. One row per change.

| Date | Change | Why |
|------|--------|-----|
|      |        |     |

---

## Decisions

> Why a choice was made, so it is not re-litigated. Lightweight ADR.

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 |          |           |      |

---

## Open Questions / UNRESOLVED

> Parameters or choices that could not be resolved from the documents. Owner must answer.
> Move each to Decisions once resolved.

- [ ]

---

## Extended Parameters (optional lookup)

> Beyond the core five in the entry protocol. Resolve when the task needs them.
> Most are inferred from `SHAUN_DEV_PROFILE.md` / `TECH-SPEC.md`; confirm when the task is sensitive to them.

| Parameter | Resolves | Default source |
|-----------|----------|----------------|
| **ERROR STRATEGY** | How errors surface and bubble (envelope / Result / exception+log); one bad record vs whole-run failure | `ARCHITECTURE-TEMPLATES.md` (error bubbling) |
| **LOGGING** | What is logged, where, at what level; structured or plain | `SHAUN_DEV_PROFILE.md` (fail loudly, log) |
| **TESTING** | What proves this slice works; the smallest useful test; the verify command | `testing-plan` skill |
| **SECURITY** | Sanitise-in / escape-out, secrets handling, nonces (WordPress), auth | `TECH-SPEC.md`, `wordpress-plugin` skill |
| **PERFORMANCE BUDGET** | Concrete target (e.g. 100 URLs < 60s); memory ceiling | `PRD.md` success metrics |
| **DEPENDENCIES** | What is already present; what may be added; what is forbidden | `TECH-SPEC.md` |
| **CONVENTIONS** | File naming, class naming, folder placement | `ARCHITECTURE.md`, project type template |
| **STATE & PERSISTENCE** | Keeps state between runs? where? idempotent? | `DATA-FLOW.md`, `DATABASE.md` |
| **CONCURRENCY** | Parallel or sequential; rate limits; backoff | `scraping-pipeline` skill |
| **FAILURE / ROLLBACK** | Dry-run mode? rollback? safe-by-default (networking: observe before active) | `PROJECT-TYPES.md` |
| **READ-FIRST** | Existing files the AI must read before writing | repo scan |
| **DONE VERIFICATION** | How the owner confirms the slice is done (command / file / screen) | `PROJECT-INTAKE.md` Q5 |

---

## Scratch / Working Notes

> Freeform context worth remembering between turns or sessions. Clear when stale.
