# Sub-Agent Delegation Skill

Use sub-agents only when a task clearly benefits from specialization. Delegation is a controlled tool, not a default.

## When to Delegate

- Complex parallel work (e.g. one agent for UI, another for backend logic)
- Specialized review (code review agent, accessibility agent, performance agent)
- Heavy verification loops

## Delegation Rules

- Clearly define the sub-agent’s role, scope, input, and success criteria.
- Maintain a master trace in the main agent.
- All sub-agents must report back with verification evidence.
- Merge results only after main agent review.

## Pacing & Control

- Maximum 40 cycles per minute across all agents (main + sub-agents).
- Enforce deliberate pauses between delegation handoffs.
- Never exceed 3 active sub-agents simultaneously without explicit approval.
- If coordination becomes chaotic, collapse back to single-agent mode and log the failure.

**Safety**: The main agent is always responsible for final integration and quality gate.
