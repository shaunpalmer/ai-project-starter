# File: `.github/PULL_REQUEST_TEMPLATE.md`

# Pull Request Checklist

## Planning Status

* [ ] `PROJECT-INTAKE.md` is filled.
* [ ] `AGENTS.md` was followed.
* [ ] `HARNESS-LOOP.md` was applied.
* [ ] `00-PLANNING/DECISIONS-TO-MAKE.md` has all required gates marked `STATUS: RESOLVED`, or clearly marked `STATUS: DEFERRED`.
* [ ] `ARCHITECTURE.md` was reviewed and updated if structure changed.
* [ ] `TECH-SPEC.md` was reviewed and updated if stack, tooling, runtime, dependencies, or APIs changed.
* [ ] `DATABASE.md` was reviewed and updated if storage changed.
* [ ] `DATA-FLOW.md` was reviewed and updated if data movement changed.
* [ ] `TASKS.md` includes the first useful build slice.
* [ ] `AI-NOTES.md` records important decisions, assumptions, and unresolved issues.

---

## Planning Summary

Paste the AI or human Planning Summary here.

```md
## Planning Summary

### Files Read

- `PROJECT-INTAKE.md` —
- `AGENTS.md` —
- `HARNESS-LOOP.md` —
- `00-PLANNING/DECISIONS-TO-MAKE.md` —
- `ARCHITECTURE.md` —
- `TECH-SPEC.md` —
- `TASKS.md` —
- `AI-NOTES.md` —

### Key Constraints

- 

### Conflicts Found

- 

### Unresolved Decisions

- 

### First Useful Build Slice

- 

### 3 Next Tasks

1. 
2. 
3. 

### Final Status

`READY FOR CODE`
```

---

## Change Type

* [ ] Planning only
* [ ] Documentation
* [ ] WordPress plugin
* [ ] PHP tool
* [ ] TypeScript / JavaScript automation
* [ ] Python automation
* [ ] Scraping pipeline
* [ ] API / backend
* [ ] Dashboard / interface
* [ ] Database change
* [ ] Refactor
* [ ] Bug fix
* [ ] Other:

---

## Complexity Brake

Before adding files, classes, tables, dependencies, abstractions, or build tooling:

* [ ] I checked whether this already exists in the codebase.
* [ ] I checked whether the platform or standard library already solves it.
* [ ] I checked whether a smaller implementation would satisfy the first useful slice.
* [ ] I did not add architecture theatre.
* [ ] Any deliberate shortcut has a `shaun-debt:` marker or is recorded in `AI-NOTES.md`.

---

## Safety Checks

* [ ] No secrets are committed.
* [ ] No credentials appear in examples, comments, logs, or docs.
* [ ] Inputs are sanitized where relevant.
* [ ] Outputs are escaped where relevant.
* [ ] Permissions/capabilities are checked where relevant.
* [ ] Database changes are documented.
* [ ] External services are wrapped or documented.
* [ ] Error handling is present for non-trivial logic.

---

## Verification

Describe what was checked.

```md
## Verification

- [ ] Planning check passed.
- [ ] Tests passed.
- [ ] Lint/build passed.
- [ ] Manual smoke test completed.
- [ ] Not applicable because:
```

---

## Notes for Shaun

What should Shaun review first?

*
