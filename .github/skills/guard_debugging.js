# SKILL: In-Place Debugging & Patching Protocol

## Core Invariant
You are FORBIDDEN from deleting existing source files or performing wholesale file replacements to fix bugs. You must treat existing source code as foundational architecture. Your goal is to surgically patch defects, not rewrite systems.

## Mandatory Execution Sequence
Whenever a failure, error, or bug is identified, you must complete these three steps in order:

1.  **READ & REASON:** Open and inspect the entire existing file. Identify the exact line or block causing the regression.
2.  **DIAGNOSTIC RECORD:** You must generate a `.debug-session` record detailing what failed, why it failed, and your target fix.
3.  **SURGICAL PATCH:** Use precise line edits or surgical updates. Retain all surrounding functions, comments, and architectural configurations.
