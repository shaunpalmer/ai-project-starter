# PROJECT-TYPES.md — Project Shape Presets

AI: Treat these as reusable architecture evidence, not mandatory boxes. Infer the system first, then use one preset, compose several capability patterns, or use a custom shape.

A natural-language brief may begin with `infer` or `hybrid`. Do not select storage, framework, folder boundaries, or patterns merely because one label sounds close.

## Routing rule

1. Read `PROJECT-INTAKE.md`.
2. Confirm `00-PLANNING/SYSTEM-MODEL.md` before locking architecture.
3. Identify:
   - primary shape;
   - capability composition;
   - classification confidence;
   - material unknowns.
4. If confidence is high and one preset fits, use it as a starting default.
5. If the system crosses domains, compose capabilities instead of forcing one type.
6. If confidence is low, inspect evidence or run a bounded proof.
7. Record the result in `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.
8. Architecture, language, framework, database, provider, cost, and security-boundary changes still follow `docs/DECISION-RIGHTS.md`.

## Capability vocabulary

Common capabilities include:

- WordPress lifecycle and hooks
- browser automation
- HTTP/API integration
- scraping and parsing
- persistent state
- idempotent ingestion
- queues / scheduling
- retry / backoff / circuit breaking
- enrichment
- validation / normalisation
- reporting / dashboard UI
- authentication / permissions
- file processing
- CLI automation
- public API surface
- deployment / packaging

Capabilities describe responsibilities. They do not imply one class, process, service, table, or dependency per capability.

---

## Preset 1: WordPress Plugin

**Strong fit when:** WordPress itself is the runtime and extension surface.

**Typical shape:** OOP plugin bootstrap, hooks at composition boundaries, responsibility-focused classes, WordPress APIs first, custom tables only when data shape/query needs justify them.

**Likely capabilities:** admin UI, frontend integration, REST endpoints, scheduled tasks, database access, packaging.

**First proof:** plugin activates cleanly and one useful vertical slice works in WordPress.

**Avoid:** abstracting away WordPress conventions, inventing extra infrastructure, or adding custom tables by default.

---

## Preset 2: PHP Web Interface

**Strong fit when:** server-rendered PHP owns requests and UI outside WordPress.

**Typical shape:** thin request/controller layer, service/business logic, repository/data access when persistence exists, templates/views separated from queries.

**Storage:** choose MySQL/MariaDB, SQLite, or none from deployment/data evidence.

**First proof:** one request-to-output or CRUD vertical slice works end to end.

---

## Preset 3: TypeScript / Node Automation

**Strong fit when:** a CLI, worker, script, or event-driven Node process is the main runtime.

**Typical shape:** explicit config, typed boundaries, logging, dry-run for mutation, focused tasks/services, retries around external dependencies.

**Storage:** none, files, SQLite, or an external database according to state requirements.

**First proof:** one task completes with observable output and a handled failure case.

---

## Preset 4: Python Automation

**Strong fit when:** Python libraries and scripting/data tooling are the main execution environment.

**Typical shape:** CLI/script entry point, configuration, logging, focused operations, explicit error/retry behaviour, unattended-safe execution when required.

**Storage:** none, files, SQLite, or external persistence according to the system model.

**First proof:** one operation produces the required output and preserves useful state across one failure/retry when persistence matters.

---

## Preset 5: Scraping / Ingestion Pipeline

**Strong fit when:** data moves through acquisition, extraction, quality control, normalisation, persistence, and delivery responsibilities.

**Candidate responsibilities:** schedule/queue → fetch → parse → validate → transform → load → monitor.

These are responsibilities, not mandatory files or processes. Combine them for a small scraper; separate them only when scale, failure isolation, reuse, or concurrency justifies it.

**Common capability composition:** HTTP APIs + Playwright/browser automation + provider adapters + persistent job state + dedupe/idempotency + retry/backoff + cost/rate controls + export/reporting.

**First proof:** one source produces one validated, repeatable record without losing state on rerun.

**Avoid:** paid enrichment before dedupe, blind inserts, silent validation loss, uncontrolled retries, and treating fallback providers as unrelated scripts.

---

## Preset 6: API Service

**Strong fit when:** other software consumes a stable network contract.

**Typical shape:** request validation, route/transport layer, services, repositories when persistence exists, consistent errors, auth/rate controls when required.

**First proof:** one endpoint validates input, produces the contract, and handles one failure correctly.

---

## Preset 7: Dashboard / Reporting Interface

**Strong fit when:** the primary outcome is human-readable decision support.

**Typical shape:** read/data-loading boundary, transformations, owner-first KPIs, analyst detail second, caching only where evidence shows need.

**First proof:** one trusted KPI and its source data can be traced and refreshed.

---

## Preset 8: Networking / Monitoring Tool

**Strong fit when:** the system observes or changes machines, processes, networks, or runtime state.

**Typical shape:** observe/read-only mode first, explicit active mode, dry-run, complete logging, rollback/fallback for mutation.

**First proof:** observe mode reports useful truth without changing state.

---

## Preset 9: Local AI / Workflow Tool

**Strong fit when:** a local workflow, files, or user-driven AI process is the product boundary.

**Typical shape:** simple interface, explicit local storage ownership, provider/model adapter only when needed, recoverable file writes.

**First proof:** read → process → write one useful result without data loss.

---

## Hybrid example: prospecting pipeline

A commercial prospecting system might be:

```text
primary shape: scraping / ingestion pipeline
capabilities:
  - Google Places API
  - browser automation fallback
  - HTML parsing
  - persistent crawl/job state
  - deduplication before paid enrichment
  - email enrichment adapter
  - provider budget caps
  - retry/backoff/circuit breaker
  - CSV/CRM export
confidence: 0.76
```

That is not a failure to classify. It is a more accurate system model than forcing the whole product into `Python automation` or `Scraping pipeline` and inheriting an arbitrary database/folder structure.

## Final rule

**Infer responsibilities before implementation. Presets accelerate known work; capability composition handles unfamiliar work. Never let a label replace evidence.**
