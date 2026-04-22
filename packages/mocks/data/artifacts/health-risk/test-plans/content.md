# Critical-Path Test Plans

Three end-to-end test plans for the flows the team actually ships against. These sit above per-service component tests and are deliberately thin in count, thick in coverage.

## Plan 1 — Offering Publication (Happy + Compensation)

### Preconditions

- At least one characteristic, one specification, one price, one sales channel in the system.
- Camunda reachable.
- All consumers (saga workers, outbox listener, store-query consumers) running.

### Happy Path

1. Admin creates an offering in DRAFT with the fixture entities.
2. Admin `POST /offerings/{id}/publish`.
3. **Assert** — offering transitions to PUBLISHING within 500 ms.
4. **Assert** — outbox row `OfferingPublicationInitiated` exists with status PENDING → SENT.
5. **Assert** — Camunda process instance exists for `offering-publication-saga`.
6. Wait ≤5 s.
7. **Assert** — offering transitions to PUBLISHED; `published_at` set.
8. **Assert** — MongoDB has the denormalized doc; Elasticsearch has an indexed entry.
9. **Assert** — referenced prices are unlocked.

### Compensation Path

1. Admin creates the same fixture state.
2. Kill a referenced specification between pre-flight and the `validate-specifications` task.
3. Admin `POST /offerings/{id}/publish`.
4. **Assert** — pre-flight passes (spec still existed); saga starts; `validate-specifications` fails.
5. **Assert** — `unlock-prices` compensation runs; prices are unlocked.
6. **Assert** — `delete-store-entry` compensation runs; MongoDB/ES entry is absent.
7. **Assert** — offering reverts to DRAFT; `OfferingPublicationFailed` is in the outbox.

## Plan 2 — Zero-Trust Enforcement

### Objective

Prove that downstream services validate JWTs independently and do not trust the gateway.

### Setup

- Running: all services + gateway.
- Fixture: valid admin JWT, valid user JWT, expired JWT.

### Cases

1. **No token via gateway** — `POST /api/v1/characteristics` without `Authorization` → 401.
2. **No token direct-to-service** — same request to characteristic-service port 8002 → 401 (proves service doesn't trust "came from gateway").
3. **Invalid signature** — sign a token with a different key → 401 both paths.
4. **Expired token** — issue a token with `exp` in the past → 401 both paths.
5. **USER token on ADMIN route** — valid user-role token on `POST /characteristics` → 403.
6. **ADMIN token on ADMIN route** — 201 both paths.

## Plan 3 — Store Search Surface

### Objective

Regression-test the public Store search flow end-to-end: URL ↔ state ↔ Elasticsearch query.

### Setup

- ≥5 offerings published with varied characteristics, prices, channels.

### Cases

1. **Bare load** — `GET /store` → offerings card grid populated; URL carries no params.
2. **Keyword** — type `fiber` in search input; URL updates to `?q=fiber`; grid filters; backend receives `q=fiber`.
3. **Price range** — drag slider; URL updates with `min_price`, `max_price`; grid reflects; backend receives range params.
4. **Channel** — tick a channel; URL updates; backend filter applied.
5. **Characteristic** — tick `Speed:100 Mbps`; URL updates; grid reflects.
6. **Combined filters** — apply all four; URL carries all; backend receives compound query.
7. **URL restore** — load `GET /store?q=fiber&min_price=50&channel=online` directly; UI rehydrates; correct offerings shown.
8. **Detail modal** — click a card; modal opens with full denormalized data; close restores focus.

## Exit Criteria

Each plan must pass on three consecutive CI runs against the Docker Compose e2e environment before it counts as "green" for release.
