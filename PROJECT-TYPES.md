# PROJECT-TYPES.md — Type Router and Patterns

AI: Use this file to classify the project from PROJECT-INTAKE.md and load the correct patterns, database, structure, and skills.

**Do not prescribe patterns that don't match the type.**

---

## Type 1: WordPress Plugin

**When:** Project type in PROJECT-INTAKE.md is "WordPress plugin"

**Architecture:**
- OOP plugin class structure
- Hooks (add_action, add_filter) only in bootstrap
- Classes for each responsibility (admin, frontend, services, database)
- Custom DB tables with $wpdb->prepare()
- Admin settings page or dashboard
- REST endpoints (optional)

**Database:**
- MariaDB/MySQL (required by WordPress)
- Custom table(s) for plugin data
- WordPress post/meta for content
- No additional storage needed

**Folder structure:**
```
/plugin-name/
├── plugin-name.php (header, bootstrap)
├── /includes/ (class-plugin.php, class-activator.php)
├── /admin/ (admin page, settings)
├── /frontend/ (shortcodes, widgets)
├── /database/ (installer, repository)
├── /services/ (business logic)
├── /adapters/ (external integrations)
└── /templates/ (front-end output)
```

**Skills to load:**
- `wordpress-plugin` (mandatory)
- `database-design` (if custom tables needed)
- `api-design` (if REST endpoints needed)

**What NOT to do:**
- Don't use MongoDB
- Don't abstract away WordPress conventions
- Don't put SQL outside the repository layer
- Don't echo output outside views/templates

**First build slice:**
- Plugin activates cleanly
- Custom tables created
- One admin page or dashboard tile works
- No functions, only classes

---

## Type 2: PHP Web Interface

**When:** Project type in PROJECT-INTAKE.md is "PHP web interface"

**Architecture:**
- MVC-style separation (models, views, controllers)
- Classes, not procedural code
- Repository pattern for database access
- Service layer for business logic
- Simple front-end (Bootstrap or Tailwind)
- No framework required for small projects

**Database:**
- MySQL / MariaDB for persistent data
- SQLite for local-only / single-user projects
- Choose based on deployment target

**Folder structure:**
```
/project/
├── public/ (index.php, front-end files)
├── app/
│   ├── controllers/ (request handlers)
│   ├── models/ (data classes)
│   ├── repositories/ (database queries)
│   ├── services/ (business logic)
│   └── config.php
├── views/ (HTML templates)
├── migrations/ (DB schema changes)
├── tests/
└── .env.example
```

**Skills to load:**
- `architecture-canvas` (to design the MVC structure)
- `database-design` (schema)

**What NOT to do:**
- Don't mix HTML and SQL in one file
- Don't add a framework "because it's standard"
- Don't put business logic in controllers

**First build slice:**
- Index page loads
- One CRUD operation works (create or read)
- Database connection verified

---

## Type 3: TypeScript Automation

**When:** Project type in PROJECT-INTAKE.md is "TypeScript automation"

