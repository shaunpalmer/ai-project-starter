# Harness Engineering
## 1. Setup (One-time)

# AI Project Starter Harness

A lightweight, opinionated system that helps you work effectively with AI agents (Claude, Cursor, Kilo, etc.). It forces clear planning **before** any code is written and gives you strong guardrails during execution.

---

## Getting Started (10–15 minutes)

### Prerequisites
- **Node.js** (v20 or higher)
- Git

### 1. Setup

```bash
# Copy the harness into your new project
cp -r /path/to/ai-project-starter my-new-project/
cd my-new-project

# Initialize everything
npm install
npm run setup

Bash# 1. Clone or copy the harness into your new project
cp -r /path/to/ai-project-starter my-new-project/
cd my-new-project

## 2. Install and initialize
npm install
npm run setup
2. Daily Workflow
Bash# Check current lock status
npm run status

# Lock the project (recommended at start of session)
npm run lock

# When ready to code:
npm run unlock     # This runs planning verification first
3. First-Time Human Steps

Fill out PROJECT-INTAKE.md (5 questions)
Run npm run setup (if not already done)
Tell your AI:textI've filled PROJECT-INTAKE.md. Read AGENTS.md and start planning.

## A lightweight planning system for AI-assisted development.

---

## What This Is

A starter folder structure with decision templates, coding conventions, and task management for building projects with AI agents (Kilo, Claude, Copilot, etc.).

When you start a new project, copy this folder. The AI agent reads the instructions here, classifies your project, loads the right patterns, and builds within clear rails. You don't manage ambiguity; the AI doesn't guess.

---

## What This Is Not

- Not a framework or boilerplate code
- Not a design system or component library
- Not a training course
- Not opinions about what language you "should" use

This folder tells the AI how you think, what you've already decided, and what it must not invent.

---

## Quick Start

**Start here:** Read `ONBOARDING.md` — it's the planning-first checklist and handoff guide.

Then follow `DAY-1-FLOWCHART.md` — it's the 15-minute path from clone to "AI is building."

```bash
# Copy into your new project
cp -r project-starter/ my-project/
cd my-project/
git init

# Fill the 5 core questions (3–5 minutes)
# Answer PROJECT-INTAKE.md

# Then hand to the AI
# "I've filled PROJECT-INTAKE.md. Read AGENTS.md and plan the project."
```

---
Tell your AI:textI've filled PROJECT-INTAKE.md. Read AGENTS.md and start planning.
After planning gates are cleared → npm run unlock

Useful Commands


CommandPurposenpm run setupFirst-time harness initializationnpm run lockLock source code (planning required)npm run unlockVerify planning then unlocknpm run statusShow current lock statenpm run memory-summaryShow active memory context
## What the Human Does

1. **Copy this folder** into your project
2. **Fill PROJECT-INTAKE.md** — classify your project (web app / scraper / WordPress plugin / etc.)
3. **Paste into AI agent:**
   ```
   I've filled PROJECT-INTAKE.md in this project-starter system.
   Read AGENTS.md and plan before writing code.
   Tell me if you need clarification on anything in the intake.
   ```
4. **AI fills the planning docs** — PRD, ARCHITECTURE, TASKS, etc.
5. **You approve or correct** — any major changes go back to AGENTS.md
6. **AI (or you) build** — from the TASKS list

---
First-Time Human Steps

Fill out PROJECT-INTAKE.md (5 questions)
Run npm run setup (if not already done)
Tell your AI:textI've filled PROJECT-INTAKE.md. Read AGENTS.md and start planning.
After planning gates are cleared → npm run unlock

Useful Commands

CommandPurposenpm run setupFirst-time harness initializationnpm run lockLock source code (planning required)npm run unlockVerify planning then unlocknpm run statusShow current lock statenpm run memory-summaryShow active memory context
## What Gets Filled In

Once you hand off, the AI will fill:

| File | What | Who |
|------|------|-----|
| `PRD.md` | Product requirements | AI (or you) |
| `ARCHITECTURE.md` | System design | AI |
| `TECH-SPEC.md` | Stack and env vars | AI |
| `DATA-FLOW.md` | How data moves | AI (if needed) |
| `DATABASE.md` | Schema and storage | AI (if needed) |
| `TASKS.md` | Build backlog | AI |
| `DECISIONS-TO-MAKE.md` | 5 planning gates | AI |

You should not touch these files while planning is active. Let the AI fill them. Then review before building starts.

---

## File Map

```
/
├── README.md                    ← you are here (for humans)
├── ONBOARDING.md                ← planning-first checklist & handoff guide (read first)
├── DAY-1-FLOWCHART.md           ← human path: clone → intake → handoff (15 min)
├── AGENTS.md                    ← AI operating manual (for AI)
│
├── PROJECT-INTAKE.md            ← 5-question project brief (fill this)
├── PROJECT-TYPES.md             ← routing rules by project type (AI reads)
│
├── SHAUN_DEV_PROFILE.md         ← canonical profile (who/what/why)
├── SHAUN-BUILD-PROFILE.md       ← code standards (how)
├── SHAUN_PROJECT_CANVAS.md      ← deep reference with examples (optional)
├── ARCHITECTURE-TEMPLATES.md    ← visual OOP + pipeline + DI diagrams
│
├── 00-PLANNING/
│   ├── DECISIONS-TO-MAKE.md     ← 5 gates AI must clear
│   ├── ASSUMPTIONS.md
│   ├── RISKS.md
│   └── SUCCESS-CRITERIA.md
│
├── PRD.md                       ← filled by AI during planning
├── ARCHITECTURE.md
├── TECH-SPEC.md
├── DATA-FLOW.md
├── DATABASE.md
├── TASKS.md
├── AI-NOTES.md                  ← AI working memory: change log, decisions, unresolved
│
└── .github/
    ├── copilot-instructions.md  ← GitHub Copilot rules
    └── skills/                  ← specialist guidance (loaded on-demand)
        ├── prd-writer/
        ├── architecture-canvas/
        ├── wordpress-plugin/
        ├── scraping-pipeline/
        ├── stack-selector/
        ├── database-selection/
        ├── api-design/
        ├── interface-design/
        ├── code-review/
        ├── testing-plan/
        └── documentation/
```

---

## Key Rules

1. **PROJECT-INTAKE.md first** — AI classifies the project, determines type, decides patterns
2. **AGENTS.md is the AI's operating manual** — it dictates what the AI must do
3. **No code until 5 gates are cleared** — in DECISIONS-TO-MAKE.md
4. **Skills are optional** — loaded only if relevant to the project type
5. **Database choice by project type** — not by fashion
6. **Don't invent missing architecture** — ask Shaun instead

---

## Supported Project Types

- WordPress plugin or theme
- PHP web interface
- TypeScript/JavaScript automation
- Python automation
- Data scraping pipeline
- API or backend service
- Dashboard / reporting interface
- Networking / monitoring tool
- Local AI / workflow tool
- Database-backed utility

---

## What This Costs

Filling PROJECT-INTAKE.md costs 5–10 minutes.
AI planning costs 15–30 minutes (depends on project complexity).
Total front-load: 20–40 minutes to replace 1–2 hours of thinking-in-the-dark.

---

## Support

If you're stuck or the AI seems confused:
- Read `ONBOARDING.md` for the planning checklist and handoff prompts
- Read `AGENTS.md` to see what the AI should be doing
- Check `PROJECT-TYPES.md` for your project type
- Read `SHAUN-BUILD-PROFILE.md` for the expected style
- The `00-PLANNING/` folder is where problems get resolved

context-engineering, cursor-ai, claude-ai, llm-guardrails, harness-engineering.
