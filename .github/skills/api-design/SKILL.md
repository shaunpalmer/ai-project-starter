# SKILL: API Design

## Purpose

Design a consistent, versioned, well-documented API that both workers and consumers can implement without ambiguity.

## When to Use

- Designing a new service or endpoint group
- Versioning a breaking change
- Reviewing an existing API for consistency

## Inputs Required

- [ ] `ARCHITECTURE.md` — system boundaries
- [ ] `TECH-SPEC.md` — API style (REST/GraphQL/gRPC/tRPC)
- [ ] List of operations needed (from PRD user stories)

## Process

### Step 1 — Resource Modelling (REST) or Schema Definition (GraphQL/gRPC)

For REST: identify nouns (resources), not verbs.

```
Resource: /users
Resource: /orders
Resource: /orders/{id}/items   ← nested only if tightly coupled
```

For GraphQL: define types first, queries/mutations second.

### Step 2 — Define Operations

For each resource/operation:

| Method | Path | Request body | Response | Status codes |
|--------|------|-------------|----------|-------------|
| GET | /users | — | `User[]` | 200, 401, 500 |
| POST | /users | `CreateUserInput` | `User` | 201, 400, 409, 500 |

### Step 3 — Error Envelope

All errors use a consistent envelope:

```json
{
  "error": {
    "code": "SCREAMING_SNAKE_CASE",
    "message": "Human-readable, safe to display",
    "details": {}
  }
}
```

Define all error codes before implementation.

### Step 4 — Versioning Strategy

- [ ] URL path versioning (`/v1/`, `/v2/`)
- [ ] Header versioning (`API-Version: 2`)
- [ ] No versioning (document breaking change policy)

### Step 5 — Auth & Permissions

For each endpoint, define:
- Authentication required? (yes/no)
- Permission scope required?
- Rate limit?

### Step 6 — Contract File

Produce an OpenAPI 3.x spec, GraphQL SDL, or `.proto` file. Store in `docs/api/`.

## Output

- Updated `TECH-SPEC.md` (API style, error codes)
- `docs/api/openapi.yaml` (or equivalent contract file)

## Quality Check

- [ ] Every endpoint has defined request/response schemas
- [ ] All error codes documented
- [ ] Auth requirements explicit on every endpoint
- [ ] No verbs in REST resource paths
- [ ] Versioning strategy documented
