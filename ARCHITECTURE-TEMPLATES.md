# ARCHITECTURE-TEMPLATES.md — Visual Patterns

> Reference diagrams for Shaun's OOP + pipeline + automation style.
> AI: copy these shapes. Don't invent new ones unless the project genuinely needs it.

---

## 1. The Pipeline + Envelope (the core data architecture)

This is Shaun's default for scraping, automation, and lead processing.

```
                          ┌──────────────┐
   raw input  ───────────▶│   ENVELOPE   │  wrap once, carry forever
   (URL/form/API/file)    │              │
                          │ data         │
                          │ source       │
                          │ timestamp    │
                          │ campaign     │
                          │ retry_count  │
                          │ confidence   │
                          │ errors[]     │
                          └──────┬───────┘
                                 │
   ┌─────────┐   ┌─────────┐   ┌─▼───────┐   ┌──────────┐   ┌─────────┐
   │  FETCH  │──▶│  PARSE  │──▶│NORMALISE│──▶│ VALIDATE │──▶│ ENRICH  │
   └─────────┘   └─────────┘   └─────────┘   └──────────┘   └────┬────┘
   adapter       strategy      pure fns      reject loud        │
   (Axios/                                    log, don't drop    │
   Playwright)                                                   ▼
                          ┌──────────┐   ┌─────────┐   ┌──────────────┐
                          │  DEDUPE  │──▶│  STORE  │──▶│ EXPORT/REPORT │
                          └──────────┘   └─────────┘   └──────────────┘
                                          SQLite/MySQL   CSV/JSON/dashboard
```

**Rules:**
- The envelope is created once at ingestion and travels through every stage.
- Each stage reads the envelope, does one job, returns the envelope (mutated or new).
- Errors accumulate in `errors[]` — a stage can fail without killing the pipeline.
- Validation rejects loudly (logs reason) but never silently drops data.

---

## 2. Envelope Type (TypeScript)

```typescript
export interface Envelope<T> {
  data: T | null;
  source: string;            // where it came from
  timestamp: Date;
  campaign?: string;
  retryCount: number;
  confidence: number;        // 0..1
  errors: StageError[];
  meta: Record<string, unknown>;
}

export interface StageError {
  stage: string;
  code: string;
  message: string;
  at: Date;
}

export function wrap<T>(data: T, source: string): Envelope<T> {
  return {
    data, source, timestamp: new Date(),
    retryCount: 0, confidence: 1, errors: [], meta: {},
  };
}

export function fail<T>(env: Envelope<T>, stage: string, code: string, message: string): Envelope<T> {
  return { ...env, data: null, errors: [...env.errors, { stage, code, message, at: new Date() }] };
}
```

---

## 3. Pipeline Stage Contract (TypeScript)

Every stage implements the same interface. The pipeline runs them in order.

```typescript
export interface Stage<In, Out> {
  readonly name: string;
  run(env: Envelope<In>): Promise<Envelope<Out>>;
}

export class Pipeline<T> {
  constructor(
    private stages: Stage<any, any>[],
    private logger: Logger,
  ) {}

  async process(env: Envelope<T>): Promise<Envelope<unknown>> {
    let current: Envelope<unknown> = env;
    for (const stage of this.stages) {
      if (current.data === null) {
        this.logger.warn(`Skipping ${stage.name}: envelope already failed`, { errors: current.errors });
        break;
      }
      current = await stage.run(current);
    }
    return current;
  }
}
```

**Dependency injection:** stages and the logger are passed in via constructor. Never `new` a dependency inside a class.

---

## 4. Factory + Adapter + Strategy (the swap trio)

When the same job has different implementations (static HTML vs JS page vs API):

```
                     ┌─────────────────┐
   "what kind of     │  FetcherFactory │   picks the right fetcher
    source is this?" │                 │   by inspecting the input
                     └────────┬────────┘
                              │ creates
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────────┐ ┌──────────────┐ ┌─────────────┐
     │ AxiosFetcher   │ │ CheerioFetch │ │ Playwright  │   ← Adapters
     │ (fast, static) │ │ (parse HTML) │ │ (JS render) │     (same interface,
     └────────────────┘ └──────────────┘ └─────────────┘      different tools)
              │               │               │
              └───────────────┴───────────────┘
                              │
                     implements Fetcher interface
                     (Strategy — swappable at runtime)
```

```typescript
export interface Fetcher {
  fetch(url: string): Promise<Envelope<string>>;
}

export class FetcherFactory {
  constructor(private logger: Logger) {}

  create(kind: 'static' | 'dynamic' | 'api'): Fetcher {
    switch (kind) {
      case 'static':  return new AxiosFetcher(this.logger);
      case 'dynamic': return new PlaywrightFetcher(this.logger);
      case 'api':     return new ApiFetcher(this.logger);
    }
  }
}
```

