// packages/mocks/src/fixtures/workspace-microservices.ts
import type {
  WorkspaceState,
  Source,
  WikiPage,
  WikiJob,
  ChatThread,
  DocsGenCard,
  OmniBoardArtifact,
  LibraryItem,
  IntelligenceDashboard,
} from "../types";

const WORKSPACE_ID = "microservices-product-catalog";
const NOW = "2026-04-22T10:00:00.000Z";
const HOURS_AGO_2 = "2026-04-22T08:00:00.000Z";
const DAYS_AGO_1 = "2026-04-21T10:00:00.000Z";
const DAYS_AGO_2 = "2026-04-20T10:00:00.000Z";

const REPOS = [
  { id: "catalog-service", desc: "Core product catalog API (TMForum TMF620)" },
  { id: "pricing-service", desc: "Pricing rules and promotion engine" },
  { id: "inventory-service", desc: "Stock ledger and reservations" },
  { id: "order-service", desc: "Order lifecycle and saga orchestrator" },
  { id: "customer-service", desc: "Customer profile and account mgmt" },
  { id: "notification-service", desc: "Email/SMS dispatch and templates" },
  { id: "search-service", desc: "Search index and query API" },
  { id: "shared-lib", desc: "Shared models, events, TMForum schemas" },
  { id: "catalog-ui", desc: "Next.js storefront" },
] as const;

const sources: Source[] = REPOS.map((r) => ({
  id: `src-${r.id}`,
  workspaceId: WORKSPACE_ID,
  name: r.id,
  kind: "repo",
  provider: "github",
  url: `https://github.com/amirkiarafiei/${r.id}`,
  branch: "main",
  status: "indexed",
  lastIndexedAt: HOURS_AGO_2,
  autoSync: true,
}));

// One external file source — TMForum reference
sources.push({
  id: "src-tmforum-spec",
  workspaceId: WORKSPACE_ID,
  name: "TMForum_TMF620_Spec.pdf",
  kind: "file",
  provider: "gdrive",
  status: "indexed",
  lastIndexedAt: DAYS_AGO_1,
  autoSync: true,
});

