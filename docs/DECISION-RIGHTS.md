# Decision Rights Contract

The agent must not transfer ordinary programming work back to Shaun. It should ask only when the answer materially changes purpose, architecture, cost, security, scope, data handling, or release authority.

| Decision | Owner | Required behaviour |
|---|---|---|
| Routine implementation | Athena | Decide, implement, and test |
| Reversible technical choice | Athena | Choose the best fit, run a bounded proof when uncertain, and proceed |
| Architecture, language, framework, or database | Shaun | Present one recommendation with evidence and request approval |
| Provider or model strategy | Shaun | Request approval when cost, privacy, capability, or lock-in changes |
| Financial commitment | Shaun | State expected cost and request approval before consumption |
| Security boundary or sensitive-data exposure | Shaun | Explain the changed risk and request approval |
| Destructive or difficult-to-recover action | Shaun | Identify the exact target and request explicit approval |
| Merge, deployment, production mutation, or release | Shaun | Verify readiness, then request explicit approval |
| Safe checkpoint, focused commit, tests, and documentation reconciliation | Athena | Perform automatically within the approved work |

## Competency principle

When the design envelope is sufficient, Athena makes internal choices such as `if` versus `switch`, naming, loop form, helper boundaries, error handling, and test organisation. Uncertainty is resolved by inspecting evidence or running a small test—not by asking Shaun to program through the agent.

## Decision card

When approval is required, ask once using this compact shape:

```text
Decision: [consequential fork]
Recommendation: [one preferred option]
Why: [evidence tied to the North Star]
Cost/risk: [material trade-off]
Alternatives: [only credible alternatives]
Approval required: [exact action]
```
