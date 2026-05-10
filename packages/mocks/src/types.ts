// Type contract for @context-layer/mocks.
// Consumers (Zustand store, Next.js routes, the MCP server) import ONLY from here
// and from ./loaders/*. The on-disk layout under data/ is an implementation detail.

// ────────────────────────────── Workspace / Sources ──────────────────────────────

export type SyncStatus = "live" | "syncing" | "queued" | "outdated";

export type IndexingStatus = "indexed" | "indexing" | "error";

export type SourceKind = "code" | "file" | "discussion";

export type SourceCategory =
  | "github"
  | "gitlab"
  | "bitbucket"
  | "gitea"
  | "upload"
  | "url"
  | "notion"
  | "confluence"
  | "drive"
  | "sharepoint"
  | "slack"
  | "discord"
  | "linear"
  | "jira"
  | "pdf";

/**
 * Whether the indexed source is in lock-step with the workspace's Wiki.
 * `synced`   — Wiki reflects this source's current state.
 * `outdated` — Source has changed (or was just added) and the Wiki hasn't been re-generated yet.
 * `undefined` — unknown / not applicable (used for tests + stale persisted state).
 */
export type KnowledgeSyncStatus = "synced" | "outdated";

export interface Source {
  id: string;
  name: string;
  kind: SourceKind;
  category: SourceCategory;
  /** Canonical URL. For the 9 microservice sources this points into a subpath of the real monorepo. */
  url: string;
  /** Human-readable sub-path label (e.g. `services/pricing`). */
  path: string;
  status: IndexingStatus;
  autoSync: boolean;
  lastIndexed: string; // ISO
  lineCount: number;
  tokenCount: number;
  primaryLanguage: string;
  description: string;
  /** Optional — runtime-stamped at bootstrap (full persona) or by Wiki Configure's Force Sync. */
  knowledgeSync?: KnowledgeSyncStatus;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  lastActivity: string;
  sourceCount: number;
  syncStatus: SyncStatus;
  syncStrategy: "per-commit" | "per-pr-merge" | "hourly" | "daily" | "weekly" | "manual";
  description: string;
}

// ──────────────────────────────────── Wiki ──────────────────────────────────────

export interface WikiTreeNode {
  /** Stable slug used in URLs. */
  slug: string;
  title: string;
  /** Path to the markdown file under data/repos/<repoId>/wiki/. */
  file: string;
  children?: WikiTreeNode[];
}

export interface WikiTree {
  repoId: string;
  nodes: WikiTreeNode[];
}

export interface WikiPage {
  repoId: string;
  slug: string;
  title: string;
  markdown: string;
  /** Approximate token count. */
  tokenCount: number;
}

export interface WorkspaceNarrative {
  /** Markdown body of the workspace-level wiki (single page, ≤~10K tokens). */
  markdown: string;
  tokenCount: number;
  sections: Array<{ slug: string; title: string }>;
}

export interface SagaFlowsDoc {
  markdown: string;
  tokenCount: number;
}

export interface LlmsTxt {
  /** Repo scope; `null` means workspace-wide master index. */
  repoId: string | null;
  markdown: string;
}

// ────────────────────────────── Intelligence ────────────────────────────────────

export interface HealthMetric {
  /** Overall tech-debt score, 0–100 (higher = healthier). */
  overallScore: number;
  perRepo: Array<{
    repoId: string;
    score: number;
    fragileAreas: string[];
    architectureViolations: number;
    codeSmells: number;
  }>;
  summary: string;
}

export interface SecurityFinding {
  id: string;
  repoId: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  file: string;
  line: number;
  description: string;
}

export interface SecurityReport {
  findings: SecurityFinding[];
  summary: { critical: number; high: number; medium: number; low: number; info: number };
}

export interface CoveragePerFile {
  file: string;
  lineCoverage: number;
  branchCoverage: number;
}

