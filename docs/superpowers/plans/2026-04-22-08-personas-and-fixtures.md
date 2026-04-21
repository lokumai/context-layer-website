# Personas & Fixtures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce three demo personas (`full` / `partial` / `empty`) powered by a single canonical fixture set in `packages/mocks`. Personas are interactive starting points over the same data model — `empty` walks the wizard from zero, `partial` starts mid-journey with Wiki done, `full` presents the finished product. A reset action rewinds any persona back to its seed state.

**Architecture:**
- **One fixture source of truth.** `packages/mocks` exports a single canonical dataset (the "full" state of the `microservices-product-catalog` workspace: 9 repo sources displayed as separate repositories, Wiki, Intelligence, chat threads, DocsGen cards done, Library items).
- **Personas are slices, not separate datasets.** `partial` = subset of full (sources + Wiki only). `empty` = no workspaces. All derived from the canonical fixture by predicate.
- **State is mutable and persisted per-persona.** The Zustand store uses `persist` middleware with a persona-scoped localStorage key. UI actions (create workspace, add source, generate Wiki, generate card) mutate the persisted state. This makes every persona interactive — the user can "advance" it — and every persona resettable.
- **Reset rehydrates from fixture seed.** A "Reset workspace" action wipes the persisted key and re-seeds from `packages/mocks`.
- **Empty persona gets a one-click populate shortcut** so demoers don't type 9 GitHub URLs by hand.

**Tech Stack:** TypeScript, Bun workspaces, Zustand + persist middleware, Next.js 15 App Router, Auth.js v5, Vitest.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`, and the spec at `../specs/2026-04-22-context-layer-website-design.md`. Read them before implementing.

**Prerequisite:** Plan `2026-04-22-foundation.md` must be complete (Turborepo workspace scaffolded; `packages/mocks` package directory exists, even if empty — see foundation plan Task 4).

---

### Task 0: Clean Up Prior Personas Work

Prior scratch work exists on branch `feature/personas-mock-data` in the `.worktrees/personas-mock-data` worktree. It contains one stale commit and two untracked files that conflict with this plan. Everything else on that branch is legitimate scaffolding work and must be preserved.

**Files:**
- Delete (worktree): `.worktrees/personas-mock-data/docs/superpowers/plans/2026-04-22-01-update-auth-store.md`
- Delete (worktree): `.worktrees/personas-mock-data/apps/web/store/playground-store.test.ts`
- Revert (worktree): commit `d0db068` ("feat: handle full and empty personas in auth")
- Modify (worktree): rebase the branch so only legitimate commits remain

- [ ] **Step 1: Confirm branch state before touching anything**

Run: `git worktree list`
Expected: two entries — main at `/home/amirkia/Desktop/context-layer-website` and `feature/personas-mock-data` at `.worktrees/personas-mock-data`.

Run: `git -C .worktrees/personas-mock-data log --oneline main..HEAD`
Expected: 5 commits, with `d0db068 feat: handle full and empty personas in auth` appearing in the list. The other 4 commits are legitimate and must survive.

- [ ] **Step 2: Remove the two untracked stale files**

```bash
rm .worktrees/personas-mock-data/docs/superpowers/plans/2026-04-22-01-update-auth-store.md
rm .worktrees/personas-mock-data/apps/web/store/playground-store.test.ts
```

- [ ] **Step 3: Drop the stale personas commit via interactive rebase replacement**

Because `-i` is not allowed, use an equivalent non-interactive drop. The stale commit is `d0db068`. Cherry-pick-replay the commits after main while skipping it:

```bash
cd .worktrees/personas-mock-data
# Save the legit commits' hashes (all commits after main EXCEPT d0db068)
LEGIT=$(git log --reverse --format=%H main..HEAD | grep -v d0db068)
# Reset branch to main
git reset --hard main
# Replay legit commits in order
for c in $LEGIT; do git cherry-pick "$c"; done
```

Expected: branch `feature/personas-mock-data` now has 4 commits on top of main, the personas auth commit is gone. `auth.ts` should be back to the single-user mock from plan `02-state-auth.md` Task 1.

- [ ] **Step 4: Verify auth.ts is clean**

Run: `cat .worktrees/personas-mock-data/apps/web/auth.ts | grep -c 'full'`
Expected: `0` (no reference to the "full" persona string anymore).

- [ ] **Step 5: Commit the cleanup (no-op in code, but meaningful for history)**

No staged changes should remain — the rebase produced a clean tree. Do not create an empty commit. Just confirm:

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

---

### Task 1: Scaffold `packages/mocks`

The spec mentions `packages/mocks` as the data package. It doesn't exist yet. Create it as a proper Bun workspace package.

**Files:**
- Create: `packages/mocks/package.json`
- Create: `packages/mocks/tsconfig.json`
- Create: `packages/mocks/src/index.ts`

- [ ] **Step 1: Create `packages/mocks/package.json`**

```json
{
  "name": "@context-layer/mocks",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types.ts",
    "./personas": "./src/personas.ts"
  },
  "devDependencies": {
    "@context-layer/config": "workspace:*",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `packages/mocks/tsconfig.json`**

```json
{
  "extends": "@context-layer/config/tsconfig.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create placeholder `packages/mocks/src/index.ts`**

```typescript
export * from "./types";
export * from "./personas";
```

- [ ] **Step 4: Add the dependency to `apps/web/package.json`**

Add under `dependencies`:

```json
"@context-layer/mocks": "workspace:*"
```

- [ ] **Step 5: Install and commit**

Run: `bun install`
Expected: workspace resolves, no errors.

```bash
git add packages/mocks apps/web/package.json bun.lock
git commit -m "chore: scaffold @context-layer/mocks package"
```

---

### Task 2: Define Fixture Types

Every page that reads mock data reads these types. Keep the file flat — one interface per concept, no behavior.

**Files:**
- Create: `packages/mocks/src/types.ts`

- [ ] **Step 1: Write the types file**

```typescript
// packages/mocks/src/types.ts

export type Persona = "full" | "partial" | "empty";

export type SyncStatus = "live" | "syncing" | "queued" | "outdated";
export type WorkspaceStage = "empty" | "sources-only" | "wiki-ready" | "graduated";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string; // ISO
  lastActivityAt: string;
  stage: WorkspaceStage;
  syncStatus: SyncStatus;
}

