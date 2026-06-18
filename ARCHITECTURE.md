# ARCHITECTURE.md — System Architecture

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

## Directory Structure

```
/
├── src/
│   ├── ...
├── tests/
├── docs/
└── ...
```

_Update this as the project grows._
