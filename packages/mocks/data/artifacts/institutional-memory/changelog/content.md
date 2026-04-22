# Consolidated Changelog

All notable changes across the workspace since v1.0.0, mined from PR titles and commit trailers. Keep a Changelog format.

## [1.4.0] — 2026-04-18

### Added
- offering-service: pre-flight validation before Camunda saga start.
- offering-service: `OfferingRetired` event.
- pricing-service: `PriceLocked` and `PriceUnlocked` events.
- specification-service: `POST /specifications/validate` internal endpoint.
- characteristic-service: `entity_version` field on outbox payloads.
- store-query-service: trigger-then-fetch hydration pattern.
- store-query-service: `processed_events` idempotency ledger.
- api-gateway: per-downstream circuit state in `/health/dependencies`.
- frontend: `useSagaPolling` hook; Store filter URL sync.
- shared-chassis: `LockedException`.
- tests/e2e: Store-search plan.

### Changed
- frontend: upgraded Next.js 15 → 16, React 18 → 19.
- all services: correlation-ID handling consolidated into middleware.
- shared-chassis: unified public-key caching; removed duplicated code in identity-aware services.
- offering-service: BPMN simplified — compensations explicit rather than inferred.

### Fixed
- identity-service: public-key PEM newline escaping normalization.
- pricing-service: lock endpoint now returns 423 instead of 409 when already locked.
- specification-service: characteristic consumer lifecycle now tied to FastAPI lifespan.
- store-query-service: nested ES queries for characteristic filters (p95 −50%).

### Security
- All services: tokens include `role` claim for explicit RBAC.
- Flagged: RSA private key sourcing from env vars is still the production weak point.

## [1.3.0] — 2026-02-22

### Added
- offering-service: retire path.
- store-query-service: Elasticsearch full-text on offering name + description.
- frontend: Viewer edit modal.

### Changed
- characteristic-service: `value` moved from VARCHAR(64) to VARCHAR(200).
- offering-service: lifecycle enum extended with `RETIRED`.

### Fixed
- api-gateway: forward Content-Type on binary responses.
- specification-service: duplicate-key exception now surfaces correctly as 409.

## [1.2.0] — 2026-01-14

### Added
- offering-service: initial Camunda saga integration.
- pricing-service: lock/unlock endpoints.
- shared-chassis: `OutboxListener`.

### Changed
- all services: migrated to SQLAlchemy 2.0 async.

## [1.1.0] — 2025-11-28

### Added
- store-query-service: initial MongoDB + Elasticsearch integration.
- frontend: Store page skeleton.

### Changed
- api-gateway: circuit-breaker thresholds tuned.

## [1.0.0] — 2025-10-07

Initial release: 7 services + frontend + chassis. CQRS + event-driven + transactional outbox in place; sagas landing in 1.2.