export type SourceKind = "repo" | "file" | "discussion";
export type SourceProvider =
  | "github"
  | "gitlab"
  | "bitbucket"
  | "gitea"
  | "gdrive"
  | "notion"
  | "confluence"
  | "sharepoint"
  | "slack"
  | "discord"
  | "linear"
  | "jira"
  | "github-discussions"
  | "upload"
  | "url";

export type IndexStatus = "indexed" | "indexing" | "error";

export interface Source {
  id: string;
  workspaceId: string;
  name: string;
  kind: SourceKind;
  provider: SourceProvider;
  url?: string;
  branch?: string;
  status: IndexStatus;
  lastIndexedAt: string;
  autoSync: boolean;
  errorReason?: string;
}

export interface WikiSummary {
  workspaceId: string;
  coverageScore: number;
  lastSyncedAt: string;
  syncStatus: SyncStatus;
  missingContextCount: number;
  totalTokens: string; // e.g., "1.2M"
  codeRatio: number; // 0..1
  activeRepoIds: string[];
  inactiveRepoIds: string[];
}

export type WikiLayer = "workspace" | "repo" | "llms-txt";

export interface WikiPage {
  id: string; // e.g., "workspace/overview"
  workspaceId: string;
  layer: WikiLayer;
  repoId?: string; // undefined for workspace layer
  title: string;
  pathSegments: string[]; // tree location, e.g., ["catalog-service", "architecture"]
  markdown: string;
}

export type WikiJobType = "generate" | "sync" | "rebuild" | "delete";
export type WikiJobTrigger = "manual" | "commit" | "pr-merge" | "scheduled";
export type WikiJobStatus = "success" | "failed" | "running";

export interface WikiJob {
  id: string;
  workspaceId: string;
  type: WikiJobType;
  trigger: WikiJobTrigger;
  startedAt: string;
  durationMs: number;
  status: WikiJobStatus;
  diffSummary: { filesAdded: number; filesRemoved: number; filesModified: number; linesAdded: number; linesRemoved: number };
  agentLogs: string[];
}

export type IntelligenceFreshness = "fresh" | "stale" | "refreshing" | "never";
export type IntelligenceCategory = "health" | "security" | "tests" | "dependencies";

export interface IntelligenceSummary {
  workspaceId: string;
  lastRefreshedAt: string | null;
  freshness: IntelligenceFreshness;
}

export interface IntelligenceWidget {
  id: string;
  title: string;
  kind: "metric" | "chart" | "heatmap" | "list";
  value: string; // pre-rendered display value
  detail?: string;
}

export interface IntelligenceDashboard {
  id: string;
  workspaceId: string;
  category: IntelligenceCategory;
  title: string;
  widgets: IntelligenceWidget[];
}

export interface ChatCitation {
  label: string; // "1", "2" or "@catalog-service/outbox.py:42-58"
  target: string; // @path:range format
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
}

export interface ChatThread {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: string;
  groundedIn: "all" | string[]; // source ids
  messages: ChatMessage[];
}

export type DocsGenBundle =
  | "structure"
  | "spec"
  | "health"
  | "agentify"
  | "memory"
  | "research";

export type DocsGenCardState = "idle" | "running" | "done";

export interface DocsGenCard {
  id: string;
  workspaceId: string;
  bundle: DocsGenBundle;
  title: string;
  description: string;
  state: DocsGenCardState;
  libraryItemId?: string;
}

export type OmniBoardModality = "text" | "audio" | "video";

export interface OmniBoardArtifact {
  id: string;
  workspaceId: string;
  modality: OmniBoardModality;
  variant: string; // "Detailed Slides", "Podcast", etc.
  title: string;
  durationSec?: number;
  libraryItemId?: string;
}

export type LibrarySourceTool = "docsgen" | "omniboard" | "mcpgen";
export type LibraryItemStatus = "current" | "superseded" | "failed";

