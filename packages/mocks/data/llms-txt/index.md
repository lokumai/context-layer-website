# Microservices Product Catalog

> A TMForum-compatible distributed product catalog realized as 9 logical components (7 Python/FastAPI services, 1 Next.js frontend, 1 Python chassis library). Demonstrates CQRS, event-driven architecture, transactional outbox, Camunda saga orchestration, and zero-trust security across service boundaries.

## Workspace

- [Workspace Narrative](../workspace/narrative.md): Cross-repo story — business domain, architecture, dev/ops, testing, and what single-repo tools miss.
- [Cross-Repo Saga Flows](../workspace/saga-flows.md): The three sagas that span multiple services end-to-end, with mermaid timelines.

## Repositories

- [api-gateway](../repos/api-gateway/llms.txt): Single entry point; reverse proxy, circuit breakers, correlation IDs, CORS.
- [identity-service](../repos/identity-service/llms.txt): Bcrypt login, RS256 JWT issuance, public-key distribution.
- [characteristic-service](../repos/characteristic-service/llms.txt): CRUD + outbox events for atomic TMForum product attributes.
- [specification-service](../repos/specification-service/llms.txt): Composes characteristics into specs; cache synced via subscribed events.
- [pricing-service](../repos/pricing-service/llms.txt): Monetary definitions; saga-aware price locking.
- [offering-service](../repos/offering-service/llms.txt): Aggregate root; DRAFT → PUBLISHING → PUBLISHED state machine; Camunda saga orchestrator.
- [store-query-service](../repos/store-query-service/llms.txt): CQRS read-model — consumers project events into MongoDB + Elasticsearch.
- [frontend](../repos/frontend/llms.txt): Next.js 16 app with Builder, Viewer, Store surfaces.
- [shared-chassis](../repos/shared-chassis/llms.txt): Cross-cutting chassis library — logging, tracing, security, messaging, outbox, exceptions.

## Key Topics

- **CQRS** — split of write-side (per-service PostgreSQL) and read-side (MongoDB + Elasticsearch via store-query-service).
- **Event-Driven Architecture** — four RabbitMQ topic exchanges: `resource.characteristics.events`, `resource.specifications.events`, `commercial.pricing.events`, `product.offerings.events`.
- **Transactional Outbox** — every write service writes business rows and outbox rows in one PostgreSQL transaction; a background `OutboxListener` publishes to RabbitMQ via PG `LISTEN/NOTIFY`.
- **Saga Orchestration** — offering publication is coordinated by Camunda BPMN with 4 external service tasks plus compensations.
- **Zero-Trust Security** — RS256 JWTs validated per-service against a cached public key from identity-service.