const WORKSPACE_OVERVIEW_MD = `# microservices-product-catalog — Overview

A **TMForum-compatible** product catalog system for a telecom operator. Nine repositories. Seven deployable microservices. One shared domain library and one storefront UI.

> Engineered for **enterprise telco resilience** — CQRS, transactional outbox, event-driven sagas, and a frontend that doesn't know which backend is running.

## System topology

\`\`\`mermaid
flowchart LR
    subgraph Clients
      UI[catalog-ui<br/>Next.js]
      API[External partners]
    end

    subgraph Edge
      GW[API Gateway]
    end

    subgraph Services
      CAT[catalog-service]
      PRC[pricing-service]
      INV[inventory-service]
      ORD[order-service]
      CUS[customer-service]
      NOT[notification-service]
      SRC[search-service]
    end

    subgraph Shared
      LIB[[shared-lib]]
    end

    subgraph Infra
      KAF[(Kafka)]
      PG[(Postgres)]
      REDIS[(Redis)]
    end

    UI --> GW
    API --> GW
    GW --> CAT & PRC & INV & ORD & CUS & SRC
    ORD --> KAF
    CAT --> KAF
    NOT --> KAF
    KAF --> NOT & INV & SRC
    CAT & PRC & INV & ORD & CUS & NOT & SRC -.-> LIB
    CAT & PRC & INV & ORD & CUS --> PG
    SRC --> REDIS
\`\`\`

## Order placement saga

The canonical cross-repo story. Four services cooperate via the **transactional outbox** pattern. Each write is a local DB transaction that appends to an outbox table; a debezium connector tails the table into Kafka.

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant O as order-service
    participant I as inventory-service
    participant P as pricing-service
    participant N as notification-service
    participant K as Kafka

    C->>O: POST /orders
    O->>I: Reserve stock (sync)
    I-->>O: OK · reservation-id
    O->>P: Calculate total (sync)
    P-->>O: OK · total, tax
    O->>O: Commit order + outbox row
    O->>K: emit OrderPlaced
    K->>N: OrderPlaced
    N->>C: Confirmation email
    K->>I: OrderPlaced<br/>(async, finalize reservation)
\`\`\`

### Compensation path

If any sync call fails, the order-service emits a \`SagaAborted\` event and inventory releases the reservation. Compensation is **event-sourced** — the saga state lives in \`order-service/saga_state\`.

## Deployment units

| Repository | Tech | SLO (p95) | Owner |
|---|---|---|---|
| catalog-service | FastAPI · Py 3.12 | 120 ms | platform |
| pricing-service | FastAPI · Py 3.12 | 80 ms | pricing |
| inventory-service | FastAPI · Py 3.12 | 100 ms | fulfillment |
| order-service | FastAPI · Py 3.12 | 350 ms | orders |
| customer-service | FastAPI · Py 3.12 | 80 ms | platform |
| notification-service | FastAPI · Py 3.12 | 1 s | platform |
| search-service | FastAPI · Py 3.12 | 50 ms | discovery |
| shared-lib | Py lib, no runtime | — | platform |
| catalog-ui | Next.js 15 | 200 ms TTI | frontend |

## Data model boundaries

\`\`\`mermaid
classDiagram
    class Product {
      +UUID id
      +String name
      +ProductSpec[] specs
      +Lifecycle lifecycle
    }
    class ProductSpec {
      +UUID id
      +Money price
      +String[] bundles
    }
    class Order {
      +UUID id
      +UUID customerId
      +LineItem[] items
      +SagaStatus status
    }
    class Reservation {
      +UUID id
      +UUID orderId
      +String sku
      +int qty
      +ReservationStatus status
    }
    Product "1" *-- "many" ProductSpec
    Order "1" o-- "many" Reservation : fulfills
\`\`\`

## Why this exists

The operator's legacy catalog stack was a single monolith. When the product team wanted to ship personalized pricing, the whole thing had to come down for deploys. This architecture decouples the pricing engine from the catalog, lets the inventory team scale independently, and gives the storefront a single gateway to consume.

## Key invariants

1. **Every cross-service write goes through the outbox.** No service writes directly to Kafka.
2. **TMF620 schema is the contract.** Internal types use \`shared-lib.models.tmf620\` — never hand-rolled.
3. **Reservations are idempotent.** Retrying \`POST /reservations\` with the same \`Idempotency-Key\` is safe.
4. **Saga state is owned by order-service alone.** Other services see events, never the saga table.
`;

const REPO_PAGE_MD = (r: { id: string; desc: string }) => `# ${r.id}

${r.desc}

## Overview

\`${r.id}\` exposes a single HTTP surface area and reads/writes its own Postgres schema. It emits domain events to Kafka via the transactional outbox. It depends on \`shared-lib\` for event schemas and TMForum models.

## High-level flow

\`\`\`mermaid
flowchart TD
    REQ[HTTP Request] --> ROUTER{Router}
    ROUTER -->|read| REPO[Repository]
    ROUTER -->|write| SVC[Service]
    SVC --> REPO
    SVC --> OUTBOX[(Outbox Table)]
    REPO --> DB[(Postgres)]
    OUTBOX -.-> KAFKA[(Kafka)]
\`\`\`

## Entry points

\`\`\`python
# src/app/main.py
from fastapi import FastAPI
from shared_lib.middleware import TelemetryMiddleware

app = FastAPI(title="${r.id}", version="1.0.0")
app.add_middleware(TelemetryMiddleware)

from app.routers import api
app.include_router(api.router)
\`\`\`

## Request lifecycle (write path)

\`\`\`mermaid
sequenceDiagram
    Client->>Router: POST /resource
    Router->>Validator: TMF620 payload
    Validator-->>Router: ok
    Router->>Service: handle(cmd)
    Service->>Repository: save(entity)
    Repository->>Postgres: INSERT + outbox row
    Postgres-->>Repository: ok
    Service-->>Router: entity
    Router-->>Client: 201 Created
\`\`\`

## Tables

| Table | Purpose |
|---|---|
| \`entities\` | Canonical state |
| \`outbox\` | Transactional event log |
| \`audit\` | Change-data capture backup |

## Known callers

Everything in the workspace reaches this service via the gateway — there is no direct service-to-service HTTP (aside from the order saga's sync calls into pricing and inventory).

> **Operational note:** this service is horizontally scalable. The outbox relay is a separate pod, deployed as a sidecar.
`;

