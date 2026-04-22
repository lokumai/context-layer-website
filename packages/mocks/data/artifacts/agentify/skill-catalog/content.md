# Skill Catalog

Machine-readable inventory of agent-callable skills available in this workspace.

```yaml
workspace: microservices-product-catalog
version: 1.0.0
skills:
  - id: query-wiki
    description: Query the living workspace wiki for prose explanations.
    input:
      - name: question
        type: string
    output:
      - name: answer
        type: markdown
      - name: citations
        type: Citation[]

  - id: query-code
    description: Grounded code-path queries across all 9 logical repos.
    input:
      - name: query
        type: string
      - name: repoIds
        type: string[]
        optional: true
    output:
      - name: hits
        type: CodeHit[]

  - id: start-publication-saga
    description: Initiate the offering-publication-saga. Emits OfferingPublicationInitiated.
    requires:
      - role: ADMIN
    input:
      - name: offering_id
        type: uuid
    output:
      - name: process_instance_id
        type: string

  - id: check-saga-status
    description: Inspect a Camunda process-instance state.
    input:
      - name: process_instance_id
        type: string
    output:
      - name: state
        type: enum[running, completed, compensating, failed]
      - name: current_task
        type: string

  - id: search-catalog
    description: Customer-facing search against the Store read model.
    input:
      - name: q
        type: string
        optional: true
      - name: filters
        type: SearchFilters
        optional: true
    output:
      - name: results
        type: PublishedOffering[]

  - id: regenerate-wiki
    description: Force a full Wiki rebuild for the workspace.
    requires:
      - role: ADMIN
    input:
      - name: source_ids
        type: string[]
        optional: true
    output:
      - name: job_id
        type: uuid
```

## Schemas

**Citation**
```yaml
anchor: wiki://<repo>/<page>#<section> | @<repo>/<path>:<start>-<end>
label: string
```

**CodeHit**
```yaml
repoId: string
path: string
line: integer
snippet: string
score: number
```

**SearchFilters**
```yaml
min_price: number
max_price: number
channel: string
characteristic: string[]   # format: "name:value"
```

**PublishedOffering** — the denormalized shape from MongoDB; see `artifacts/structure-architecture/db-schema`.
