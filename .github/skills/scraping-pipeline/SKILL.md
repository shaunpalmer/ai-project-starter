# SKILL: Scraping Pipeline

## Purpose

Design and implement a reliable, polite, maintainable web scraping pipeline that handles rate limits, retries, schema changes, and data quality.

## When to Use

- Building a new scraper for any target site
- Redesigning a brittle existing scraper
- Adding a new data source to an existing pipeline

## Inputs Required

- [ ] Target URL(s) and data to extract
- [ ] `DATA-FLOW.md` — where scraped data goes
- [ ] `DATABASE.md` — schema for storing results
- [ ] Legal/ToS check completed (document in `PRD.md`)

## Pipeline Stages

```
Scheduler → Fetcher → Parser → Validator → Transformer → Loader → Monitor
```

### Stage 1 — Scheduler

Responsibilities:
- Trigger scrape jobs on a schedule or event
- Track which URLs are queued, in-flight, done, failed
- Enforce crawl politeness (delay between requests)

Decisions:
- [ ] Cron / queue-based / event-driven?
- [ ] Crawl delay: _____ ms between requests to same domain
- [ ] Robots.txt: respected? (document if not)

### Stage 2 — Fetcher

Responsibilities:
- HTTP requests with retry and backoff
- Header rotation / user-agent management
- Proxy rotation (if required)
- Render JavaScript (if required)

Retry strategy:
```
Attempt 1 → immediate
Attempt 2 → 2s delay
Attempt 3 → 8s delay
Attempt 4 → 32s delay
Give up → mark as failed, alert
```

Tool selection:
| Need | Tool |
|------|------|
| Static HTML | httpx / requests / got |
| JS rendering | Playwright / Puppeteer |
| Anti-bot protection | Crawlee / Apify / residential proxy |

### Stage 3 — Parser

Responsibilities:
- Extract structured data from raw HTML/JSON
- Use CSS selectors or XPath (document which and why)
- Never use regex on HTML — use a parser

Schema:
```
Raw HTML → { field: value, field: value, ... }
```

Fragility note: Document the selectors used. When the site changes, this is what breaks first.

### Stage 4 — Validator

Responsibilities:
- Validate each extracted field against expected types/ranges
- Reject records that fail validation (don't silently drop fields)
- Log validation failures with the source URL

```python
# Example validation
assert isinstance(price, float), f"Expected float, got {type(price)}"
assert 0 < price < 1_000_000, f"Price out of range: {price}"
```

### Stage 5 — Transformer

Responsibilities:
- Normalise data (dates, currencies, strings)
- Map to target schema from `DATABASE.md`
- Handle deduplication logic

### Stage 6 — Loader

Responsibilities:
- Upsert records (not blind insert — handle re-runs)
- Write to store defined in `DATABASE.md`
- Emit event on completion (for downstream consumers)

Upsert key: document which field(s) uniquely identify a record.

### Stage 7 — Monitor

Responsibilities:
- Track: records fetched / parsed / validated / loaded / failed per run
- Alert on: >5% validation failure rate, zero records loaded, fetch error rate >10%
- Store run metadata: start time, end time, record counts, errors

## Output

- Pipeline implementation in `src/scrapers/[target-name]/`
- Schema additions in `DATABASE.md`
- Data flow additions in `DATA-FLOW.md`

## Quality Check

- [ ] Legal/ToS documented
- [ ] Robots.txt behaviour documented
- [ ] Retry strategy implemented with backoff
- [ ] Validation rejects bad records (doesn't silently drop fields)
- [ ] Upsert key defined (pipeline is idempotent)
- [ ] Monitor tracks failure rates and alerts
- [ ] Selectors documented (so breakage is diagnosable)
