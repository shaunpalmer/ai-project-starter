# SHAUN_PROJECT_CANVAS.md — How Shaun Builds (Deep Reference)

> **Hierarchy:** This is the OPTIONAL deep-dive with full worked examples.
> Read the short ones first:
> 1. `SHAUN_DEV_PROFILE.md` — canonical profile (who/what/why)
> 2. `SHAUN-BUILD-PROFILE.md` — code standards (how)
> 3. This file — full examples and detail (only when you need depth)
>
> If anything conflicts, `SHAUN_DEV_PROFILE.md` wins.

---

## The North Star

Every project must answer this before planning starts:

> **Will this help generate leads, capture leads, convert leads, track leads,
> automate work, or protect the business?**

If the answer is no, or unclear, stop and ask before proceeding.

Projects here are commercially grounded first. Technical quality serves the business goal — not the other way around.

---

## Who Shaun Is (context for the AI)

- Digital marketer, web developer, and business owner
- Focused on: SEO, PPC, social media, WordPress, lead generation
- Builds for: service businesses, cleaning companies, agency clients, and his own tools
- Two main brands: **Project Studios** (development) and **Super Clean** (service business)
- Style: practical over trendy, modular over monolithic, owner-readable over developer-readable

---

## 1. Project Identity — Ask These First

Every project needs answers to:

```
What does this project do in plain English?
Why does this matter commercially?
Who is the primary user? (owner / manager / developer / client / customer)
What is the success metric? (leads / calls / bookings / revenue / saved time / fewer errors)
```

The answers drive everything: architecture, UX, reporting, and launch plan.

---

## 2. Architecture Style

**Principle: draw the map before laying the road.**

Core structure to define before any code:

```
Entry point:          (what triggers the system — URL, form, cron, CLI, webhook)
Main modules:         (the named components this system is made of)
Data flow:            (how data moves from input to output)
Admin UI:             (what the owner/admin sees and controls)
Storage:              (database, files, WordPress tables/meta)
External services:    (APIs, payment, email, analytics, telephony)
Reporting:            (how the owner knows it's working)
Failure handling:     (what happens when something breaks)
```

Avoid spaghetti. If a module is doing more than one job, split it.

---

## 3. The Pattern Layer

Use these patterns when the problem fits. Don't use them to show off.

| Problem | Pattern | When to apply |
|---------|---------|--------------|
| Many sequential steps | **Pipeline** | Data transforms: fetch → parse → normalize → store |
| Payload + metadata travelling together | **Envelope** | Tracking, attribution, scraping with context |
| Pick the right class/tool dynamically | **Factory** | Multiple strategies, adapters, or processors |
| Convert one interface to another | **Adapter** | Third-party APIs, GA4, Twilio, payment gateways |
| Swap algorithms without changing callers | **Strategy** | Phone click vs form submit vs QR scan handling |
| Reusable business rules | **Specification** | Lead scoring, qualification, filtering |
| Multi-step dependencies | **DAG** | Workflows where step B needs step A to complete first |
| Flaky APIs or slow pages | **Retry + Backoff** | Scraping, external API calls |
| Protect against repeated failures | **Circuit Breaker** | Any external dependency that can go down |
| Separate writes from reads/reports | **CQRS** | Dashboards with high read volume, separate reporting DB |

**Rule:** use the pattern only when it reduces mess. Don't add patterns to simple things.

---

## 4. The Data Flow Canvas

This is the core architecture Shaun returns to most — especially for tracking, scraping, and lead attribution:

```
1. INPUT
   What arrives? (URL, form submit, click, call, QR scan, CSV, API response, webhook)

2. ENVELOPE
   Wrap the input with context:
   { source, timestamp, route, campaign, retry_count, confidence_score, raw_payload }

3. STRATEGY SELECTION
   What kind of input is this?
   (static HTML / dynamic JS page / REST API / Playwright / manual fallback)

4. EXTRACTION
   Collect raw data without mutating the source.

5. NORMALISATION
   Phone format, email, address, campaign, UTM, source, status — all standardised.

6. VALIDATION
   Required fields present? Duplicate? Confidence score above threshold? Sanity checks pass?

7. STORAGE
   Custom DB table / JSON / CSV / Google Sheet / WordPress options or meta

8. REPORTING
   Dashboard tile / CSV export / digest email / KPI summary / alert

9. ACTION
   Call client / change campaign / update page / send quote / follow up
```

Any project that moves data should map explicitly to these 9 stages before building.

---

## 5. WordPress Plugin Structure

When the project is a WordPress plugin, follow this structure exactly:

