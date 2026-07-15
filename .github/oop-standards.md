---

name: oop-standards
description: >
Enforces maintainable object-oriented architecture, SOLID principles,
deliberate design-pattern selection, dependency boundaries, testability,
and project-specific PHP, WordPress, TypeScript, JavaScript, and Python
coding standards. Use when planning, creating, reviewing, refactoring,
or extending classes, services, repositories, adapters, factories,
pipelines, plugins, APIs, or multi-component software.
------------------------------------------------------

# OOP Standards

## Purpose

Use this skill to ensure code is:

* clear before it is clever;
* modular without becoming fragmented;
* extensible without speculative over-engineering;
* testable without depending on hidden global state;
* compatible with the existing project architecture;
* explicit about responsibilities, dependencies, side effects, and failures.

This skill governs architecture and implementation.

It does **not** require every problem to be solved with classes. Procedural or functional code is acceptable when it produces a clearer and more maintainable result.

---

## When to Activate

Activate this skill when the task involves:

* creating or changing classes, interfaces, traits, services, or modules;
* designing a plugin, package, subsystem, API, integration, or feature;
* choosing or reviewing a design pattern;
* refactoring tightly coupled, duplicated, or oversized code;
* introducing dependency injection, factories, adapters, pipelines, or strategies;
* reviewing code for SOLID, cohesion, coupling, or testability;
* extending WordPress plugins beyond simple hook callbacks;
* creating TypeScript contracts, API clients, providers, or service layers;
* resolving architectural drift or unclear class responsibilities.

Do not force this skill onto a tiny one-off edit where architecture has no practical effect.

---

# Core Operating Rule

> Architecture first. Code second.

Before writing implementation code, identify:

1. the responsibility being added or changed;
2. the existing module that should own it;
3. the inputs and outputs;
4. the dependencies;
5. the side effects;
6. the public contract;
7. the likely extension points;
8. the failure and recovery paths;
9. the tests that will prove the behaviour.

Do not create an abstraction merely to demonstrate OOP knowledge.

Every abstraction must do at least one of the following:

* remove duplicated knowledge;
* isolate volatile behaviour;
* protect an architectural boundary;
* improve testability;
* make intent clearer;
* reduce coupling;
* prevent invalid state.

---

# I. The Four OOP Pillars

## 1. Abstraction

Expose intent rather than implementation.

Rules:

* Public methods must describe meaningful domain or system actions.
* Hide persistence, transport, framework, and vendor details behind boundaries.
* Prefer domain-specific names over vague names such as `Manager`, `Helper`, or `Processor`.
* Expose only the minimum interface required by callers.
* Do not expose mutable internal state unnecessarily.
* Keep contracts stable while allowing implementations to change.

Prefer:

```php
$invoice = $invoiceService->createForBooking($bookingId);
```

Avoid:

```php
$result = $manager->process($data);
```

---

## 2. Encapsulation

Keep state and the behaviour that protects it together.

Rules:

* Properties should be `private` by default.
* Use `protected` only when inheritance is intentional.
* Prevent invalid state during construction or through named methods.
* Do not generate getters and setters automatically for every property.
* Do not let callers bypass validation by mutating raw state.
* Prefer immutable value objects where practical.
* Keep the public API thin and intention-revealing.

Prefer:

```php
$order->markPaid($paymentReference);
```

Avoid:

```php
$order->setStatus('paid');
$order->setPaymentReference($paymentReference);
```

---

## 3. Inheritance

Use inheritance only for a genuine substitutable **is-a** relationship.

Rules:

* Prefer composition over inheritance.
* Avoid deep inheritance hierarchies.
* Do not inherit only to reuse a few methods.
* Do not expose excessive protected state to subclasses.
* Base classes must define stable behavioural contracts.
* Child classes must preserve the expectations of the parent contract.

Use inheritance when:

* the subtype genuinely fulfils the base contract;
* polymorphic substitution is required;
* shared invariants belong in the base;
* the hierarchy is shallow and stable.

Use composition when:

* behaviour needs to be swapped independently;
* multiple capabilities must be combined;
* inheritance would exist only for reuse;
* different features change for different reasons.

---