export interface LibraryItem {
  id: string;
  workspaceId: string;
  title: string;
  sourceTool: LibrarySourceTool;
  bundle?: DocsGenBundle;
  createdAt: string;
  sizeBytes: number;
  status: LibraryItemStatus;
  mime: string; // "application/pdf", "audio/mpeg", "text/markdown", etc.
}

export interface WorkspaceState {
  workspace: Workspace;
  sources: Source[];
  wikiSummary: WikiSummary | null;
  wikiPages: WikiPage[];
  wikiJobs: WikiJob[];
  intelligenceSummary: IntelligenceSummary;
  intelligenceDashboards: IntelligenceDashboard[];
  chatThreads: ChatThread[];
  docsGenCards: DocsGenCard[];
  omniBoardArtifacts: OmniBoardArtifact[];
  libraryItems: LibraryItem[];
}

export interface PersonaState {
  persona: Persona;
  workspaces: WorkspaceState[];
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/mocks/src/types.ts
git commit -m "feat(mocks): define fixture types"
```

---

### Task 3: Author the Canonical "Full" Fixture

This is the single source of demo content. Every persona derives from this. The fixture models a `microservices-product-catalog` workspace with 9 repo sources (each microservice displayed as a separate repo), a complete Wiki, Intelligence dashboards, three canned chat threads, all DocsGen cards done, and a populated Library.

**Files:**
- Create: `packages/mocks/src/fixtures/workspace-microservices.ts`
- Create: `packages/mocks/src/fixtures/index.ts`

The 9 microservice repos — from the `microservices-product-catalog` project, each shown as a separate repository in the demo:

1. `catalog-service` — core product catalog API
2. `pricing-service` — pricing rules and promotions
3. `inventory-service` — stock and reservations
4. `order-service` — order lifecycle + saga orchestrator
5. `customer-service` — customer profiles
6. `notification-service` — email/SMS dispatch
7. `search-service` — search index + query API
8. `shared-lib` — shared models, events, TMForum schemas
9. `catalog-ui` — Next.js storefront

- [ ] **Step 1: Write the workspace fixture**

```typescript
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
```

- [ ] **Step 2: Write the fixtures index barrel**

```typescript
// packages/mocks/src/fixtures/index.ts
export { microservicesWorkspaceFull, QUICK_POPULATE_SOURCES } from "./workspace-microservices";
```

- [ ] **Step 3: Export fixtures from package root**

Modify `packages/mocks/src/index.ts`:

```typescript
export * from "./types";
export * from "./personas";
export * from "./fixtures";
```

- [ ] **Step 4: Commit**

```bash
git add packages/mocks/src/fixtures packages/mocks/src/index.ts
git commit -m "feat(mocks): author canonical microservices workspace fixture"
```

---

### Task 4: Derive `partial` and `empty` Persona Seeds

Personas are derived from the canonical fixture, not authored separately. `partial` keeps sources + Wiki + Intelligence dashboards but strips Library/DocsGen/OmniBoard/Chat history. `empty` has zero workspaces entirely.

**Files:**
- Create: `packages/mocks/src/personas.ts`
- Create: `packages/mocks/src/personas.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// packages/mocks/src/personas.test.ts
import { describe, it, expect } from "vitest";
import { seedForPersona } from "./personas";

describe("seedForPersona", () => {
  it("full: returns the canonical workspace with all data", () => {
    const state = seedForPersona("full");
    expect(state.persona).toBe("full");
    expect(state.workspaces).toHaveLength(1);
    const ws = state.workspaces[0];
    expect(ws.workspace.stage).toBe("graduated");
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.wikiSummary).not.toBeNull();
    expect(ws.intelligenceDashboards.length).toBeGreaterThan(0);
    expect(ws.libraryItems.length).toBeGreaterThan(0);
    expect(ws.chatThreads.length).toBeGreaterThan(0);
  });

  it("partial: has sources + wiki but no library / no threads / cards idle", () => {
    const state = seedForPersona("partial");
    expect(state.persona).toBe("partial");
    expect(state.workspaces).toHaveLength(1);
    const ws = state.workspaces[0];
    expect(ws.workspace.stage).toBe("wiki-ready");
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.wikiSummary).not.toBeNull();
    expect(ws.intelligenceSummary.freshness).toBe("never");
    expect(ws.intelligenceDashboards).toHaveLength(0);
    expect(ws.libraryItems).toHaveLength(0);
    expect(ws.chatThreads).toHaveLength(0);
    expect(ws.docsGenCards.every((c) => c.state === "idle")).toBe(true);
    expect(ws.omniBoardArtifacts).toHaveLength(0);
  });

