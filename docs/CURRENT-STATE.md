# Current State

Last verified: 2026-08-01
Verified against: `agent/project-control-memory` working tree
Verification: `npm test` (7 passed), `npm run control:verify`, WordPress scaffold creation, and filesystem-tree inspection

## Current truth

The harness now has a unified project-control layer and a type-aware project lifecycle scaffold. It creates a separate canonical project, carries a small operating contract and memory starters into it, and tells the agent exactly where planning, product code, proof, assembly, distribution, and deployment belong.

## Working capabilities

- Five-question intake and planning documents already exist.
- Project control can reconstruct a compact resume context from checked-in files.
- Structured alignment state distinguishes `YES`, `NO`, and `UNKNOWN` with evidence.
- Decision-right routing separates routine developer work from Shaun-owned consequential choices.
- Destination preview/create separates canonical source from an optional deployment target.
- A created project is self-orienting through its own `AGENTS.md`, intake, North Star, current state, and structured task state.
- Common lifecycle folders are `00-PLANNING/`, `docs/`, `src/`, `tests/`, `build/`, and `dist/`.
- WordPress source is bounded to `src/<plugin-slug>/` and its distribution contract produces a slug-rooted versioned ZIP.
- Checkpoints capture repository facts without pretending those facts explain architectural intent.

## Known boundaries

- The scaffold carries the minimum project-local guidance; it does not duplicate the entire reusable starter repository.
- The WordPress package shape is defined, but a reproducible ZIP/checksum command remains a separate release-adapter slice.
- The command does not deploy code into WordPress or another runtime.
- A semantic memory update still belongs to the agent; deterministic code validates structure and captures facts.
- Merging and releasing remain human decisions.

## Next action

Review the focused project-lifecycle draft PR, then run one real WordPress project from its generated VS Code workspace through resume → plan → execute → verify → checkpoint → package. Implement the packaging adapter from the friction demonstrated by that trial.
