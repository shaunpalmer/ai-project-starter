# SUCCESS-CRITERIA.md — Definition of Done

> Success criteria exist to stop scope creep and to tell you when you're finished.
> If you can't measure it, you can't know when you've achieved it.

---

## The Prime Directive

> "Done means: [specific user] can [specific action] and achieve [specific outcome], without [specific pain]."

Fill this in before building anything:

```
Done means: ___________
```

---

## Levels of Done

### Level 1 — Technically Working

The system does what it's supposed to do in a controlled environment.

| Criterion | Measurement | Target | Achieved |
|-----------|------------|--------|----------|
| Core feature works end-to-end | Manual test | Yes/No | [ ] |
| No data loss on normal operation | Test + review | Zero loss | [ ] |
| Error handling covers key failure paths | Code review | All documented failures handled | [ ] |
| Tests pass | CI run | 100% pass | [ ] |

---

### Level 2 — Production Ready

The system can be deployed and operated reliably.

| Criterion | Measurement | Target | Achieved |
|-----------|------------|--------|----------|
| Deploys without manual steps | Deploy script | Automated | [ ] |
| Secrets not in code | Code audit | Zero secrets | [ ] |
| Logs are useful (not silent or noisy) | Log review | Key events logged | [ ] |
| Can recover from restart | Test restart | State persists correctly | [ ] |
| README gets a new developer running in < 10 min | Time it | < 10 minutes | [ ] |

---

### Level 3 — User Success

Real users can achieve their goals with it.

| Criterion | Measurement | Target | Achieved |
|-----------|------------|--------|----------|
| Target user can complete core flow without help | Observation | Unassisted completion | [ ] |
| Performance meets expectation | Timing | [N]ms / [N]s | [ ] |
| Error messages are understandable | User feedback | No "what does this mean?" | [ ] |

---

## Feature-Level Done Criteria

For each feature, define done before building it.

| Feature | Done when | Measured by |
|---------|----------|------------|
| | | |

---

## Anti-Done (What is NOT success)

Explicitly list outcomes that would look like success but are not:

- [ ] It works on my machine but not in the target environment
- [ ] It works for the happy path but crashes on invalid input
- [ ] It's built but not documented
- [ ] It's built but the target user hasn't confirmed it solves their problem
- [ ] It's "almost done" — there is no "almost done"

---

## Sign-Off Checklist

Before calling this project done, confirm:

- [ ] `DECISIONS-TO-MAKE.md` — all 5 gates were cleared before coding started
- [ ] `ASSUMPTIONS.md` — all high-risk assumptions were validated
- [ ] `RISKS.md` — all open risks are accepted, mitigated, or closed
- [ ] All Level 1 and Level 2 criteria above are checked
- [ ] Level 3 criteria checked or explicitly deferred with reason
- [ ] `TASKS.md` — no open tasks in current scope
- [ ] `ARCHITECTURE.md` — reflects what was actually built
- [ ] `README.md` — exists and passes the 10-minute test

**Signed off by:** ___________ **Date:** ___________