  it("empty: has zero workspaces", () => {
    const state = seedForPersona("empty");
    expect(state.persona).toBe("empty");
    expect(state.workspaces).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Verify the test fails**

Run: `bun test packages/mocks/src/personas.test.ts` (or `bunx vitest run packages/mocks/src/personas.test.ts`)
Expected: FAIL — `seedForPersona` is not defined.

- [ ] **Step 3: Implement `seedForPersona`**

```typescript
// packages/mocks/src/personas.ts
import type { Persona, PersonaState, WorkspaceState, DocsGenCard } from "./types";
import { microservicesWorkspaceFull } from "./fixtures/workspace-microservices";

function toPartialWorkspace(full: WorkspaceState): WorkspaceState {
  const idleCards: DocsGenCard[] = full.docsGenCards.map((c) => ({
    id: c.id,
    workspaceId: c.workspaceId,
    bundle: c.bundle,
    title: c.title,
    description: c.description,
    state: "idle",
  }));

  return {
    workspace: { ...full.workspace, stage: "wiki-ready" },
    sources: full.sources,
    wikiSummary: full.wikiSummary,
    wikiPages: full.wikiPages,
    wikiJobs: full.wikiJobs,
    intelligenceSummary: {
      workspaceId: full.workspace.id,
      lastRefreshedAt: null,
      freshness: "never",
    },
    intelligenceDashboards: [],
    chatThreads: [],
    docsGenCards: idleCards,
    omniBoardArtifacts: [],
    libraryItems: [],
  };
}

export function seedForPersona(persona: Persona): PersonaState {
  switch (persona) {
    case "full":
      return { persona, workspaces: [microservicesWorkspaceFull] };
    case "partial":
      return { persona, workspaces: [toPartialWorkspace(microservicesWorkspaceFull)] };
    case "empty":
      return { persona, workspaces: [] };
  }
}

export function isValidPersona(value: string): value is Persona {
  return value === "full" || value === "partial" || value === "empty";
}
```

- [ ] **Step 4: Install vitest in the mocks package**

Add to `packages/mocks/package.json` under `devDependencies`:

```json
"vitest": "^1.6.0"
```

Run: `bun install`

- [ ] **Step 5: Verify the test passes**

Run: `bunx vitest run packages/mocks/src/personas.test.ts`
Expected: PASS — 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add packages/mocks/src/personas.ts packages/mocks/src/personas.test.ts packages/mocks/package.json bun.lock
git commit -m "feat(mocks): derive partial and empty persona seeds"
```

---

### Task 5: Rewrite `auth.ts` for Three Personas

Replace the single-user mock with a credentials provider that accepts `full`, `partial`, or `empty` as the username. Persona is carried on the session so the store can hydrate from it.

**Files:**
- Modify: `apps/web/auth.ts`
- Create: `apps/web/auth.test.ts`

- [ ] **Step 1: Write failing test for `authorize`**

```typescript
// apps/web/auth.test.ts
import { describe, it, expect } from "vitest";
import { authorizePersona } from "./auth";

describe("authorizePersona", () => {
  it("accepts 'full'", () => {
    const user = authorizePersona({ username: "full" });
    expect(user).toMatchObject({ id: "full", persona: "full" });
  });
  it("accepts 'partial'", () => {
    const user = authorizePersona({ username: "partial" });
    expect(user).toMatchObject({ id: "partial", persona: "partial" });
  });
  it("accepts 'empty'", () => {
    const user = authorizePersona({ username: "empty" });
    expect(user).toMatchObject({ id: "empty", persona: "empty" });
  });
  it("rejects anything else", () => {
    expect(authorizePersona({ username: "other" })).toBeNull();
  });
});
```

- [ ] **Step 2: Verify test fails**

Run: `bunx vitest run apps/web/auth.test.ts`
Expected: FAIL — `authorizePersona` not exported.

- [ ] **Step 3: Rewrite `auth.ts`**

```typescript
// apps/web/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isValidPersona, type Persona } from "@context-layer/mocks";

export interface PersonaUser {
  id: Persona;
  name: string;
  email: string;
  persona: Persona;
}

const personaDisplay: Record<Persona, { name: string; email: string }> = {
  full: { name: "Full Demo", email: "full@contextlayer.io" },
  partial: { name: "Partial Demo", email: "partial@contextlayer.io" },
  empty: { name: "Empty Demo", email: "empty@contextlayer.io" },
};

export function authorizePersona(input: { username?: string | null }): PersonaUser | null {
  const value = (input.username ?? "").trim().toLowerCase();
  if (!isValidPersona(value)) return null;
  const display = personaDisplay[value];
  return { id: value, persona: value, name: display.name, email: display.email };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Persona", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        return authorizePersona({ username: credentials?.username as string | undefined });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "persona" in user) {
        token.persona = (user as PersonaUser).persona;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.persona) {
        (session.user as { persona?: Persona }).persona = token.persona as Persona;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
});
```

- [ ] **Step 4: Verify test passes**

Run: `bunx vitest run apps/web/auth.test.ts`
Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add apps/web/auth.ts apps/web/auth.test.ts
git commit -m "feat(auth): support full/partial/empty personas"
```

---

### Task 6: Login Page with Persona Selector

The `/login` page offers three one-click buttons (no password needed — this is a demo). Typing a custom username is still allowed as a fallback.

**Files:**
- Create: `apps/web/app/login/page.tsx`

- [ ] **Step 1: Build the login page**

```tsx
// apps/web/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PERSONAS = [
  { id: "full", title: "Full", subtitle: "Complete demo — every page populated." },
  { id: "partial", title: "Partial", subtitle: "Sources + Wiki done; generate the rest." },
  { id: "empty", title: "Empty", subtitle: "Zero state — walk the first-time wizard." },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function enter(persona: string) {
    setBusy(persona);
    const res = await signIn("credentials", {
      username: persona,
      password: "demo",
      redirect: false,
    });
    if (res?.ok) router.push("/play/workspaces");
    else setBusy(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Choose a Demo Persona</h1>
      <p className="inter-airy text-[18px] text-neutral-600 mb-12 text-center max-w-xl">
        Each persona starts the playground at a different point in the journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => enter(p.id)}
            disabled={busy !== null}
            className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all text-left disabled:opacity-50 min-h-[220px] flex flex-col"
          >
            <h2 className="font-waldenburg text-[28px] mb-3 capitalize">{p.title}</h2>
            <p className="text-neutral-500 text-[15px] flex-1">{p.subtitle}</p>
            <span className="mt-6 font-waldenburg-bold uppercase tracking-[0.7px] text-[13px]">
              {busy === p.id ? "Signing in…" : "Enter →"}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Install next-auth/react peer if needed**

Run: `cd apps/web && bun add next-auth@beta` (idempotent if already installed)

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/login
git commit -m "feat(auth): add login page with persona selector"
```

---

### Task 7: Extend the Playground Store (persona + hydration + persistence)

The Zustand store becomes the single in-memory model of the current persona's state. It is persisted to localStorage under a persona-scoped key so progress survives reload. On login, the store hydrates from the persisted key if present, else from the persona seed.

**Files:**
- Modify: `apps/web/store/playground-store.ts`
- Create: `apps/web/store/playground-store.test.ts`

- [ ] **Step 1: Install `zustand` persist middleware (already in zustand core)**

No install needed — zustand ships `persist`.

- [ ] **Step 2: Write failing tests**

```typescript
// apps/web/store/playground-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { usePlaygroundStore } from "./playground-store";

describe("usePlaygroundStore", () => {
  beforeEach(() => {
    usePlaygroundStore.getState().__resetAll();
    localStorage.clear();
  });

  it("hydrates from 'full' persona seed", () => {
    usePlaygroundStore.getState().hydrateFromPersona("full");
    const s = usePlaygroundStore.getState();
    expect(s.persona).toBe("full");
    expect(s.workspaces).toHaveLength(1);
    expect(s.workspaces[0].sources.length).toBeGreaterThanOrEqual(9);
    expect(s.workspaces[0].libraryItems.length).toBeGreaterThan(0);
  });

  it("hydrates from 'empty' persona seed with zero workspaces", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    const s = usePlaygroundStore.getState();
    expect(s.persona).toBe("empty");
    expect(s.workspaces).toHaveLength(0);
  });

  it("createWorkspace adds to empty persona", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    usePlaygroundStore.getState().createWorkspace("my-workspace");
    expect(usePlaygroundStore.getState().workspaces).toHaveLength(1);
    expect(usePlaygroundStore.getState().workspaces[0].workspace.name).toBe("my-workspace");
    expect(usePlaygroundStore.getState().workspaces[0].workspace.stage).toBe("empty");
  });

  it("addQuickPopulateSources adds the 9 microservice repos", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    const wsId = usePlaygroundStore.getState().createWorkspace("demo");
    usePlaygroundStore.getState().addQuickPopulateSources(wsId);
    const ws = usePlaygroundStore.getState().workspaces.find((w) => w.workspace.id === wsId)!;
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.workspace.stage).toBe("sources-only");
  });

  it("resetActiveWorkspace rehydrates from persona seed", () => {
    usePlaygroundStore.getState().hydrateFromPersona("full");
    const wsId = "microservices-product-catalog";
    usePlaygroundStore.getState().setActiveWorkspace(wsId);
    // Mutate: remove all library items
    usePlaygroundStore.setState((s) => ({
      ...s,
      workspaces: s.workspaces.map((w) =>
        w.workspace.id === wsId ? { ...w, libraryItems: [] } : w
      ),
    }));
    expect(usePlaygroundStore.getState().workspaces[0].libraryItems).toHaveLength(0);
    // Reset
    usePlaygroundStore.getState().resetActiveWorkspace();
    expect(usePlaygroundStore.getState().workspaces[0].libraryItems.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Verify tests fail**

Run: `bunx vitest run apps/web/store/playground-store.test.ts`
Expected: FAIL — methods not defined.

- [ ] **Step 4: Rewrite the store**

```typescript
// apps/web/store/playground-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Persona,
  type WorkspaceState,
  type SyncStatus,
  seedForPersona,
  QUICK_POPULATE_SOURCES,
} from "@context-layer/mocks";

interface PlaygroundState {
  persona: Persona | null;
  workspaces: WorkspaceState[];
  activeWorkspaceId: string | null;
  syncStatus: SyncStatus;

