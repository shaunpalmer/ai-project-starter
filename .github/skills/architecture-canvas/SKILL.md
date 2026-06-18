# SKILL: Architecture Canvas

## Purpose

Produce a complete `ARCHITECTURE.md` that defines system structure, boundaries, and key decisions — so workers never have to guess where code goes.

## When to Use

- After PRD is approved
- Before any implementation starts
- When refactoring a system's core structure

## Inputs Required

- [ ] Approved `PRD.md`
- [ ] Project type confirmed in `PROJECT-INTAKE.md` (and routed via `PROJECT-TYPES.md`)
- [ ] Stack confirmed in `TECH-SPEC.md` (or run `stack-selector` skill first)
- [ ] Any hard constraints (hosting platform, existing services, compliance)

---

## Process

### Step 1 — Identify System Boundaries

Define what is inside and outside this system:
- What this system owns
- What it calls (external APIs, services, third-party)
- What calls it (users, schedulers, upstream systems)

### Step 2 — Choose Architecture Style

Select the simplest style that meets the need.

| Style | Choose when | Avoid when |
|-------|------------|-----------|
| Monolith | Small team, moving fast, single deployable | Need independent scaling of parts |
| Modular monolith | Want clean separation but single deploy | Multiple teams or languages |
| Pipeline | Data flows linearly (scraper → transform → store) | User interaction is primary |
| Hub-and-spoke | Central orchestrator, many integrations | Simple point-to-point flows |
| Event-driven | Loose coupling, async processing | Simple request/response is enough |
| Serverless | Infrequent runs, low ops overhead | Always-on, high-throughput |

Document the rejected options briefly.

### Step 3 — Define Layers

For each layer, define:
- Name and responsibility (one sentence)
- What it can call (dependency direction — dependencies flow inward)
- What it cannot call (no circular deps)

### Step 4 — Map External Dependencies

For each external dependency:
- Protocol (REST, SDK, file, webhook, scrape)
- Who owns the contract?
- Fallback if unavailable (retry, cache, skip, alert)

### Step 5 — Sketch the Directory Structure

Propose top-level folder structure. Workers follow this exactly.
Match the project type template below.

### Step 6 — Record Key Decisions as ADRs

```
## ADR-[N]: [Short title]
Status: Accepted
Context: [Why was this decision needed?]
Decision: [What was decided?]
Consequences: [What does this enable or constrain?]
```

---

## Project Type Templates

> AI: Use the template matching the project type from PROJECT-INTAKE.md / PROJECT-TYPES.md.

---

### Template A — Web App (TypeScript)

**Architecture style:** Monolith or Modular monolith

**Layers:**
| Layer | Responsibility |
|-------|---------------|
| UI (front-end) | User-facing pages and components |
| API layer | HTTP routes, request validation |
| Business logic | Core rules, calculations, orchestration |
| Data access | Queries, ORM, migrations |
| Database | Persistent storage |

**Directory structure:**
```
/
├── src/
│   ├── pages/          # or routes/ — UI or API entry points
│   ├── components/     # reusable UI components
│   ├── services/       # business logic
│   ├── db/             # database access, migrations, models
│   └── lib/            # shared utilities, helpers
├── public/             # static assets
├── tests/
├── .env.example
└── package.json
```

---

### Template B — Python API (FastAPI / Flask)

**Architecture style:** Monolith

**Layers:**
| Layer | Responsibility |
|-------|---------------|
| Routes | HTTP endpoints, request/response validation |
| Services | Business logic, orchestration |
| Repositories | Database access, queries |
| Models | Data schemas (Pydantic / SQLAlchemy) |
| Database | Persistent storage |

**Directory structure:**
```
/
├── app/
│   ├── main.py         # app entry point
│   ├── routes/         # endpoint handlers
│   ├── services/       # business logic
│   ├── repositories/   # database access
│   ├── models/         # data models and schemas
│   └── config.py       # settings, env vars
├── tests/
├── migrations/
├── .env.example
└── requirements.txt
```

---

### Template C — Python Scraper / Data Pipeline

**Architecture style:** Pipeline

**Stages:**
| Stage | Responsibility |
|-------|---------------|
| Fetch | Retrieve raw data from sources (HTTP, file, API) |
| Parse | Extract structured data from raw content |
| Transform | Clean, normalise, validate |
| Store | Write to CSV, database, or output file |
| Report | Log results, send alerts if needed |

