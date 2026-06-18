# SKILL: Testing Plan

## Purpose

Define a complete testing strategy before writing tests — so coverage is intentional, not accidental, and the test suite actually catches real failures.

## When to Use

- At the start of any new feature or module
- When test coverage is low and needs to be improved systematically
- When reviewing whether the existing test suite is adequate

## Inputs Required

- [ ] `TECH-SPEC.md` — test tools and coverage targets
- [ ] `ARCHITECTURE.md` — layers to test
- [ ] Feature requirements from `PRD.md` or `TASKS.md`

## Test Pyramid

```
        /\
       /  \   E2E (few, slow, expensive)
      /────\
     /      \  Integration (some, medium speed)
    /────────\
   /          \ Unit (many, fast, cheap)
  /────────────\
```

Guideline: 70% unit / 20% integration / 10% E2E.

## Process

### Step 1 — Identify Test Subjects

List every function, class, or API endpoint that needs tests.

| Subject | Layer | Type of test needed |
|---------|-------|-------------------|
| | | |

### Step 2 — Define Test Cases Per Subject

For each subject, list test cases using this format:

```
Given [precondition]
When [action]
Then [expected outcome]
```

Always include:
- Happy path (valid input, expected output)
- Empty / null / zero input
- Maximum / boundary input
- Invalid input (wrong type, out of range)
- Error / failure path (dependency fails)

### Step 3 — Integration Test Boundaries

Identify which integration points need integration tests:
- Database (real queries against test DB)
- External APIs (contract tests or recorded fixtures)
- Message queues (produce and consume round-trips)

### Step 4 — E2E Scenarios

List the critical user flows that MUST work end-to-end:

| Flow | Steps | Pass criteria |
|------|-------|--------------|
| | | |

### Step 5 — Test Data Strategy

- How is test data created? (factories, fixtures, seeds)
- Is the test DB reset between tests? (per test / per suite)
- Are external API calls mocked? (yes/no — document why)

### Step 6 — Coverage Targets

| Layer | Line coverage target | Branch coverage target |
|-------|---------------------|----------------------|
| Domain / business logic | 90% | 85% |
| API handlers | 80% | 75% |
| Infrastructure adapters | 70% | 65% |

## Output

- Test files in `tests/` or co-located with source (`*.test.ts` etc.)
- `TECH-SPEC.md` testing section updated with tool choices

## Quality Check

- [ ] Every public function has at least one test
- [ ] Every error path has a test
- [ ] No test depends on another test's side effects
- [ ] E2E tests cover every critical user flow from PRD
- [ ] Test data strategy documented and implemented