  hydrateFromPersona: (persona: Persona) => void;
  setActiveWorkspace: (id: string | null) => void;
  setSyncStatus: (status: SyncStatus) => void;

  createWorkspace: (name: string) => string; // returns new workspace id
  addQuickPopulateSources: (workspaceId: string) => void;
  generateWiki: (workspaceId: string) => void;
  generateIntelligence: (workspaceId: string) => void;
  runDocsGenCard: (workspaceId: string, cardId: string) => void;

  resetActiveWorkspace: () => void;
  __resetAll: () => void; // test helper
}

function emptyWorkspaceState(id: string, name: string): WorkspaceState {
  const now = new Date().toISOString();
  return {
    workspace: {
      id,
      name,
      createdAt: now,
      lastActivityAt: now,
      stage: "empty",
      syncStatus: "live",
    },
    sources: [],
    wikiSummary: null,
    wikiPages: [],
    wikiJobs: [],
    intelligenceSummary: { workspaceId: id, lastRefreshedAt: null, freshness: "never" },
    intelligenceDashboards: [],
    chatThreads: [],
    docsGenCards: [],
    omniBoardArtifacts: [],
    libraryItems: [],
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || `workspace-${Date.now()}`;
}

const STORAGE_NAME = "playground";

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      persona: null,
      workspaces: [],
      activeWorkspaceId: null,
      syncStatus: "live",

      hydrateFromPersona: (persona) => {
        const current = get().persona;
        // If we already have persisted state for this persona, keep it — user progress survives.
        if (current === persona) return;
        const seed = seedForPersona(persona);
        set({
          persona,
          workspaces: seed.workspaces,
          activeWorkspaceId: seed.workspaces[0]?.workspace.id ?? null,
          syncStatus: "live",
        });
      },

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      setSyncStatus: (status) => set({ syncStatus: status }),

      createWorkspace: (name) => {
        const id = slugify(name);
        set((s) => ({
          ...s,
          workspaces: [...s.workspaces, emptyWorkspaceState(id, name)],
          activeWorkspaceId: id,
        }));
        return id;
      },

      addQuickPopulateSources: (workspaceId) => {
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  workspace: { ...ws.workspace, stage: "sources-only", lastActivityAt: new Date().toISOString() },
                  sources: QUICK_POPULATE_SOURCES.map((src) => ({ ...src, workspaceId })),
                }
          ),
        }));
      },

      generateWiki: (workspaceId) => {
        const full = seedForPersona("full").workspaces[0];
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  workspace: { ...ws.workspace, stage: "wiki-ready" },
                  wikiSummary: full.wikiSummary,
                  wikiPages: full.wikiPages,
                  wikiJobs: full.wikiJobs,
                }
          ),
        }));
      },

      generateIntelligence: (workspaceId) => {
        const full = seedForPersona("full").workspaces[0];
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  intelligenceSummary: full.intelligenceSummary,
                  intelligenceDashboards: full.intelligenceDashboards,
                }
          ),
        }));
      },

      runDocsGenCard: (workspaceId, cardId) => {
        const full = seedForPersona("full").workspaces[0];
        const fullCard = full.docsGenCards.find((c) => c.id === cardId);
        const libItem = fullCard?.libraryItemId
          ? full.libraryItems.find((l) => l.id === fullCard.libraryItemId)
          : undefined;
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  docsGenCards: ws.docsGenCards.map((c) =>
                    c.id !== cardId
                      ? c
                      : { ...c, state: "done", libraryItemId: fullCard?.libraryItemId ?? c.libraryItemId }
                  ),
                  libraryItems: libItem && !ws.libraryItems.some((i) => i.id === libItem.id)
                    ? [...ws.libraryItems, libItem]
                    : ws.libraryItems,
                }
          ),
        }));
      },

      resetActiveWorkspace: () => {
        const { persona, activeWorkspaceId } = get();
        if (!persona) return;
        const seed = seedForPersona(persona);
        const seedWs = seed.workspaces.find((w) => w.workspace.id === activeWorkspaceId);
        if (!seedWs) {
          // Active workspace isn't in seed (created by user) — wipe it entirely
          set((s) => ({
            ...s,
            workspaces: s.workspaces.filter((w) => w.workspace.id !== activeWorkspaceId),
            activeWorkspaceId: null,
          }));
          return;
        }
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((w) => (w.workspace.id === seedWs.workspace.id ? seedWs : w)),
        }));
      },

      __resetAll: () => {
        set({ persona: null, workspaces: [], activeWorkspaceId: null, syncStatus: "live" });
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        persona: s.persona,
        workspaces: s.workspaces,
        activeWorkspaceId: s.activeWorkspaceId,
      }),
    }
  )
);
```

**Persona isolation without a persona-scoped key:** the store persists `persona` as part of state. On login, `PersonaHydrator` calls `hydrateFromPersona(sessionPersona)`, which no-ops when the persisted persona already matches (preserving user progress) or overwrites when it differs (switching personas wipes the previous slate). The sign-out handler (Task 10) explicitly removes the persisted key so the next login always starts from seed.

- [ ] **Step 5: Verify tests pass**

Run: `bunx vitest run apps/web/store/playground-store.test.ts`
Expected: PASS — 5 tests green.

- [ ] **Step 6: Commit**

```bash
git add apps/web/store
git commit -m "feat(store): persona hydration, persistence, and mutations"
```

---

### Task 8: Hydrate the Store on Login

The playground layout must hydrate the store from the session's persona on first mount. This ensures a user landing on any `/play/*` URL gets the right initial state.

**Files:**
- Modify: `apps/web/app/play/layout.tsx`
- Create: `apps/web/components/layout/persona-hydrator.tsx`

- [ ] **Step 1: Create the hydrator client component**

```tsx
// apps/web/components/layout/persona-hydrator.tsx
"use client";

import { useEffect } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { isValidPersona, type Persona } from "@context-layer/mocks";

export function PersonaHydrator({ persona }: { persona: Persona }) {
  const current = usePlaygroundStore((s) => s.persona);
  const hydrate = usePlaygroundStore((s) => s.hydrateFromPersona);

  useEffect(() => {
    if (!isValidPersona(persona)) return;
    if (current !== persona) hydrate(persona);
  }, [persona, current, hydrate]);

  return null;
}
```

- [ ] **Step 2: Mount the hydrator in the play layout**

Modify `apps/web/app/play/layout.tsx`:

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import { PersonaHydrator } from "@/components/layout/persona-hydrator";
import { isValidPersona } from "@context-layer/mocks";

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const raw = (session.user as { persona?: string } | undefined)?.persona;
  const persona = isValidPersona(raw ?? "") ? (raw as "full" | "partial" | "empty") : null;
  if (!persona) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PersonaHydrator persona={persona} />
      <TopNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/play/layout.tsx apps/web/components/layout/persona-hydrator.tsx
git commit -m "feat(play): hydrate store from session persona on layout mount"
```

---

### Task 9: Navbar — Persona Badge + Reset Action

Add a small persona badge to the right region of the navbar (next to the profile circle) and a "Reset Workspace" item under the profile dropdown. Reset is available for all personas so demoers can replay anytime.

**Files:**
- Modify: `apps/web/components/layout/top-navbar.tsx`

- [ ] **Step 1: Update the navbar component**

Replace the Right Region block in `top-navbar.tsx` with:

```tsx
{/* Right Region */}
<div className="flex items-center gap-3">
  {persona && (
    <span
      className="text-[11px] font-waldenburg-bold uppercase tracking-[0.7px] px-3 py-1 rounded-full bg-neutral-100 text-neutral-600"
      title="Demo persona"
    >
      {persona}
    </span>
  )}
  <button
    onClick={() => {
      if (confirm("Reset the active workspace to its persona seed?")) resetActiveWorkspace();
    }}
    className="text-[13px] font-medium text-neutral-500 hover:text-black px-3 py-1 rounded-full hover:bg-neutral-100"
    title="Reset active workspace"
  >
    Reset
  </button>
  <div className="w-8 h-8 rounded-full bg-neutral-200" title="Profile" />