**Architecture:**
- Node.js script or CLI tool
- Config file (JSON or .env)
- Logging (console or file)
- Dry-run mode (preview, don't execute)
- Error handling with retry
- Graceful failure

**Database:**
- SQLite (if local processing needed)
- JSON file (if config-like data)
- No database if stateless

**Folder structure:**
```
/project/
├── src/
│   ├── index.ts (entry point)
│   ├── config.ts (settings, env vars)
│   ├── tasks/ (individual tasks)
│   ├── utils/ (helpers)
│   └── types/ (type definitions)
├── bin/ (CLI wrapper)
├── tests/
├── .env.example
└── package.json
```

**Skills to load:**
- `stack-selector` (Node.js + TypeScript)
- `api-design` (if calling external APIs)

**What NOT to do:**
- Don't hard-code configuration
- Don't ignore errors silently
- Don't skip logging

**First build slice:**
- Script runs without error
- Config file loads
- One task completes successfully
- Logs are written

---

## Type 4: Python Automation

**When:** Project type in PROJECT-INTAKE.md is "Python automation"

**Architecture:**
- Script or CLI (Click/Typer for larger tools)
- Config file (JSON, YAML, or .env)
- Logging (file and/or console)
- Dry-run mode
- Error handling and retry logic
- Can run unattended or manual trigger

**Database:**
- SQLite (if persistent state needed)
- JSON or pickle (if temporary state)
- No database if stateless

**Folder structure:**
```
/project/
├── main.py (entry point)
├── tasks/ (individual operations)
├── utils/ (helpers)
├── config.py (settings)
├── logs/ (output)
├── tests/
├── .env.example
└── requirements.txt
```

**Skills to load:**
- `stack-selector` (Python + specific library)
- `api-design` (if calling external APIs)

**What NOT to do:**
- Don't hard-code credentials or API keys
- Don't skip error handling
- Don't assume files exist

**First build slice:**
- Script runs and produces one output
- Logging works
- One retry or error case handled
- Config file loads

---

## Type 5: Scraping Pipeline

**When:** Project type in PROJECT-INTAKE.md is "Scraping pipeline"

**Architecture:**
- Pipeline stages: Fetch → Parse → Normalize → Validate → Store → Export
- Adapter pattern for different page types or APIs
- Envelope pattern (carry context through stages)
- Factory pattern for strategy selection
- Error handling: log loudly, don't skip
- Rate limiting and retry logic
- Validation before storage

**Database:**
- SQLite (local cache, persistent results)
- CSV/JSON export (for delivery or next stage)
- API destination (Airtable, Zapier, webhook)

**Folder structure:**
```
/scraper/
├── main.py (orchestration)
├── fetcher.py (HTTP requests, Playwright)
├── parser.py (HTML/JSON parsing)
├── normalizer.py (data cleaning)
├── validator.py (data validation)
├── storage.py (DB or file writes)
├── adapters/ (service-specific configs)
├── output/ (generated files)
├── logs/
├── config.py
├── requirements.txt
└── .env.example
```

**Skills to load:**
- `scraping-pipeline` (mandatory)
- `database-design` (if using SQLite)

**What NOT to do:**
- Don't scrape without checking ToS
- Don't ignore rate limits
- Don't discard data on validation error — log it
- Don't hard-code URLs

**First build slice:**
- Fetch one URL → parse → write to CSV
- Logging shows what happened
- One error case handled gracefully
- Retry works

---

## Type 6: API Service

**When:** Project type in PROJECT-INTAKE.md is "API service"

**Architecture:**
- REST (or specified protocol)
- Request validation (Pydantic for FastAPI, Zod for Express)
- Service layer for business logic
- Repository layer for data access
- Error handling with consistent response format
- Logging of requests and errors
- Rate limiting and authentication

**Database:**
- PostgreSQL or MySQL for relational data
- No database if stateless

**Folder structure (Python/FastAPI):**
```
/api/
├── main.py (FastAPI app, routes)
├── routes/ (endpoint handlers)
├── services/ (business logic)
├── repositories/ (database queries)
├── models/ (Pydantic schemas)
├── config.py
├── migrations/ (Alembic or equivalent)
├── tests/
├── requirements.txt
└── .env.example
```

**Skills to load:**
- `api-design` (mandatory)
- `database-design` (if database needed)

**What NOT to do:**
- Don't trust user input
- Don't return database errors to clients
- Don't skip validation

**First build slice:**
- One endpoint works (GET or POST)
- Request validation works
- Error response is formatted correctly
- Basic auth or API key works

---

## Type 7: Dashboard / Reporting Interface

**When:** Project type in PROJECT-INTAKE.md is "Dashboard / reporting interface"

**Architecture:**
- Owner mode first (KPI tiles, key metrics)
- Analyst mode second (tables, filters, exports)
- Data loading from database or API
- No stored state (stateless)
- Simple, fast response

**Database:**
- Read-only connection (if needed)
- Reports from existing data store
- No write operations from UI

**Folder structure (Python/Streamlit):**
```
/dashboard/
├── app.py (Streamlit entry)
├── pages/ (multi-page sections)
├── data/ (loaders, transformers)
├── components/ (chart functions)
├── config.py
└── requirements.txt
```

**Skills to load:**
- `interface-design` (mandatory)
- `database-design` (if custom queries needed)

**What NOT to do:**
- Don't hard-code data
- Don't force analyst mode before owner mode
- Don't forget to cache slow queries

**First build slice:**
- One KPI tile displays correctly
- Data refreshes on reload
- One table or chart works

---

## Type 8: Networking / Monitoring Tool

**When:** Project type in PROJECT-INTAKE.md is "Networking / monitoring script"

**Architecture:**
- Observe mode first (read-only, log findings)
- Active mode second (make changes, with confirmation)
- Dry-run before execution
- Rollback / fallback always available
- Log every action
- Never destroy without explicit confirmation

**Database:**
- SQLite (for state, cache, history)
- JSON (for config and logs)

**Folder structure:**
```
/tool/
├── main.py
├── observe.py (read-only operations)
├── actions.py (state-changing operations)
├── config.py (settings)
├── logs/
├── requirements.txt
└── .env.example
```

**Skills to load:**
- `stack-selector` (Python + specific library)

**What NOT to do:**
- Don't skip confirmation before active mode
- Don't destroy existing state without backup
- Don't operate without logging
- Don't assume network is reliable

**First build slice:**
- Script runs in observe mode
- Reports what it would do
- Doesn't change anything yet

---

## Type 9: Local AI / Workflow Tool

**When:** Project type in PROJECT-INTAKE.md is "Local AI / workflow tool"

**Architecture:**
- Simple interface (Obsidian plugin, local server, web UI)
- Markdown or JSON storage
- State in local files
- Optional: local LLM or API integration
- CLI or simple server

**Database:**
- File-based (Markdown, JSON)
- SQLite (if structured data needed)

**Folder structure:**
```
/tool/
├── main.py or index.ts
├── storage/ (load/write files)
├── ai/ (LLM integration)
├── ui/ (interface)
├── config.py
└── .env.example
```

**Skills to load:**
- `stack-selector` (language + framework)
- `api-design` (if calling external AI)

**What NOT to do:**
- Don't break the user's existing files
- Don't assume file paths
- Don't forget undo/recovery

**First build slice:**
- Reads local file
- Processes it
- Writes output
- No data loss

---

## Summary Table

| Type | Primary database | Pattern | First build slice |
|------|------------------|---------|-------------------|
| WordPress plugin | MySQL/MariaDB | OOP classes, hooks | Activate, create table, show one KPI |
| PHP web interface | MySQL/MariaDB or SQLite | MVC, repository | Index page, one CRUD operation |
| TypeScript automation | SQLite or none | Config, logging, dry-run | Run and log, config loads |
| Python automation | SQLite or none | Config, logging, dry-run | Run one task, log output |
| Scraping pipeline | SQLite + CSV/JSON | Pipeline + adapters | Fetch → parse → export |
| API service | PostgreSQL or MySQL | REST routes, services | One endpoint works, validation passes |
| Dashboard | Read-only source | Owner mode first | One KPI tile displays |
| Networking tool | SQLite or file | Observe mode first | Read-only run, log findings |
| Local AI tool | File-based | Simple storage | Read, process, write |

---

## Decision Flow for AI

1. **Read PROJECT-INTAKE.md Q3.**
2. **Find your type in this file.**
3. **Use the database choice from the table.**
4. **Use the folder structure.**
5. **Load only the relevant skills listed.**
6. **Build the first slice first.**
7. **Never deviate from the pattern without asking.**
