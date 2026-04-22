# Software Requirements Specification

Reverse-engineered from tests, routes, and domain models. Functional requirements grouped by bounded context; non-functional requirements consolidated at the end.

## 1. Functional Requirements

### 1.1 Identity Context

- **F-I1** The system shall authenticate users via username + password and return an RS256-signed JWT with a default lifetime of 1 hour.
- **F-I2** The system shall expose the RSA public key via an unauthenticated endpoint for distributed validation.
- **F-I3** The system shall reject unknown users and incorrect passwords with a single generic 401 message (no enumeration).
- **F-I4** JWT payloads shall include `sub`, `username`, `role`, `iat`, `exp`.

### 1.2 Characteristic Context

- **F-C1** The system shall allow ADMIN users to create, read, update, and delete atomic characteristics with the triple `(name, value, unit_of_measure)`.
- **F-C2** The system shall enforce global uniqueness of characteristic names.
- **F-C3** The system shall reject any `unit_of_measure` outside the documented enumeration.
- **F-C4** The system shall forbid deleting a characteristic referenced by any specification (409).
- **F-C5** The system shall emit `CharacteristicCreated`, `CharacteristicUpdated`, and `CharacteristicDeleted` events transactionally with the corresponding write.

### 1.3 Specification Context

- **F-S1** The system shall allow ADMIN users to create specifications referencing ≥1 characteristic.
- **F-S2** The system shall validate characteristic references against a local cache kept in sync by subscribing to characteristic events.
- **F-S3** The system shall expose an internal `POST /specifications/validate` endpoint for saga pre-flight.
- **F-S4** The system shall emit `SpecificationCreated`, `SpecificationUpdated`, and `SpecificationDeleted` events transactionally.
- **F-S5** The system shall forbid deleting a specification referenced by any offering (409).

### 1.4 Pricing Context

- **F-P1** The system shall allow ADMIN users to manage prices (CRUD).
- **F-P2** Prices shall carry `value` as DECIMAL(10,2) positive, and `currency` shall be one of `{USD, EUR, TRY}`.
- **F-P3** Saga workers shall be able to lock / unlock prices via dedicated endpoints; locked prices reject modification with HTTP 423.
- **F-P4** The system shall emit `PriceCreated`, `PriceUpdated`, `PriceDeleted`, `PriceLocked`, `PriceUnlocked` events.

### 1.5 Offering Context

- **F-O1** The system shall manage offerings with a state machine: DRAFT → PUBLISHING → PUBLISHED → RETIRED.
- **F-O2** An offering may be created in DRAFT with only a name; it cannot be published without ≥1 specification, ≥1 price, and ≥1 sales channel.
- **F-O3** Publication shall initiate via `POST /offerings/{id}/publish`; the handler must perform pre-flight validation and start a Camunda saga.
- **F-O4** Only DRAFT offerings may be edited or hard-deleted; PUBLISHED offerings are immutable; RETIRED offerings are hidden from the Store.
- **F-O5** The system shall emit lifecycle events through the outbox: `OfferingCreated`, `OfferingUpdated`, `OfferingPublicationInitiated`, `OfferingPublished`, `OfferingPublicationFailed`, `OfferingRetired`.

### 1.6 Store (Read) Context

- **F-Q1** The system shall project published offerings into a denormalized MongoDB document.
- **F-Q2** The system shall index the same shape in Elasticsearch for full-text + faceted search.
- **F-Q3** The Store endpoints shall be unauthenticated and return only offerings with lifecycle_status=PUBLISHED.
- **F-Q4** The system shall tolerate at-least-once event delivery via an idempotency ledger (`processed_events`).
- **F-Q5** Updates to referenced entities (characteristics, specs, prices) shall cause affected offerings' read-model docs to rebuild.

## 2. Non-Functional Requirements

- **NFR-1 Availability** — read side (Store) shall remain available when the write side is degraded.
- **NFR-2 Consistency** — eventual consistency on the read side, ≤3s p95 lag under nominal load.
- **NFR-3 Security** — every service boundary validates JWTs independently against the cached identity public key.
- **NFR-4 Observability** — every request carries a correlation ID; traces reach Zipkin; logs reach Kibana with `correlation_id` indexed.
- **NFR-5 Resilience** — the gateway shall open a per-service circuit breaker on 3 consecutive failures and fast-fail for 20 seconds.
- **NFR-6 Auditability** — every saga and outbox emission is logged with structured fields sufficient to reconstruct the flow from logs alone.
- **NFR-7 Deployability** — each service shall run in Docker Compose locally and be Kubernetes-ready; no host-coupled state.
- **NFR-8 Performance** — Store search p95 ≤ 400 ms for up to 10K offerings.

## 3. Out of Scope (Documented as Explicit Non-Goals)

- Payment processing.
- Real user management (self-service signup, email verification, password reset).
- Multi-tenant data partitioning.
- Currency conversion.
- Real-time notifications to customers on offering updates.
