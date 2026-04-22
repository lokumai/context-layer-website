# Tech Debt Audit — Q2 2026

Frozen snapshot. The live view lives in Intelligence; this document is the one emailed to stakeholders.

## Summary

The codebase is healthier than the average 9-repo system of its size. The debt is concentrated in three places: the offering-service's saga coordination, the specification-service's cache consumer, and the frontend's test coverage. Everything else is in maintenance-grade shape.

## Top 10 Debt Items

1. **Offering-service pre-flight double-calls** — the publish handler calls `specification-service` and `pricing-service` for validation, then Camunda's `validate-specifications` worker calls them again. Either collapse pre-flight into the saga or skip the Camunda step.
2. **Offering-service saga compensation ordering** — the current BPMN assumes external workers run in a specific order. If Camunda re-orders on replay, compensations could overcorrect. Needs a saga-state invariant check in the worker.
3. **Pricing-service lock watchdog** — a saga process that crashes mid-flight leaves prices locked indefinitely until an operator unlocks them by hand. A TTL on `locked_by_saga_id` or a background reaper would close this.
4. **Specification-service consumer back-pressure** — the characteristic-event consumer has no prefetch tuning and no metrics for queue depth. Under event storms this will silently fall behind.
5. **Specification-service cache divergence** — no periodic reconciliation between `cached_characteristics` and `characteristic-service`. If events are lost (broker outage beyond its DLQ retention), the cache can permanently diverge.
6. **Frontend saga polling has no max duration** — `useSagaPolling` polls every 2s forever. A stuck saga leaves the UI spinning indefinitely.
7. **Frontend auth-context SSR leak** — some hooks run during Next.js SSR warmup and attempt localStorage access. Today this is a harmless fallback; a future Next.js upgrade may turn it fatal.
8. **api-gateway forwards unsanitized correlation IDs** — CRLF in incoming headers can split log lines. Low impact, trivial fix.
9. **Shared-chassis public key has no TTL** — identity-service key rotation requires restart of every backend. Add a periodic refresh.
10. **Drifting dependencies** — `offering-service` is one minor behind on `asyncpg`; `specification-service` is two minors behind on `fastapi`. Low risk but worth a maintenance sprint.

## What's Surprisingly Clean

- The chassis has no mutable global state.
- Every domain model has a pure unit-test suite.
- The outbox pattern is implemented identically across all five write services — no drift.
- Every service returns the same error envelope.

## Recommendations

**Short term (this sprint)**

- Add max-duration cutoff to frontend saga polling.
- Sanitize `X-Correlation-ID` in the gateway.
- Cap Elasticsearch `q` input length.

**Medium term (this quarter)**

- Add TTL + reaper for pricing locks.
- Add periodic cache reconciliation in specification-service.
- Tune consumer prefetch + emit queue-depth metrics.
- Rotate identity public-key and confirm no service restart is needed (add if necessary).

**Long term (this half)**

- Split `offering-service` saga orchestration into a dedicated thin component.
- Backfill frontend unit coverage to 75% on `lib/` and `contexts/`.
- Introduce event schema versioning workspace-wide.

## Debt Trend

Coverage has trended up 4 points since Q1. Outstanding TODOs in code have decreased from 38 to 21. Overall health score moved from 79 → 84.
