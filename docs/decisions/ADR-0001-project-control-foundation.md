---
id: ADR-0001
title: File-backed project control foundation
status: accepted
date: 2026-08-01
owner: Shaun Palmer
---

# Context

The harness had planning documents, scripts, and a growing notebook, but no single mechanism for reconstructing current truth, changing route without drift, assigning decisions, or choosing a project destination.

# Decision

Use Markdown, structured JSON, Git, an agent skill, and a zero-dependency Node CLI as the first memory and control layer. Keep a vector database or external memory service out of the first slice.

# Rationale

Files are transparent, versioned, inspectable in VS Code, and sufficient for the present repository scale. Model judgment writes semantic truth; deterministic code captures facts and validates structure.

# Consequences

- Current truth is separated from historical decisions.
- Routine development decisions remain autonomous.
- Consequential decisions remain with Shaun.
- A future retrieval layer may index these files but cannot outrank them.