```
/plugin-name/
├── plugin-name.php          ← header, constants, bootstrap
├── readme.txt
├── changelog.txt
├── /assets/
│   ├── /css/
│   └── /js/
├── /includes/
│   ├── class-plugin.php           ← main plugin class (hooks only)
│   ├── class-activator.php        ← install DB tables, set defaults
│   └── class-deactivator.php      ← cleanup on deactivate
├── /admin/
│   ├── class-admin-page.php       ← settings, menu registration
│   └── /views/                    ← admin templates (HTML)
├── /frontend/
│   └── class-frontend.php         ← public-facing hooks and output
├── /database/
│   ├── class-installer.php        ← CREATE TABLE, migrations
│   └── class-repository.php       ← all DB queries (no SQL in business classes)
├── /services/
│   ├── class-tracking-service.php ← orchestration / business logic
│   └── class-export-service.php
├── /adapters/
│   ├── class-ga4-adapter.php      ← third-party integrations
│   └── class-twilio-adapter.php
├── /strategies/
│   ├── class-phone-click-strategy.php
│   └── class-form-submit-strategy.php
└── /templates/                    ← front-end template partials
```

**WordPress conventions:**
- Hooks at the edge — `add_action` and `add_filter` only in the main class or bootstrap
- Classes in the middle — business logic never touches `$_POST` or `echo` directly
- Admin UX on top — owner-readable settings, reports, and KPI tiles
- Custom tables underneath — `$wpdb` in the repository class only
- No SQL outside `/database/`
- No `echo` outside `/admin/views/` and `/templates/`
- Sanitise everything in, escape everything out

---

## 6. Code Principles (Practical SOLID)

Not enterprise theatre. These are the ones that matter day-to-day:

| Principle | Shaun version |
|-----------|--------------|
| Single Responsibility | One class, one job. No monster classes. |
| Open/Closed | Add new strategies or adapters without rewriting the core. |
| Interface Segregation | Small interfaces. No giant "god interface." |
| Dependency Inversion | Depend on adapters/contracts, not concrete third-party tools. |
| Simplicity | Use the pattern only when it reduces mess. |

**Code style:**
- Modular, clear, maintainable
- Practical over trendy
- No magic strings — use constants or enums
- No inline credentials or API keys — `.env` only
- One class per file
- Docblocks on every public method

---

## 7. Dashboard / UX Standard

Every project that has a UI should have two modes:

**Owner mode** (default view):
- Calls / leads / bookings today, this week, this month
- What changed vs last period?
- What should I do next?
- KPI tiles (not tables)

**Analyst mode** (secondary view):
- Filters and date ranges
- Tables with sortable columns
- CSV export
- Campaign / source breakdown
- Event log
- Debug / sanity check panel

Owner mode is always the first screen. Analyst mode is always one click away.

---

## 8. Documentation Standard

Every serious project ships with:

| File | Purpose |
|------|---------|
| `PRD.md` | What we're building and why |
| `ARCHITECTURE.md` | How the system fits together |
| `TECH-SPEC.md` | Stack, env vars, patterns |
| `ROADMAP.md` | What ships now vs later |
| `DECISION_LOG.md` | Why choices were made |
| `CHANGELOG.md` | What changed by version |
| `QUICKSTART.md` or `SETUP.md` | How to install/use it in under 10 min |
| `TEST_PLAN.md` | What must pass before release |
| `RUNBOOK.md` | What to do when it breaks |

Minimum viable set for a small project: PRD, ARCHITECTURE, QUICKSTART, CHANGELOG.

---

## 9. Smoke Test Standard

Before calling anything done:

```
☐ Install clean (no prior state)
☐ Activate plugin / run script
☐ Confirm tables / config created
☐ Run one normal workflow end-to-end
☐ Run one failure workflow (bad input, missing field, unreachable URL)
☐ Export data (CSV or API response)
☐ Check logs (something useful is being written)
☐ Check permissions / security (no unprotected endpoints or nonces missing)
☐ Check mobile view (if front-end exists)
☐ Confirm no PHP errors / JS console errors / Python exceptions on normal use
```

---

## 10. Launch Canvas

For any project that ships externally:

```
☐ Problem statement (one sentence, no jargon)
☐ Before/after demo (show the pain, then the fix)
☐ 60-second video or animated GIF
☐ Screenshots of owner mode dashboard
☐ Pricing page or pricing decision
☐ Beta user list
☐ Outreach list (who gets the first email)
☐ LinkedIn post draft
☐ Email sequence draft
☐ Lead magnet (free version, checklist, or calculator)
☐ Support docs (at minimum: QUICKSTART + FAQ)
☐ Upgrade path (what does paying more unlock?)
```

Launch is not separate from development. The sales story is designed while the system is built.

---

## The One-Line Summary

> Commercially grounded, pattern-aware, WordPress-heavy, modular, dashboard-driven —
> turning messy real-world activity into clean systems that generate leads,
> save time, and show owners what to do next.
