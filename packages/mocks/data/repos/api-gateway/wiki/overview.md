# API Gateway — Overview

The `api-gateway` is the single entry point for every external request into the product catalog. It runs on port 8000, is built on Python 3.13+ with FastAPI and `httpx`, and exists to:

- abstract downstream services behind a single stable surface
- enforce resilience (circuit breakers, timeouts) against every hop
- inject cross-cutting observability (correlation IDs, process-time headers)
- handle CORS for browser clients

It is **not** an authentication authority — JWT validation is distributed per-service via the shared chassis. The gateway simply forwards the `Authorization` header. This preserves zero-trust semantics while letting the gateway remain stateless and cheap.

Public endpoints exposed directly by the gateway itself are limited to health checks:

- `GET /health` — gateway's own liveness probe
- `GET /health/dependencies` — polls every downstream service and reports circuit-breaker state

Everything else is proxied through path-prefix routing.
