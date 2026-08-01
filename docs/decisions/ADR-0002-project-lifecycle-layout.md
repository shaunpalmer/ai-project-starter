---
id: ADR-0002
title: Separate project lifecycle and distribution layout
status: accepted
date: 2026-08-01
owner: Shaun Palmer
---

# Context

The harness could resolve an external project destination but did not tell the agent where planning ends, where authored code begins, or where a finished installable package belongs. That ambiguity risks writing product code into the reusable harness or treating generated release files as source.

# Decision

Create every product as a separate project under the configured workspace root. Within that project use `.harness/` for control state, `00-PLANNING/` for the design envelope, `docs/` for current knowledge and decisions, `src/` for canonical code, `tests/` for proof, `build/` for disposable release assembly, and `dist/` for finished distribution artifacts.

For WordPress plugins, canonical plugin code lives at `src/<plugin-slug>/`. The release ZIP is named `<plugin-slug>-<version>.zip`, contains exactly one `<plugin-slug>/` top-level directory, and excludes project-control and development-only files.

# Rationale

The boundaries make the folder tree readable as agent context, prevent the harness from becoming a mixed collection of generated products, and make the release artifact reproducible from tracked source.

# Consequences

- The generated project root becomes the VS Code working directory after creation.
- The agent can infer folder ownership without asking for routine placement decisions.
- `build/` and `dist/` are generated, ignored, and never canonical source.
- Local deployment remains a separate explicit action and path.
- Git history and release tags replace a handwritten archive directory.
