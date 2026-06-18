# SKILL: Stack Selector

## Purpose

Pick the right language and framework for a project from the approved stack, document the choice in `TECH-SPEC.md`, and explain the trade-off being accepted.

## Approved Stack

This project owner uses: **Python, TypeScript, JavaScript, PHP, HTML, CSS.**

No other languages or frameworks should be suggested without flagging it explicitly and explaining why the approved stack cannot meet the need.

## When to Use

- After project type is confirmed in `PROJECT-INTAKE.md` / `PROJECT-TYPES.md`
- Before writing `TECH-SPEC.md`
- When there is disagreement or uncertainty about which language to use

---

## Decision Tree

Work through this tree top-to-bottom. Stop at the first match.

```
1. Is this a WordPress plugin or theme?
   → PHP (required by WordPress)
   → HTML/CSS for templates
   → JavaScript for admin UI interactions

2. Is this a scraper, automation script, data pipeline, or CLI tool?
   → Python
   → No framework needed for small scripts
   → Click or Typer for CLI
   → requests + BeautifulSoup for simple scraping
   → Playwright for JavaScript-heavy sites

3. Is this a web app with a meaningful front-end?
   → TypeScript + HTML/CSS
   → Vanilla TS for simple apps
   → Ask: does it need a framework? Only add one if the UI is complex.

4. Is this an API / backend service?
   → Python (FastAPI for APIs with validation; Flask for simple/small)
   → TypeScript/Node (Express or Hono) if it's tightly coupled to a TypeScript front-end

5. Is this a dashboard or reporting tool?
   → Python + Streamlit (fast build, internal use)
   → TypeScript if it needs to be embedded in a web app or shared publicly

6. Is this a simple browser script or lightweight front-end widget?
   → JavaScript (vanilla, no build step)
   → TypeScript only if complexity justifies a build step
```

---

## Framework Defaults by Language

### Python

| Use case | Framework/Library | Why |
|----------|-----------------|-----|
| Web API | FastAPI | Auto docs, Pydantic validation, async support |
| Simple web API | Flask | Minimal setup, good for small services |
| Scraping (static HTML) | requests + BeautifulSoup | Lightweight, no browser needed |
| Scraping (JavaScript sites) | Playwright | Full browser control |
| CLI | Click or Typer | Clean API, auto help text |
| Dashboard | Streamlit | Fastest path to a working UI |
| Task scheduling | schedule or APScheduler | Simple cron-like scheduling in Python |
| Database ORM | SQLAlchemy (async for FastAPI) | Mature, migration-friendly |
| Migrations | Alembic | Pairs with SQLAlchemy |
| Validation | Pydantic | First-class in FastAPI, works standalone too |

### TypeScript / JavaScript

| Use case | Framework/Library | Why |
|----------|-----------------|-----|
| Node API | Express or Hono | Mature (Express) or fast/lightweight (Hono) |
| Front-end framework | None by default — only add if justified | Avoid framework overhead for simple UIs |
| Build tool | Vite | Fast, sensible defaults |
| ORM | Drizzle or Prisma | Type-safe, good DX |
| Validation | Zod | Type-safe schema validation |
| Testing | Vitest | Vite-native, fast |

### PHP (WordPress)

| Use case | Library | Why |
|----------|---------|-----|
| Plugin base | WordPress Plugin API | Standard hooks (add_action, add_filter) |
| Custom DB tables | $wpdb | WordPress-native, safe |
| Settings pages | WordPress Settings API | Handles nonces, sanitisation |
| REST endpoints | register_rest_route() | WordPress-native REST |
| Asset enqueueing | wp_enqueue_script/style | Correct dependency management |

---

## Trade-Offs to Document

When you choose a stack, record the accepted trade-off in `TECH-SPEC.md` and `DECISIONS-TO-MAKE.md`.

| Choice | Trade-off accepted |
|--------|--------------------|
| Python | Slower than compiled languages; not native in the browser |
| FastAPI over Flask | Slightly more setup; worth it for validation and auto docs |
| TypeScript over JavaScript | Build step required; worth it for type safety on complex front-ends |
| Playwright over requests | Much slower and heavier; only justified when JS rendering is required |
| Streamlit over custom UI | Limited styling control; fast to build, hard to customise deeply |
| SQLite over PostgreSQL | No concurrent writes; not suitable for multi-user production |
| PHP/WordPress | Locked to WordPress conventions; fast for WP projects, irrelevant outside them |

---

## Output

Update `TECH-SPEC.md` with:

```markdown
## Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Language | [Python 3.11 / TypeScript 5 / PHP 8.2] | | |
| Framework | [FastAPI / Flask / Express / None] | | |
| Database | [SQLite / PostgreSQL / None] | | |
| Front-end | [HTML/CSS + vanilla JS / TypeScript / None] | | |
```

## Quality Check

- [ ] Stack matches the approved language list (Python / TypeScript / JavaScript / PHP / HTML / CSS)
- [ ] Trade-off is documented
- [ ] Framework choice is justified (not just "popular")
- [ ] No framework added without a reason
- [ ] `TECH-SPEC.md` is updated
- [ ] `DECISIONS-TO-MAKE.md` Gate 4 can now be cleared
