# API Reference — Workspace Roll-Up

Every public HTTP endpoint in the workspace, grouped by service and sorted by path.

## Auth (via `api-gateway` at `/api/v1/auth/*`, hosted by `identity-service`)

### `POST /auth/login`
Form-encoded `username`, `password`. Returns `{access_token, token_type}`.

### `GET /auth/public-key`
Unauthenticated. Returns the RSA public key in PEM form with `algorithm: RS256`.

## Characteristics (`/api/v1/characteristics`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/characteristics` | ADMIN | 201 with entity; 409 on duplicate |
| GET | `/characteristics` | USER | pagination |
| GET | `/characteristics/{id}` | USER | 200 / 404 |
| PUT | `/characteristics/{id}` | ADMIN | 200 / 409 |
| DELETE | `/characteristics/{id}` | ADMIN | 204 / 409 if referenced |

## Specifications (`/api/v1/specifications`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/specifications` | ADMIN | 201 / 400 / 409 |
| GET | `/specifications` | — | pagination |
| GET | `/specifications/{id}` | — | 200 / 404 |
| PUT | `/specifications/{id}` | ADMIN | 200 / 400 / 404 / 409 |
| DELETE | `/specifications/{id}` | ADMIN | 204 / 409 if referenced |
| POST | `/specifications/validate` | ADMIN | 204 / 400 — body: `[uuid, uuid, ...]` |

## Prices (`/api/v1/prices`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/prices` | ADMIN | 201 / 409 |
| GET | `/prices/{id}` | — | internal-friendly |
| GET | `/prices` | — | pagination |
| PUT | `/prices/{id}` | ADMIN | 200 / 404 / 409 / 423 if locked |
| DELETE | `/prices/{id}` | ADMIN | 204 / 423 if locked |
| POST | `/prices/{id}/lock` | ADMIN (saga worker) | 200 / 423 if already locked |
| POST | `/prices/{id}/unlock` | ADMIN (saga worker) | 200 |

## Offerings (`/api/v1/offerings`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/offerings` | ADMIN | 201 DRAFT |
| GET | `/offerings/{id}` | — | internal-friendly |
| GET | `/offerings` | — | pagination |
| PUT | `/offerings/{id}` | ADMIN | only DRAFT |
| DELETE | `/offerings/{id}` | ADMIN | only DRAFT |
| POST | `/offerings/{id}/publish` | ADMIN | 200 PUBLISHING; 400 on pre-flight fail |
| POST | `/offerings/{id}/retire` | ADMIN | only PUBLISHED → RETIRED |
| POST | `/offerings/{id}/confirm` | ADMIN (saga worker) | PUBLISHING → PUBLISHED |
| POST | `/offerings/{id}/fail` | ADMIN (saga worker) | compensation |

## Store (`/api/v1/store`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/store/offerings` | — | list with pagination |
| GET | `/store/offerings/{id}` | — | detail |
| GET | `/store/search` | — | q, min_price, max_price, channel, characteristic[], skip, limit |

## Gateway Health

| Method | Path |
|---|---|
| GET | `/health` |
| GET | `/health/dependencies` |

## Service-Local Health

Every service also exposes `GET /health` on its own port; `api-gateway` aggregates these in `/health/dependencies`.

## Error Envelope

Every non-2xx response conforms to:

```json
{
  "code": "<ENUMERATED_CODE>",
  "message": "<human-readable>",
  "correlation_id": "<uuid>"
}
```

Common codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`, `LOCKED`, `SERVICE_UNAVAILABLE`.
