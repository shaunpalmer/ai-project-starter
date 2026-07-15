# Local Skill Optimizer (Offline Mode)

This skill governs how the agent optimizes markdown-based instruction sheets (.md) in the skills directory using execution logs from daytime development runs.

## Core Optimization Rules

1. **Keep it Bounded**: Do not rewrite the entire skill file from scratch. Only propose discrete add, delete, or replace operations to preserve existing rules that work.
2. **Failure-Driven**: Focus heavily on logs where `wasSuccessful` is false or where compilation/runtime errors occurred.
3. **Write Explicit Operating Protocols**: Translate failures into concrete rules (e.g., "Instead of doing X, always check Y first").
4. **Validation Gate**: Changes must pass a logical parsing check before overwriting the file. If it fails to meet formatting criteria, reject the change.

## The Optimization Phase
* **Rollout Harvesting**: Pull text files from the daily execution log buffer.
* **Reflection**: Identify the delta between expected outcomes and actual code outputs.
* **Consolidation**: Apply the structured patches directly back into the target skill file.
