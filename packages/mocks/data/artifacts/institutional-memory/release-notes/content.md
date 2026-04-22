# Multi-Repo Release Notes — Q2 2026

Aggregated view across all 9 repos for the quarter. Organized by impact rather than chronology.

## Highlights

- **Saga robustness** — `offering-service` gained explicit compensation tests and a pre-flight validation step that reduces saga-failure noise by ~40%.
- **Zero-trust hardening** — `shared-chassis` public-key caching now uniform across all services; a single source of truth for JWT validation.
- **Store search** — nested Elasticsearch queries for characteristic filters shipped; `/store/search` p95 went from 620 ms to 310 ms.
- **Storefront polish** — filter URL sync, bookmarkable search, detail-modal focus trap.

## By Service

### api-gateway
- Correlation-ID generation moved into middleware (was an ad-hoc decorator).
- `/health/dependencies` now reports per-downstream circuit state.
- Timeout defaults unified: 2s connect, 4s read, everywhere.

### identity-service
- Public-key PEM newline escaping normalized on startup (closes a recurring bug class).
- Tokens now carry `role` as a first-class claim (was nested under `user`).
- Added component tests for expired-token rejection.

### characteristic-service
- Added `POST /characteristics/bulk` (admin-only) — internal tool for importing seed data.
- Outbox payloads now include `entity_version` for consumer ordering decisions.

### specification-service
- Characteristic event consumer now runs inside the FastAPI lifespan (was a detached task with no shutdown handler).
- Added `POST /specifications/validate` for saga pre-flight.

### pricing-service
- `PriceLocked` / `PriceUnlocked` events added to the outbox stream.
- Lock endpoint now rejects with 423 + a "held by another saga" message instead of silently returning 409.

### offering-service
- Pre-flight validation added before Camunda start.
- BPMN simplified: compensations now explicit, no longer inferred from error codes.
- `OfferingRetired` event added.

### store-query-service
- Switched to trigger-then-fetch hydration (no longer trusts event payloads).
- Added `processed_events` idempotency collection.
- Nested ES queries for characteristics.

### frontend
- Next.js 16 upgrade (was 15.x).
- New `useSagaPolling` hook consolidates post-publish polling.
- Store filter URL sync + rehydration on load.
- Added e2e suite scaffolding (Playwright).

### shared-chassis
- Public-key cache unified; all services now use the same lookup.
- `AppException` hierarchy expanded with `LockedException`.
- Outbox listener reconnect logic improved for broker flaps.

## Migration Notes

No breaking changes for external consumers. Internal: the new `entity_version` field on outbox payloads is additive. Consumers that inspect it will do so; consumers that don't are unaffected.

## Thanks

Big shout-out to @platform-team for the saga-compensation work and @frontend-team for shipping the Next.js 16 upgrade without regressions.

Release tag: `v1.4.0`.