</div>
```

And update the hook destructure at the top of the component:

```tsx
const { activeWorkspaceId, syncStatus, persona, workspaces, resetActiveWorkspace } = usePlaygroundStore();
const active = workspaces.find((w) => w.workspace.id === activeWorkspaceId);
const hasSources = (active?.sources.length ?? 0) > 0;
const hasWiki = active?.wikiSummary != null;
```

Also update the center-region gating to use `hasSources` / `hasWiki` derived from the active workspace (replaces the old store flags that are now computed from state):

```tsx
{activeWorkspaceId && (
  <div className="hidden md:flex items-center gap-6">
    <Link href={`/play/${activeWorkspaceId}/sources`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Sources</Link>
    {hasWiki ? (
      <>
        <Link href={`/play/${activeWorkspaceId}/knowledge/wiki`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Wiki</Link>
        <Link href={`/play/${activeWorkspaceId}/knowledge/intelligence`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Intelligence</Link>
        <Link href={`/play/${activeWorkspaceId}/chatbot`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Chatbot</Link>
        <Link href={`/play/${activeWorkspaceId}/generate/docsgen`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Generate</Link>
        <Link href={`/play/${activeWorkspaceId}/library`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Library</Link>
      </>
    ) : hasSources ? (
      <span className="text-neutral-300 text-[15px] cursor-not-allowed" title="Generate Wiki first">Knowledge Locked</span>
    ) : (
      <span className="text-neutral-300 text-[15px] cursor-not-allowed" title="Add a source first">Locked</span>
    )}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/layout/top-navbar.tsx
git commit -m "feat(navbar): persona badge, reset action, state-derived gating"
```

---

### Task 10: Session Boundary — Logout Clears Persona Key

When the user signs out, the persona-scoped localStorage key is cleared so the next login sees a fresh seed. (If the user wants to preserve progress across sessions, they can just not log out — persist does its job automatically.)

**Files:**
- Create: `apps/web/app/api/signout/route.ts`
- Modify: `apps/web/components/layout/top-navbar.tsx`

- [ ] **Step 1: Add a sign-out handler that clears the persona key**

Because Auth.js handles the session cookie, we only need to clear the localStorage key client-side. Add a client-side handler to the navbar's profile area. Extend Task 9's Right Region with a sign-out button:

```tsx
<button
  onClick={async () => {
    localStorage.removeItem("playground");
    usePlaygroundStore.getState().__resetAll();
    await signOut({ callbackUrl: "/login" });
  }}
  className="text-[13px] font-medium text-neutral-500 hover:text-black px-3 py-1 rounded-full hover:bg-neutral-100"
>
  Sign out
</button>
```

Import `signOut` from `next-auth/react` at the top of `top-navbar.tsx`.

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/layout/top-navbar.tsx
git commit -m "feat(auth): clear persona state on sign-out"
```

---

### Task 11: End-to-End Smoke Test

Add a Playwright smoke test that exercises all three personas and the reset action. This locks the contract and prevents regressions as pages are built out in plans 03–06.

**Files:**
- Create: `apps/web/e2e/personas.spec.ts`
- Modify: `apps/web/package.json` (add playwright scripts)

- [ ] **Step 1: Install Playwright**

Run: `cd apps/web && bun add -d @playwright/test && bunx playwright install chromium`

- [ ] **Step 2: Create the smoke test**

```typescript
// apps/web/e2e/personas.spec.ts
import { test, expect } from "@playwright/test";

test.describe("personas", () => {
  test("full persona: Library is populated immediately", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /full/i }).click();
    await expect(page).toHaveURL(/\/play\/workspaces/);
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    await page.getByRole("link", { name: /library/i }).click();
    await expect(page.locator("[data-library-item]")).toHaveCount(12, { timeout: 5_000 });
  });

  test("empty persona: lands on empty workspaces; quick-populate works", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /empty/i }).click();
    await expect(page.getByText(/Create your first workspace/i)).toBeVisible();
    await page.getByRole("button", { name: /create workspace/i }).click();
    await page.getByPlaceholder(/workspace name/i).fill("demo");
    await page.getByRole("button", { name: /create/i }).click();
    await page.getByRole("button", { name: /quick-populate demo sources/i }).click();
    await expect(page.locator("[data-source-card]").first()).toBeVisible();
  });

  test("partial persona: wiki visible, library empty, DocsGen cards idle", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /partial/i }).click();
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    await page.getByRole("link", { name: /wiki/i }).click();
    await expect(page.getByText(/Wiki Status/i)).toBeVisible();
    await page.getByRole("link", { name: /library/i }).click();
    await expect(page.getByText(/Generate your first artifact/i)).toBeVisible();
  });

  test("reset action: full persona resets to seed after mutation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /full/i }).click();
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    // Mutate: delete a source via UI (expect delete action wired later) — skipped in MVP.
    // Reset:
    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /reset/i }).click();
    await expect(page.locator("[data-source-card]").first()).toBeVisible();
  });
});
```

- [ ] **Step 3: Add playwright config**

Create `apps/web/playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:3000" },
});
```

- [ ] **Step 4: Note on timing**

This smoke test depends on pages built in plans 03–06. It will fail until those are complete. Skip execution until the dependent plans are in. Use `test.describe.skip` initially and remove the skip at the end of the 06 plan, or run it as the final verification of the full rollout.

- [ ] **Step 5: Commit**

```bash
git add apps/web/e2e apps/web/playwright.config.ts apps/web/package.json bun.lock
git commit -m "test(e2e): persona smoke tests (skipped until pages land)"
```

---

### Task 12: Final Verification

- [ ] **Step 1: Run unit tests**

Run: `bunx vitest run`
Expected: PASS — personas, auth, store tests all green.

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: no type errors, Next.js build succeeds.

- [ ] **Step 3: Manual smoke**

Run: `bun run dev`
Visit `/login`. Click each persona in turn. Verify:
- `full` → lands in Workspaces with 1 card; navbar Reset button visible; Library has 12 items.
- `partial` → 1 workspace card; Wiki accessible; Library empty state; DocsGen cards all Idle.
- `empty` → Workspaces empty state; create workspace; Sources empty state; quick-populate button adds 9 repos.

- [ ] **Step 4: Final commit (if any tweaks)**

```bash
git status
# commit any stray fixes with meaningful messages
```

---

## Cross-Plan Dependencies

This plan is consumed by the following downstream plans. Implementing a downstream plan means reading its data from the store/fixtures defined here, never inlining mock data:

| Plan | Consumes |
|---|---|
| `03-workspaces-shell.md` | `workspaces[]` from store; create action for empty persona |
| `04-sources-knowledge.md` | `sources[]`, `wikiSummary`, `wikiPages[]`, `wikiJobs[]`, `intelligenceDashboards[]`; `addQuickPopulateSources`, `generateWiki`, `generateIntelligence` actions |
| `05-chatbot-omniboard.md` | `chatThreads[]`, `omniBoardArtifacts[]` |
| `06-docsgen-library.md` | `docsGenCards[]`, `libraryItems[]`; `runDocsGenCard` action |

The rule: pages render from store state, and state derives from `seedForPersona(persona)` plus user-driven mutations. No component inlines fixture content.
