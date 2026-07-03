# TECH-SPEC.md — Technical Specification

> Workers must not deviate from stack choices documented here without architect sign-off.

## Machine-Readable Stack Markers

Runtime:
Language:
Database:
Dependencies:

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
