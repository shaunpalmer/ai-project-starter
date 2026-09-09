# Legacy Project Migration

Use this path for real product projects created by an early harness generation before the managed lifecycle existed, especially when the product project still lives inside an old starter folder and has no `.harness/handoff.json` or project-local Git repository.

This is different from `adopt`:

- **update**: project already has a managed lifecycle baseline;
- **adopt**: project has a recognisable older harness version/history from which a trusted managed baseline can be reconstructed;
- **migrate**: pre-lifecycle product project must be separated from an old starter and converted into a standalone managed project without changing product behaviour.

## Safe migration command

Run from a current starter clone:

```bash
npm run harness -- migrate \
  --from /absolute/path/to/old/project \
  --to /absolute/path/to/new/standalone-project \
  --name "Project Name" \
  --slug project-slug
```

`--type` is optional. The migrator recognises a standard WordPress plugin header under `src/` and selects `wordpress-plugin`; otherwise it uses `infer` unless an explicit type is supplied.

## What migrate does

1. validates that source and destination are absolute, separate, non-overlapping directories;
2. verifies that the source looks like a real project root rather than an arbitrary folder;
3. inventories every source file with size and SHA-256 evidence;
4. copies the project to the new standalone destination while leaving the legacy source untouched;
5. verifies that the copy exactly matches the source inventory before adding lifecycle files;
6. preserves project-owned source, docs, tests, planning, `AGENTS.md`, build output and release artifacts;
7. creates missing current project metadata and draft discovery artifacts without redesigning product behaviour;
8. preserves an incompatible pre-v0.5 active-task file under `.harness/legacy/` before creating current schema-v2 task state;
9. installs the current managed handoff, engineering defaults, skills, VCS controller and lifecycle controller;
10. initialises standalone Git on a safe work branch when needed and creates the bootstrap checkpoint when Git identity is configured;
11. records `.harness/migration.json` with the original source path and source inventory;
12. rolls back the newly created destination if any migration/handoff step fails. The legacy source is never used as the rollback target and is never deleted or rewritten.

## After migration

Open the standalone project, not the old starter folder.

Run the project's existing tests first, then:

```bash
node scripts/harness.mjs doctor
```

The generated `SYSTEM-MODEL.md` and `ARCHITECTURE-HYPOTHESIS.md` remain `DRAFT` after migration on purpose. Existing code/docs/tests are the evidence used to reconcile them before the next product change. Migration itself is not an architecture rewrite.

Future harness upgrades are then normal project-local lifecycle operations:

```bash
node scripts/harness.mjs doctor
node scripts/harness.mjs update --check
node scripts/harness.mjs update --apply
```

## Example: Link Optimizer

```bash
cd ~/Developer/Projects/ai-project-starter-v05
npm run harness -- migrate \
  --from /home/shaun-prime/Developer/Projects/ai-project-starter1-main/link-optimizer \
  --to /home/shaun-prime/Developer/Projects/link-optimizer \
  --name "Link Optimizer" \
  --slug link-optimizer
```

The legacy project remains at its original path as evidence until the standalone migration has been verified and intentionally archived later.
