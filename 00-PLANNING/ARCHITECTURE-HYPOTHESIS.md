# Architecture Hypothesis

HYPOTHESIS_STATUS: ACCEPTED

## Primary shape

Evolve the existing zero-dependency project-control harness rather than add another agent/orchestration framework. Confidence: high.

## Capabilities

- Add a system-model readiness gate to the existing Alignment Ladder.
- Treat project types as presets and allow hybrid capability composition.
- Scaffold discovery artifacts into generated projects.
- Give generated projects a small local readiness verifier.
- Keep CI and repository tests as promotion proof.

## Candidate patterns

- State machine / gating for readiness.
- Pipeline thinking for intent → model → hypothesis → execution.
- Capability composition instead of class/type inheritance for hybrid domains.
- Adapter/strategy patterns remain specialist choices only when evidence requires them.

## Assumptions

- Node 20+ remains available for the harness and generated-project readiness helper.
- Existing destination and decision-right contracts should remain stable.
- Legacy experimental scripts do not need to be repaired to deliver this slice.

## Alternatives considered

1. Add more project types — rejected because hybrid systems would still be forced into one box.
2. Add a large router/agent framework — rejected because the harness review explicitly recommends reconciliation and the current controller is already sufficient.
3. Rely on prompt text only — rejected because it does not provide executable proof that discovery occurred.

## Bounded proof

Regression tests create a generated project, confirm it starts blocked with eight gates and draft discovery artifacts, then promote the artifacts/state and require the local readiness verifier to pass. Existing destination, memory, decision-right, and control tests must continue to pass on Node 20/22/24.

## Proposed architecture

`scripts/project-control.js` remains the supported control plane. Schema v2 adds `system_model` to task alignment. Ready/in-progress/completed state also requires confirmed system-model and accepted architecture-hypothesis artifacts. Generated projects receive the same artifacts plus `scripts/project-ready.mjs`. `PROJECT-TYPES.md` becomes a preset library instead of a mandatory router. `lock-project.js` delegates only to the supported controller rather than the incompatible legacy planning checker.

## Approval evidence

Shaun explicitly authorised Athena on 2026-09-09 to fix, run, reorganise, and finish the harness on GitHub, while the existing decision contract still reserves merge/release for Shaun.
