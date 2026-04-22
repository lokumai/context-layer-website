# Test Coverage Landscape

Workspace-wide test coverage, critical-path gap analysis, and recommended investments. Frozen alongside the Q2 review.

## Overall

- **Overall line coverage**: 81.4%
- **Overall branch coverage**: ~75% (estimated from per-repo averages)
- **Target**: 80% line on domain code across all services.

The workspace meets the target in aggregate, but not in every repo.

## Per-Repo Snapshot

| Repo | Line % | Branch % | Meets 80% target? |
|---|---:|---:|---|
| identity-service | 91.8 | 88.4 | ✅ |
| shared-chassis | 92.4 | 88.1 | ✅ |
| characteristic-service | 90.2 | 85.6 | ✅ |
| pricing-service | 88.3 | 83.9 | ✅ |
| specification-service | 86.7 | 81.2 | ✅ |
| store-query-service | 84.9 | 78.2 | ✅ |
| offering-service | 83.1 | 76.8 | ✅ line, ⚠ branch |
| api-gateway | 72.1 | 64.8 | ⚠ below target |
| frontend | 58.4 | 48.2 | ⚠ well below target |

## Critical-Path Gap Analysis

Gaps ranked by business impact.

1. **Offering saga compensation when Camunda is unreachable mid-flight** — no test. Today we rely on retries and hope Camunda comes back. A component test with a killable Camunda mock would catch regressions to the compensation logic.
2. **Store-query out-of-order event arrival** — partial coverage. The version-check logic is tested in isolation but not under realistic reorder scenarios. Extend with a chaos-style test.
3. **Circuit-breaker half-open re-entry** — `api-gateway` has an integration test for open → closed but not for the half-open probe failure path.
4. **Frontend saga polling max-duration** — ungated indefinite polling is a UX issue; no test exists because the behavior itself isn't implemented.
5. **Token refresh flow in frontend** — today a 401 triggers logout. If we ever add refresh tokens, we'll need test scaffolding that doesn't exist.

## Recommendations

**Offering-service (+3 pts)**
- Add compensation-failure test with stubbed Camunda.
- Add retire-with-outstanding-outbox test.

**api-gateway (+8 pts)**
- Half-open re-entry scenarios.
- CORS pre-flight on unknown origin.
- Middleware-level unit tests for correlation-ID generation.

**Frontend (+15 pts)**
- Backfill `lib/` and `contexts/` to ≥80%.
- Saga-polling max-duration behavior once implemented.
- Filter URL round-trip (bookmarkable search).

## Testing Philosophy Reaffirmed

Unit coverage is a floor, not a ceiling. Integration coverage for the outbox and for each event consumer is non-negotiable because those paths cross transactional boundaries. End-to-end coverage is deliberately minimal — heavy e2e suites are brittle in microservices systems and drift too quickly; we invest in per-service component tests instead.
