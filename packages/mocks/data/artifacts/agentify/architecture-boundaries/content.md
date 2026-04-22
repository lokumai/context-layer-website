# Architecture Boundaries

Machine-readable rules encoding which cross-repo dependencies are allowed. Enforced by a repository-graph linter that runs in CI.

## Declaration

```yaml
version: 1
rules:
  # Every backend service may depend on shared-chassis.
  - name: chassis-is-foundation
    allow:
      from: [api-gateway, identity-service, characteristic-service, specification-service, pricing-service, offering-service, store-query-service]
      to: [shared-chassis]

  # The frontend may only cross the gateway.
  - name: frontend-only-through-gateway
    allow:
      from: [frontend]
      to: [api-gateway]
    deny:
      from: [frontend]
      to: [identity-service, characteristic-service, specification-service, pricing-service, offering-service, store-query-service]

  # The gateway is the only service allowed to call every backend.
  - name: gateway-fan-out
    allow:
      from: [api-gateway]
      to: [identity-service, characteristic-service, specification-service, pricing-service, offering-service, store-query-service]

  # Write services may not call each other directly, EXCEPT offering-service
  # calling specification-service and pricing-service during pre-flight.
  - name: no-direct-peer-calls
    deny:
      from: [characteristic-service, specification-service, pricing-service]
      to: [characteristic-service, specification-service, pricing-service, offering-service, store-query-service]
  - name: offering-preflight-allowed
    allow:
      from: [offering-service]
      to: [specification-service, pricing-service]

  # Store-query may hydrate from any write service.
  - name: store-query-hydration
    allow:
      from: [store-query-service]
      to: [characteristic-service, specification-service, pricing-service, offering-service]
    deny:
      from: [store-query-service]
      to: [identity-service]

  # Nothing calls identity-service at request time except via the gateway
  # (for login) or at startup to fetch the public key.
  - name: identity-is-cold-path
    allow:
      from: [shared-chassis]   # public-key fetch at startup
      to: [identity-service]
```

## Enforcement

A `tools/repo-graph-lint/` script walks every service's import graph and HTTP client configuration, reconstructs the edge list, and asserts it against the rules above. The linter is wired into CI; any violation fails the build.

## Consequences When You Break Them

- **A write service calling another write service directly** → couples the two services, creates distributed-monolith risk. Use events + outbox.
- **The frontend bypassing the gateway** → loses circuit breakers, correlation IDs, and resilience. The frontend code is never built against service hostnames; only the gateway's base URL.
- **Runtime dependency on identity-service** → every request becomes a double-hop. The chassis's cached public-key pattern specifically exists to prevent this.