## 4. Polymorphism

Allow callers to depend on a common contract while implementations vary.

Rules:

* Use interfaces where implementations are genuinely interchangeable.
* Keep implementations behaviourally compatible.
* Select concrete implementations at the application boundary.
* Avoid repeated `switch`, type-string, or `instanceof` chains when polymorphism would remove them.
* Do not make callers understand concrete implementation details.

---

# II. SOLID Design Discipline

## 1. Single Responsibility Principle — SRP

A class should have one coherent responsibility and one primary reason to change.

Enforcement:

* Describe each class responsibility in one sentence.
* If the sentence contains “and,” inspect it for mixed responsibilities.
* Separate persistence, presentation, validation, transport, orchestration, and domain rules when they change independently.
* Do not create god classes.

Example decomposition:

* `Booking` — booking state and domain rules;
* `BookingRepository` — booking persistence;
* `BookingValidator` — incoming-data validation;
* `BookingMailer` — booking notifications;
* `BookingController` — request orchestration.

SRP is based on reasons to change, not an arbitrary line-count limit.

---

## 2. Open–Closed Principle — OCP

Software should support new behaviour through extension without repeatedly changing stable, tested branches.

Use:

* Strategy for interchangeable algorithms;
* Adapter for vendors or external systems;
* Decorator for optional additive behaviour;
* Pipeline for ordered processing stages;
* handlers for independently extensible operations.

Do not introduce extension machinery where one direct implementation is enough.

---

## 3. Liskov Substitution Principle — LSP

Every implementation of a contract must be safely usable wherever that contract is expected.

Rules:

* Do not implement required methods with “not supported.”
* Do not weaken promised behaviour.
* Do not return incompatible results.
* Do not require callers to check the concrete subtype.
* Preserve contract invariants and expected side effects.
* Split an invalid hierarchy into smaller contracts.

---

## 4. Interface Segregation Principle — ISP

Clients should depend only on methods they use.

Rules:

* Keep interfaces small and role-specific.
* Avoid broad interfaces containing unrelated capabilities.
* Split reading, writing, deleting, sending, exporting, or calculating when consumers differ.
* Combine small interfaces only when a client genuinely requires the complete contract.

Prefer:

```php
interface BookingReader
{
    public function findById(int $bookingId): ?Booking;
}

interface BookingWriter
{
    public function save(Booking $booking): void;
}
```

Avoid forcing a read-only consumer to depend on create, update, and delete methods.

---

## 5. Dependency Inversion Principle — DIP

High-level business policy must not depend directly on low-level infrastructure.

Rules:

* Inject dependencies through constructors by default.
* Depend on abstractions at volatile boundaries.
* Assemble concrete implementations in a bootstrap, provider, factory, container, or composition root.
* Do not instantiate vendor SDKs inside application or domain services.
* Do not hide dependencies in globals or static service locators.
* Make infrastructure replaceable during testing.

Prefer:

```php
final class SendInvoice
{
    public function __construct(
        private InvoiceRepository $invoices,
        private InvoiceSender $sender
    ) {
    }
}
```

Avoid:

```php
final class SendInvoice
{
    public function execute(): void
    {
        $repository = new MysqlInvoiceRepository();
        $sender = new VendorEmailClient();
    }
}
```

---

# III. Supporting Engineering Principles

## Cohesion

Keep behaviour together when it serves the same responsibility and changes for the same reason.

## Low Coupling

Modules should know as little as reasonably possible about one another’s internals.

Avoid chains such as:

```php
$booking->getCustomer()->getAccount()->getMailer()->send();
```

## Tell, Do Not Ask

Ask an object to perform a valid operation instead of extracting its state and recreating its rules elsewhere.

## Law of Demeter

A method should mainly collaborate with:

* itself;
* its own dependencies;
* its parameters;
* objects it deliberately creates.

## Thin Interfaces, Thick Implementations

Public contracts should remain small, stable, and meaningful.

Complexity belongs behind the boundary, not inside every caller.

## YAGNI

Do not build extension points without a credible need.

## KISS

Choose the simplest design that preserves correctness and maintainability.

## DRY

Remove duplicated knowledge, not merely repeated syntax.

