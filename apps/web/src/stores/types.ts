import type {
  Artifact,
  CannedQAPair,
  ChatMessage,
  ChatThread,
  CoverageReport,
  DependencyReport,
  HealthMetric,
  Job,
  KnowledgeGraph,
  LlmsTxt,
  SagaFlowsDoc,
  SecurityReport,
  Source,
  SuggestedPrompt,
  WikiTree,
  Workspace,
  WorkspaceNarrative,
} from "@context-layer/mocks";
import type { PersonaId } from "@/lib/personas";

// Workspaces gain two runtime-only fields on top of the canonical mocks type:
// `hasWiki` — whether the first Wiki has been generated (drives progressive gating).
// `graduated` — whether the first-time wizard should still appear.
// These are derived in bootstrap, and subsequent user actions (Phase 7+) mutate them.
export interface RuntimeWorkspace extends Workspace {
  hasWiki: boolean;
  graduated: boolean;
  /** Whether the IntelliGen job has been run for this workspace. */
  hasIntelligence: boolean;
  /** Last time Intelligence was refreshed (drives the Fresh / Stale / Refreshing badge). */
  intelligenceRefreshedAt: string | null;
}

// The shape that /api/mocks/bootstrap returns. This is the on-the-wire
// contract the hydration pipeline binds to — downstream phases substitute
// real backends by serving the same shape.

export interface HydrationPayload {
  workspaces: RuntimeWorkspace[];
  sources: Source[];
  wiki: {
    tree: Record<string, WikiTree>;
    narrative: WorkspaceNarrative | null;
    sagaFlows: SagaFlowsDoc | null;
    llms: Record<string, LlmsTxt>;
  } | null;
  intelligence: {
    health: HealthMetric;
    security: SecurityReport;
    coverage: CoverageReport;
    dependencies: DependencyReport;
    knowledgeGraph: KnowledgeGraph;
  } | null;
  artifacts: Artifact[];
  chatbot: {
    suggestedPrompts: SuggestedPrompt[];
    cannedQA: CannedQAPair[];
    threads: ChatThread[];
  } | null;
  activity: Job[];
}

// ────────────────────── Slices ──────────────────────

export interface WorkspacesSlice {
  workspaces: RuntimeWorkspace[];
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string | null) => void;
  /** Create a new workspace with a name; returns the new id. */
  /** Create a new workspace; description is optional and surfaces on the workspace card. */
  createWorkspace: (name: string, description?: string) => string;
  /** Rename an existing workspace. */
  renameWorkspace: (id: string, name: string) => void;
  /** Set graduation + hasWiki flags (called after the first Wiki generation). */
  setGraduated: (id: string, value: boolean) => void;
  /** Toggle Intelligence availability and stamp the refreshed timestamp. */
  setHasIntelligence: (id: string, value: boolean) => void;
}

export interface SourcesSlice {
  sources: Source[];
  addSource: (source: Source) => void;
  removeSource: (id: string) => void;
  renameSource: (id: string, newName: string) => void;
  markIndexing: (id: string) => void;
  markIndexed: (id: string) => void;
  markError: (id: string, message: string) => void;
  toggleAutoSync: (id: string) => void;
  /** Flip a source's knowledgeSync to "synced" (called by Wiki Configure's Force Sync). */
  markSynced: (id: string) => void;
  /** Flip a source's knowledgeSync to "outdated" (default for newly added sources). */
  markOutdated: (id: string) => void;
}

export interface WikiPayload {
  tree: Record<string, WikiTree>;
  narrative: WorkspaceNarrative | null;
  sagaFlows: SagaFlowsDoc | null;
  llms: Record<string, LlmsTxt>;
}

export interface WikiSlice {
  wikiTrees: Record<string, WikiTree>;
  narrative: WorkspaceNarrative | null;
  sagaFlows: SagaFlowsDoc | null;
  llms: Record<string, LlmsTxt>;
  /** Populate wiki slice after a Configure-tab generation (or from bootstrap). */
  setWikiData: (payload: WikiPayload) => void;
}

