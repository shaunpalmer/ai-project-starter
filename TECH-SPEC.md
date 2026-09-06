# TECH-SPEC.md — Technical Specification

> Workers must not deviate from stack choices documented here without architect sign-off.

## Harness maintenance tooling (2026-09-05)

The reusable controller retains Node.js, its built-in test runner, and Markdown/JSON storage without runtime dependencies. `.github/workflows/harness-checks.yml` runs the same tests, control verification, and resume command on Node 20, 22, and 24 for pull requests and main. Official checkout/setup-node actions are pinned to verified commits, with read-only repository permissions and no package installation. This provides repeatable proof for the GitHub review requested by Shaun. The product stack template below remains unfilled for the next intake.

## Machine-Readable Stack Markers

Fill with actual values only (remove examples):

Runtime: (e.g., Node.js 18, Python 3.11, Go 1.21, etc.)
Language: (e.g., TypeScript, Python, Go, PHP, etc.)
Database: (e.g., PostgreSQL, MongoDB, SQLite, etc.)
Dependencies: (e.g., npm, pip, composer, etc.)

---

## Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Language |  |  |  |
| Runtime |  |  |  |
| Framework |  |  |  |
| Database |  |  |  |
| Cache |  |  |  |
| Queue |  |  |  |
| Auth |  |  |  |
| Storage |  |  |  |
| Hosting |  |  |  |
| CI/CD |  |  |  |

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
|          |         |          |         |

> Store secrets in `.env` (never commit). Document all keys here.

## API Style

- [ ] REST
- [ ] GraphQL
- [ ] gRPC
- [ ] tRPC
- [ ] Other: ___________

## Authentication

- [ ] JWT
- [ ] Session cookies
- [ ] OAuth2 / OIDC
- [ ] API keys
- [ ] Other: ___________

## Error Handling Strategy

_Describe the error envelope format and how errors propagate._

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## Logging & Observability

| Concern | Tool | Notes |
|---------|------|-------|
| Logging |      |       |
| Metrics |      |       |
| Tracing |      |       |
| Alerting |     |       |

## Testing Strategy

| Type | Tool | Coverage target |
|------|------|----------------|
| Unit |      |                |
| Integration |  |             |
| E2E  |      |                |

## Deployment

_Describe build, release, and rollback process._

## Performance Targets

| Metric | Target |
|--------|--------|
| API p99 latency |  |
| Page load time |  |
| Throughput |  |
