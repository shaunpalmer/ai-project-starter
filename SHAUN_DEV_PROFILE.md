# SHAUN_DEV_PROFILE.md — Developer Profile

> AI: read this once, early. It tells you how Shaun thinks and builds.
> This is the canonical profile. SHAUN-BUILD-PROFILE.md and SHAUN_PROJECT_CANVAS.md expand on it.

---

## The Short Version

Shaun is a **business-first systems builder**: part WordPress developer, part automation engineer, part SEO/lead-gen strategist, part practical architect. 23+ years experience.

His strength is seeing the whole system: where the lead enters, where the data goes, where the business value is, and where the code will become a mess if it isn't structured early.

**Default mental model:** build the map first, choose the pattern first, then let the AI write code inside the rails.

---

## 1. Project Categories

| Type | What he builds |
|------|----------------|
| WordPress plugins | Tracking tools, admin pages, forms, blocks, analytics, calculators, custom tables |
| PHP projects | Plugin architecture, `$wpdb`, prepared SQL, business logic, service layers |
| Plain web | Business sites, landing pages, SEO pages, Bootstrap/Tailwind, conversion-focused |
| Python automation | Scrapers, CSV processing, file workflows, data cleanup, enrichment, reporting |
| Scraping pipelines | Directory/lead scraping, NAP/email extraction, staged JSON → CSV flows |
| Networking scripts | Fedora/Linux failover, nmcli, routing checks, Bash-first then Python |
| AI / local model | Ollama, LM Studio, Obsidian/RAG tools, local assistants, lead-gen automation |
| Business ops | Quoting, invoicing, pricing calculators, lead tracking, dashboards |

Nearly every serious project has a **lead, booking, call, quote, or campaign angle**.

---

## 2. Coding Style

**Prefers:**
- OOP over procedural (once a project grows)
- Procedural only when simpler (small WordPress glue, direct `$wpdb`)
- Modular classes, clear single responsibility
- Autoloaders where the project deserves structure
- Factory / Adapter / Strategy when tools or behaviours swap
- Pipelines when data moves through stages
- Envelope pattern when data needs metadata/context
- Retry/backoff + circuit breaker for flaky pages, APIs, network checks
- **Simple first, scalable second** — not trendy complexity for its own sake

**Dislikes:**
- Spaghetti code, mystery folders, unclear naming
- Over-engineering
- "Use MongoDB because it's trendy" thinking
- Dashboards only developers understand
- AI answers that don't know the actual project shape

---

## 3. Pattern Cheat-Sheet

| Problem | Pattern |
|---------|---------|
| Many sequential steps | Pipeline |
| Data + metadata travelling together | Envelope |
| Pick the right tool/class | Factory |
| Convert mismatched interface | Adapter |
| Swap algorithm | Strategy |
| Dependent multi-step workflow | DAG |
| Flaky external service | Retry + Backoff |
| Repeated failures cascading | Circuit Breaker |

Use a pattern only when it reduces mess.

---

## 4. The Stack

| Area | Tools |
|------|-------|
| Backend | PHP, WordPress, Python, some Node/TypeScript |
| Frontend | HTML, CSS, vanilla JS, Bootstrap, Tailwind, Vue, WordPress blocks |
| WordPress | Custom plugins, hooks, REST endpoints, custom DB tables, Blocksy, WPForms |
| Automation | Python, Bash, PowerShell; cron/systemd when state/logging grows |
| Scraping | Playwright, Cheerio, Axios, BeautifulSoup; JSON/CSV output |
| Data | MySQL/MariaDB (WordPress), SQLite (lightweight local), CSV/JSON (transport) |
| Dev env | Fedora/Linux (transitioning), Windows/XAMPP, VS Code, GitHub, terminal-heavy |
| AI / local | Ollama, LM Studio, local LLMs, Obsidian/RAG concepts |

---

## 5. Project Setup Pattern (his natural shape)

```
idea
→ business purpose
→ project folder
→ notes / PRD / roadmap
→ architecture sketch
→ data flow
→ modules / classes
→ adapters / strategies
→ storage
→ admin / dashboard
→ exports / reports
→ smoke tests
→ launch / lead-gen angle
```

---

## 6. Data-Flow Instinct

```
collect
→ wrap in envelope
→ clean
→ validate
→ enrich
→ dedupe
→ store
→ export
→ report
→ act
```

He's not just collecting data — he's building **decision systems**.

---

## 7. Dashboard / UX Style

Dashboards should answer, in one glance:
- How many leads?
- Where did they come from?
- What changed?
- What should I do next?
- Can I export it?

Two modes: **owner mode** (KPI tiles, plain English) and **analyst mode** (filters, tables, exports).
Owner mode first, always.

---

## 8. Recurring Themes

| Theme | How it shows up |
|-------|-----------------|
| Lead generation | Most projects have a lead/booking/call/quote angle |
| Service-business practicality | Builds from owner/operator pain, not theory |
| Automation | Always hunting repetitive admin/scraping/reporting to automate |
| Local / self-hosted | Avoids paid APIs / SaaS lock-in when a local tool works |
| Architecture repair | Starts by asking "how do we stop this becoming spaghetti?" |
| AI-assisted workflow | Wants notes/docs/structure clear enough for AI to pick up fast |
| Plain-English UX | Especially for owners, managers, non-technical users |
| Commercial packaging | Thinks about pricing, launch, outreach, demos early |

---

## 9. Active / Recurring Projects

- **LeadStream** — WordPress-native attribution: phone/click/UTM/QR tracking, GA4 dedup, Twilio, owner dashboards, CSV/JSON export, weekly digests.
- **At Your Service** — service-business plugin: invoicing, pricing calculators, booking/lead flows.
- **Starfleet Command Algorithm** — backend using the Hungarian algorithm; TypeScript, Vue, PHP, MySQL.
- **Scraper / pipeline systems** — business/motel lead extraction, NAP/email capture, JSON/CSV pipeline.
- **Networking / failover scripts** — Fedora/Linux route monitoring, Wi-Fi/wired failover, safe Bash-first.
- **Obsidian / local knowledge system** — note processing, local RAG, AI-readable vaults.
- **Project Studios / Super Clean** — WordPress, SEO, conversion, local lead-gen.

---

## 10. How To Work With Shaun

- He defines system logic and big-picture strategy. You execute inside it.
- Don't guess architecture — if it's not specified, ask.
- Don't suggest trendy tech without a project-shape reason.
- Keep it clean, explicit, and business-readable.
- Default to his patterns (section 3) before inventing anything.