Two pieces of code that look similar may still represent different responsibilities.

---

# IV. Design Pattern Standards

Patterns are tools, not trophies.

Before using a pattern, the agent must state:

1. the specific problem;
2. why a direct implementation is insufficient;
3. the pattern being selected;
4. the trade-off introduced;
5. how the implementation remains testable.

---

## Creational Patterns

### Factory

Use when object creation varies by:

* provider;
* configuration;
* environment;
* type;
* runtime selection.

Examples:

* payment providers;
* notification channels;
* export formats;
* repository implementations.

Do not create a factory when one constructor is already clear.

### Abstract Factory

Use when the system creates related families of compatible objects.

Example:

* provider API client;
* provider webhook verifier;
* provider response mapper.

### Builder

Use when constructing an object involves many optional or ordered configuration steps.

Do not use a builder for simple objects with two or three obvious arguments.

### Singleton

Use rarely.

Singleton may be accepted only when:

* one coordinated runtime instance is genuinely required;
* lifecycle is explicit;
* concurrency implications are understood;
* tests can replace or reset it;
* dependency injection would not be clearer.

Do not use Singleton as a substitute for proper dependency management.

A WordPress plugin bootstrap instance may be acceptable. Business services must not retrieve dependencies through hidden singleton access.

---

## Structural Patterns

### Adapter

Use when an external provider exposes an interface incompatible with the project.

An adapter should:

* translate external objects into project-owned types;
* contain vendor-specific behaviour;
* prevent vendor leakage into business logic;
* make replacement and testing easier.

Examples:

* Twilio;
* Stripe;
* Xero;
* external email providers;
* third-party WordPress APIs.

### Decorator

Use to add optional behaviour around an existing contract.

Examples:

* caching;
* logging;
* metrics;
* retries;
* authorisation;
* tracing.

### Facade

Use to provide a simple public entry point over a complex subsystem.

A facade must delegate work. It must not become a god object.

### Proxy

Use for:

* lazy loading;
* remote access;
* caching;
* access control;
* lifecycle management.

### Composite

Use for tree structures where individual items and groups share the same contract.

---

## Behavioural Patterns

### Strategy

Use when multiple algorithms solve the same problem.

Examples:

* hourly vs itemised pricing;
* lead scoring;
* matching;
* sorting;
* tax calculation;
* discount calculation.

### Pipeline

Use when data passes through ordered, independent stages.

Example:

```text
sanitise → validate → enrich → calculate → persist
```

Pipeline rules:

* each stage has one responsibility;
* stage contracts must be explicit;
* processing moves in one direction;
* failures must stop, skip, retry, or recover according to policy;
* duplicate processing must be guarded;
* stages must not silently mutate unrelated global state.

### Chain of Responsibility

Use when one of several handlers may handle a request or pass it onward.

Do not use it where every step must always execute; use Pipeline instead.

### Command

Use when an action needs to be:

* queued;
* logged;
* authorised;
* retried;
* scheduled;
* executed independently of the caller.

### Observer / Event Dispatcher

Use when multiple independent listeners should react to an event.

Rules:

* Events should describe facts that have happened.
* Do not hide essential sequential business logic inside unpredictable listeners.
* Document ordering where ordering matters.
* Avoid circular event dispatch and event storms.

### State

Use where behaviour changes according to a defined lifecycle state.

Examples:

* draft;
* approved;
* issued;
* paid;
* cancelled.

Use State when conditional transitions have become difficult to maintain.

### Specification

Use for reusable and composable business rules.

Examples:

```text
isActive AND isNewZealand
isCommercial OR isPriority
isEligible AND NOT isSuspended
```

Useful for:

* filtering;
* validation;
* eligibility;
* policy decisions;
* complex searches.

### Template Method

Use when an algorithm has a stable sequence but controlled steps vary.

Prefer composition when subclasses need broad access to protected internals.

---

## Integration and Resilience Patterns

### Envelope

Use when a payload requires supporting metadata without polluting the payload.

Example:

```json
{
  "envelope": {
    "id": "evt_123",
    "timestamp": "2026-07-15T20:00:00+12:00",
    "route": "lead.created",
    "version": 1
  },
  "payload": {
    "lead_id": 451
  }
}
```