export interface IntelligencePayload {
  health: HealthMetric;
  security: SecurityReport;
  coverage: CoverageReport;
  dependencies: DependencyReport;
  knowledgeGraph: KnowledgeGraph;
}

export interface IntelligenceSlice {
  health: HealthMetric | null;
  security: SecurityReport | null;
  coverage: CoverageReport | null;
  dependencies: DependencyReport | null;
  knowledgeGraph: KnowledgeGraph | null;
  /** Populate intelligence slice after IntelliGen runs (or from bootstrap). */
  setIntelligenceData: (payload: IntelligencePayload) => void;
}

export interface ArtifactsSlice {
  artifacts: Artifact[];
  /** Prepend (or upsert) a freshly generated artifact — DocsGen + OmniBoard both use this. */
  addArtifact: (artifact: Artifact) => void;
  /** In-place swap; used by the Regenerate flow so card position is preserved. */
  replaceArtifact: (id: string, next: Artifact) => void;
  /** Library delete (Phase 11 consumes this). */
  removeArtifact: (id: string) => void;
}

export interface ChatbotSlice {
  suggestedPrompts: SuggestedPrompt[];
  cannedQA: CannedQAPair[];
  threads: ChatThread[];
  /** Currently selected thread id (null → empty state with suggested prompts). */
  activeThreadId: string | null;
  setActiveThread: (id: string | null) => void;
  /** Create a new thread; returns the new id. */
  createThread: (title?: string) => string;
  /** Append a message to a thread. For assistant messages the caller supplies citations. */
  appendMessage: (threadId: string, message: ChatMessage) => void;
  /** Replace (mutate in-place) the last message of a thread — used during streaming. */
  patchLastMessage: (threadId: string, content: string) => void;
  renameThread: (threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
}

export interface ActivitySlice {
  jobs: Job[];
}

export interface UiSlice {
  // transient UI state — never persisted
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  createWorkspaceModalOpen: boolean;
  setCreateWorkspaceModalOpen: (v: boolean) => void;
  addSourceChooserOpen: boolean;
  setAddSourceChooserOpen: (v: boolean) => void;
  activeSourcePreviewId: string | null;
  setActiveSourcePreviewId: (id: string | null) => void;
  /** Workspace ids for which the user dismissed the first-time wizard this session. */
  firstTimeWizardDismissedFor: string[];
  dismissFirstTimeWizard: (workspaceId: string) => void;
}

export interface SessionSlice {
  personaId: PersonaId | null;
  hydratedAt: string | null;
  isHydrated: boolean;
  hydrate: (payload: HydrationPayload, personaId: PersonaId) => void;
  reset: () => void;
}

export type AppState = WorkspacesSlice &
  SourcesSlice &
  WikiSlice &
  IntelligenceSlice &
  ArtifactsSlice &
  ChatbotSlice &
  ActivitySlice &
  UiSlice &
  SessionSlice;

// The persisted subset — everything except the UI slice and action functions.
// The persist middleware's partialize returns only serializable data.
export type PersistedState = Omit<
  AppState,
  | "navOpen"
  | "setNavOpen"
  | "createWorkspaceModalOpen"
  | "setCreateWorkspaceModalOpen"
  | "addSourceChooserOpen"
  | "setAddSourceChooserOpen"
  | "activeSourcePreviewId"
  | "setActiveSourcePreviewId"
  | "firstTimeWizardDismissedFor"
  | "dismissFirstTimeWizard"
  | "setActiveWorkspace"
  | "createWorkspace"
  | "renameWorkspace"
  | "setGraduated"
  | "addSource"
  | "removeSource"
  | "renameSource"
  | "markIndexing"
  | "markIndexed"
  | "markError"
  | "toggleAutoSync"
  | "markSynced"
  | "markOutdated"
  | "setWikiData"
  | "setIntelligenceData"
  | "setHasIntelligence"
  | "setActiveThread"
  | "createThread"
  | "appendMessage"
  | "patchLastMessage"
  | "renameThread"
  | "deleteThread"
  | "addArtifact"
  | "replaceArtifact"
  | "removeArtifact"
  | "hydrate"
  | "reset"
  | "isHydrated"
>;
