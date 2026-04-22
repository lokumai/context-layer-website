# Database Schemas

Each write service owns its PostgreSQL database. The read side uses MongoDB + Elasticsearch. This document is the consolidated shape.

## PostgreSQL — per-service databases

### `identity_db.users`

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | default gen_random_uuid() |
| username | VARCHAR(64) | UNIQUE |
| password_hash | VARCHAR(128) | bcrypt cost 12 |
| role | VARCHAR(16) | enum: ADMIN, USER |
| created_at | TIMESTAMPTZ | default now() |

### `characteristics_db.characteristics`

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(200) | UNIQUE |
| value | VARCHAR(200) | |
| unit_of_measure | VARCHAR(32) | enum |
| created_at / updated_at | TIMESTAMPTZ | |

### `specifications_db.specifications` + `cached_characteristics`

`specifications`:

| Column | Type |
|---|---|
| id | UUID PK |
| name | VARCHAR(200) UNIQUE |
| characteristic_ids | UUID[] |
| created_at / updated_at | TIMESTAMPTZ |

`cached_characteristics` (read-only, synced via events):

| Column | Type |
|---|---|
| id | UUID PK |
| name | VARCHAR(200) |
| created_at / updated_at | TIMESTAMPTZ |

### `pricing_db.prices`

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(200) | UNIQUE |
| value | DECIMAL(10,2) | positive |
| unit | VARCHAR(50) | |
| currency | VARCHAR(3) | enum: USD, EUR, TRY |
| locked | BOOLEAN | default false |
| locked_by_saga_id | UUID | nullable |
| created_at / updated_at | TIMESTAMPTZ | |

### `offerings_db.offerings`

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(200) | |
| description | TEXT | |
| specification_ids | UUID[] | |
| pricing_ids | UUID[] | |
| sales_channels | TEXT[] | |
| lifecycle_status | VARCHAR(16) | enum: DRAFT, PUBLISHING, PUBLISHED, RETIRED |
| published_at | TIMESTAMPTZ | nullable |
| retired_at | TIMESTAMPTZ | nullable |
| created_at / updated_at | TIMESTAMPTZ | |

### Outbox (in every write service DB)

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| topic | VARCHAR(128) | |
| event_type | VARCHAR(64) | |
| payload | JSONB | |
| status | VARCHAR(16) | enum: PENDING, SENT, FAILED |
| retry_count | INTEGER | default 0 |
| created_at | TIMESTAMPTZ | |
| processed_at | TIMESTAMPTZ | nullable |

A trigger `notify_outbox()` fires `pg_notify('outbox_events', NEW.id)` on INSERT.

## MongoDB — `catalog_read.published_offerings`

Denormalized document:

```jsonc
{
  "id": "uuid",
  "name": "Fiber Optic 200 Residential",
  "description": "...",
  "lifecycle_status": "PUBLISHED",
  "published_at": "2026-04-15T12:00:00Z",
  "sales_channels": ["online", "retail"],
  "specifications": [
    {
      "id": "uuid",
      "name": "Fiber Optic Spec",
      "characteristics": [
        { "id": "uuid", "name": "Speed", "value": "200", "unit_of_measure": "MBPS" },
        { "id": "uuid", "name": "Data Cap", "value": "1", "unit_of_measure": "TB" }
      ]
    }
  ],
  "pricing": [
    { "id": "uuid", "name": "Monthly Premium", "value": 89.99, "currency": "USD", "unit": "per month" }
  ],
  "searchableText": "Fiber Optic 200 Residential Fiber Optic Spec Speed Data Cap ..."
}
```

Indexes:
- `{lifecycle_status: 1, published_at: -1}` (list)
- `{"pricing.value": 1}` (price filters)
- `{"sales_channels": 1}` (channel filter)
- `{"specifications.characteristics.name": 1, "specifications.characteristics.value": 1}`

There is also a `processed_events` collection with `{event_id, received_at}` — the idempotency ledger for the consumers.

## Elasticsearch — `published_offerings` index

Mapping mirrors the MongoDB shape:

- `name`, `description`, `specifications.name`, `specifications.characteristics.name`, `searchableText` → `text` + standard analyzer
- `sales_channels`, `specifications.characteristics.value` → `keyword`
- `pricing.value` → `scaled_float` (scaling_factor: 100)
- `lifecycle_status` → `keyword`
- `published_at` → `date`

Nested query support is enabled on `specifications` and `pricing` paths.