### Circuit Breaker

Use around unreliable external dependencies to prevent cascading failure.

Define:

* failure threshold;
* open duration;
* half-open test;
* fallback behaviour;
* logging and metrics.

### Retry with Backoff

Use only for transient failures.

Rules:

* cap the number of attempts;
* use exponential backoff;
* add jitter where appropriate;
* do not retry permanent validation failures;
* require idempotency or duplicate protection;
* combine with Circuit Breaker for unstable services.

### DAG

Use for workflows with branching dependencies and no cycles.

Every node must define:

* prerequisites;
* inputs;
* outputs;
* retry policy;
* idempotency behaviour;
* failure propagation.

### CQRS

Use only when read and write operations have meaningfully different requirements.

Do not introduce CQRS to ordinary CRUD merely because it sounds architectural.

---

# V. Project-Specific Standards

## PHP

For new code:

* use `declare(strict_types=1);` where compatible;
* use typed properties;
* use parameter and return types;
* prefer constructor injection;
* use `final` for concrete classes not designed for inheritance;
* follow PSR-4 autoloading;
* follow the project namespace convention;
* avoid static mutable state;
* avoid service locators;
* use domain-specific exceptions where callers can recover;
* preserve previous exceptions when wrapping failures;
* use value objects when primitive values become ambiguous.

Value objects may be appropriate for:

* money;
* dates;
* identifiers;
* statuses;
* email addresses;
* telephone numbers;
* percentages;
* structured configuration.

Do not convert every primitive into an object without practical benefit.

---

## WordPress

WordPress hooks are entry points, not the application architecture.

Rules:

* Keep hook callbacks thin.
* Validate context and delegate to a service.
* Do not place entire features in the main plugin file.
* Do not place entire features in `functions.php`.
* Prefix procedural functions and global identifiers.
* Namespace project-owned OOP code.
* Escape output at the point of output.
* Sanitize and validate incoming data according to its expected type.
* Verify nonces and capabilities for privileged operations.
* Use `$wpdb->prepare()` correctly when placeholders are present.
* Keep database queries out of templates.
* Keep business logic out of controllers and hook callbacks.
* Wrap external services behind adapters.
* Separate admin UI, application logic, persistence, and integrations.
* Never edit WordPress core or third-party plugin files.
* Make activation, migrations, deactivation, and uninstall behaviour explicit.
* Avoid global-scope pollution.

Suggested scalable structure:

```text
plugin-name/
├── plugin-name.php
├── src/
│   ├── Application/
│   ├── Domain/
│   ├── Infrastructure/
│   ├── Admin/
│   ├── Frontend/
│   ├── Integrations/
│   └── Support/
├── templates/
├── assets/
├── tests/
└── uninstall.php
```

Do not force this complete structure onto a tiny plugin. Scale architecture according to actual complexity.

---

## TypeScript

* Enable strict mode unless the existing project explicitly cannot.
* Avoid `any`.
* Use `unknown` for untrusted values and narrow safely.
* Use interfaces for meaningful contracts.
* Use union types for finite states.
* Prefer pure functions for stateless transformations.
* Keep side effects at system boundaries.
* Validate API, storage, URL, and user data at runtime.
* Do not confuse compile-time typing with runtime validation.
* Keep external API clients behind adapters.
* Use dependency injection where replaceability and testing justify it.

---

## JavaScript

* Use modules.
* Do not pollute global scope.
* Prefer `const`, then `let`.
* Avoid `var`.
* Keep functions focused.
* Make side effects explicit.
* Use classes only where identity, lifecycle, state, or polymorphism justify them.
* Do not imitate class-heavy architecture for simple browser scripts.
* Remove event listeners and timers when components are destroyed.
* Avoid hidden shared state between modules.

---

## Python

* Use type hints on public functions and methods.
* Prefer dataclasses or value objects for structured values.
* Use protocols or abstract base classes at genuine replaceable boundaries.
* Separate I/O from transformations.
* Use context managers for managed resources.
* Do not create a class where a pure function is clearer.

---

# VI. Naming Standards

Names must reveal responsibility.

