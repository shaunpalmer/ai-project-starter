# DATABASE.md — Database Design & Schema

> Single source of truth for all storage decisions. No schema changes without updating this file.

## Storage Selection

| Store | Type | Use case | Justification |
|-------|------|---------|---------------|
|       |      |         |               |

## Schema

### Table / Collection: `[name]`

| Column / Field | Type | Nullable | Default | Description |
|---------------|------|----------|---------|-------------|
| `id`          |      | No       |         | Primary key |
| `created_at`  |      | No       | now()   |             |
| `updated_at`  |      | No       | now()   |             |

**Indexes:**
- `[column]` — reason

**Constraints:**
- 

---

### Table / Collection: `[name]`

_Copy the block above for each table/collection._

## Relationships

```
[Table A] 1──N [Table B]
[Table B] N──N [Table C] (via junction table D)
```

## Migrations

| # | Description | File | Applied |
|---|-------------|------|---------|
|   |             |      |         |

## Seed Data

_Describe any required seed data for dev/staging environments._

## Backup & Recovery

| Store | Backup frequency | Retention | Recovery target (RTO/RPO) |
|-------|-----------------|-----------|--------------------------|
|       |                 |           |                          |

## Query Patterns

| Pattern | Query/index | Notes |
|---------|-------------|-------|
|         |             |       |
