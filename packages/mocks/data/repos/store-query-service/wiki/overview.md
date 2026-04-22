# Store Query Service

The Store Query Service is the **read side of CQRS**. It never writes to the command databases and never participates in write transactions. Instead, it consumes domain events from all four write services and projects them into a denormalized MongoDB document (`PublishedOffering`) plus an Elasticsearch index. The customer-facing storefront serves its browse/detail/search traffic from this read model, at sub-second latency, without ever touching the command side.

Runs on Python 3.13+ with FastAPI. MongoDB via Motor (async); Elasticsearch via aiohttp; event consumption via aio-pika.

## Architecture

### Event Consumers and Synchronization

Four topic subscriptions:

| Topic | Effect |
|---|---|
| `product.offerings.events` | `OfferingPublished` → rebuild doc; `OfferingRetired` → delete doc |
| `resource.specifications.events` | find all offerings using the spec, rebuild their docs |
| `resource.characteristics.events` | find all offerings containing the characteristic, rebuild docs |
| `commercial.pricing.events` | find all offerings referencing the price, rebuild docs |

Idempotency is enforced via a `processed_events` MongoDB collection. On every event: check for `event_id`; if present, skip; otherwise process and atomically insert the `event_id`. This tolerates RabbitMQ's at-least-once delivery.

### Data Composition via HTTP Fetching

The service does **not** trust event payloads as the source of truth; payloads act as *triggers*. On `OfferingPublished`, the consumer:

1. Fetches offering details via HTTP GET from `offering-service`.
2. Fetches each referenced specification from `specification-service`.
3. Fetches each characteristic in each spec from `characteristic-service`.
4. Fetches each price from `pricing-service`.

All calls are issued in parallel via `httpx.AsyncClient`. The consumer then builds a single denormalized document and upserts into MongoDB and Elasticsearch.

This approach avoids a subtle hazard: if `CharacteristicUpdated` and `OfferingPublished` arrive out of order, payload-based projection would risk showing stale data. Trigger-then-fetch always reads the latest committed state.

### MongoDB Storage Layer

Collection `published_offerings`. Indexes:

- `{lifecycle_status: 1, published_at: -1}` for the default listing.
- `{"pricing.value": 1}` for price-range filters.
- `{"sales_channels": 1}` for channel filters.
- `{"specifications.characteristics.name": 1, "specifications.characteristics.value": 1}` for characteristic filters in the search fallback path.

### Elasticsearch Search Index

Mirrors the MongoDB document shape. Mapping:

- `name`, `description`, `specifications.name`, `specifications.characteristics.name` — text with standard analyzer.
- `sales_channels`, `specifications.characteristics.value` — keyword.
- `pricing.value` — scaled_float.
- `searchableText` — concatenation of all textual fields for broad matching.

Upsert in MongoDB → index in Elasticsearch; delete in MongoDB → remove from ES.

### Eventual Consistency

Typical lag 100–500 ms under normal load, 1–3 s under stress. Events carry `entity_version`; the projection ignores events older than the stored version, preventing stale overwrites.

## Endpoints

### `GET /api/v1/store/offerings`

Paginated list of all PUBLISHED offerings. Params: `skip` (default 0), `limit` (default 100, max 1000). Sorted by `published_at` desc.

Response:
```json
{"total": 42, "items": [ {PublishedOffering}, ... ]}
```

### `GET /api/v1/store/offerings/{offering_id}`

Single offering by ID. Returns the full denormalized document. 404 if missing or not PUBLISHED.

### `GET /api/v1/store/search`

Elasticsearch-backed search.

Query params:

- `q` — multi_match across name (boost 3x), description, specifications.name. `match_all` if absent.
- `min_price`, `max_price` — nested range query on `pricing.value`.
- `channel` — keyword filter on `sales_channels`.
- `characteristic` — repeatable `name:value` pairs, combined with AND over nested characteristic filters.
- `skip`, `limit` — pagination (default 0, 10).

Response shape matches the list endpoint.

## Testing

Fully async with `pytest-asyncio` and `httpx.AsyncClient`. No sync `TestClient` — the service uses Motor and aio-pika, both of which require the same event loop as the app.

Projection tests:

- **`OfferingPublished` materializes a doc** — mock source-service responses, trigger event, assert MongoDB document shape.
- **`CharacteristicUpdated` rebuilds referencing docs** — seed two offerings using a shared characteristic, update the characteristic, assert both docs reflect the change.
- **`OfferingRetired` deletes** — doc removed from MongoDB and Elasticsearch.

Idempotency tests:

- **Duplicate delivery ignored** — same `event_id` delivered twice; doc touched once; `processed_events` contains one row.

Search tests:

- **Full-text precision** — `q=fiber` returns offerings with "fiber" in name higher than those only in description (boost 3x).
- **Price range** — combined `min_price`/`max_price` correctly scopes nested price results.
- **Characteristic AND** — two `characteristic` filters match only offerings satisfying both.
