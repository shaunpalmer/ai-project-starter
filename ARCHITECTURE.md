# ARCHITECTURE.md — System Architecture Contract

> This file is the source of truth for system structure. Worker agents must read this before creating, moving, or modifying code. If this file does not define where something belongs, stop and ask before implementing.

## Purpose

ARCHITECTURE.md defines the system’s boundaries, layers, responsibilities, dependency direction, directory structure, data flow, external integrations, storage choices, extension points, and key design decisions.

Its job is to prevent guessing.

Every major code change should fit inside this architecture. If a change does not fit, update the architecture first, record the decision, then implement.

> Updated by the architect model. Workers read this before touching structure.

## System Overview

_One paragraph: what is this system, what are its boundaries, what does it not do._

## Architecture Style

- [ ] Monolith
- [ ] Modular monolith
- [ ] Microservices
- [ ] Event-driven
- [ ] Serverless
- [ ] Other: ___________

## High-Level Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API/BFF   │────▶│   Backend   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                        ┌──────▼──────┐
                                        │  Database   │
                                        └─────────────┘
```

_Replace with actual diagram or ASCII art._

## Layers / Modules

| Layer | Responsibility | Key files/folders |
|-------|---------------|-------------------|
|       |               |                   |

## External Dependencies

| Service | Purpose | Interface type |
|---------|---------|---------------|
|         |         |               |

## Data Stores

| Store | Type | What lives here |
|-------|------|----------------|
|       |      |                |

## Key Design Decisions

| Decision | Chosen approach | Alternatives considered | Rationale |
|----------|----------------|------------------------|-----------|
|          |                |                        |           |


+++markdown

# Architecture Notes

## Dependency Rules

| From layer   | May call               | Must not call                 |
| ------------ | ---------------------- | ----------------------------- |
| UI / Admin   | Services               | Database directly             |
| Services     | Repositories, adapters | `$_POST`, `$_GET`, direct SQL |
| Repositories | Database only          | Business rules                |
| Adapters     | External APIs          | UI rendering                  |

## Directory Structure

```
/
├── src/
│   ├── ...
├── tests/
├── docs/
└── ...
```

## Extension Points

| Extension point  | Purpose              | How to add new behaviour         |
| ---------------- | -------------------- | -------------------------------- |
| Fetcher strategy | Swap source type     | Add class implementing `Fetcher` |
| Storage adapter  | Change output target | Add repository or adapter        |
| Report renderer  | Change output format | Add renderer class               |

## Architecture Quality Gates

* [ ] System boundary is clear
* [ ] Each layer has one responsibility
* [ ] Dependency direction is explicit
* [ ] No circular dependencies
* [ ] External services have fallbacks
* [ ] Directory structure tells workers where new files go
* [ ] Key decisions are recorded as ADRs
* [ ] Data flow is mapped if the project moves data

## Layer Rules

```
Services do not echo HTML.
Repositories do not contain business rules.
Controllers do not perform SQL.
Adapters hide external APIs.
Factories create swappable implementations.
```

## Common Patterns

| Pattern    | Purpose                                          |
| ---------- | ------------------------------------------------ |
| Factory    | Creates objects without specifying exact classes |
| Singleton  | Ensures only one instance of a class exists      |
| Adapter    | Allows interfaces to work together               |
| Strategy   | Selects an algorithm at runtime                  |
| Observer   | Defines a dependency between objects             |
| Decorator  | Adds behavior to objects dynamically             |
| Command    | Encapsulates a request as an object              |
| Pipeline   | Passes data through a sequence of steps          |
| Repository | Manages data access logic                        |

## Featured Patterns

| Pattern                     | Purpose and pairing                             |
| --------------------------- | ----------------------------------------------- |
| Circuit Breaker + Observer  | Handle failures and react to events             |
| Envelope + Pipeline/Factory | Carry context through processing steps          |
| Factory                     | Create objects without specifying exact classes |
| Pipeline                    | Pass data through sequential processing stages  |

Circuit Breaker and Observer together give you control over external dependencies: when something fails or changes, you can react intelligently.

Envelope and Pipeline, often paired with Factory, give you structure. You wrap data with context, then process it step by step.

Together, these patterns provide a useful combination of stability and clarity, which is especially helpful for systems that need resilience and clean data flow.

*Update this as the project grows.*
## Architecture Authority

`ARCHITECTURE.md` is the source of truth for system structure.

Worker agents must follow this file when creating, moving, or modifying code.

If a new request conflicts with this architecture, the agent must not silently implement the request. The agent must first identify the conflict and ask whether the architecture should be updated.

Casual comments, brainstorming, possible options, or rough ideas do not override this file.

Architecture may only change when:

* Shaun confirms the change deliberately.
* The reason for the change is recorded.
* The relevant planning files are updated.
* `AI-NOTES.md` records the decision and rationale.

The correct sequence is:

1. Confirm the architectural change.
2. Update `ARCHITECTURE.md`.
3. Update any affected planning files.
4. Record the decision in `AI-NOTES.md`.
5. Then implement.

## Dependency, Library, and Framework Rules

Do not confuse **libraries** with **frameworks**.

A good library solves a focused problem.

A framework controls the shape of the project.

Shaun does not need to know every library deeply before using it. If a library is mature, project-appropriate, understandable at the call site, and solves a real problem, it may be the best design choice.

Do not rewrite solved problems from scratch just to avoid dependencies.

Use proven libraries for tasks such as:

- HTTP requests
- HTML parsing
- Browser automation
- CSV/JSON handling
- Fuzzy matching
- Validation
- Date/time handling
- Logging
- File processing
- Scraping helpers
- API clients
- Testing utilities

Examples:

- Scraping projects may use tools such as Beautiful Soup, Selenium, Playwright, Cheerio, Axios, or equivalent project-appropriate libraries.
- Data-cleaning projects may use fuzzy matching libraries instead of hand-written matching logic.
- Automation scripts may use reliable utility libraries where they reduce code, bugs, and maintenance cost.

### Dependency Classification

Before adding a dependency, classify it:

#### 1. Small Utility Library

- Solves one clear problem.
- Easy to remove or replace.
- Allowed when useful.

#### 2. Core Project Library

- Used heavily in the project.
- Must be listed in `TECH-SPEC.md`.
- Should have clear examples and tests around usage.

#### 3. External Service SDK

- Wrap behind an adapter.
- Do not scatter direct SDK calls through the codebase.

#### 4. Framework

- Controls project structure, routing, rendering, state, build process, or deployment.
- Requires stronger justification and Shaun approval.

#### 5. Platform / Infrastructure Choice

- Changes hosting, deployment, runtime, database, queues, containers, or cloud services.
- Requires explicit approval and architecture update.

### Library Rule

Libraries are allowed when they:

- Solve a real project problem
- Reduce custom code
- Are understandable at the usage point
- Can be wrapped, tested, or isolated
- Do not force an unfamiliar project structure
- Do not create unnecessary lock-in
- Are recorded in `TECH-SPEC.md` when important

### Framework Rule

Frameworks require a higher bar.

Do not introduce React, Next.js, Laravel, Django, complex frontend frameworks, microservice tooling, or heavy build systems unless the project clearly earns that complexity.

Before recommending a framework, explain:

1. What problem it solves.
2. Why Shaun's known stack is not enough.
3. What files and commands it adds.
4. How Shaun will run, debug, and maintain it.
5. What the simpler version would look like.
6. Whether the long-term benefit is worth the learning cost.

### Utility Rule

Prefer shared utilities over repeated inline logic.

If the same operation appears more than once, consider moving it into a clear utility function, helper class, adapter, or service.

Utilities should be:

- Named clearly
- Easy to test
- Small enough to understand
- Imported at the top of the file
- Kept in an obvious location such as `src/utils`, `src/Support`, `includes/helpers`, or the project’s approved equivalent

### Import Rule

Imports, requires, and dependency loading should be hoisted to the top of the file unless the language or runtime has a good reason not to.

Avoid hidden dependencies inside deep functions.

A reader should be able to see what a file depends on before reading the implementation.

### Adapter Rule

If a dependency touches an external service, browser automation, filesystem, database, API, email provider, payment provider, or scraping source, wrap it behind an adapter or service boundary.

Do not let third-party libraries leak through the whole project.

The project should depend on its own interface first, and the third-party library second.

### Final Rule

Use libraries boldly when they reduce risk.

Use frameworks carefully when they change the shape of the project.

Do not make Shaun maintain a project structure he does not understand unless the benefit is deliberate, documented, and approved.
