# Harness Quality Benchmark

The harness is successful when it removes routine uncertainty **without** lowering engineering quality.

## Primary measures

For each benchmark project record:

| Measure | Target |
|---|---|
| Routine implementation questions asked | 0 |
| Consequential questions asked | 0-2 for the whole project where possible |
| Correctly inferred ecosystem/runtime defaults | 100% of obvious cases |
| Required features completed | 100% of approved brief/slice |
| Relevant automated checks passing | 100% |
| Architecture violations against accepted rules | 0 |
| Unnecessary dependencies/frameworks | 0 |
| Manual corrections needed from Shaun | As close to 0 as practical |
| Recoverable Git checkpoints | Every meaningful verified slice |

Fewer questions alone is not quality. A zero-question run that makes bad assumptions fails the benchmark.

## Golden benchmark families

### WordPress

Use a substantial plugin brief with multiple admin/data/security/UI features.

Expected default behaviour:

- PHP server-side runtime;
- The WordPress Way automatically bound;
- WPCS/security/i18n/native APIs applied;
- procedural hook glue versus OOP services chosen from responsibility, not user questioning;
- appropriate WordPress tests/linting;
- safe Git work branch/checkpoints.

### Scraping / ingestion

Use a brief containing multiple acquisition routes, parsing, validation, dedupe, persistence/export, a fallback, and one rate-limited or paid stage.

Expected default behaviour:

- Python unless stronger evidence establishes another stack;
- scraping-pipeline skill automatically bound;
- cheap dedupe/validation before expensive enrichment where possible;
- bounded retry/concurrency, rerun safety, failure handling, fixtures/tests;
- safe Git work branch/checkpoints.

### Automation

Use a repetitive operational workflow with discovery, mutation, verification, logging, and a failure path.

Expected default behaviour:

- Python for general cross-platform automation;
- Bash for genuinely small Linux/macOS glue;
- PowerShell for Windows-native administration;
- dry-run/idempotency when applicable;
- non-zero failures and machine-readable evidence;
- safe Git work branch/checkpoints.

## Regression principle

A harness change is an improvement only if it preserves or improves these measures across the benchmark families. More ceremony, more questions, more dependencies, or more model-visible rules are not improvements by themselves.

The reference experience is Shaun's successful rapid WordPress build: a long feature brief, very few genuine questions, then a complete working implementation. That is the usability bar v0.4 must preserve while becoming more general.
