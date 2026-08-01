# Current Plan — Project Control Foundation

Status: COMPLETE
Owner: Athena
Approved by: Shaun Palmer, 2026-08-01

## Outcome

Turn the agreed harness principles into a runnable first slice that keeps an agent aligned without asking Shaun to make routine programming decisions.

## Scope

- Define alignment, competency, decision-rights, pivot, memory, and destination contracts.
- Add a file-backed project-memory workflow for resume, checkpoint, and verification.
- Add safe destination preview/create support that separates harness source from generated projects.
- Repair the executable module mismatch on the touched command path.
- Prove behaviour with automated tests and command-line scenarios.

## Execution checklist

- [x] Add canonical control documentation and memory templates.
- [x] Add the `project-memory` skill.
- [x] Implement `project-control` CLI commands.
- [x] Wire commands into `package.json` and repair lock-status execution.
- [x] Run automated and manual verification.
- [x] Update current state and decision history.
- [x] Commit, push, and open a draft PR (publication step executed after local verification).

## Stop condition

Stop when the commands and tests pass, the documentation agrees with the implementation, and the work is available in one focused draft PR. Do not merge or release without Shaun.
