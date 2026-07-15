# SKILL: Interface Design (Adapter / Envelope / Factory)

## Purpose

Define the contracts between system layers so that modules can be swapped, tested, and extended without rewriting their consumers. Covers interface contracts, adapter patterns, envelope patterns, and factory patterns.

## When to Use

- Before implementing any module with external dependencies
- When designing a module that will have multiple implementations (e.g., multi-provider, multi-database)
- When refactoring tightly coupled code

## Inputs Required

- [ ] `ARCHITECTURE.md` — layers and dependency directions
- [ ] `TECH-SPEC.md` — language and framework (interfaces look different in TypeScript vs Python vs Go)

## Patterns

### Adapter Pattern

Use when: integrating an external service that may change or be swapped.

```typescript
// Contract (interface)
interface EmailProvider {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Adapter implementation
class SendgridAdapter implements EmailProvider {
  async send(to, subject, body) { /* Sendgrid-specific code */ }
}

// Consumer only knows the interface
class NotificationService {
  constructor(private email: EmailProvider) {}
}
```

**Rule:** The consumer MUST NOT import the concrete adapter directly.

### Envelope Pattern

Use when: a function can succeed or fail, and the caller needs to handle both without exceptions.

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**Rule:** Functions at layer boundaries return `Result`, not raw values or thrown errors.

### Factory Pattern

Use when: object creation is complex, conditional, or needs to be deferred.

```typescript
class ProviderFactory {
  static create(type: 'sendgrid' | 'ses' | 'mailgun'): EmailProvider {
    switch (type) {
      case 'sendgrid': return new SendgridAdapter();
      case 'ses': return new SesAdapter();
      case 'mailgun': return new MailgunAdapter();
    }
  }
}
```

**Rule:** Factories live in the infrastructure layer, not the domain layer.

## Process

### Step 1 — Identify Seams

A seam is any point where the concrete implementation might change. List all seams:

| Seam | Why it might change | Pattern to use |
|------|-------------------|---------------|
| Email provider | Switch vendors | Adapter |
| Payment gateway | Switch vendors | Adapter |
| Database reads | Add caching | Adapter |
| Service call results | Errors need propagation | Envelope |
| Object creation | Multiple types | Factory |

### Step 2 — Write the Interface First

Before any implementation, write the interface file. The interface is the contract.

### Step 3 — Write One Implementation

Write the simplest real implementation against the interface.

### Step 4 — Write a Test Double

Write a fake/stub implementation for testing. This proves the interface is usable.

## Output

- Interface files in `src/interfaces/` or equivalent
- One concrete adapter per external dependency
- One factory per multi-implementation seam

## Quality Check

- [ ] No consumer imports a concrete adapter directly
- [ ] All layer-boundary functions return Result envelopes
- [ ] Every interface has at least one test double
- [ ] Factories are in the infrastructure layer

