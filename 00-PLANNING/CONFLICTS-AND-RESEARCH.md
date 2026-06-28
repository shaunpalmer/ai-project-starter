# CONFLICTS-AND-RESEARCH

that file becomes the place where the agent works through:

competing ideas
different possible architectures
old notes vs new notes
Shaun thinking out loud
AI recommendations that disagree
research snippets
library/framework choices
database trade-offs
implementation options


## Purpose

This file controls how the agent handles competing ideas, research notes, unclear instructions, and conflicts between planning documents.

Shaun may collect rough notes, compare options, think out loud, or change direction while working through a design.

The agent must not treat all notes as decisions.

The agent must classify, compare, resolve, and record before changing architecture, stack, database, or build direction.

## Input Types

- Confirmed Decision
- Research Note
- Option Under Consideration
- Casual Comment
- Assumption
- Risk
- Open Question
- Rejected Idea

## Conflict Rule

Quality architecture beats casual comments.

Confirmed decisions beat suggestions.

Research informs decisions, but does not automatically become architecture.

If unsure, ask Shaun.

## Research Folder Rule

If `00-PLANNING/RESEARCH-NOTES/` exists, read it during Discovery.

Do not copy research notes directly into architecture.

Summarize them into options, trade-offs, risks, and recommendations.

## Resolution Status

Every conflict must end with one status:

- RESOLVED
- NEEDS SHAUN/Senior Developer.
- NEEDS ARCHITECTURE UPDATE
- NEEDS PROTOTYPE
- DEFERRED
- REJECTED
