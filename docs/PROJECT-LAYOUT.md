# Project Layout Contract

The harness is the controller, not the container for product code. Every product receives its own project root outside the harness repository.

## Workspace boundary

```text
/home/shaun-prime/Development/
├── ai-project-starter/             reusable harness source
└── projects/                       configured workspace root
    └── super-clean-deals/          canonical project and Git repository
```

After destination creation, open `super-clean-deals/` as the VS Code workspace. The agent resumes, plans, codes, tests, and checkpoints from that project root. It must not create product code inside `ai-project-starter/`.

## Project lifecycle folders

```text
project-slug/
├── AGENTS.md                         project-local operating contract
├── .harness/                       machine-checkable agent state
├── 00-PLANNING/                    intake, design envelope, and approved plan
│   └── PROJECT-INTAKE.md            five-question starting brief
├── docs/                           current truth, architecture, and decisions
│   ├── NORTH-STAR.md                stable purpose and invariants
│   ├── CURRENT-STATE.md             concise present truth and next action
│   └── decisions/                  accepted and superseded ADRs
├── src/                            canonical product source
├── tests/                          proof of behaviour
├── build/                          disposable assembled release tree
└── dist/                           finished distribution artifacts
```

| Folder | Owner and rule |
|---|---|
| `AGENTS.md` | Project-local operating contract loaded when the project opens independently. |
| `.harness/` | The control layer writes state here. Product code never belongs here. |
| `00-PLANNING/` | The agent plans here until the Alignment Ladder permits execution. |
| `docs/` | Holds concise current truth and durable reasons. It is not shipped with the product unless the product requires it. |
| `src/` | Source of truth for authored product code. Once execution starts, this is where the agent codes. |
| `tests/` | Automated and manual proof kept separate from shipped runtime files. |
| `build/` | Generated staging area. It may be deleted and rebuilt; never hand-edit it. |
| `dist/` | Short for **distribution**. Contains only finished, verified installable or deliverable artifacts. |

Git history and release tags preserve old versions. Do not create a second handwritten `archive/` folder.

## WordPress plugin layout

A WordPress project uses a slug-named plugin directory below `src/` so the installable boundary is unambiguous:

```text
super-clean-deals/
├── .harness/
├── 00-PLANNING/
├── docs/
├── src/
│   └── super-clean-deals/
│       ├── super-clean-deals.php
│       ├── includes/
│       ├── admin/
│       ├── frontend/
│       ├── services/
│       ├── adapters/
│       ├── assets/
│       ├── templates/
│       ├── languages/
│       ├── readme.txt
│       └── uninstall.php
├── tests/
├── build/
│   └── super-clean-deals/          generated staging copy
└── dist/
    ├── super-clean-deals-1.0.0.zip
    └── super-clean-deals-1.0.0.sha256
```

The ZIP must contain exactly one top-level directory named `super-clean-deals/`. It is assembled from the plugin source into `build/`, verified there, then written to `dist/`. The package must exclude `.harness/`, `00-PLANNING/`, project documentation, tests, Git data, development dependencies, build tools, logs, secrets, and previous distributions.

`build/` and `dist/` are ignored apart from placeholder files. The distributable should be reproducible from tracked source and a release command; generated ZIP files do not become the source of truth.

## Execution handoff

1. Run the destination command from the harness and preview the resolved paths.
2. Create the project only after the preview is correct.
3. Open the returned `working_directory` as the VS Code workspace.
4. Complete intake and planning in `00-PLANNING/` and project memory.
5. After all Alignment Ladder gates are `YES`, write product code under the returned `code_root`.
6. Prove behaviour from `tests/`.
7. Assemble generated release files in `build/`.
8. Put only the verified delivery artifact in `dist/`.
9. Deploy or upload only after explicit release approval.

The deployment destination is external runtime state. It is never the canonical source folder and is never populated as a side effect of project creation.
