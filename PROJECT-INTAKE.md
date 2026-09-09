# PROJECT-INTAKE.md — Natural-Language Project Brief

> Give the AI the outcome, first useful slice, and hard constraints. A natural-language prompt is enough to begin discovery.
> Do not force an unfamiliar system into a single project type before the system has been modelled.

---

## CORE — Answer these 5

### 1. Outcome + commercial reason

Describe what should exist, who benefits, and why it matters.

```text
[Name] should [outcome] for [user/business].
Commercial point: generate / capture / convert / track leads — or automate / protect / report / other.
```

### 2. Initial shape hint

Choose a hint only if obvious. The AI may revise it after discovery.

- [ ] infer from evidence
- [ ] hybrid / crosses several capabilities
- [ ] WordPress plugin
- [ ] PHP web interface
- [ ] TypeScript / Node automation
- [ ] Python automation
- [ ] Scraping pipeline
- [ ] API service
- [ ] Dashboard / reporting
- [ ] Networking / monitoring tool
- [ ] Local AI / workflow tool
- [ ] other: __________

A hint is not an architecture decision. `PROJECT-TYPES.md` contains reusable presets, not mandatory boxes.

### 3. First useful slice

```text
The first observable working outcome: ___________
```

Example: "Given one directory URL, collect business name + phone, normalise it, and persist one idempotent record."

### 4. Known constraints

Use defaults only after the system model supports them.

```text
Runtime/language: known ______ / infer
Storage: known ______ / infer
Providers/integrations: ______
Must run on: ______
Must not use / spend / mutate: ______
```

### 5. Done condition

```text
Done means: [user] can [action] and [outcome], without [pain].
```

---

## Discovery handoff

After intake, the AI must:

1. Build `00-PLANNING/SYSTEM-MODEL.md` from evidence.
2. Identify a primary shape plus capability composition and confidence.
3. Draft `00-PLANNING/ARCHITECTURE-HYPOTHESIS.md`.
4. Run a bounded proof when a material internal choice is uncertain.
5. Ask Shaun only when the Decision Rights Contract assigns the consequential choice to him.
6. Move to execution only when all eight Alignment Ladder gates are `YES`, the system model is confirmed, and the architecture hypothesis is accepted.

`UNKNOWN` means investigate. It does not mean hand routine engineering back to Shaun.
