# SKILL: Scraping / Ingestion Pipeline

## Purpose

Design reliable data acquisition and ingestion work from observed responsibilities rather than forcing every scraper into a fixed seven-file architecture.

## When to use

Use when the confirmed system model includes acquisition from websites/APIs plus extraction, validation, normalisation, persistence, enrichment, export, or monitoring responsibilities.

## Candidate responsibilities

A mature pipeline often contains some of these responsibilities:

```text
schedule/queue → acquire → parse → validate → transform/normalise → dedupe → enrich → load → export → monitor
```

This is a responsibility map, not a mandatory class/process/file list. A one-site prototype may combine several steps. Separate them only when scale, retries, provider boundaries, testing, concurrency, cost control, or failure isolation justify it.

## Discovery questions the agent should answer from evidence

- What are the sources and what data is required?
- Is an official API preferable/available before scraping?
- Which sources require JavaScript/browser rendering?
- What state must survive crashes and reruns?
- What uniquely identifies a record?
- Where must dedupe occur before paid provider calls?
- What are rate limits, budgets, retryable failures, and permanent failures?
- What fallback path exists when a source/provider fails?
- What observable counts prove pipeline health?
- What legal/ToS/robots/privacy constraints apply?

## Useful patterns — only when the failure mode exists

- **Pipeline:** staged transforms with explicit contracts.
- **Envelope:** carry source/job metadata beside payload data.
- **Adapter:** isolate provider/page/API differences.
- **Strategy:** select acquisition/enrichment approach at runtime.
- **Retry + backoff:** transient timeout/429/network failure.
- **Circuit breaker:** stop hammering a failing or budget-exhausted provider.
- **Idempotent upsert:** safe reruns without duplicates.

## Cost and data-quality ordering

Prefer cheap deterministic checks before paid or fragile work:

```text
acquire → normalise → dedupe → validate → paid enrichment → persist/export
```

The exact order may vary, but the architecture hypothesis must explain any paid call that occurs before dedupe/validation.

## First useful proof

For a new pipeline, prove one vertical path end to end:

- acquire one representative source;
- produce one validated normalised record;
- persist/export it;
- rerun without duplicating it;
- demonstrate one handled failure/fallback;
- record enough run evidence to diagnose failure.

## Quality gate

- source and data contract documented;
- system model identifies persistent state and idempotency;
- provider cost/rate limits have explicit guards when applicable;
- retryable vs permanent failure is distinguishable;
- validation failures are observable, not silently discarded;
- selectors/adapters are diagnosable when page shape changes;
- first useful proof passes before scale/concurrency is added.
