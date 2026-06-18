# DECISIONS-TO-MAKE.md — Pre-Build Decisions Checklist

> These decisions must be made before any code is written.
> An unchecked box is a blocked decision. A blocked project is a failed project.
>
> RULE: No coding until all five gates are cleared:
> - [ ] Project type is known
> - [ ] Architecture shape is chosen
> - [ ] Source of truth is defined
> - [ ] Data flow is mapped
> - [ ] First build slice is named

---

## Gate 1 — Project Type

- **What kind of thing is this?** (web app / API / CLI / scraper / automation / other)

  > Answer: ___________

- **Who or what triggers it?** (a human / a schedule / an event / another system)

  > Answer: ___________

- **Where does it run?** (browser / server / local machine / edge / all of the above)

  > Answer: ___________

**Gate 1 cleared?** [ ]

---

## Gate 2 — Architecture Shape

Choose one primary shape. Document why alternatives were rejected.

| Shape | Description | Choose if... |
|-------|-------------|-------------|
| Vertical slice | Feature folders, each owning its own data, logic, UI | You want to ship features independently |
| Horizontal layers | Separate UI / business logic / data layers | You have a large team or complex domain logic |
| Pipeline | Data flows linearly through transformation stages | You're processing data, not serving users |
| Hub-and-spoke | Central core with pluggable integrations | You're building an integration platform |
| Monolith | Everything in one deployable unit | You're a small team moving fast |
| Hybrid | Combination of above | Document the split explicitly |

- **Chosen shape:** ___________
- **Rejected shapes and why:**

  -
  -

**Gate 2 cleared?** [ ]

---

## Gate 3 — Data

### Source of Truth

- **What is the single source of truth for each entity?**

  | Entity | Source of truth | Why here and not elsewhere |
  |--------|----------------|--------------------------|
  | | | |

### Data In

- **What data enters the system?** (user input / external API / file upload / scrape / webhook / other)

  | Data | Source | Format | Frequency |
  |------|--------|--------|-----------|
  | | | | |

### Data Out

- **What data leaves the system?** (API response / UI display / file export / event / webhook / other)

  | Data | Destination | Format | Frequency |
  |------|-------------|--------|-----------|
  | | | | |

### Storage

- **What needs storing?**

  | Data | Temporary or permanent? | Why? |
  |------|------------------------|------|
  | | | |

**Gate 3 cleared?** [ ]

---

## Gate 4 — Database

Pick the simplest option that meets the need. Document the trade-off you are accepting.

| Option | Use when | Trade-off |
|--------|---------|-----------|
| SQLite | Local tool, single user, simple queries | No concurrent writes, no network access |
| PostgreSQL | Multi-user, relational, complex queries | Operational overhead, needs a server |
| MySQL / MariaDB | Legacy ecosystem, read-heavy | Weaker JSON support, fewer features than PG |
| MongoDB | True schemaless, document-heavy | No joins, eventual consistency by default |
| Redis | Cache, sessions, queues, leaderboards | Data loss risk, not a primary store |
| JSON file | Config, tiny datasets, local tools | No querying, no transactions, easy to corrupt |
| CSV | Data export, import, simple logs | No structure, no integrity |
| In-memory | Tests, ephemeral data, prototypes | Lost on restart |

- **Chosen database:** ___________
- **Why this choice:** ___________
- **Trade-off being accepted:** ___________
- **Migration tool:** ___________

**Gate 4 cleared?** [ ]

---

## Gate 5 — First Build Slice

The first slice must:
- Be shippable on its own
- Prove the core hypothesis
- Take no more than 1–3 days to build

- **What is the first working slice?**

  > One sentence: ___________

- **What can wait until slice 2 or later?**

  -
  -
  -

- **What should NOT be built yet?** (premature optimisation, nice-to-haves, edge cases)

  -
  -

**Gate 5 cleared?** [ ]

---

## Remaining Decisions (fill in after gates are cleared)

### Interfaces

- [ ] CLI
- [ ] Web UI
- [ ] Admin page
- [ ] REST API
- [ ] GraphQL API
- [ ] Browser extension
- [ ] Cron / scheduled job
- [ ] Background worker
- [ ] Webhook receiver
- [ ] Other: ___________

**Who or what calls each interface?**

| Interface | Called by | Auth required? |
|-----------|----------|---------------|
| | | |

---

### Contracts

_What objects, payloads, schemas, or API formats must stay stable across versions?_

| Contract | Stability requirement | Owned by |
|----------|----------------------|---------|
| | | |

---

### Security

| Concern | Present? | How handled |
|---------|----------|------------|
| User input sanitisation | [ ] | |
| HTML/SQL escaping | [ ] | |
| API keys / secrets | [ ] | Stored in .env, never committed |
| Personal data (PII) | [ ] | |
| Authentication | [ ] | |
| Rate limiting | [ ] | |
| Scraping limits / ToS | [ ] | |

---

### Testing

- **What proves this works?**

  > ___________

- **What is the smallest useful test?**

  > ___________

- **What failure cases matter most?**

  | Failure case | Impact | Test approach |
  |-------------|--------|--------------|
  | | | |

---

## Decision Log

| # | Decision | Made by | Date | Rationale |
|---|----------|---------|------|-----------|
| 1 | | | | |
