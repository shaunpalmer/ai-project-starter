# Skills Index

This is the master reference for all available skills in this AI harness.  
Load skills **only** when they are relevant to the project type or current task.

## Core Control Skills (Always Consider)

| Skill                        | Purpose | Load When |
|-----------------------------|--------|----------|
| `complexity-brake`          | Prevents unnecessary complexity | Before adding files, classes, dependencies, or abstractions |
| `loop-controller`           | Enforces Plan → Execute → Verify → Adapt cycles | During all implementation and troubleshooting |
| `trace-eval-logging`        | Maintains execution traces and evaluations | Every major task or loop iteration |
| `memory-consolidation`      | Summarizes learnings and prevents context bloat | End of phases or when notes grow large |
| `chrome-devtools-mcp`       | Live browser inspection, debugging, and verification | Any front-end, UI, CSS, or JavaScript work |

## Domain-Specific Skills

| Skill                        | Purpose | Load When |
|-----------------------------|--------|----------|
| `wordpress-plugin`          | WordPress-specific patterns and best practices | WordPress plugin or theme projects |
| `scraping-pipeline`         | Data scraping, pipelines, and export handling | Scraping or automation pipelines |
| `api-design`                | API contracts, versioning, error handling | Projects with backend APIs |
| `interface-design`          | UI/UX patterns and component contracts | Front-end or dashboard work |
| `database-selection`        | Database choice reasoning by project type | Any project needing persistent storage |
| `database-design`           | Schema design and migration patterns | When defining data models |
| `prd-writer`                | Structured PRD generation | Planning phase |
| `architecture-canvas`       | Architecture diagrams and templates | Architecture planning |
| `stack-selector`            | Tech stack justification | TECH-SPEC phase |
| `code-review`               | Systematic code review checklist | After code is written |
| `testing-plan`              | Test strategy and coverage | Before implementation |
| `documentation`             | Documentation standards | Documentation tasks |

## How to Use Skills

- Check this index + `AGENTS.md` + `PROJECT-TYPES.md` before loading.
- Use the **Smart Skills Injector** (`scripts/inject-skills-note.js`) to generate contextual reminders.
- Only load what you need — do not preload everything.

**Last Updated:** ${new Date().toISOString().split('T')[0]}

## https://github.com/shaunpalmer/ai-project-starter/blob/main/.github/skills/INDEX.md
