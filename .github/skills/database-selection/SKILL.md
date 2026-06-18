# SKILL: Database Selection

## Purpose

Objectively select the right storage technology for each data type in the system — preventing the "use Postgres for everything" or "use MongoDB because it's trendy" failure modes.

## When to Use

- Before starting `database-design` skill
- When adding a new data concern (caching, search, time-series, etc.)
- When re-evaluating an existing storage decision

## Inputs Required

- [ ] `DATA-FLOW.md` — read/write patterns, volumes, frequency
- [ ] `TECH-SPEC.md` — hosting constraints, existing stack
- [ ] `PRD.md` — consistency and availability requirements

## Process

### Step 1 — Classify Data Concerns

For each type of data in the system, classify:

| Data type | Shape | Access pattern | Volume | Consistency need |
|-----------|-------|---------------|--------|-----------------|
| | Relational / Document / Key-Value / Time-series / Graph | Read-heavy / Write-heavy / Mixed | Low / Medium / High | Strong / Eventual |

### Step 2 — Apply Selection Rules

Use these rules as defaults. Override with documented justification only.

| Need | Default choice | When to deviate |
|------|---------------|-----------------|
| Structured relational data | PostgreSQL | Extreme scale (> 10TB), then consider sharding or Spanner |
| Key-value / session cache | Redis | Persistence not needed → use in-memory only |
| Full-text search | PostgreSQL FTS or Meilisearch | Elastic-scale corpus → Elasticsearch |
| Time-series / metrics | TimescaleDB or InfluxDB | Already have Prometheus → use it |
| Document store | PostgreSQL JSONB | True schemaless polymorphism → MongoDB |
| Graph relationships | PostgreSQL recursive CTEs | Deep graph traversal → Neo4j or Dgraph |
| Object / file storage | S3-compatible | Local dev → MinIO |
| Queue / async jobs | PostgreSQL + pgmq or Redis Streams | High throughput → Kafka or NATS |

### Step 3 — Evaluate Trade-offs

For each shortlisted option, score:

| Criterion | Weight | Option A | Option B |
|-----------|--------|----------|----------|
| Operational complexity | 30% | | |
| Query capability fit | 25% | | |
| Team familiarity | 20% | | |
| Cost at target scale | 15% | | |
| Ecosystem / tooling | 10% | | |

### Step 4 — Document Decision

Record as an ADR in `ARCHITECTURE.md`:

```
## ADR-[N]: Storage selection for [data concern]
Status: Accepted
Context: [what the data is and how it's accessed]
Decision: [chosen technology and tier]
Consequences: [what this enables, what it rules out]
```

## Output

- Updated `DATABASE.md` with storage selection table
- New ADR entries in `ARCHITECTURE.md`
- Updated `TECH-SPEC.md` stack table

## Quality Check

- [ ] Every data concern has an assigned store
- [ ] Each choice has a documented justification
- [ ] Operational cost/complexity is factored in
- [ ] No store chosen without team experience or a plan to acquire it