export interface CoverageReport {
  overall: number;
  perRepo: Array<{
    repoId: string;
    lineCoverage: number;
    branchCoverage: number;
    criticalGaps: string[];
    files: CoveragePerFile[];
  }>;
}

export interface DependencyNode {
  name: string;
  version: string;
  repoId: string;
  outdated: boolean;
  risk: "none" | "low" | "medium" | "high";
  latestVersion?: string;
}

export interface DependencyReport {
  nodes: DependencyNode[];
  crossRepoCount: number;
  outdatedCount: number;
  summary: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  /** Repo these nodes belong to; empty string for workspace-level nodes. */
  repoId: string;
  type: "service" | "module" | "datastore" | "external";
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  kind: "calls" | "publishes" | "subscribes" | "reads" | "writes" | "depends";
  label?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// ─────────────────────────────── DocsGen artifacts ──────────────────────────────

export type ArtifactBundle =
  | "structure-architecture"
  | "specification-knowledge"
  | "health-risk"
  | "agentify"
  | "institutional-memory"
  | "research-docs";

export type ArtifactFormat = "markdown" | "pdf" | "json" | "slides" | "audio" | "video";

export type ArtifactTool = "docsgen" | "omniboard" | "mcpgen";

export interface Artifact {
  id: string;
  bundle: ArtifactBundle;
  title: string;
  description: string;
  /** Which card inside the bundle this represents (slug). */
  cardSlug: string;
  createdAt: string;
  sizeBytes: number;
  /** Output format of the source-of-truth file. */
  format: ArtifactFormat;
  status: "current" | "superseded" | "failed";
  sourceRepos: string[];
  /** Markdown content preloaded for convenience. */
  markdown: string;
  /** Which Generate tool produced this. Defaults to "docsgen" for Phase 3 mocks. */
  tool?: ArtifactTool;
}

// ─────────────────────────────────── Chatbot ────────────────────────────────────

/** Citation primitive — shared by Wiki content and Chatbot answers (UI_UX §9.7). */
export interface Citation {
  id: string;
  kind: "wiki" | "code" | "file";
  /** e.g. `wiki://pricing-service/architecture#events` */
  anchor: string;
  /** For `kind: "code"` — the source (repo) ID. */
  repoId?: string;
  /** For `kind: "code"` — file path inside the repo. */
  path?: string;
  /** For `kind: "code"` — line range `[start, end]` (1-indexed, inclusive). */
  lineRange?: [number, number];
  /** Short label shown in the rendered chip. */
  label: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Citation[];
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  /** Optional grounding hint shown as a chip. */
  groundedIn?: "wiki" | "codebase" | "files" | "all";
}

export interface CannedQAPair {
  id: string;
  question: string;
  answer: string;
  citations: Citation[];
}

// ────────────────────────────────── Activity ────────────────────────────────────

export type JobType = "generate" | "sync" | "regenerate" | "delete";

export type JobTrigger = "manual" | "commit" | "pr-merge" | "scheduled";

export type JobStatus = "success" | "failed" | "cancelled" | "in-progress";

export interface Job {
  id: string;
  type: JobType;
  trigger: JobTrigger;
  status: JobStatus;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  repoIds: string[];
  summary: string;
  /** Per-step agent logs, normalized per UI_UX §9.5. */
  steps: Array<{ name: string; status: JobStatus; summary: string }>;
  /** Stub of the git diff produced by this job (files added/modified/removed counts). */
  diffStats?: { added: number; modified: number; removed: number };
}

// ─────────────────────────────────── Manifest ───────────────────────────────────

export interface MocksManifest {
  version: string;
  generatedAt: string;
  repoRef: {
    owner: string;
    name: string;
    branch: string;
    commit: string;
  };
  counts: {
    workspaces: number;
    sources: number;
    repoWikis: number;
    wikiPages: number;
    artifacts: number;
    cannedQA: number;
    jobs: number;
  };
}
