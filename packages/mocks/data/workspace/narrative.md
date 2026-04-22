# Microservices Product Catalog — Workspace Narrative

This workspace is a TMForum-compatible **Product Catalog** realized as nine logical components: seven Python/FastAPI backend services, a Next.js 16 storefront, and a shared Python chassis library. Although all nine live inside a single monorepo for development convenience, this Context Layer workspace treats each as a first-class source with its own repo-level wiki, and aggregates them here into a workspace-level narrative — the kind of cross-repo view single-repo wiki tools cannot produce.

## 1. Business Domain

The system manages the lifecycle of telecommunications product offerings. In TMForum terms: atomic **Characteristics** (e.g., "Speed: 100 Mbps") compose into **Specifications** (e.g., "Fiber Optic Residential"), which combine with monetary **Prices** to form publishable **Product Offerings**. Once published, offerings surface in a public **Store** for customer browsing. The domain is intentionally small but the *mechanics* are enterprise-grade: every write crosses a trust boundary, every cross-service change flows through events, and every publication spans a distributed saga.

## 2. Logical Repository Split

The nine sources in this workspace are:

| Source | Role |
|---|---|
| `api-gateway` | Single front door; reverse proxy, JWT validation, circuit breakers, correlation IDs |
| `identity-service` | Login + RS256 JWT issuance + public-key distribution (the root of zero-trust) |
| `characteristic-service` | CRUD + events for atomic product attributes |
| `specification-service` | Composes characteristics into specs; maintains a local cache synced by events |
| `pricing-service` | Monetary definitions + saga-aware price locking |
| `offering-service` | The aggregate root; owns the DRAFT → PUBLISHING → PUBLISHED → RETIRED state machine and orchestrates the publication saga |
| `store-query-service` | CQRS read-model over MongoDB + Elasticsearch, rebuilt from events |
| `frontend` | Next.js 16 app with three surfaces: Builder, Viewer, Store |
| `shared-chassis` | Python library (`libs/common-python`) that every backend imports for logging, tracing, security, messaging, outbox, and exception handling |

Each has its own repo-level wiki. This document is the view across them.

## 3. High-Level Architecture

Five patterns define how the pieces fit together:

**CQRS.** Writes land in per-service PostgreSQL; reads come from MongoDB + Elasticsearch maintained by `store-query-service`. The four write services never talk to the read side directly.

**Event-Driven Communication.** Services publish domain events onto RabbitMQ topic exchanges — `resource.characteristics.events`, `resource.specifications.events`, `commercial.pricing.events`, `product.offerings.events`. Consumers subscribe and project.

**Transactional Outbox.** Every write service writes its business row and an outbox row inside the *same* PostgreSQL transaction. A trigger fires `pg_notify('outbox_events', id)`; a background listener picks the row up, publishes it to RabbitMQ, and marks it `SENT`. This eliminates the dual-write problem without adding a broker dependency to request-handling hot paths.

**Saga Orchestration.** Complex publication workflows are coordinated by Camunda BPMN. The `offering-service` starts the `offering-publication-saga` process; individual services run External Task Workers that poll Camunda for their steps (`lock-prices`, `validate-specifications`, `create-store-entry`, `confirm-publication`) and report success or failure. Compensations unwind on failure.

**Zero-Trust Security.** Every service boundary validates RS256 JWTs independently against the identity-service's public key — no service "trusts" the gateway. The gateway still enforces auth early, but services refuse unauthenticated calls even from inside the cluster.

## 4. Frontend → Services (via Gateway)

All frontend traffic enters through `api-gateway` on port 8000. The gateway:

- Generates or forwards an `X-Correlation-ID` for end-to-end tracing
- Validates nothing itself — JWT validation is a shared-chassis concern invoked by each downstream service
- Routes by path prefix: `/api/v1/auth/*` → identity, `/api/v1/characteristics/*` → characteristic, `/api/v1/specifications/*` → specification, `/api/v1/prices/*` → pricing, `/api/v1/offerings/*` → offering, `/api/v1/store/*` → store-query
- Wraps each proxy call in an `AsyncCircuitBreaker` (3 failures → open for 20s) with strict timeouts (2s connect, 4s read)
- Exposes `GET /health/dependencies` which polls every downstream and surfaces circuit state

The Next.js app uses a single `apiClient` that reads `NEXT_PUBLIC_API_URL`, attaches the JWT from localStorage to every request, and registers a 401 callback that logs the user out. The three surfaces:

