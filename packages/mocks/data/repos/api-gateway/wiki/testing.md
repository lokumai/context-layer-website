# API Gateway — Testing

Tests live in `services/api-gateway/tests/` and e2e flows under `tests/e2e/`. The framework is `pytest` + `pytest-asyncio`, with `httpx.AsyncClient` for request construction.

## Coverage Targets

No explicit gateway-only target. The overall project goal is **80% coverage on domain code**; the gateway's tests focus on **behavior** rather than code lines, since most of its logic is configuration and middleware.

## Notable Test Cases

**Routing** — every configured prefix resolves to the expected downstream. A table-driven test iterates over `(prefix, expected_host)` pairs and asserts the downstream received the request body unmodified.

**Circuit Breaker** — an integration test stops a downstream container (e.g. `characteristic-service`) mid-flight:

1. Three consecutive calls return 503.
2. The fourth call returns 503 *without* attempting the downstream (breaker is open).
3. After 20s, the next call is probed. Restarting the container and waiting one interval produces a 200.

**Timeout Enforcement** — fixture downstreams that sleep 10s confirm the gateway returns 503 at ~4s (read timeout), and that connect failures fail fast at ~2s.

**Authentication Enforcement** — an e2e test asserts that requests without a valid `Authorization: Bearer` header are rejected **by the downstream** with 401. The gateway itself does not reject; the test proves the zero-trust promise.

**Error Response Conformance** — every non-2xx response body is validated against the shared `ErrorResponse` schema: `code`, `message`, and `correlation_id` are all present.
