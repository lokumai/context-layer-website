# Unified API Catalog

A portal-style inventory across the seven services. Each entry cross-references the service's OpenAPI root, port, auth requirements, and rate-limit guidance. Use this to populate an API gateway portal or an internal developer hub.

## identity-service (port 8001)

- **OpenAPI**: `services/identity-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/auth`
- **Auth profile**: public (login + public-key are unauthenticated)
- **Recommended rate limit**: 5 req/s per source IP on `/login`; unthrottled on `/public-key`.

Endpoints: `POST /auth/login`, `GET /auth/public-key`, `GET /health`.

## api-gateway (port 8000)

- **OpenAPI**: auto-derived from proxy routes
- **Base path**: `/api/v1/*`
- **Auth profile**: N/A — forwarding only
- **Recommended rate limit**: 100 req/s/user (no per-service limit today).

Endpoints: `GET /health`, `GET /health/dependencies`, plus every proxy prefix.

## characteristic-service (port 8002)

- **OpenAPI**: `services/characteristic-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/characteristics`
- **Auth profile**: ADMIN writes, USER reads
- **Rate limit**: 20 req/s/user on writes.

Endpoints: 5 CRUD routes + `GET /health`.

## specification-service (port 8003)

- **OpenAPI**: `services/specification-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/specifications`
- **Auth profile**: ADMIN writes; reads + validate are unauthenticated to support internal calls (service-to-service).
- **Rate limit**: 20 req/s/user on writes; no limit on `/validate` (internal).

Endpoints: 5 CRUD + `POST /specifications/validate` + `GET /health`.

## pricing-service (port 8004)

- **OpenAPI**: `services/pricing-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/prices`
- **Auth profile**: ADMIN writes + saga worker endpoints (also ADMIN)
- **Rate limit**: 20 req/s/user on writes.

Endpoints: 5 CRUD + 2 saga (lock/unlock) + `GET /health`.

## offering-service (port 8005)

- **OpenAPI**: `services/offering-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/offerings`
- **Auth profile**: ADMIN writes; publish/retire/confirm/fail are ADMIN (some used internally by saga workers).
- **Rate limit**: 5 req/s/user on `/publish`.

Endpoints: 5 CRUD + 4 lifecycle (publish, retire, confirm, fail) + `GET /health`.

## store-query-service (port 8006)

- **OpenAPI**: `services/store-query-service/openapi.yaml`
- **Base path via gateway**: `/api/v1/store`
- **Auth profile**: unauthenticated (customer-facing)
- **Rate limit**: 50 req/s per source IP on `/search`.

Endpoints: `GET /store/offerings`, `GET /store/offerings/{id}`, `GET /store/search`, `GET /health`.

## Cross-Cutting

- **Error envelope**: uniform across all services (`{code, message, correlation_id}`).
- **Authentication**: JWT Bearer, RS256, validated per-service via `shared-chassis.common.security`.
- **Correlation**: every request either receives or generates `X-Correlation-ID`; gateway and all services echo it.
- **OpenAPI collation**: a workspace script under `tools/openapi-collate/` merges the seven spec files into a single portal-facing document.
