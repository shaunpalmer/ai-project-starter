id: ADR-0004
title: Engineering defaults and deterministic version control
status: accepted
date: 2026-09-09

# ADR-0004 — Engineering defaults and deterministic version control

## Context

The harness can already model unfamiliar systems before architecture, but it still risks asking Shaun routine engineering questions that mature ecosystems or repository evidence have already answered. Version control was also not a reliable control-loop primitive: the legacy helper was interactive, staged the whole worktree, created timestamp commits, and pushed without a protected-branch policy.

## Decision

1. Add `ENGINEERING-DEFAULTS.md` as the baseline policy for routine language/runtime, architecture, style, dependency, persistence, failure, test, and VCS choices.
2. Routine engineering question budget is zero. Established defaults are applied automatically; material deviations remain consequential.
3. Automatically bind ecosystem skills from confirmed capabilities, including The WordPress Way for WordPress and scraping-pipeline guidance for scraping/ingestion.
4. Consolidate The WordPress Way into one authoritative non-duplicated contract.
5. Add a zero-dependency, non-interactive `scripts/vcs-control.js` for Git preflight/init/branch/focused checkpoint/remote verification/safe feature-branch push.
6. Use existing machine Git/SSH/GitHub credentials only. Never store or request tokens in the harness.
7. Refuse protected-branch managed writes, force-style behaviour, broad implicit staging, and credential-bearing HTTPS remote URLs.
8. Remote-repository creation/deletion, merge, deployment, release, and destructive history edits remain Shaun-owned.

## Consequences

- WordPress/Python/automation projects begin with stronger defaults and fewer unnecessary questions.
- Version-control failures become explicit machine-readable failures rather than hidden interactive stalls.
- The Node control plane remains the harness implementation regardless of the product language selected for a project.
- Generated-project handoff of these proven controls is a separate integration step after CI proof.

## Approval

Shaun approved this direction explicitly on 2026-09-09 and asked Athena to proceed without further routine implementation help. Merge/release remains separately controlled by the existing decision-right contract.
