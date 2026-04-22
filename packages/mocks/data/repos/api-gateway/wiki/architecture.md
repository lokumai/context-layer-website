# API Gateway — Architecture

## Middleware Pipeline

Every incoming request passes through:

1. **CORS middleware** — manages cross-origin for the Next.js frontend.
2. **Correlation ID middleware** — reads `X-Correlation-ID` if present or generates a UUID; makes it available to downstream logs and traces.
3. **Process-time middleware** — records request start, adds `X-Process-Time` to the response.
4. **Route handler** — either a health endpoint or a `proxy_request()` call.

## Downstream Routing

The gateway is a reverse proxy defined by path prefix. Every match hands off to the generic `proxy_request()` helper (`gateway/main.py:proxy_request()`), which:

- picks the target host from config
- forwards method, headers (notably `Authorization` and `X-Correlation-ID`), query string, and body
- applies the per-service `AsyncCircuitBreaker`
- applies strict HTTP timeouts: **2s connect**, **4s read**

Path prefix → target:

| Prefix | Service |
|---|---|
| `/api/v1/auth/*` | identity-service |
| `/api/v1/characteristics/*` | characteristic-service |
| `/api/v1/specifications/*` | specification-service |
| `/api/v1/prices/*` | pricing-service |
| `/api/v1/offerings/*` | offering-service |
| `/api/v1/store/*` | store-query-service |

## Circuit Breaker

`AsyncCircuitBreaker` is a per-downstream, three-state breaker:

- **Closed** — traffic flows normally.
- **Open** — after 3 consecutive failures, the breaker opens for 20s. Requests fast-fail with 503.
- **Half-open** — after 20s, one probe request is allowed; success closes the breaker, failure re-opens it for another 20s.

This keeps cascading failures contained: a dying `pricing-service` does not stall frontend requests for `offerings` through exhaustion of the gateway's connection pool.

## Error Handling

Every error produced by the gateway conforms to the shared `ErrorResponse` JSON shape:

```json
{ "code": "SERVICE_UNAVAILABLE", "message": "Pricing service unreachable", "correlation_id": "..." }
```

- **503 Service Unavailable** — downstream unreachable or breaker open.
- **401 / 403 / 404 / 422** — propagated verbatim from downstream, body normalized.
- Stack traces are never leaked.
