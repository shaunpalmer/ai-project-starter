# PROJECT-INTAKE.md — 5-Minute Project Brief

> Fill the 5 core questions. That's enough for the AI to classify and route.
> Everything else, the AI infers from SHAUN_DEV_PROFILE.md and PROJECT-TYPES.md — or asks you.
> Do NOT over-answer. Five answers, three minutes, hand it off.

---

## CORE — Answer these 5 (mandatory)

### 1. One-line pitch + commercial reason

```
[Name] is a [project type] that [does what] for [who].
Commercial point: (generate / capture / convert / track leads — or — automate / protect / report)
```

> Example: "MotelScraper is a scraping pipeline that extracts NAP + email from directory sites to build a cold-outreach lead list. Commercial point: generate leads."

---

### 2. Project type — mark ONE

This routes everything (pattern, database, structure, skills). See PROJECT-TYPES.md.

- [ ] WordPress plugin
- [ ] PHP web interface
- [ ] TypeScript / Node automation
- [ ] Python automation
- [ ] Scraping pipeline
- [ ] API service
- [ ] Dashboard / reporting
- [ ] Networking / monitoring tool
- [ ] Local AI / workflow tool

---

### 3. First slice — the one thing it must do first

```
The first working slice: ___________
```

> Example: "Fetch one directory page, extract business name + phone + email, write to CSV."

---

### 4. Stack — confirm or override the default

The project type has a default stack (see PROJECT-TYPES.md). Override only if needed.

```
Use default for this type:  [ ] yes
Or override:                Backend ______  Frontend ______  Storage ______
```

---

### 5. Done — when is it finished?

```
Done means: [user] can [action] and [outcome], without [pain].
```

> Example: "Done means: I run one command and get a deduped CSV of motel leads, without visiting any site manually."

---

## OPTIONAL — Only if the AI would otherwise guess wrong

Skip anything obvious. Fill only what matters for *this* project.

```
External integrations:   (GA4, Twilio, Stripe, CRM, none)
Auth / users:            (none / single / team / public)
Hard constraints:        (deadline, must-run-on, must-not-use)
Data volume:             (tiny / moderate / large)
```

---

## Handoff

When the 5 core questions are answered, paste to the AI:

```
I've filled PROJECT-INTAKE.md. Read AGENTS.md, classify the project
from PROJECT-TYPES.md, and plan. Ask me only what you can't infer.
Do not write code until the 5 gates are cleared.
```

---

## Rule of Thumb (too much vs not enough)

- **Not enough:** "build me a scraper" → AI guesses → spaghetti.
- **Too much:** 15 questions + 5 docs to read first → you lose an hour, AI drowns.
- **Right:** type + commercial point + first slice + stack + done. The AI infers the rest from your profile.
