# Changelog

This file records meaningful user-facing harness changes. Git remains the source for exact file history.

## Unreleased

### Added

- Regression coverage for destination boundaries, malformed task state, setup/unlock failures, and memory handoff.
- GitHub checks on Node 20, 22, and 24, plus a bounded harness review and documented limitations.
- Evidence-backed seven-gate Alignment Ladder.
- Decision-right routing between Athena and Shaun.
- File-backed resume, checkpoint, and verification commands.
- Controlled Pivot Loop and ADR history contract.
- Safe project destination preview and creation.
- Type-aware project lifecycle scaffolding with separate planning, source, test, build, distribution, and deployment ownership.
- WordPress distribution contract for a slug-rooted installable ZIP in `dist/`.
- Automated project-control tests.

### Changed

- Reject relative or escaped project destinations, paths inside the harness, and overlapping deployment locations.
- Require unique, evidenced all-YES gates for ready, in-progress, and completed work.
- Anchor setup/lock commands to their harness; fail clearly on missing core files and denied unlock.
- Describe planning locks as advisory and older demo scripts as unsupported.
- Consolidated the agent operating manual and README around one authoritative control contract.
- Repaired ES-module execution for planning and lock commands.

### Removed

- Removed the SQLite memory demo that seeded fictitious decisions and changes on every run.