const wikiPages: WikiPage[] = [
  {
    id: "workspace/overview",
    workspaceId: WORKSPACE_ID,
    layer: "workspace",
    title: "Workspace Overview",
    pathSegments: ["Overview"],
    markdown: WORKSPACE_OVERVIEW_MD,
  },
  ...REPOS.map((r) => ({
    id: `repo/${r.id}/architecture`,
    workspaceId: WORKSPACE_ID,
    layer: "repo" as const,
    repoId: r.id,
    title: `${r.id} — Architecture`,
    pathSegments: [r.id, "Architecture"],
    markdown: REPO_PAGE_MD(r),
  })),
];

const wikiJobs: WikiJob[] = [
  {
    id: "job-1",
    workspaceId: WORKSPACE_ID,
    type: "generate",
    trigger: "manual",
    startedAt: DAYS_AGO_2,
    durationMs: 184_000,
    status: "success",
    diffSummary: { filesAdded: 42, filesRemoved: 0, filesModified: 0, linesAdded: 6210, linesRemoved: 0 },
    agentLogs: [
      "Indexed 9 repositories (14,220 LOC)",
      "Generated workspace-level summary (8.4K tokens)",
      "Generated 9 repo-level wikis",
      "Generated llms.txt index",
    ],
  },
  {
    id: "job-2",
    workspaceId: WORKSPACE_ID,
    type: "sync",
    trigger: "pr-merge",
    startedAt: HOURS_AGO_2,
    durationMs: 42_000,
    status: "success",
    diffSummary: { filesAdded: 1, filesRemoved: 0, filesModified: 3, linesAdded: 58, linesRemoved: 12 },
    agentLogs: ["Detected PR merge on order-service", "Updated 3 pages"],
  },
];

const intelligenceDashboards: IntelligenceDashboard[] = [
  {
    id: "dash-health",
    workspaceId: WORKSPACE_ID,
    category: "health",
    title: "Code Health",
    widgets: [
      { id: "w1", title: "Cyclomatic Complexity (avg)", kind: "metric", value: "4.2", detail: "below threshold 10" },
      { id: "w2", title: "Tech Debt Ratio", kind: "metric", value: "7%" },
      { id: "w3", title: "Hotspots", kind: "list", value: "3 files in order-service/saga" },
    ],
  },
  {
    id: "dash-security",
    workspaceId: WORKSPACE_ID,
    category: "security",
    title: "Security Posture",
    widgets: [
      { id: "w1", title: "Known Vulnerabilities", kind: "metric", value: "0 critical, 2 medium" },
      { id: "w2", title: "Secret Scans", kind: "metric", value: "Clean" },
    ],
  },
  {
    id: "dash-tests",
    workspaceId: WORKSPACE_ID,
    category: "tests",
    title: "Test Coverage",
    widgets: [
      { id: "w1", title: "Overall Coverage", kind: "metric", value: "78%" },
      { id: "w2", title: "Uncovered Critical Flows", kind: "list", value: "saga-compensation, refund" },
    ],
  },
  {
    id: "dash-deps",
    workspaceId: WORKSPACE_ID,
    category: "dependencies",
    title: "Dependencies",
    widgets: [
      { id: "w1", title: "Outdated (major)", kind: "metric", value: "4" },
      { id: "w2", title: "Cross-repo Shared", kind: "metric", value: "shared-lib used by 7" },
    ],
  },
];

