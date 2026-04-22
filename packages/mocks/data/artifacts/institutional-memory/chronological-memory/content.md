# Chronological Memory — From PR Discussions

Decisions and rationale mined from PR discussions, RFCs, and commit trailers. Chronological, editorial.

## 2025-10 — Why a monorepo if we want microservices?

**PR #12** (repo bootstrap). The original discussion had a strong monorepo-vs-polyrepo fork. The deciding argument was the shared chassis: if every service copies the chassis into its own repo, any chassis bug is a nine-PR fix and nine releases. A monorepo lets the chassis be a workspace package with a single source of truth.

The cost: explaining to newcomers that "services are logically separate" despite sharing a git history. That explanation landed in the workspace README and later in `AGENTS.md`.

## 2025-11 — Why MongoDB + Elasticsearch for the read side?

**RFC R-004** (store-query design). The team considered a single-store solution (Postgres with tsvector, or just Elasticsearch for both display and search). Picked MongoDB for denormalized doc retrieval + Elasticsearch for search because:

1. MongoDB's flexible schema absorbs any future characteristic shape without migrations on the read side.
2. Elasticsearch's nested queries are a better fit for filtering on inner characteristics than Postgres JSONB containment.

Trade-off: two databases to run. Accepted — Compose and Kubernetes both make this cheap.

## 2026-01 — Why Camunda over a Temporal.io saga?

**ADR 011**. Both evaluated. Picked Camunda because:

- Visual BPMN in Cockpit is a strong demo asset for enterprise customers (the target market).
- External Task Pattern maps cleanly onto the existing FastAPI services — each service just polls for its task type.
- Teams already familiar with BPMN modeling.

Rejected: Temporal's code-first approach. Powerful, but the visual audit trail was a hard requirement from compliance.

## 2026-01 — Why trigger-then-fetch in store-query?

**PR #142**. Originally the consumer trusted event payloads. A soak test produced stale offerings when `CharacteristicUpdated` arrived after `OfferingPublished` but referred to an older version of the characteristic than the one already read by `OfferingPublished`. The simplest fix was to use events as *triggers* and always fetch current state from the source service.

This shifted a dependency into the read path, but the payoff is monotonic consistency. Discussed trade-offs with @data-team; accepted.

## 2026-02 — Why is identity-service a cold-path dependency?

**PR #178**. Early versions had every service call `GET /auth/validate` on every request. A bad deploy of identity-service took the whole system down. @security-team pushed for local validation with a cached public key; @platform-team landed the pattern in the chassis. Now identity-service matters at deploy-time, not request-time.

## 2026-02 — Why `entity_version` on outbox payloads?

**PR #201**. The out-of-order hazard mentioned above pushed us to add a version field on every payload. Consumers can now cheap-compare incoming events against stored state without a full re-fetch in the common case.

## 2026-04 — Why the publish pre-flight?

**PR #249**. Before this PR, publication went straight to Camunda. Failures in `validate-specifications` were common, resulting in compensations that confused operators ("why did I get an email about a failed saga when the spec obviously exists?"). Pre-flight validation catches 80% of these as a 400 at publish-time, saving the compensation path for genuine concurrent deletions.

## 2026-04 — Why Next.js 16?

**PR #261**. App Router improvements, React 19 compatibility, and faster dev-server startup. Minimal migration surface; no breaking changes to our app. Took one afternoon.
