# Specification Service

A **Specification** is a named collection of characteristics that defines a class of product — e.g., "Fiber Optic Residential" referencing characteristics for speed, data cap, latency. Specifications don't embed characteristic data; they hold UUID references. This enables reuse and loose coupling, but forces the service to keep a local cache of valid characteristic IDs so it can validate without hitting `characteristic-service` on every write.

Attributes: `id` (UUID), `name` (unique, 1–200 chars), `characteristic_ids` (List[UUID], min 1), `created_at`, `updated_at`. Invariant: at least one characteristic.

## Architecture

### Event Subscription: Characteristic Events

At startup, the service launches a background consumer against RabbitMQ topic `resource.characteristics.events`. It handles three event types:

- `CharacteristicCreated` → INSERT into `cached_characteristics`
- `CharacteristicUpdated` → UPDATE cached row
- `CharacteristicDeleted` → DELETE cached row

The consumer is implemented in `services/specification-service/src/infrastructure/characteristic_consumer.py`. It pulls messages inside a database transaction so cache updates are atomic.

### Local Cache of Characteristics

Table `cached_characteristics` — columns: `id`, `name`, `created_at`, `updated_at`. Validation on write uses this cache: sub-millisecond, zero HTTP calls, and the service keeps working if `characteristic-service` is temporarily unreachable. Trade-off: ≤1s eventual-consistency lag; duplicated data; staleness during partitions.

### Outbox Event Emissions

Same pattern as `characteristic-service`. Events on `resource.specifications.events`:

- `SpecificationCreated`
- `SpecificationUpdated`
- `SpecificationDeleted`

Outbox table + `OutboxListener` background task from the chassis.

## Endpoints

### `POST /api/v1/specifications`  (ADMIN)

Body:
```json
{"name": "Fiber Optic Spec", "characteristic_ids": ["uuid1", "uuid2"]}
```

Validation: name unique + 1–200 chars; `characteristic_ids` non-empty array; every ID exists in `cached_characteristics`.

Responses: 201; 400 (empty ids, missing characteristics); 409 (duplicate name).

### `GET /api/v1/specifications`  (no auth)

List; supports pagination. Unauthenticated to allow internal service-to-service queries.

### `GET /api/v1/specifications/{id}`  (no auth)

Single spec or 404.

### `PUT /api/v1/specifications/{id}`  (ADMIN)

Same body as POST; same validation. 200, 400, 404, or 409.

### `DELETE /api/v1/specifications/{id}`  (ADMIN)

204 on success; 404 if missing; 409 if any offering references this spec.

### `POST /api/v1/specifications/validate`  (ADMIN)

Body: `["uuid1", "uuid2"]` — array of spec IDs. Returns 204 if all exist; 400 with the missing IDs otherwise. Used by the offering-service during saga pre-flight and by the `validate-specifications` external-task worker.

## Testing

Tests in `services/specification-service/tests/{unit,integration}`. Vitest on the frontend covers the corresponding form component.

Unit:

- **Empty characteristic_ids → VALIDATION_ERROR** — creating a spec with `characteristic_ids: []` raises at the service layer.
- **Missing characteristic_id → VALIDATION_ERROR** — IDs not in cache surface as 400 with the missing list.
- **Happy path** — all cached, unique name → 201 with persisted entity.

Integration (testcontainers: Postgres + RabbitMQ):

- **Consumer syncs three event types** — publish Created/Updated/Deleted; assert cache row state.
- **Create writes to outbox** — insert a spec; assert a `SpecificationCreated` outbox row with status `PENDING`.

Contract / e2e:

- **OpenAPI conformance** — admin creates a spec; retry loop for eventual cache consistency; GET returns a shape matching the schema.
