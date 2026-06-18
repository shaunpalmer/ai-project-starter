# SKILL: Code Review

## Purpose

Conduct a systematic, objective code review that catches correctness issues, security risks, and maintainability problems — not just style.

## When to Use

- Before merging any PR
- When asked to review a file or module
- As a self-check before opening a PR

## Review Levels

| Level | What it covers | Time |
|-------|---------------|------|
| L1 — Quick | Obvious bugs, security, test coverage | < 5 min |
| L2 — Standard | Correctness, patterns, edge cases | 15–30 min |
| L3 — Deep | Architecture fit, performance, long-term maintainability | 30–60 min |

## Checklist

### Correctness

- [ ] Does the code do what the ticket/task says?
- [ ] Are all edge cases handled (null, empty, 0, max, overflow)?
- [ ] Are errors handled at every failure point?
- [ ] Are all async operations properly awaited?
- [ ] Is state mutation safe (no race conditions)?

### Security

- [ ] No secrets, tokens, or credentials in code or comments
- [ ] All user input is validated and sanitised before use
- [ ] No SQL string concatenation — parameterised queries only
- [ ] No `eval()`, `exec()`, or equivalent dynamic code execution
- [ ] File paths validated against traversal attacks
- [ ] Auth checks before any data access

### Tests

- [ ] New code has unit tests
- [ ] Edge cases are tested (not just the happy path)
- [ ] Tests are independent (no shared mutable state between tests)
- [ ] Test names describe the scenario, not the implementation

### Maintainability

- [ ] Function/method does one thing
- [ ] No function longer than ~40 lines without justification
- [ ] No deeply nested conditionals (> 3 levels) — use early returns
- [ ] No magic numbers or strings — use named constants
- [ ] Variable/function names are self-describing

### Architecture Compliance

- [ ] Code follows layer structure in `ARCHITECTURE.md`
- [ ] No new dependencies not in `TECH-SPEC.md` (or flagged)
- [ ] Follows patterns in `interface-design` skill (adapters, envelopes)
- [ ] No direct DB access from UI/controller layer

### Performance

- [ ] No N+1 queries
- [ ] No unbounded loops over large datasets
- [ ] No blocking I/O in async contexts
- [ ] Caching considered for expensive repeated operations

## Feedback Format

When leaving review comments, use this format:

```
[MUST] Fix the SQL injection vulnerability on line 42.
[SHOULD] Extract this logic into a named function for readability.
[NIT] Variable name `d` should be `dueDate`.
[QUESTION] Why is this retried 10 times? Is that intentional?
```

| Tag | Meaning |
|-----|---------|
| `[MUST]` | Blocks merge. Correctness/security issue. |
| `[SHOULD]` | Strong recommendation. Will cause problems later. |
| `[NIT]` | Minor style/naming. Non-blocking. |
| `[QUESTION]` | Seeking clarification. Not a criticism. |

## Output

- Review comments on the PR, or inline in the file
- `TASKS.md` updated if review reveals new follow-up tasks
