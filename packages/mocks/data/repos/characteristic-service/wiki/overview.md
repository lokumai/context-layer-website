# Characteristic Service

The Characteristic Service owns **atomic product attributes** — the smallest indivisible units of TMForum product information. Examples: "Speed: 100 Mbps", "Data Cap: 500 GB", "Color: Black". Each characteristic is a name, a value, and a unit of measure. They are the Lego bricks that `specification-service` assembles into specs.

The service enforces strict invariants: names are globally unique; units come from a closed enumeration (`MBPS`, `GBPS`, `GB`, `TB`, `GHZ`, `VOLT`, `WATT`, `METER`, `PERCENT`, `SECONDS`, `MINUTES`, `HOURS`, `DAYS`, `MONTHS`, `YEARS`, `UNIT`, `NONE`); a characteristic cannot be deleted if any specification references it.

Runs on port 8002; accessed through the gateway at `/api/v1/characteristics/*`.

## Architecture

### Clean Architecture Layers

**Domain** (`services/characteristic-service/src/domain/models.py`) — a pure `Characteristic` entity + `UnitOfMeasure` enum, no framework dependencies. Validates invariants via `__init__` and update methods.

**Application** (`services/characteristic-service/src/application/`) — `CharacteristicService` orchestrates use cases (`create_characteristic`, `update_characteristic`, etc.) by coordinating domain objects with the repository. Pydantic schemas (`CharacteristicCreate`, `CharacteristicUpdate`, `CharacteristicResponse`) live here.

**Infrastructure** (`services/characteristic-service/src/infrastructure/`) — SQLAlchemy ORM (`CharacteristicORM`), `CharacteristicRepository`, RabbitMQ wiring, outbox listener wiring. The FastAPI app (`src/main.py`) is also infrastructure — it depends on the inner layers, never the other way around.

### Persistence

PostgreSQL 15+, SQLAlchemy 2.0 async via `asyncpg`. Own database: `characteristic_db`. Two tables: `characteristics` (business) and `outbox` (events). Unique constraint on `characteristics.name`. Alembic migrations under `alembic/versions/` manage schema.

### Transactional Outbox

Every write (create/update/delete) writes both the business row and an outbox row inside one transaction. A PostgreSQL trigger fires `pg_notify('outbox_events', row_id)` on outbox INSERT. The `OutboxListener` from `libs/common-python/src/common/database/outbox.py` receives notifications, publishes to the `resource.characteristics.events` RabbitMQ topic, marks the row `SENT` on ack. At-least-once delivery is the guarantee; consumers handle idempotency.

### Events Published

All to topic exchange `resource.characteristics.events`:

- `CharacteristicCreated` — full payload (id, name, value, unit, timestamps).
- `CharacteristicUpdated` — post-change payload.
- `CharacteristicDeleted` — id + deletion timestamp.

Event envelope: `{event_id, event_type, aggregate_id, timestamp, correlation_id, payload}`.

Consumers:

- `specification-service` — maintains `cached_characteristics` for local validation.
- `store-query-service` — updates denormalized catalog documents.

## Endpoints

### `POST /api/v1/characteristics`  (ADMIN)

Request body:
```json
{"name": "Internet Speed", "value": "100", "unit_of_measure": "MBPS"}
```

Responses: 201 with the created entity; 409 on duplicate name; 400 on invalid unit.

### `GET /api/v1/characteristics`  (USER or ADMIN)

Pagination: `skip` (default 0), `limit` (default 50). Returns an array of characteristics.

### `GET /api/v1/characteristics/{id}`  (USER or ADMIN)

Returns single entity or 404.

### `PUT /api/v1/characteristics/{id}`  (ADMIN)

Updates value/unit. 200 with updated entity; 404 if missing; 409 on name conflict with another row.

### `DELETE /api/v1/characteristics/{id}`  (ADMIN)

204 on success; 404 if missing; 409 if any specification references this characteristic.

## Testing

Unit tests focus on the domain model and service orchestration; integration tests bring up Postgres via testcontainers and exercise the outbox.

Notable scenarios:

- **Create + outbox event written** — insert a characteristic, query `outbox` within the same test transaction, assert a `CharacteristicCreated` row with status `PENDING` exists.
- **Duplicate-name conflict** — second insert with same name returns 409.
- **Unit validation** — `unit_of_measure: "FOO"` is rejected at the schema layer with 400.
- **Cannot delete referenced characteristic** — create a characteristic, create a spec that references it (via specification-service in an e2e test), attempt delete, assert 409.
- **Update emits `CharacteristicUpdated`** — update mutates the row and appends an outbox row.
