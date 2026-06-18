# GitHub Copilot Instructions

These instructions apply to all Copilot interactions in this repository.

## Read Before Acting

Always read the following files before generating code or suggestions:

1. `AGENTS.md` — roles, conventions, constraints
2. `SHAUN_PROJECT_CANVAS.md` — owner's style, patterns, and code standards
3. `PROJECT-INTAKE.md` — owner's 5-answer project brief
4. `PRD.md` — product context
5. `ARCHITECTURE.md` — system structure
6. `TECH-SPEC.md` — stack and implementation rules
7. `TASKS.md` — current work

## Stack Constraints

- Only use technologies listed in `TECH-SPEC.md`.
- Approved languages: Python, TypeScript, JavaScript, PHP, HTML, CSS only.
- Match the existing file/folder structure defined in `ARCHITECTURE.md`.
- Follow error handling patterns in `TECH-SPEC.md`.

## Code Style

- Prefer explicit over clever.
- No magic strings — use constants or enums.
- No inline credentials or secrets — `.env` only.
- All functions need docstrings or JSDoc if the project uses them.
- One class per file.
- No SQL outside the database/repository layer.
- No `echo` or direct output outside view/template files.
- WordPress projects: sanitise all input, escape all output, nonce all forms.

## Skills

Use the skills in `.github/skills/` as guardrails for domain-specific work:

| Domain | Skill |
|--------|-------|
| PRD writing | `.github/skills/prd-writer/SKILL.md` |
| Architecture | `.github/skills/architecture-canvas/SKILL.md` |
| Stack selection | `.github/skills/stack-selector/SKILL.md` |
| API design | `.github/skills/api-design/SKILL.md` |
| Database | `.github/skills/database-design/SKILL.md` |
| Database selection | `.github/skills/database-selection/SKILL.md` |
| Interface contracts | `.github/skills/interface-design/SKILL.md` |
| Scraping | `.github/skills/scraping-pipeline/SKILL.md` |
| Code review | `.github/skills/code-review/SKILL.md` |
| Testing | `.github/skills/testing-plan/SKILL.md` |
| Documentation | `.github/skills/documentation/SKILL.md` |

## Commit Messages

Use conventional commits:

```
feat: short description
fix: short description
docs: short description
refactor: short description
test: short description
chore: short description
```

## What NOT to Do

- Do not generate files not described in `ARCHITECTURE.md` without a comment explaining why.
- Do not modify `DATABASE.md` schema without a matching migration file.
- Do not suggest libraries not in the approved stack without flagging it clearly.
