# API Gateway — Endpoints

## Health

### `GET /health`

Gateway-only liveness. Never touches downstreams.

```json
{ "status": "healthy", "service": "api-gateway" }
```

### `GET /health/dependencies`

Aggregate health. Polls each downstream `/health` in parallel and reports both upstream status and breaker state.

```json
{
  "gateway": "healthy",
  "dependencies": {
    "identity-service": { "status": "healthy", "circuit": "closed" },
    "characteristic-service": { "status": "healthy", "circuit": "closed" },
    "specification-service": { "status": "healthy", "circuit": "closed" },
    "pricing-service": { "status": "degraded", "circuit": "half-open" },
    "offering-service": { "status": "healthy", "circuit": "closed" },
    "store-query-service": { "status": "healthy", "circuit": "closed" }
  }
}
```

## Proxy Routes

All routes below are defined as a single `api_route()` per prefix using FastAPI's path-catch mechanism, and funnel through `proxy_request()`:

| Method | Path | Target |
|---|---|---|
| ANY | `/api/v1/auth/*` | identity-service |
| ANY | `/api/v1/characteristics/*` | characteristic-service |
| ANY | `/api/v1/specifications/*` | specification-service |
| ANY | `/api/v1/prices/*` | pricing-service |
| ANY | `/api/v1/offerings/*` | offering-service |
| ANY | `/api/v1/store/*` | store-query-service |

The gateway captures the remainder of the path after the prefix and forwards it verbatim. Method, query, headers, and body are preserved.