---

## 5. OOP Class Template (TypeScript) — DI by default

```typescript
/**
 * One class, one job. Dependencies injected, never instantiated inside.
 */
export class LeadNormaliser {
  constructor(
    private readonly validator: LeadValidator,
    private readonly logger: Logger,
  ) {}

  normalise(env: Envelope<RawLead>): Envelope<CleanLead> {
    this.logger.debug('normalise:start', { source: env.source });

    if (!env.data) return env as unknown as Envelope<CleanLead>;

    const clean: CleanLead = {
      phone: this.formatPhone(env.data.phone),
      email: env.data.email.trim().toLowerCase(),
      name: env.data.name.trim(),
    };

    return { ...env, data: clean };
  }

  private formatPhone(raw: string): string { /* ... */ return raw; }
}
```

---

## 6. WordPress Plugin Class Template (PHP) — DI by default

```php
<?php
/**
 * One class, one job. $wpdb wrapped in repository, never touched directly here.
 */
class LeadStream_Tracking_Service {

    private LeadStream_Repository $repo;
    private LeadStream_Logger $logger;

    public function __construct( LeadStream_Repository $repo, LeadStream_Logger $logger ) {
        $this->repo   = $repo;
        $this->logger = $logger;
    }

    public function record_click( array $payload ): int {
        $this->logger->debug( 'record_click', array( 'source' => $payload['source'] ?? 'unknown' ) );

        $clean = array(
            'source'      => sanitize_text_field( $payload['source'] ?? '' ),
            'campaign'    => sanitize_text_field( $payload['campaign'] ?? '' ),
            'created_at'  => current_time( 'mysql' ),
        );

        return $this->repo->insert_event( $clean );
    }
}
```

```
WordPress plugin layering:

  hooks (bootstrap)  ─────────▶  only add_action / add_filter
        │
        ▼
  services (logic)   ─────────▶  business rules, no SQL, no echo
        │
        ▼
  repository (data)  ─────────▶  ALL $wpdb->prepare() lives here
        │
        ▼
  MySQL custom tables
```

---

## 7. Error Bubbling (automation pipelines)

```
   Stage fails
        │
        ▼
   Log it loudly (logger.error with stage + code + context)
        │
        ▼
   Attach to envelope.errors[]   ← data not lost, reason recorded
        │
        ▼
   envelope.data = null          ← downstream stages skip it
        │
        ▼
   Pipeline continues with other items (one bad item ≠ dead run)
        │
        ▼
   At the end: report = { processed, succeeded, failed[], reasons[] }
```

**Rule:** a single bad record never kills the whole run. Failures are logged, attached, and reported — not swallowed, not fatal.

---

## 8. Retry + Circuit Breaker (flaky sources)

```
   request ──▶ try
                │
        ┌───────┴───────┐
        ▼               ▼
     success          failure
        │               │
        ▼               ▼
     return        retry with backoff (1s, 2s, 4s...)
                        │
                   max retries hit?
                        │
                  ┌─────┴─────┐
                  ▼           ▼
                no          yes
                  │           │
              retry      OPEN the circuit
                         (stop hammering for N seconds,
                          fail fast, log, alert)
```

Use for: scraping targets, external APIs (GA4, Twilio), network failover checks.

---

## 9. Dashboard Layout (owner-first)

```
┌───────────────────────────────────────────────────────┐
│  OWNER MODE  (default screen)                           │
│                                                         │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│   │  47    │  │  12    │  │  +18%  │  │ Source │       │
│   │ leads  │  │ calls  │  │ vs LW  │  │  = GA4 │       │
│   │ today  │  │ today  │  │        │  │  top   │       │
│   └────────┘  └────────┘  └────────┘  └────────┘       │
│                                                         │
│   "What should I do next?"  → 3 leads need follow-up    │
│                                                         │
│   [ Switch to Analyst mode ]   [ Export CSV ]           │
└───────────────────────────────────────────────────────┘
                          │ one click
                          ▼
┌───────────────────────────────────────────────────────┐
│  ANALYST MODE                                           │
│   filters | date range | source breakdown | event log  │
│   sortable table | CSV/JSON export | debug panel        │
└───────────────────────────────────────────────────────┘
```

---

## When To Use Which

| Project type | Primary template |
|--------------|-----------------|
| Scraping pipeline | #1 Pipeline + Envelope, #4 Factory/Adapter, #7 errors, #8 retry |
| Python/TS automation | #3 Pipeline contract, #5 OOP+DI, #7 errors |
| WordPress plugin | #6 PHP class + layering, #9 dashboard |
| API service | #5 OOP+DI, #7 errors |
| Dashboard | #9 owner-first layout |
| Networking tool | #7 errors, #8 retry/circuit breaker |
