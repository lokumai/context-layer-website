# Offering Service

The Offering Service is the aggregate root of the catalog. It owns the `ProductOffering` — an artifact that bundles specifications, prices, sales channels, and a lifecycle state machine, and it is the **saga orchestrator** for the publication workflow that spans four services.

Attributes: `id`, `name`, `description`, `specification_ids` (List[UUID]), `pricing_ids` (List[UUID]), `sales_channels` (List[str]), `lifecycle_status` (Enum).

## Architecture

### Lifecycle State Machine

Four states, strict transitions:

```
DRAFT ──► PUBLISHING ──► PUBLISHED ──► RETIRED
  ▲           │
  └───────────┘ (on saga failure)
```

- `DRAFT` — freely editable; partial entities allowed.
- `PUBLISHING` — saga in flight; mutations blocked.
- `PUBLISHED` — immutable for audit.
- `RETIRED` — soft-delete terminal state.

Domain methods enforce the machine: `canPublish()` validates completeness (≥1 spec, ≥1 price, ≥1 channel); `publish()` DRAFT→PUBLISHING; `confirmPublication()` PUBLISHING→PUBLISHED; `failPublication()` PUBLISHING→DRAFT; `retire()` PUBLISHED→RETIRED. Invalid transitions raise exceptions.

### Events

Six, all on `product.offerings.events`:

- `OfferingCreated`, `OfferingUpdated`
- `OfferingPublicationInitiated`, `OfferingPublished`, `OfferingPublicationFailed`
- `OfferingRetired`

Only `store-query-service` consumes these today (for the customer-facing read model).

### Saga Orchestration Entry Point

`POST /api/v1/offerings/{id}/publish` → `OfferingService.initiate_publication()`:

1. **Pre-flight validation** — offering in DRAFT; has specs/prices/channels.
2. **Cross-service validation** — parallel `httpx` calls to `specification-service` and `pricing-service` asserting every referenced ID exists. Fails fast with 400 before any saga state is created.
3. **Camunda process start** — POST to `/engine-rest/process-definition/key/offering-publication-saga/start` with variables `{offeringId, specificationIds, pricingIds, correlationId}`.
4. **Atomic state transition** — DRAFT → PUBLISHING + `OfferingPublicationInitiated` outbox row in one PG transaction.

### Camunda BPMN Integration

The BPMN file `offering-publication-saga.bpmn` defines four external service tasks in sequence:

1. `lock-prices` — pricing-service worker.
2. `validate-specifications` — specification-service worker.
3. `create-store-entry` — store-query-service worker.
4. `confirm-publication` — offering-service's own worker.

Each service's worker polls Camunda (`fetchAndLock`), executes, and `complete`s. On failure, Camunda routes to compensating tasks: `unlock-prices`, `delete-store-entry`, `revert-to-draft`. Failure also emits `OfferingPublicationFailed` from offering-service through the same outbox channel.

### Infrastructure

SQLAlchemy ORM; `SessionLocal`, `get_db`. `OutboxORM` for the outbox table. Alembic migrations in `alembic/versions/`. Config in `offering/config.py` (Pydantic Settings) reads `DATABASE_URL`, `RABBITMQ_URL`, `CAMUNDA_URL`, etc. Chassis provides logging, tracing, security, messaging, outbox.

## Endpoints

### CRUD

- **`POST /api/v1/offerings`** (ADMIN) — 201 with DRAFT offering; emits `OfferingCreated`.
- **`GET /api/v1/offerings/{id}`** — single; no auth (allows internal calls).
- **`GET /api/v1/offerings`** — list; `skip`, `limit` ≤ 1000.
- **`PUT /api/v1/offerings/{id}`** (ADMIN) — only DRAFT can be updated; otherwise 400. Emits `OfferingUpdated`.
- **`DELETE /api/v1/offerings/{id}`** (ADMIN) — only DRAFT; 204 / 400.

### Publication / Lifecycle

- **`POST /api/v1/offerings/{id}/publish`** (ADMIN) — starts the saga; 200 with the offering in PUBLISHING; 400 on pre-flight failure.
- **`POST /api/v1/offerings/{id}/retire`** (ADMIN) — PUBLISHED → RETIRED; 200; emits `OfferingRetired`.

### Saga Workers (internal)

Called by the service's own `confirm-publication` worker that polls Camunda:

- **`POST /api/v1/offerings/{id}/confirm`** — PUBLISHING → PUBLISHED; emits `OfferingPublished`.
- **`POST /api/v1/offerings/{id}/fail`** — compensation: PUBLISHING → DRAFT; emits `OfferingPublicationFailed`.

### Health

`GET /health` → `{"status": "healthy", "service": "offering-service"}`.

## Testing

Three layers in `tests/{unit,integration,component}`.

Unit (domain):

- **State machine guards** — illegal transitions (e.g., PUBLISHED → DRAFT) raise.
- **`canPublish` enforcement** — missing specs/prices/channels rejects `publish()`.
- **Each transition** — DRAFT→PUBLISHING, PUBLISHING→PUBLISHED, PUBLISHING→DRAFT, PUBLISHED→RETIRED.

Integration (testcontainers):

- **Atomic create + outbox** — offering + `OfferingCreated` in one transaction.
- **Publish atomicity** — state is PUBLISHING *iff* `OfferingPublicationInitiated` is in outbox; rollback leaves neither.
- **Listener publishes** — outbox row with status PENDING transitions to SENT after listener run; RabbitMQ receives the payload.

Component (httpx.AsyncClient with mocked Camunda):

- **Saga happy path** — publish endpoint returns 200 PUBLISHING; after Camunda "completes" each step, offering reaches PUBLISHED.
- **Compensation** — mocked failure on `create-store-entry`; offering reverts to DRAFT; `OfferingPublicationFailed` emitted.
- **Pre-flight 400** — offering in PUBLISHED state, publish returns 400 without calling Camunda.
