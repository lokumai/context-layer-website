# Microservices Product Catalog — README

A TMForum-compatible product catalog realized as **7 Python/FastAPI microservices + 1 Next.js frontend + 1 shared Python chassis library** — 9 logical components in a single working system.

## What It Does

- Admins create atomic **Characteristics**, bundle them into **Specifications**, attach **Prices**, and publish **Product Offerings**.
- Publication runs through a distributed saga coordinated by Camunda BPMN: lock prices → validate specs → create store entry → confirm.
- Customers browse the result through a public Store surface backed by a CQRS read model (MongoDB + Elasticsearch).

## Quick Start

```bash
make setup-keys   # generates the RSA keypair for identity-service
make infra-up     # spins up Postgres, MongoDB, Elasticsearch, RabbitMQ, Camunda, Zipkin, Kibana
make migrate      # runs Alembic migrations for all write-service databases
make dev          # launches all 7 services + the frontend
```

Frontend: [http://localhost:3000](http://localhost:3000). API Gateway: [http://localhost:8000](http://localhost:8000).

Demo creds: `admin / admin` (ADMIN), `user / user` (USER).

## Repository Layout

```
services/
  api-gateway/          # reverse proxy, circuit breakers, correlation IDs
  identity-service/     # login + RS256 JWT
  characteristic-service/
  specification-service/
  pricing-service/
  offering-service/     # saga orchestrator
  store-query-service/  # CQRS read model
web-ui/                 # Next.js 16 app
libs/
  common-python/        # shared chassis (logging/tracing/security/messaging/outbox/exceptions)
tests/
  e2e/                  # workspace-level tests
```

## Architecture in 6 Patterns

- **CQRS** — write side on PostgreSQL, read side on MongoDB + Elasticsearch.
- **Event-Driven** — four RabbitMQ topics carry all domain events.
- **Transactional Outbox** — business row + outbox row in one transaction; `OutboxListener` publishes reliably.
- **Saga Orchestration** — Camunda BPMN coordinates publication across 4 services.
- **Zero Trust** — RS256 JWTs validated per service against a cached public key from identity-service.
- **Glass-Box Observability** — Zipkin for traces, Kibana for logs, Camunda Cockpit for sagas — all stitched by `correlation_id`.

## Testing

```bash
make test         # unit + integration per service
make test-e2e     # workspace-level saga + zero-trust tests
```

Target: 80% coverage on domain code. Frontend relies on Playwright e2e; unit coverage is modest.

## Documentation

- **Wiki (this workspace)** — the living view, always synced.
- **DocsGen** — frozen artifacts (architecture diagrams, SRS, security reports) in the Library.
- **OmniBoard** — multimodal onboarding packs (disabled in the public demo).

## License

MIT. Demo fixtures and credentials are for local development only.