const chatThreads: ChatThread[] = [
  {
    id: "thread-saga",
    workspaceId: WORKSPACE_ID,
    title: "Saga Orchestration Details",
    createdAt: DAYS_AGO_1,
    groundedIn: "all",
    messages: [
      { id: "m1", role: "user", content: "How does order placement coordinate across services?" },
      {
        id: "m2",
        role: "assistant",
        content:
          "Order placement is a distributed saga coordinated by `order-service`. It uses the transactional outbox pattern to publish events to Kafka [1]. Compensation steps roll back reservations on failure [2].",
        citations: [
          { label: "1", target: "@catalog-service/outbox.py:42-58" },
          { label: "2", target: "@order-service/saga.py:120-180" },
        ],
      },
    ],
  },
  {
    id: "thread-tmforum",
    workspaceId: WORKSPACE_ID,
    title: "TMForum API Specs",
    createdAt: HOURS_AGO_2,
    groundedIn: "all",
    messages: [
      { id: "m1", role: "user", content: "Which TMForum APIs does catalog-service implement?" },
      {
        id: "m2",
        role: "assistant",
        content: "`catalog-service` implements TMF620 (Product Catalog Management) [1].",
        citations: [{ label: "1", target: "@catalog-service/api/tmf620.py:1-220" }],
      },
    ],
  },
  {
    id: "thread-shared-lib",
    workspaceId: WORKSPACE_ID,
    title: "Shared Library Usage",
    createdAt: HOURS_AGO_2,
    groundedIn: ["src-shared-lib"],
    messages: [
      { id: "m1", role: "user", content: "Which services depend on shared-lib?" },
      {
        id: "m2",
        role: "assistant",
        content: "All 7 backend services import from `shared-lib` for event schemas and TMForum models.",
      },
    ],
  },
];

const docsGenCards: DocsGenCard[] = [
  { id: "dg-structure-repomap", workspaceId: WORKSPACE_ID, bundle: "structure", title: "Semantic Repo Map", description: "Cross-repo dependency and data-flow map", state: "done", libraryItemId: "lib-1" },
  { id: "dg-structure-dbschema", workspaceId: WORKSPACE_ID, bundle: "structure", title: "DB Schema Docs", description: "Per-service database schema documentation", state: "done", libraryItemId: "lib-2" },
  { id: "dg-spec-srs", workspaceId: WORKSPACE_ID, bundle: "spec", title: "SRS (Reverse-Engineered)", description: "Software requirements specification", state: "done", libraryItemId: "lib-3" },
  { id: "dg-spec-apicatalog", workspaceId: WORKSPACE_ID, bundle: "spec", title: "Unified API Catalog", description: "Swagger/OpenAPI across all services", state: "done", libraryItemId: "lib-4" },
  { id: "dg-health-techdebt", workspaceId: WORKSPACE_ID, bundle: "health", title: "Tech Debt Audit", description: "SonarQube-equivalent static findings", state: "done", libraryItemId: "lib-5" },
  { id: "dg-health-security", workspaceId: WORKSPACE_ID, bundle: "health", title: "Security Report", description: "CodeQL-equivalent vulnerability scan", state: "done", libraryItemId: "lib-6" },
  { id: "dg-agentify-claude", workspaceId: WORKSPACE_ID, bundle: "agentify", title: "CLAUDE.md Bundle", description: "Agent project context files", state: "done", libraryItemId: "lib-7" },
  { id: "dg-agentify-skills", workspaceId: WORKSPACE_ID, bundle: "agentify", title: "Skill Guides", description: "Machine-readable skill definitions", state: "done", libraryItemId: "lib-8" },
  { id: "dg-memory-changelog", workspaceId: WORKSPACE_ID, bundle: "memory", title: "Multi-repo Changelog", description: "Consolidated release notes", state: "done", libraryItemId: "lib-9" },
];

const omniBoardArtifacts: OmniBoardArtifact[] = [
  { id: "ob-arch-podcast", workspaceId: WORKSPACE_ID, modality: "audio", variant: "Podcast", title: "Architecture Deep Dive (Two-Host)", durationSec: 732, libraryItemId: "lib-10" },
  { id: "ob-arch-slides", workspaceId: WORKSPACE_ID, modality: "text", variant: "Detailed Slides", title: "Onboarding Deck (42 slides)", libraryItemId: "lib-11" },
  { id: "ob-arch-video", workspaceId: WORKSPACE_ID, modality: "video", variant: "Summary Presentation", title: "10-Minute Architecture Walkthrough", durationSec: 612, libraryItemId: "lib-12" },
];