## Good Class Names

* `InvoiceRepository`
* `TwilioCallAdapter`
* `ItemisedPricingStrategy`
* `BookingController`
* `LeadImportPipeline`
* `CustomerEligibilitySpecification`

## Weak Class Names

* `Utils`
* `Helper`
* `Manager`
* `Common`
* `Misc`
* `DoStuff`
* `Processor`

A qualified name such as `PaymentProcessor` may be acceptable when its responsibility is clear.

## Method Names

Prefer verbs that reveal intent:

* `calculateTotal()`
* `findById()`
* `sendInvoice()`
* `markCompleted()`
* `registerHooks()`
* `verifyWebhook()`

Avoid vague names such as:

* `doIt()`
* `executeThing()`
* `processData()`
* `handleStuff()`

Generic names such as `handle()` or `execute()` are acceptable only where the class or interface provides the missing context.

## Interface Names

Name interfaces according to role or capability:

* `InvoiceSender`
* `LeadRepository`
* `PricingStrategy`
* `WebhookVerifier`
* `BookingReader`

Do not add an `Interface` suffix unless the project convention requires it.

---

# VII. Error and Failure Design

Before implementation, identify:

* input-validation failures;
* domain-rule violations;
* persistence failures;
* infrastructure failures;
* external provider failures;
* retryable failures;
* permanent failures;
* user-facing messages;
* internal logging context;
* fallback behaviour.

Rules:

* Fail loudly when an internal invariant is broken.
* Return useful validation errors for expected invalid input.
* Do not expose secrets, stack traces, SQL, or vendor internals to users.
* Preserve the original exception when wrapping it.
* Do not log passwords, tokens, credentials, or unnecessary personal data.
* Do not catch exceptions only to suppress them.
* Do not use exceptions for ordinary branching when a result object is clearer.
* Make retry operations idempotent or duplicate-safe.

---

# VIII. Testing Standards

Every significant class must have a test strategy.

Prioritise:

1. unit tests for domain and business rules;
2. application-service tests using fakes or mocks at boundaries;
3. integration tests for repositories and adapters;
4. end-to-end tests for critical user journeys.

Test:

* normal behaviour;
* boundary values;
* invalid input;
* dependency failures;
* retries;
* duplicate protection;
* permissions and authorisation;
* state transitions;
* alternate implementations;
* backwards compatibility.

A class that cannot be tested without booting the entire application probably contains hidden dependencies or excessive coupling.

Prefer fakes over interaction-heavy mocks when practical.

Do not mock simple value objects.

---

# IX. Anti-Patterns to Reject

Reject or refactor:

* god objects;
* hidden global state;
* service locators inside business code;
* deep inheritance hierarchies;
* speculative interfaces;
* speculative factories;
* static methods used to avoid dependency design;
* database queries in templates;
* business rules inside controllers;
* business rules inside WordPress hook callbacks;
* repositories that render UI or send email;
* repeated type switches that should be polymorphic;
* empty subclasses;
* boolean flag arguments that activate unrelated behaviours;
* constructors that perform network calls or heavy work;
* circular dependencies;
* silent exception swallowing;
* undocumented generic arrays passed through multiple layers;
* pattern stacking that makes the solution harder than the problem.

---

# X. Required Agent Workflow

## Step 1 — Inspect Before Designing

Before proposing architecture, inspect:

* the current folder structure;
* neighbouring classes;
* naming conventions;
* dependency management;
* existing tests;
* framework hooks and lifecycle;
* public APIs;
* backwards-compatibility requirements.

Do not design from an isolated snippet when repository context is available.

---

## Step 2 — Write a Planning Summary

Before substantial implementation, state:

* the responsibility;
* proposed files and locations;
* class and interface roles;
* dependency direction;
* selected pattern, if any;
* why the pattern is justified;
* hooks, routes, events, or entry points;
* compatibility concerns;
* tests to add or run.

For a small change, this can be brief.

---

## Step 3 — Compare Viable Options

For non-trivial architecture, provide two to four viable approaches.

Compare:

* implementation speed;
* complexity;
* scalability;
* testability;
* backwards compatibility;
* migration risk.

