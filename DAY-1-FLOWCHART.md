# DAY-1-FLOWCHART.md — From Idea to AI Handoff

> The exact path. 15 minutes from "new idea" to "AI is building inside the rails."

---

## The Whole Path (one screen)

```
┌─────────────────────────────────────────────────────────────────┐
│  MINUTE 0–2:  ENVIRONMENT                                         │
│                                                                   │
│   cp -r project-starter/ my-project/                             │
│   cd my-project/                                                 │
│   git init && git add -A && git commit -m "chore: starter"       │
│                                                                   │
└───────────────────────────────┬───────────────────────────────--┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  MINUTE 2–7:  INTAKE  (you, the human)                           │
│                                                                   │
│   Open PROJECT-INTAKE.md. Answer 5 questions:                    │
│     1. Pitch + commercial reason                                 │
│     2. Project type  (the routing decision)                      │
│     3. First slice                                               │
│     4. Stack (or "use default")                                  │
│     5. Done means...                                             │
│                                                                   │
└───────────────────────────────┬───────────────────────────────--┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  MINUTE 7–8:  HANDOFF                                             │
│                                                                   │
│   Paste to AI:                                                   │
│   "I've filled PROJECT-INTAKE.md. Read AGENTS.md, classify       │
│    from PROJECT-TYPES.md, and plan. Ask only what you can't      │
│    infer. No code until the 5 gates are cleared."                │
│                                                                   │
└───────────────────────────────┬───────────────────────────────--┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  MINUTE 8–15:  AI PLANS  (the AI, inside the rails)              │
│                                                                   │
│   AI reads:  AGENTS.md → PROJECT-INTAKE.md → PROJECT-TYPES.md    │
│              → SHAUN_DEV_PROFILE.md                              │
│                                                                   │
│   AI fills:  DECISIONS-TO-MAKE.md (5 gates)                      │
│              PRD.md, ARCHITECTURE.md, TECH-SPEC.md               │
│              DATA-FLOW.md (if data moves)                        │
│              DATABASE.md (if storage)                            │
│              TASKS.md (first slice first)                        │
│                                                                   │
│   AI asks:   ONLY the gaps it cannot infer                       │
│                                                                   │
└───────────────────────────────┬───────────────────────────────--┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  REVIEW GATE  (you)                                              │
│                                                                   │
│   Read TASKS.md + ARCHITECTURE.md.                               │
│   Correct anything wrong.                                        │
│   Approve → AI builds the first slice.                           │
│                                                                   │
└───────────────────────────────────────────────────────────────--┘
```

---

## The Routing Decision (Minute 2–7, the only one that matters)

```
                    What project type?
                          │
   ┌──────────┬──────────┼──────────┬──────────┬────────────┐
   ▼          ▼          ▼          ▼          ▼            ▼
WordPress  PHP web   TS/Node    Python    Scraping     API / Dash /
 plugin    interface automation automation pipeline    Net / Local AI
   │          │          │          │          │            │
   ▼          ▼          ▼          ▼          ▼            ▼
 MySQL     MySQL/     SQLite/    SQLite/    SQLite +    (see
 OOP       SQLite     none       none       CSV/JSON    PROJECT-
 hooks     MVC        config/    config/    pipeline +  TYPES.md)
 admin UI  repository dry-run    dry-run    adapters
   │          │          │          │          │            │
   └──────────┴──────────┴──────────┴──────────┴────────────┘
                          │
                          ▼
            PROJECT-TYPES.md has the full
            structure, DB, skills, first slice
            for each. AI follows it exactly.
```

**Once you pick the type, the rest is decided.** That's why type is question 2 and everything routes off it.

---

## Linux / Fedora Environment Notes

For your transitioning Linux workspace, the AI should assume:

```
Shell:        bash (default), zsh aware
Package mgmt: dnf (Fedora) / apt (Ubuntu)
Python:       python3, venv (not system pip)
Node:         nvm-managed or system, prefer pnpm/npm
PHP:          local php-cli + composer; XAMPP only for WP testing
DB:           mariadb/mysql service, or sqlite3 for local
Secrets:      .env files; system keyring for credentials
Scheduling:   systemd timers preferred over cron for state/logging
```

The AI should write setup steps as a `QUICKSTART.md` task, not assume the environment is ready.

---

## What the AI Must NOT Do on Day 1

- Do not write code before the 5 gates are cleared
- Do not pick a database that contradicts PROJECT-TYPES.md
- Do not ask questions already answered in PROJECT-INTAKE.md
- Do not invent folder structure not in PROJECT-TYPES.md or ARCHITECTURE.md
- Do not skip the first-slice-first rule

---

## The 15-Minute Promise

| Phase | Who | Time |
|-------|-----|------|
| Environment | You | 2 min |
| Intake (5 questions) | You | 5 min |
| Handoff | You | 1 min |
| AI planning | AI | 7 min |
| **Total to "AI is building"** | | **~15 min** |

This replaces 1–2 hours of unstructured thinking with one routing decision and five answers.
