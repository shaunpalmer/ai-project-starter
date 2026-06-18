# SHAUN-BUILD-PROFILE.md — How Shaun Thinks (Code Standards)

> **Hierarchy:** `SHAUN_DEV_PROFILE.md` is the canonical profile (who/what/why).
> This file is the **code-standards layer** (how to write the code).
> `SHAUN_PROJECT_CANVAS.md` is the optional deep-dive with full examples.
> If anything conflicts, `SHAUN_DEV_PROFILE.md` wins.

AI: read `SHAUN_DEV_PROFILE.md` first, then use this for concrete code rules.

---

## The North Star

Every project must answer: **Will this generate leads, capture leads, convert leads, track leads, automate work, or protect the business?**

If the answer is unclear, ask. A project without commercial reason is a hobby.

---

## What Shaun Builds

| Category | Examples |
|----------|----------|
| WordPress plugins | Tracking, export, lead attribution, admin dashboards |
| Web interfaces | Login, data display, report export, lead capture forms |
| Scraping pipelines | Competitor tracking, lead sources, price monitoring |
| Automation | Lead qualification, workflow routing, data normalization |
| Dashboards | KPI summaries, lead sources, attribution, performance |
| Networking tools | Service discovery, monitoring, integration health checks |
| Local tools | Obsidian plugins, file processors, workflow scripts |

---

## The Shaun Stack

**You will use these. Do not suggest anything else without flagging it.**

| Layer | Languages / Tools |
|-------|-------------------|
| Back-end | PHP, Python, TypeScript/Node |
| Front-end | HTML, CSS, JavaScript, TypeScript |
| Storage | MySQL, MariaDB, SQLite, JSON, CSV |
| UI frameworks | Bootstrap, Tailwind |
| CMS | WordPress |
| Config | .env, JSON, YAML |

---

## Code Philosophy

**Build the map first. Define the pattern first. Let the AI write code inside the rails.**

Not vibe coding. Pattern-led development.

---

## Patterns Shaun Likes

Use these when the problem fits. Don't use them for show.

| Problem | Pattern | Example |
|---------|---------|---------|
| Many steps | **Pipeline** | Scraper: fetch → parse → normalize → validate → store |
| Payload + metadata | **Envelope** | Tracking: carry source, UTM, timestamp through all stages |
| Pick right tool | **Factory** | Scraper: static HTML vs JS-required vs API |
| Convert interface | **Adapter** | GA4 adapter, Twilio adapter, third-party integrations |
| Swap algorithm | **Strategy** | Phone click vs form submit vs QR code handling |
| Reusable rules | **Specification** | Lead scoring, qualification filters |
| Dependent steps | **DAG** | Workflows where B depends on A finishing first |
| Flaky APIs | **Retry + Backoff** | External services, scraping |
| Prevent cascades | **Circuit Breaker** | Stop hammering a service that's down |
| Separate reads | **CQRS** | Dashboards with high read volume, separate reporting DB |

**Use the pattern only when it reduces mess. Don't add patterns to simple things.**

---

## Architecture Preferences

| Principle | Shaun's Version |
|-----------|-----------------|
| **OOP over procedural** | Classes and interfaces. One class, one job. |
| **Single responsibility** | Don't mix concerns. No monster 500-line files. |
| **Clear interfaces** | Contract between modules is explicit. |
| **Data flowing through stages** | Input → transform → output. Not scattered globals. |
| **Clean folders** | Related code in the same place. No src/ soup. |

---

## Database Rules (Not Trends)

**Choose storage by project type and data lifetime, NOT by fashion.**

| Project type | Storage | Why |
|--------------|---------|-----|
| WordPress plugin | MySQL/MariaDB | Required by WordPress |
| Local automation | SQLite | Zero setup, single-user, no server |
| Scraping pipeline | SQLite + CSV/JSON | Transient cache + portable export |
| Web app multi-user | MySQL/MariaDB or PostgreSQL | Reliable, scales, proven |
| Temporary data | In-memory or JSON | No persistence needed |
| Document-heavy | MongoDB | *Only if flexible JSON schema truly helps. Otherwise SQLite + JSON.* |

**Never choose MongoDB because it's fashionable. Never choose PostgreSQL because you think you might scale.**

---

## Data Movement Architecture

Any project that moves data should map to these 9 stages before building:

```
1. INPUT           → URL, form, click, API, file, webhook
2. ENVELOPE        → wrap with source, timestamp, route, campaign, retry_count
3. STRATEGY        → pick the right processor (static / JS / API / manual)
4. EXTRACTION      → collect raw data without mutating source
5. NORMALISATION   → standardise phone, email, date, status codes
6. VALIDATION      → required fields? duplicate? confidence score okay?
7. STORAGE         → DB, CSV, JSON, API, destination
8. REPORTING       → dashboard tile, email, export, alert
9. ACTION          → call client, change campaign, follow up
```

**Every project that processes data should have these 9 stages mapped before coding starts.**

---

## WordPress Plugin Structure

**If the project is a WordPress plugin:**

```
/plugin-name/
├── plugin-name.php           ← header, constants, bootstrap
├── /includes/
│   ├── class-plugin.php      ← main class, load hooks/filters only
│   └── class-activator.php  ← create tables, set defaults
├── /admin/
│   └── class-admin.php       ← admin pages, settings UI
├── /database/
│   ├── class-installer.php  ← CREATE TABLE, no SQL elsewhere
│   └── class-repository.php ← all queries here
├── /services/
│   └── class-*.php           ← business logic, no SQL in here
├── /adapters/
│   └── class-*-adapter.php  ← external API integrations
└── /templates/
    └── *.php                 ← front-end output, HTML only
```

**Rules:**
- Hooks only in `class-plugin.php`
- No SQL outside `/database/class-repository.php`
- No direct `echo` outside `/admin/` and `/templates/`
- Sanitise all input, escape all output
- Nonce on every form
- `current_user_can()` on every admin action

---

## UI / Dashboard Pattern

Every interface should have two modes:

**Owner mode (default first screen):**
- KPI tiles (calls today, leads today, bookings today)
- What changed vs last period?
- What should I do next?
- Simple, clear, decision-ready

**Analyst mode (one click away):**
- Filters and date ranges
- Sortable tables
- CSV export
- Campaign/source breakdown
- Event log / debug panel

Owner sees metrics. Analyst sees data.

---

## Code Style Quick Rules

| Rule | Example |
|------|---------|
| No magic strings | Use `PLUGIN_NAME_VERSION`, not `"1.0.0"` |
| One class per file | Not 5 classes in utils.php |
| No inline secrets | `.env` only. No API keys in code. |
| All functions have docs | Docblock on every public function |
| No silent failures | If it fails, log it. Fail loudly. |
| Validate input | Every `$_POST`, every API param |
| Escape output | Every `echo`, every JSON response |
| Test first slice | Prove one end-to-end flow works |

---

## Testing Approach

**Shaun's testing style: practical, not comprehensive.**

Before shipping:

- [ ] Smoke test: install clean → activate → run one workflow
- [ ] Failure case: wrong input → what happens? logged?
- [ ] Export or report: does output format match spec?
- [ ] Mobile view: (if front-end exists)
- [ ] Security: no auth bypass, no secrets in logs
- [ ] Logs make sense: someone can debug from logs

Don't write 1000 unit tests. Write 5 tests that prove the thing works.

---

## Documentation Shaun Uses

Minimum viable docs:

| Doc | Purpose |
|-----|---------|
| `PRD.md` | What problem does this solve? Who uses it? |
| `ARCHITECTURE.md` | How is the code structured? What goes where? |
| `TECH-SPEC.md` | What stack? What env vars? |
| `QUICKSTART.md` or `SETUP.md` | How to get running in 10 minutes |
| `CHANGELOG.md` | What changed in each version |

That's it for small projects. For large projects, add: ROADMAP, DECISION_LOG, TEST_PLAN, RUNBOOK.

---

## No Spaghetti

Shaun dislikes:

- Unclear state (`this.config` set in three places, read in four)
- Magic behaviour (code that works but nobody knows why)
- Procedural mess where OOP would be clearer
- Database access scattered through the codebase
- HTML mixed with business logic
- Unlogged decisions (why was this pattern chosen?)
- AI guessing the architecture
- Trendy choices justified by "it's popular"

---

## The One-Line Summary

**Commercially grounded, pattern-aware, OOP-first, modular, dashboard-driven, routing messy data through known stages into clean storage and actionable reports.**

Build the map first. The AI fills in the code.
