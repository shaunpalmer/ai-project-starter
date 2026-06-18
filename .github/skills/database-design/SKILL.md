# SKILL: Database Design

## Purpose

Produce a complete, normalised (or intentionally denormalised) schema that a worker can implement directly into migrations — no guessing required.

## When to Use

- Designing a new data model
- Adding a major new entity
- Refactoring schema for performance or correctness

## Inputs Required

- [ ] `PRD.md` — entities implied by user stories
- [ ] `DATABASE.md` — storage technology chosen (or run `database-selection` skill first)
- [ ] `DATA-FLOW.md` — read/write patterns

## Process

### Step 1 — Entity Identification

List every noun in the PRD that needs to be persisted. For each:
- Is it a first-class entity (its own table/collection)?
- Or is it an attribute of another entity?

### Step 2 — Attribute Definition

For each entity, define every field:

| Field | Type | Nullable | Default | Constraints | Notes |
|-------|------|----------|---------|-------------|-------|
| id | UUID | No | gen_random_uuid() | PK | |
| created_at | timestamptz | No | now() | | |

### Step 3 — Relationships

Map all relationships:

```
User 1──N Order
Order N──N Product (via order_items)
```

For each N:N — define the junction table explicitly.

### Step 4 — Indexes

For each query pattern in `DATA-FLOW.md`:
- What columns are filtered on?
- What columns are sorted on?
- Is a composite index needed?
- Would a partial index help?

### Step 5 — Constraints & Integrity

- Foreign keys: define ON DELETE / ON UPDATE behaviour
- Unique constraints: list them explicitly
- Check constraints: validate enums at DB level

### Step 6 — Migration Plan

Number migrations sequentially. Each migration file:
- Does one thing
- Is reversible (has a down migration)
- Is named: `NNNN_short_description.sql`

## Output

- Updated `DATABASE.md` with complete schema
- Migration files in `migrations/` or equivalent

## Quality Check

- [ ] Every entity has `id`, `created_at`, `updated_at`
- [ ] All relationships have explicit FK constraints
- [ ] N:N relationships have junction tables
- [ ] Every query pattern in DATA-FLOW.md has a supporting index
- [ ] All enum fields validated at DB level
- [ ] Migrations are numbered and reversible
