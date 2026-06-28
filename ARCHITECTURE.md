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