const libraryItems: LibraryItem[] = [
  { id: "lib-1", workspaceId: WORKSPACE_ID, title: "Semantic Repo Map.pdf", sourceTool: "docsgen", bundle: "structure", createdAt: DAYS_AGO_1, sizeBytes: 842_000, status: "current", mime: "application/pdf" },
  { id: "lib-2", workspaceId: WORKSPACE_ID, title: "DB Schema Docs.md", sourceTool: "docsgen", bundle: "structure", createdAt: DAYS_AGO_1, sizeBytes: 124_000, status: "current", mime: "text/markdown" },
  { id: "lib-3", workspaceId: WORKSPACE_ID, title: "SRS.pdf", sourceTool: "docsgen", bundle: "spec", createdAt: DAYS_AGO_1, sizeBytes: 512_000, status: "current", mime: "application/pdf" },
  { id: "lib-4", workspaceId: WORKSPACE_ID, title: "Unified API Catalog.json", sourceTool: "docsgen", bundle: "spec", createdAt: DAYS_AGO_1, sizeBytes: 92_000, status: "current", mime: "application/json" },
  { id: "lib-5", workspaceId: WORKSPACE_ID, title: "Tech Debt Audit.pdf", sourceTool: "docsgen", bundle: "health", createdAt: DAYS_AGO_1, sizeBytes: 310_000, status: "current", mime: "application/pdf" },
  { id: "lib-6", workspaceId: WORKSPACE_ID, title: "Security Report.pdf", sourceTool: "docsgen", bundle: "health", createdAt: DAYS_AGO_1, sizeBytes: 220_000, status: "current", mime: "application/pdf" },
  { id: "lib-7", workspaceId: WORKSPACE_ID, title: "CLAUDE.md Bundle.zip", sourceTool: "docsgen", bundle: "agentify", createdAt: DAYS_AGO_1, sizeBytes: 48_000, status: "current", mime: "application/zip" },
  { id: "lib-8", workspaceId: WORKSPACE_ID, title: "Skill Guides.zip", sourceTool: "docsgen", bundle: "agentify", createdAt: DAYS_AGO_1, sizeBytes: 36_000, status: "current", mime: "application/zip" },
  { id: "lib-9", workspaceId: WORKSPACE_ID, title: "Multi-repo Changelog.md", sourceTool: "docsgen", bundle: "memory", createdAt: DAYS_AGO_1, sizeBytes: 82_000, status: "current", mime: "text/markdown" },
  { id: "lib-10", workspaceId: WORKSPACE_ID, title: "Architecture Deep Dive Podcast.mp3", sourceTool: "omniboard", createdAt: HOURS_AGO_2, sizeBytes: 11_800_000, status: "current", mime: "audio/mpeg" },
  { id: "lib-11", workspaceId: WORKSPACE_ID, title: "Onboarding Deck.pdf", sourceTool: "omniboard", createdAt: HOURS_AGO_2, sizeBytes: 4_200_000, status: "current", mime: "application/pdf" },
  { id: "lib-12", workspaceId: WORKSPACE_ID, title: "Architecture Walkthrough.mp4", sourceTool: "omniboard", createdAt: HOURS_AGO_2, sizeBytes: 62_000_000, status: "current", mime: "video/mp4" },
];

export const microservicesWorkspaceFull: WorkspaceState = {
  workspace: {
    id: WORKSPACE_ID,
    name: "microservices-product-catalog",
    createdAt: "2026-04-01T10:00:00.000Z",
    lastActivityAt: HOURS_AGO_2,
    stage: "graduated",
    syncStatus: "live",
  },
  sources,
  wikiSummary: {
    workspaceId: WORKSPACE_ID,
    coverageScore: 100,
    lastSyncedAt: HOURS_AGO_2,
    syncStatus: "live",
    missingContextCount: 0,
    totalTokens: "1.2M",
    codeRatio: 0.86,
    activeRepoIds: REPOS.map((r) => r.id),
    inactiveRepoIds: [],
  },
  wikiPages,
  wikiJobs,
  intelligenceSummary: {
    workspaceId: WORKSPACE_ID,
    lastRefreshedAt: HOURS_AGO_2,
    freshness: "fresh",
  },
  intelligenceDashboards,
  chatThreads,
  docsGenCards,
  omniBoardArtifacts,
  libraryItems,
};

export const QUICK_POPULATE_SOURCES: Omit<Source, "workspaceId">[] = sources.map((s) => ({
  id: s.id,
  name: s.name,
  kind: s.kind,
  provider: s.provider,
  url: s.url,
  branch: s.branch,
  status: "indexing", // quick-populate starts in indexing, animates to indexed
  lastIndexedAt: NOW,
  autoSync: s.autoSync,
}));
