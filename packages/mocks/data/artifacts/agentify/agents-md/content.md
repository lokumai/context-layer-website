# AGENTS.md

Workspace-level guidance for AI agents navigating the Microservices Product Catalog. Keep this at the workspace root.

## What This Project Is

A TMForum-compatible product catalog realized as 9 logical components:

- 7 Python/FastAPI backend services
- 1 Next.js 16 frontend (`web-ui/`)
- 1 shared Python chassis library (`libs/common-python/`)

## How To Navigate

**Before you touch code, read the right wiki.**

- Workspace-level story and cross-repo sagas: `docs/wiki/workspace/`
- Per-service wikis: `docs/wiki/repos/<service-id>/`
- The workspace's `llms.txt`: `docs/wiki/llms-txt/index.md`

Each service carries its own `AGENTS.md` inside its folder with service-local conventions.

## How To Run Things

- `make setup-keys` — generates RSA keys for identity-service on first run.
- `make infra-up` — brings up Postgres, MongoDB, Elasticsearch, RabbitMQ, Camunda, Zipkin, Kibana in Docker Compose.
- `make migrate` — runs Alembic migrations for every write service.
- `make dev` — starts all services + the frontend.
- `make test` — unit + integration per service.
- `make test-e2e` — workspace-level tests under `tests/e2e/`.
- `make down` — tears everything down.

## Where Tests Live

- Unit + integration: `services/<service>/tests/{unit,integration,component}/`
- Workspace e2e: `tests/e2e/` — saga happy-paths, zero-trust, Store search.
- Frontend: `web-ui/tests/` (Vitest) + `web-ui/e2e/` (Playwright).

## Patterns You Must Respect

- **Clean architecture layers** in every write service: Domain → Application → Infrastructure. The Domain layer never imports from framework code.
- **Transactional outbox**: every domain event is written in the same transaction as the business row. Never publish directly to RabbitMQ from a service handler.
- **Zero trust**: never trust `api-gateway` to have validated a JWT. Every service validates independently.
- **Error envelope**: surface `AppException` subtypes; the chassis handler renders the uniform `{code, message, correlation_id}` response.

## Shared Chassis

Every backend service depends on `libs/common-python`. If you change chassis internals, run the contract tests in **every** consumer — the failure mode is cross-service.

## Decision Log

Architectural decisions live in `docs/adr/` as numbered ADR files. Propose new ones via PR, not by writing code first.

## Gotchas

- **Camunda must be up** before any offering-service test that exercises the saga path. `make infra-up` starts it; `make infra-down` stops it.
- **Outbox listener needs `LISTEN/NOTIFY`** — if you run against a hosted Postgres without notifications, the listener falls back to polling but with a 5s lag.
- **Store-query consumer uses HTTP hydration** — fetching from source services, not from event payloads. If you add a new field to an event payload, also add it to the source-service response.
- **Frontend stores JWT in localStorage** — acceptable for demo; not production-hardened.
