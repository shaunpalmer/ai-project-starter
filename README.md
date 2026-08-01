# AI Project Starter

A planning-first development harness for working with AI agents without handing routine programming decisions back to the project owner.

The harness keeps four things distinct:

- the North Star: why the project exists;
- current truth: what is true now and what happens next;
- decision history: why a route was chosen or superseded;
- executable evidence: code, tests, Git facts, and structured task state.

## Requirements

- Node.js 20 or newer
- Git

No npm dependencies are required for the project-control foundation.

## Start a session

```bash
npm run memory:resume
npm run status
```

Then read `AGENTS.md` and the files named by the active task.

## Core commands

| Command | Purpose |
|---|---|
| `npm run setup` | Initialise required harness folders and the planning lock |
| `npm run status` | Show planning lock status |
| `npm run unlock` | Verify planning and project control before unlocking |
| `npm run memory:resume` | Reconstruct compact current context |
| `npm run control:verify` | Validate memory, decisions, and alignment state |
| `npm run memory:checkpoint -- --summary "..."` | Capture a factual handoff checkpoint |
| `npm run decision -- --kind routine` | Resolve who owns a decision category |
| `npm run destination -- --slug example --workspace-root /absolute/path` | Preview a canonical project destination |
| `npm test` | Run automated behaviour tests |

## Create a bounded project destination

Preview first:

```bash
npm run destination -- \
  --name "Super Clean Deals" \
  --slug super-clean-deals \
  --type wordpress-plugin \
  --workspace-root /home/shaun-prime/Development/projects \
  --deploy-root /var/www/html/wordpress/wp-content/plugins
```

Add `--create` only after the displayed paths are correct. Creation writes a project-local `AGENTS.md`, intake and memory starters, project-control state, and the standard `00-PLANNING/`, `docs/`, `src/`, `tests/`, `build/`, and `dist/` lifecycle folders into an empty canonical project directory. It does not deploy or copy files into WordPress.

For a WordPress plugin, the command reports these distinct paths:

- `working_directory`: open this project root in VS Code;
- `code_root`: author the plugin under `src/<plugin-slug>/`;
- `build_root`: assemble a disposable installable tree here;
- `distribution_root`: place the verified `<plugin-slug>-<version>.zip` here;
- `deploy_destination`: optional external WordPress runtime path.

See `docs/PROJECT-LAYOUT.md` for the complete folder ownership and packaging contract.

## Memory model

| File | Authority |
|---|---|
| `docs/NORTH-STAR.md` | Stable purpose and invariants |
| `docs/CURRENT-STATE.md` | Current truth and next action |
| `docs/decisions/` | Accepted and superseded technical decisions |
| `.harness/state/active-task.json` | Active task and Alignment Ladder |
| `.harness/state/checkpoints/` | Generated factual handoffs |
| Git | Exact code history |

See `docs/PROJECT-CONTROL.md` for the Alignment Ladder, Controlled Pivot Loop, session protocol, and destination contract. See `docs/DECISION-RIGHTS.md` for what Athena decides and what requires Shaun.

## Current boundary

This slice creates and validates control state plus the project lifecycle scaffold. Reproducible packaging commands, runtime deployment adapters, and semantic retrieval remain separate slices; project creation never performs those actions implicitly.
