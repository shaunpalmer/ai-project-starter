# RISKS.md — Risk Register

> A risk is something that might go wrong. The goal is not to eliminate all risk — it is to know which risks you are accepting and which you are mitigating.

---

## Risk Matrix

```
         │ Low impact │ Med impact │ High impact │
─────────┼────────────┼────────────┼─────────────┤
High     │  Monitor   │  Mitigate  │  Mitigate   │
prob     │            │            │  or stop    │
─────────┼────────────┼────────────┼─────────────┤
Med      │  Accept    │  Monitor   │  Mitigate   │
prob     │            │            │             │
─────────┼────────────┼────────────┼─────────────┤
Low      │  Accept    │  Accept    │  Monitor    │
prob     │            │            │             │
```

**Strategies:**
- **Accept** — live with it, no action
- **Monitor** — watch for early signs, have a plan ready
- **Mitigate** — take action to reduce probability or impact
- **Stop** — risk is too high, do not proceed until resolved

---

## Risk Register

| # | Risk | Category | Probability | Impact | Score | Strategy | Owner | Status |
|---|------|----------|------------|--------|-------|----------|-------|--------|
| R1 | | Technical | H/M/L | H/M/L | | | | Open |
| R2 | | Schedule | | | | | | Open |
| R3 | | Data | | | | | | Open |
| R4 | | External | | | | | | Open |
| R5 | | Team | | | | | | Open |

**Score** = Probability × Impact (HH=9, HM=6, HL=3, MM=4, ML=2, LL=1)

---

## Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Chosen library/framework doesn't support a required feature | | | Spike/prototype before committing |
| Third-party API changes or goes down | | | Abstract behind adapter, have fallback |
| Performance doesn't meet targets at scale | | | Load test early, before full build |
| Data format from external source is inconsistent | | | Validate at ingestion, fail loudly |
| Security vulnerability in dependency | | | Pin versions, run audit in CI |

---

## Schedule Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Scope creep during build | | | Lock scope in DECISIONS-TO-MAKE.md, change requires sign-off |
| Key dependency blocked on external party | | | Identify early, mock it out |
| Underestimated complexity | | | Build first slice first, re-estimate after |

---

## Data Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Data quality is worse than expected | | | Validate and log on ingestion |
| Data volume is higher than estimated | | | Set limits, monitor, plan for scale |
| PII/sensitive data found in source | | | Classify data before building pipeline |
| Data source unavailable or rate-limited | | | Cache, retry, alert |

---

## External / Dependency Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Third-party service pricing changes | | | Budget buffer, have alternative |
| API deprecation | | | Version-pin, monitor deprecation notices |
| Vendor lock-in | | | Use adapter pattern, document the seam |

---

## Closed Risks

| # | Risk | How resolved | Date closed |
|---|------|-------------|------------|
| | | | |
