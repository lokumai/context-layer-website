# Repo Map

A single diagram-and-table view of the nine logical repositories in the **Microservices Product Catalog** workspace. Use this as the map before you open any individual service wiki.

## Logical Topology

```
                           ┌─────────────────┐
                           │    frontend     │
                           │   (Next.js 16)  │
                           └────────┬────────┘
                                    │ HTTPS
                           ┌────────▼────────┐
                           │   api-gateway   │
                           │   (port 8000)   │
                           └────────┬────────┘
          ┌──────────┬──────────┬──┴───┬──────────┬──────────────┐
          │          │          │      │          │              │
  ┌───────▼────┐ ┌───▼────┐ ┌───▼──┐ ┌─▼─────┐ ┌──▼─────┐ ┌──────▼──────┐
  │ identity-  │ │ char-  │ │spec- │ │pricing│ │offering│ │store-query- │
  │  service   │ │ istic  │ │-svc  │ │ -svc  │ │  -svc  │ │  service    │
  └────────────┘ └───┬────┘ └──┬───┘ └───┬───┘ └────┬───┘ └────┬───┬────┘
                     │         │         │          │          │   │
                     │         │         │          │          │   ▼
                  (events via RabbitMQ topics to store-query)  │  MongoDB
                                                               │  Elasticsearch
                                                               ▼
                                                          (from offering)
```

All seven backend services import `shared-chassis` (`libs/common-python`) for logging, tracing, security, messaging, and outbox.

## Repo Inventory

| # | Source ID | Role | Language | LOC |
|---|---|---|---|---|
| 1 | `api-gateway` | Reverse proxy + resilience | Python | ~1,284 |
| 2 | `identity-service` | Login + JWT issuance + public-key distribution | Python | ~1,012 |
| 3 | `characteristic-service` | CRUD + events for atomic product attributes | Python | ~1,836 |
| 4 | `specification-service` | Compose characteristics + cache consumer | Python | ~2,110 |
| 5 | `pricing-service` | Prices + saga-aware locking | Python | ~1,754 |
| 6 | `offering-service` | Aggregate root + saga orchestrator | Python | ~2,498 |
| 7 | `store-query-service` | CQRS read-model projector | Python | ~1,922 |
| 8 | `frontend` | Builder / Viewer / Store | TypeScript | ~3,641 |
| 9 | `shared-chassis` | Cross-cutting library | Python | ~1,247 |

## Ownership & Heat

- **Highest rate of change**: `offering-service` (saga evolution) and `frontend` (UI iteration).
- **Highest cross-team impact**: `shared-chassis` — change it and every backend service rebuilds.
- **Lowest rate of change but highest security weight**: `identity-service` — treat PRs here like key rotation.

## Key Coupling Edges

- `frontend` → `api-gateway` (HTTP)
- `api-gateway` → every backend service (HTTP; breaker-wrapped)
- `store-query-service` subscribes to all four event topics and **also** issues HTTP hydration calls back to the four write services
- `offering-service` issues pre-flight HTTP calls to `specification-service` and `pricing-service`
- All seven backend services depend on `shared-chassis`

If you're planning a change, this is the map of who pages in when something breaks.
