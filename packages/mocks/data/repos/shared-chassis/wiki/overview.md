# Shared Chassis Library

`libs/common-python/` is a Python library imported as a workspace package by every backend service. It's the chassis — the cross-cutting plumbing that keeps the seven services consistent and thin. A new service can spin up by importing `common`, wiring a repository, and writing domain logic. Without the chassis, each service would need to re-solve logging shape, tracing propagation, JWT validation, outbox reliability, and error formatting.

The library exposes a stable set of modules under `common.*`:

- `common.logging` — structured JSON with correlation/trace/span IDs
- `common.tracing` — OpenTelemetry setup + FastAPI auto-instrumentation
- `common.security` — JWT verification + `get_current_user`, `admin_required` FastAPI deps + `RoleChecker`
- `common.messaging` — aio-pika publisher/consumer wrappers
- `common.database.outbox` — the `OutboxListener` that ties PG `LISTEN/NOTIFY` to RabbitMQ
- `common.exceptions` — `AppException` hierarchy + FastAPI exception handler

Every backend service's `main.py` calls `setup_logging()`, `setup_tracing()`, `instrument_fastapi(app)`, registers the exception handler, and in the FastAPI lifespan boots an `OutboxListener`.

## Architecture

### `common.logging`

Initializes `structlog` with a JSON renderer. A FastAPI middleware reads `X-Correlation-ID` (or generates a UUID) and binds it to the logger context for the duration of the request. Every log line carries `correlation_id`, `trace_id`, `span_id`, `service_name`, `level`, and `message`. The fields are stable across services so Kibana searches like `correlation_id: "..."` stitch a request across hops without glue code.

### `common.tracing`

Uses `opentelemetry-sdk` with B3 propagation (the header convention Zipkin uses). `setup_tracing()` configures the SDK at import time; `instrument_fastapi(app)`, `instrument_sqlalchemy(engine)`, `instrument_httpx(client)`, and `instrument_aio_pika()` auto-wire spans for each transport. Spans are exported to Zipkin via the OTLP exporter. The B3 headers naturally traverse the gateway and downstream services, producing a waterfall chart per correlation ID in Zipkin Cockpit.

### `common.security`

Exposes three concerns:

- **JWT verification** — on service startup, the chassis fetches `identity-service /auth/public-key` once and caches the RSA public key. `verify_jwt(token)` validates signature, expiry, and required claims; errors raise `AppException("UNAUTHORIZED")`.
- **FastAPI dependencies** — `get_current_user()` returns a typed user, `admin_required(user)` raises `AppException("FORBIDDEN")` if the user's role is not ADMIN.
- **`RoleChecker`** — parametrizable dependency for routes that accept a configurable set of roles.

Because validation happens per-service with a cached key, identity-service is a cold-path dependency: its uptime matters at deploy-time, not request-time.

### `common.messaging`

Thin wrappers around `aio-pika`:

- `TopicPublisher(topic_exchange)` — exposes `publish(event_type, payload)` and handles exchange declaration, connection reuse, and typed payload serialization (`orjson`).
- `TopicConsumer(topic_exchange, queue_name, handler)` — consumer pattern that manages durable queue declaration, prefetch, acknowledgement, and retry/dead-letter on handler exceptions.

Services compose these into their own consumers (e.g., `specification-service`'s characteristic event consumer).

### `common.database.outbox`

The `OutboxListener` background task:

1. Opens a `LISTEN outbox_events` channel on the service's Postgres connection.
2. On each notification, reads pending rows with `SELECT ... FOR UPDATE SKIP LOCKED`.
3. Publishes each row to its topic via `TopicPublisher`.
4. On ack, updates `status = 'SENT'`. On publish failure, increments `retry_count` and leaves the row PENDING for the next pass.

A second mode — periodic polling — handles the edge case where a notification is missed (e.g., process restart during a commit). Together they give at-least-once delivery.

### `common.exceptions`

A hierarchy rooted at `AppException` with structured fields: `code`, `message`, `http_status`. A FastAPI exception handler renders these as the standard `ErrorResponse` JSON:

```json
{ "code": "LOCKED", "message": "Price is locked by an active saga", "correlation_id": "..." }
```

Subtypes (`NotFoundException`, `ConflictException`, `LockedException`, `ValidationException`, `UnauthorizedException`, `ForbiddenException`) map to 404/409/423/400/401/403.

## Exports (Library Contract)

Services consume the chassis via a small, explicit set of imports:

```python
from common.logging import setup_logging
from common.tracing import setup_tracing, instrument_fastapi
from common.security import get_current_user, admin_required, RoleChecker
from common.messaging import TopicPublisher, TopicConsumer
from common.database.outbox import OutboxListener
from common.exceptions import AppException, NotFoundException, ConflictException, LockedException
```

That set is the stable contract — internal modules under `common._internal.*` may change, but the symbols above are considered API surface.

## Testing

The chassis carries its own unit tests plus **contract tests** that each service runs to ensure it integrates with the expected shape:

- **Logging contract** — every service asserts that a sample request produces a JSON log containing `correlation_id`, `trace_id`, `span_id`, `service_name`, `message`.
- **Tracing contract** — integration test confirms that a request through the gateway appears in the Zipkin dev backend with the expected hop count.
- **Security contract** — `tests/e2e/test_service_security.py` hits each service directly without a token (expect 401) and with a valid token (expect 200).
- **Outbox contract** — each write service's integration test asserts that a business write produces exactly one outbox row, and that the listener transitions it PENDING → SENT within a bounded time.
- **Exception contract** — each service asserts that domain exceptions round-trip through the handler into the canonical `ErrorResponse` shape.

Because the contracts are enforced from the *consumer* side, changes to chassis internals that would break services fail CI before merge.
