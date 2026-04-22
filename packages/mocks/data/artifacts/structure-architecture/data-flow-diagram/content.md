# End-to-End Data Flow — Publishing an Offering

A single concrete flow — an admin clicks Publish on a draft Offering — traced through every service it touches.

## Trigger

Admin is on `/builder`, the Offering tab. They click **Publish** on a draft offering. The `OfferingForm` fires `apiClient.post('/offerings/{id}/publish')` (through `api-gateway` on port 8000).

## Timeline

```mermaid
sequenceDiagram
  participant Admin
  participant FE as frontend
  participant GW as api-gateway
  participant OS as offering-service
  participant PS as pricing-service
  participant SS as specification-service
  participant SQ as store-query-service
  participant CM as Camunda
  participant MQ as RabbitMQ
  participant ES as Elasticsearch
  participant MDB as MongoDB

  Admin->>FE: click Publish
  FE->>GW: POST /offerings/{id}/publish
  GW->>OS: proxy
  OS->>OS: pre-flight (DRAFT + specs/prices/channels)
  OS->>SS: GET /specifications/{id} × N  (validate)
  OS->>PS: GET /prices/{id} × M          (validate)
  OS->>CM: start offering-publication-saga
  OS->>OS: DRAFT → PUBLISHING + outbox(OfferingPublicationInitiated)
  OS-->>GW: 202 PUBLISHING
  GW-->>FE: 202 PUBLISHING
  FE->>FE: useSagaPolling → GET every 2s

  Note over CM,SQ: External Task Pattern — workers poll Camunda
  CM->>PS: fetchAndLock lock-prices
  PS->>PS: SET locked=true + outbox(PriceLocked)
  PS-->>CM: complete
  CM->>SS: fetchAndLock validate-specifications
  SS-->>CM: complete
  CM->>SQ: fetchAndLock create-store-entry
  SQ->>SQ: hydrate from OS/SS/CS/PS + upsert to MDB/ES
  SQ-->>CM: complete
  CM->>OS: fetchAndLock confirm-publication
  OS->>OS: PUBLISHING → PUBLISHED + outbox(OfferingPublished)
  OS-->>CM: complete

  OS->>MQ: publish OfferingPublicationInitiated
  PS->>MQ: publish PriceLocked
  OS->>MQ: publish OfferingPublished
  MQ->>SQ: deliver events
  SQ->>MDB: upsert finalized PublishedOffering
  SQ->>ES: index finalized doc

  FE->>GW: GET /offerings/{id}
  GW->>OS: proxy
  OS-->>FE: lifecycle_status=PUBLISHED
  FE->>Admin: success toast
```

## Where the Data Lives at Each Step

| Moment | Authoritative state | Read-model state |
|---|---|---|
| DRAFT | `offerings` table in offering-service PG | N/A |
| PUBLISHING, saga in flight | offering PG (lifecycle=PUBLISHING) + outbox row + pricing PG (locked rows) | N/A (store doc is in-progress) |
| PUBLISHED | offering PG (lifecycle=PUBLISHED) | MongoDB `published_offerings` + Elasticsearch index |

## What the Customer Sees

At the moment the saga completes `create-store-entry`, a denormalized doc appears in MongoDB and is indexed in ES. The `/api/v1/store/search` endpoint can now surface the offering. In practice the customer sees the new offering 100–500 ms after the admin sees their success toast.

## Failure Compensation

If any worker fails (e.g., `validate-specifications` can't find a spec), Camunda fires compensations in reverse: `unlock-prices`, `delete-store-entry`, `revert-to-draft`. The offering returns to DRAFT with a `OfferingPublicationFailed` event; the Store doc (if one was created) is removed. The admin's polling sees `DRAFT` again and shows an error toast.