Recommend one approach.

Do not present every option as equally suitable.

---

## Step 4 — Implement the Smallest Complete Design

Implementation must:

* follow existing project conventions;
* preserve compatibility unless a change is explicitly approved;
* provide complete working code;
* include appropriate types and documentation;
* identify where each file belongs;
* identify what existing code changes or is replaced;
* avoid unrelated refactoring;
* avoid premature abstractions.

---

## Step 5 — Perform the OOP Self-Audit

Before finalising, verify the following.

### Responsibility

* Can each class responsibility be stated in one sentence?
* Does any class mix persistence, transport, policy, and presentation?
* Does any class have multiple unrelated reasons to change?

### Contracts

* Are public methods minimal and intention-revealing?
* Are interfaces small?
* Are implementations substitutable?
* Do contracts avoid leaking vendor or framework internals?

### Dependencies

* Does high-level code depend on abstractions where volatility exists?
* Are concrete dependencies assembled at the application boundary?
* Are any dependencies hidden in global or static access?

### Patterns

* Does every selected pattern solve a real problem?
* Would a direct class or function be clearer?
* Has Singleton been avoided unless genuinely necessary?
* Has pattern stacking been avoided?

### State and Failure

* Can invalid states be prevented?
* Are side effects visible?
* Are failure and recovery paths defined?
* Are retries duplicate-safe?
* Are state transitions valid and testable?

### Testing

* Can major logic be tested without the complete framework?
* Are failure paths covered?
* Are alternate implementations covered by shared contract tests where useful?

### Project Fit

* Does the design match existing conventions?
* Will it survive plugin updates?
* Is global-scope pollution avoided?
* Is the design scalable without becoming ceremonial?

---

## Step 6 — Report Architectural Conflicts

When legacy architecture conflicts with this skill:

1. do not silently rewrite the whole system;
2. explain the conflict in the Planning Summary;
3. choose the least damaging compatible implementation;
4. add a note to `AI-NOTES.md` when that file exists;
5. describe a realistic future refactor path.

Do not block a safe implementation merely because existing code is imperfect.

---

# XI. Required Output Contract

For architecture and coding tasks, the agent should provide:

## Decision

The recommended approach.

## Structure

Files, classes, interfaces, and responsibilities.

## Pattern Rationale

Only patterns actually used and why they fit.

## Implementation

Complete code or a precise patch.

## Placement

Where each file goes and what it changes or replaces.

## Verification

Tests, linting, static analysis, and manual checks.

## SOLID Audit

A brief review of:

* SRP;
* ISP;
* DIP;
* composition vs inheritance;
* dependency boundaries.

## Risks

Relevant compatibility, migration, performance, or operational concerns.

Do not claim SOLID compliance without inspecting the actual design.

---

# XII. Fast Pattern Decision Guide

Use a:

* **Function** for a focused stateless operation.
* **Class** for identity, lifecycle, state, invariants, or cohesive behaviour.
* **Interface** for genuine interchangeability or a volatile boundary.
* **Factory** when creation varies.
* **Adapter** when an external interface does not match the project.
* **Strategy** when an algorithm varies.
* **Pipeline** when ordered transformation stages all execute.
* **Chain of Responsibility** when handlers may pass responsibility onward.
* **Decorator** when optional behaviour wraps a contract.
* **Facade** when callers need a simpler subsystem entry point.
* **Observer** when independent listeners react to an event.
* **Command** when an action must be queued, logged, retried, or scheduled.
* **State** when behaviour changes by lifecycle state.
* **Specification** for composable business rules.
* **Envelope** for payload plus metadata.
* **Circuit Breaker** to prevent repeated remote failure.
* **Retry with Backoff** for transient, idempotent operations.
* **DAG** for branching workflow dependencies.
* **CQRS** when read and write models genuinely diverge.
* **Singleton** almost never and only with explicit lifecycle justification.

---

# XIII. Final Principle

> Good architecture creates useful boundaries without creating ceremony.

Optimise for:

1. correctness;
2. clarity;
3. maintainability;
4. testability;
5. project compatibility;
6. appropriate extensibility.

Do not optimise for the number of classes, interfaces, or patterns used.

