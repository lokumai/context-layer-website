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

const wikiPages: WikiPage[] = [
  {
    id: "workspace/overview",
    workspaceId: WORKSPACE_ID,
    layer: "workspace",
    title: "Workspace Overview",
    pathSegments: ["Overview"],
    markdown: `# microservices-product-catalog — Overview\n\nA TMForum-compatible product catalog system comprising 9 repositories and 7 microservices.\n\n## Saga Flows\n\nThe order placement saga spans 4 services: \`order-service\` → \`inventory-service\` → \`pricing-service\` → \`notification-service\`. Each step uses the transactional outbox pattern published via Kafka.\n\n\`\`\`mermaid\nsequenceDiagram\n  Client->>order-service: POST /orders\n  order-service->>inventory-service: Reserve stock\n  inventory-service-->>order-service: OK\n  order-service->>pricing-service: Calculate total\n  pricing-service-->>order-service: OK\n  order-service->>notification-service: Send confirmation\n\`\`\``,
  },
  ...REPOS.map((r) => ({
    id: `repo/${r.id}/architecture`,
    workspaceId: WORKSPACE_ID,
    layer: "repo" as const,
    repoId: r.id,
    title: `${r.id} — Architecture`,
    pathSegments: [r.id, "Architecture"],
    markdown: `# ${r.id}\n\n${r.desc}\n\n## Entry Points\n\n\`\`\`python\n# Representative example (see src/app/main.py)\napp = FastAPI(title="${r.id}")\n\`\`\``,
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
