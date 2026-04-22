# Security Posture Report — Q2 2026

Frozen snapshot. Attach to the Q2 security review.

## Executive Summary

No critical vulnerabilities. Two high-severity findings, both remediable with configuration changes. Six medium, 11 low, 8 informational. The overall posture is consistent with zero-trust design intent; the findings are concentrated in operational hygiene (secret sourcing, URL allow-listing) rather than architectural flaws.

## Severity Distribution

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 2 |
| Medium | 6 |
| Low | 11 |
| Info | 8 |

## High-Severity Findings

### SEC-001 — RSA private key from plain env var

**Service**: identity-service · **File**: `services/identity-service/src/config.py:42`

The private signing key is read directly from an environment variable as a PEM string (with escaped newlines). In non-dev environments this should be sourced from a KMS or mounted secret. Existing incidents around newline escaping have already bitten the team.

*Remediation*: migrate to `kubernetes.io/tls` secret mount or AWS Secrets Manager / Vault. Owner: @infra-team. Target: Q2 end.

### SEC-002 — Camunda URL not allow-listed

**Service**: offering-service · **File**: `services/offering-service/src/infrastructure/camunda_client.py:28`

`CAMUNDA_URL` is accepted as-is. If ever supplied by user-controlled config (which it shouldn't be, but defense-in-depth), it becomes an SSRF vector.

*Remediation*: validate scheme (`http`/`https`), reject private IP ranges unless explicitly whitelisted. Owner: @platform-team. Target: next sprint.

## Medium-Severity Findings (Summary)

- **SEC-003** `X-Correlation-ID` forwarded without sanitization (log injection risk) — `api-gateway`.
- **SEC-004** Outbox payloads lack schema version — `characteristic-service` (and the other write services by inheritance).
- **SEC-005** Specification list endpoint publicly readable — acceptable with network policy, flagged for explicit decision.
- **SEC-006** Pricing saga endpoints share the ADMIN role — narrow to a dedicated SAGA role.
- **SEC-007** Offering pre-flight not transactional with saga start — race window exists.
- **SEC-008** Elasticsearch URL allow-listing absent — same class as Camunda URL.

## Low-Severity & Info (Summary)

Includes: rate-limit gaps on `/auth/login`, JWT in `localStorage`, `dangerouslySetInnerHTML` usage on Offering description (future-proofing), exception handler leaking correlation ID on 500s, no public-key TTL in the chassis cache, and various dependency drift items.

See the full findings list in Intelligence (live) or the attached JSON.

## Compliance Mapping

| Control | Coverage |
|---|---|
| Authentication | ✅ RS256 JWT, bcrypt cost 12 |
| Authorization | ✅ RBAC via shared chassis, plus future SAGA role split |
| Transport security | ✅ TLS terminates at gateway in prod |
| Audit logging | ✅ structured logs + correlation ID, Kibana-ingested |
| Secret management | ⚠ partial — env vars for dev, KMS migration pending |
| Input validation | ✅ Pydantic schemas at every boundary |
| Error handling | ✅ uniform envelope, no stack-trace leakage |
| Rate limiting | ⚠ absent at gateway |
| Monitoring & alerting | ✅ Zipkin + Kibana + Camunda Cockpit |

## Recommendations

1. Move identity-service signing key to KMS.
2. Add scheme/host allow-listing on outbound URLs from `offering-service` and `store-query-service`.
3. Implement gateway rate limit on `/auth/login`.
4. Introduce a dedicated SAGA role for saga-worker-only routes.
5. Add event-schema versioning across all outbox payloads.

Sign-off: @security-team, 2026-04-18.
