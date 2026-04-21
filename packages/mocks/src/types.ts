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