- **Builder** (`/builder`) — admin-only tabs for creating characteristics, specifications, prices, and offerings. The Offering tab's "Publish" button triggers saga polling via `useSagaPolling`, which hits `GET /api/v1/offerings/{id}` every 2s to watch the lifecycle transition.
- **Viewer** (`/viewer`) — admin tables with search, sort, pagination, edit modals, delete confirmations, and the same publish-and-poll flow for offerings.
- **Store** (`/store`) — public, unauthenticated marketplace. URL-synchronized filters (keyword, price range, channels, characteristics) hit `GET /api/v1/store/search`, backed by Elasticsearch.

## 5. Inter-Service Communication over Events

Writes on the command side publish events; the read side and selected command-side subscribers project them.

| Topic | Published by | Consumed by |
|---|---|---|
| `resource.characteristics.events` | characteristic-service | specification-service (cache sync), store-query-service (projections) |
| `resource.specifications.events` | specification-service | store-query-service |
| `commercial.pricing.events` | pricing-service | store-query-service |
| `product.offerings.events` | offering-service | store-query-service |

A key detail: `specification-service` **subscribes** to characteristic events and maintains a local `cached_characteristics` table. This gives it sub-millisecond validation without synchronous HTTP calls to the characteristic-service, and lets it keep working if the characteristic-service is briefly unavailable — at the cost of an eventual-consistency window typically <1 second.

## 6. Shared Chassis Conventions

Every backend service imports `libs/common-python` as a workspace package. The chassis provides:

- **Logging** — structured JSON with `correlation_id`, `trace_id`, `span_id`; a FastAPI middleware injects and propagates these for every request.
- **Tracing** — OpenTelemetry initialization with B3 propagation, auto-instrumentation of FastAPI, SQLAlchemy, httpx, aio-pika.
- **Security** — JWT validation utilities plus `get_current_user()` and `admin_required()` FastAPI dependencies. The public key is fetched once at startup from `identity-service`'s `/public-key` endpoint and cached; no per-request remote validation.
- **Messaging** — thin wrappers around `aio-pika` for topic publishers and subscribers with typed event payloads.
- **Outbox** — the `OutboxListener` class that ties PostgreSQL `LISTEN/NOTIFY` to a RabbitMQ publisher; every write service initializes it in its FastAPI lifespan.
- **Exceptions** — a normalized `AppException` hierarchy and a FastAPI exception handler that converts domain errors into the standard `ErrorResponse` JSON shape (`{code, message, correlation_id}`).

The chassis is the reason services stay thin. A new service spins up by importing `common`, wiring a repository, and writing domain logic.

## 7. Developer & Operations Story

The developer experience is a two-liner: `make infra-up && make dev` brings up PostgreSQL, MongoDB, Elasticsearch, RabbitMQ, Camunda, Zipkin, Kibana, and all 7 services in Docker Compose. `make setup-keys` mints the RSA key pair; `make migrate` runs Alembic migrations for all databases.

Observability is "glass box":

- **Zipkin** — waterfall traces per correlation ID across every hop.
- **Kibana** — centralized JSON logs searchable by `correlation_id` across services.
- **Camunda Cockpit** — live saga state, including which external task is currently owned by which worker.

The architecture is Kubernetes-ready (each service ships a Dockerfile; no host-coupled state) but day-to-day dev runs on Compose.

## 8. Testing Posture

Each service carries a test pyramid: unit (domain logic, no I/O), integration (`testcontainers` spinning up Postgres/RabbitMQ), component (`httpx.AsyncClient` hitting a live FastAPI app), and a smaller e2e slice at the workspace root under `tests/e2e/` validating saga flows and zero-trust contracts. Overall target is 80% coverage on domain code; the write services are closer to 90%, `api-gateway` and `frontend` sit lower on unit coverage but compensate with e2e.

The e2e tests are minimal on purpose — they are brittle in a microservices environment, and the bulk of correctness work sits in the integration layer per service.

## 9. What Makes This Hard for Single-Repo Wiki Tools

A single-repo wiki can document any one of these nine components faithfully. What it *can't* do is answer questions like:

- "When a customer sees a new fiber offering in the Store, which four databases and three queues were touched?"
- "If the Pricing Service goes down mid-publication, which compensations fire and in what order, and what gets left behind in the outbox?"
- "Which services consume `characteristic.updated` events, and how do they handle a characteristic that was renamed between the event being emitted and consumed?"

Answering these requires holding all nine components in view simultaneously and tracing causal chains across them. That is the workspace-level view Context Layer's wiki produces, and it is the selling moment of this demo: the saga-flows page linked under this narrative walks a concrete publication end-to-end across four services, three databases, a broker, and a BPMN engine — and that walk is *generated* from the underlying repo-level wikis, not hand-written.
