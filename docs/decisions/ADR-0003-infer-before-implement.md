id: ADR-0003
title: Infer system responsibilities before architecture
status: accepted
date: 2026-09-09

# Context

The harness performs strongly on familiar WordPress work but can stall or route poorly on unfamiliar or hybrid systems. The previous intake required one project type, and the type file routed pattern, database, structure, and skills before the agent had an explicit model of the domain, state, failure boundaries, or capability composition.

The supported controller and memory model are already useful. The 2026-09-05 harness review recommends reconciling interfaces rather than adding another orchestration layer.

# Decision

Adopt an infer-before-implement phase in the existing control plane:

- natural-language intent is sufficient to start discovery;
- confirm a system model before locking architecture;
- infer a primary shape plus capabilities and confidence;
- treat project types as presets, not mandatory boxes;
- use bounded proof for material internal uncertainty;
- require an accepted architecture hypothesis before execution;
- add `system_model` as the eighth Alignment Ladder gate;
- scaffold the discovery artifacts and a local readiness verifier into new projects.

# Consequences

Known WordPress work remains fast because it can reach high-confidence classification quickly. Unfamiliar systems spend more effort on evidence and bounded proofs before code, but no longer require Shaun to pre-architect them or accept arbitrary defaults. Task state moves to schema version 2. Legacy experimental controllers remain unsupported; the supported unlock path uses project-control verification only.

# Approval

Shaun authorised Athena on 2026-09-09 to fix, run, reorganise, and finish the harness in GitHub. Merge and release remain separately reserved under the Decision Rights Contract.