**Directory structure:**
```
/
├── scraper/
│   ├── main.py         # entry point and orchestration
│   ├── fetcher.py      # HTTP requests or Playwright
│   ├── parser.py       # HTML/JSON parsing
│   ├── transformer.py  # data cleaning and normalisation
│   ├── storage.py      # write CSV, DB, or files
│   └── config.py       # URLs, settings, env vars
├── output/             # generated files (gitignored)
├── tests/
├── .env.example
└── requirements.txt
```

---

### Template D — Python Automation / Script

**Architecture style:** Pipeline or single-script

**Structure:**
```
/
├── main.py             # entry point
├── tasks/              # individual task modules (if multiple tasks)
│   ├── fetch.py
│   ├── process.py
│   └── notify.py
├── config.py           # settings and env vars
├── utils/              # shared helpers
├── logs/               # log output (gitignored)
├── tests/
├── .env.example
└── requirements.txt
```

---

### Template E — WordPress Plugin (PHP)

**Architecture style:** WordPress plugin conventions

**Structure:**
```
/
├── [plugin-name].php   # plugin header and bootstrap
├── includes/
│   ├── class-[name].php        # main class
│   ├── class-[name]-admin.php  # admin-side logic
│   └── class-[name]-public.php # front-end logic
├── admin/
│   ├── css/
│   ├── js/
│   └── partials/       # admin page templates
├── public/
│   ├── css/
│   ├── js/
│   └── partials/       # front-end templates
├── languages/          # i18n .pot file
├── tests/
└── readme.txt
```

---

### Template F — Python Dashboard (Streamlit)

**Architecture style:** Single-page app

**Structure:**
```
/
├── app.py              # Streamlit entry point
├── pages/              # multi-page sections (optional)
├── data/
│   ├── loader.py       # load from CSV, DB, or API
│   └── transformer.py  # prepare data for display
├── components/         # reusable chart/widget functions
├── config.py
├── tests/
├── .env.example
└── requirements.txt
```

---

## The Data Flow Canvas (for any project that moves data)

If the project type is scraper, automation, tracking, attribution, pipeline, or API — map every piece of data through these 9 stages before designing modules. This is the core architecture pattern for this project owner.

```
Stage 1 — INPUT
  What arrives?
  (URL / form submission / click / call / QR scan / CSV / API response / webhook / file)

Stage 2 — ENVELOPE
  Wrap the input with context so it can travel through the system:
  { source, timestamp, route, campaign, retry_count, confidence_score, raw_payload }
  Nothing downstream should need to re-fetch the original source.

Stage 3 — STRATEGY SELECTION
  What processing path does this input need?
  (static HTML / dynamic JS page / REST API / Playwright / CSV / manual fallback)
  Use the Factory pattern to pick the right strategy.

Stage 4 — EXTRACTION
  Collect the raw data from the source.
  Do not mutate, store, or act on it yet.
  Log failures loudly.

Stage 5 — NORMALISATION
  Standardise all fields:
  phone format, email, address, campaign name, UTM, source label, status codes.
  Produce a clean, predictable object.

Stage 6 — VALIDATION
  Are required fields present?
  Is this a duplicate?
  Is the confidence score above threshold?
  Do sanity checks pass?
  Reject loudly, log reason, do not silently discard.

Stage 7 — STORAGE
  Write to the correct destination:
  custom DB table / CSV file / JSON / WordPress meta / Google Sheet / queue

Stage 8 — REPORTING
  Surface the result to the owner:
  dashboard KPI tile / CSV export / digest email / alert / event log

Stage 9 — ACTION
  Trigger any downstream response:
  call client / update campaign / change page / send quote / follow up / alert
```

For each project, fill in this table:

| Stage | What happens here | Module/class responsible |
|-------|------------------|-------------------------|
| Input | | |
| Envelope | | |
| Strategy | | |
| Extraction | | |
| Normalisation | | |
| Validation | | |
| Storage | | |
| Reporting | | |
| Action | | |

This table becomes the backbone of `DATA-FLOW.md` and informs `ARCHITECTURE.md` module names.

---

## Quality Check

- [ ] System boundary is clear (in/out)
- [ ] Dependency directions are explicit (no circular deps)
- [ ] Every external dependency has a fallback noted
- [ ] Directory structure matches the project type template
- [ ] At least one ADR per major decision
- [ ] `ARCHITECTURE.md` is consistent with choices in `DECISIONS-TO-MAKE.md`
- [ ] If project moves data: all 9 data flow stages are mapped in the table above
