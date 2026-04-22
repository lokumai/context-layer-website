# Pricing Service

The Pricing Service owns **monetary price definitions** — a billable cost associated with a product offering. A Price is a standalone aggregate, not a child of an offering, which lets the same price be reused and lets sagas lock prices atomically during publication.

Attributes: `id`, `name` (unique), `value` (DECIMAL(10,2), positive), `unit` (free text, e.g., "per month"), `currency` (enum: USD, EUR, TRY), `locked` (bool), `locked_by_saga_id` (UUID | null), `created_at`, `updated_at`.

## Architecture

### Domain Model

Clean-architecture layering mirrors the other write services. The `Price` aggregate in the domain layer owns invariants: non-duplicate name, positive two-decimal value, valid currency, locking semantics. The domain has zero framework dependencies and is pure Python, unit-tested in isolation.

`PricingService` in the application layer orchestrates create/update/delete/lock/unlock use cases, delegating to a repository and an outbox publisher. `PriceORM` in the infrastructure layer maps the domain onto a PostgreSQL table with the same columns plus `locked` and `locked_by_saga_id` — infrastructure concerns that the pure domain doesn't model.

### Currency Handling

Three codes — USD, EUR, TRY — enforced as a `CurrencyEnum` at both the Pydantic schema and the domain layer, with the database storing a VARCHAR. The frontend Pricing form offers exactly these three in its dropdown. Values store at DECIMAL(10, 2); the schema rejects values with more than two decimal places.

### Price Locking for Sagas

Two operations power saga participation:

- `lock_price(price_id, saga_id)` sets `locked=true` and stamps `locked_by_saga_id`. Raises `AppException("LOCKED")` if already locked by a different saga.
- `unlock_price(price_id)` clears both.

While locked, `update_price()` and `delete_price()` raise `AppException("LOCKED")` → HTTP 423. On saga completion (success or compensation), the lock is cleared. This keeps the offering's price configuration stable for the duration of the publication transaction.

### Outbox and Events

Five events, all to `commercial.pricing.events`: `PriceCreated`, `PriceUpdated`, `PriceDeleted`, `PriceLocked`, `PriceUnlocked`. Same pattern as peers — atomic write of business row + outbox row, listener flushes to RabbitMQ.

## Endpoints

### `POST /api/v1/prices`  (ADMIN)

Body:
```json
{"name": "Monthly Fiber Basic", "value": 49.99, "unit": "per month", "currency": "USD"}
```

201 with entity; 400 on invalid currency or decimal count; 409 on duplicate name.

### `GET /api/v1/prices/{id}`  (no auth — allows internal calls)

Returns entity or 404.

### `GET /api/v1/prices`  (no auth)

Pagination `skip`, `limit` (≤1000).

### `PUT /api/v1/prices/{id}`  (ADMIN)

Blocked on locked rows (423). Otherwise 200, 404, or 409.

### `DELETE /api/v1/prices/{id}`  (ADMIN)

204; 404 if missing; 423 if locked; 409 if referenced by a published offering.

### `POST /api/v1/prices/{id}/lock`  (ADMIN — called by saga worker)

Body: `{"saga_id": "..."}`. 200 with locked entity; 423 if already locked by another saga.

### `POST /api/v1/prices/{id}/unlock`  (ADMIN — called by saga worker or compensation)

200 with unlocked entity.

## Testing

Tests under `services/pricing-service/tests/{unit,integration,component}`.

Unit:

- **Value precision** — `49.999` is rejected at schema layer.
- **Currency enum** — `JPY` is rejected.
- **Lock contract** — locking an already-locked price from a different saga raises `LOCKED`.

Integration (testcontainers):

- **Outbox atomicity** — creating/updating/deleting emits the expected event.
- **Lock blocks writes** — with `locked=true`, `PUT` returns 423 and emits no event.

Component (httpx.AsyncClient on the FastAPI app):

- **CRUD happy paths** — full create/read/update/delete cycle with valid admin token.
- **Saga endpoints** — lock → unlock emits `PriceLocked` then `PriceUnlocked`.
- **Unauthorized writes** — missing or non-admin token → 401/403.
