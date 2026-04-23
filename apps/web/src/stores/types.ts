import type {
  Artifact,
  CannedQAPair,
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
  createWorkspace: (name: string) => string;
  /** Rename an existing workspace. */
  renameWorkspace: (id: string, name: string) => void;
  /** Set graduation + hasWiki flags (called after the first Wiki generation). */
  setGraduated: (id: string, value: boolean) => void;
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

export interface IntelligenceSlice {
  health: HealthMetric | null;
  security: SecurityReport | null;
  coverage: CoverageReport | null;
  dependencies: DependencyReport | null;
  knowledgeGraph: KnowledgeGraph | null;
}

export interface ArtifactsSlice {
  artifacts: Artifact[];
}

export interface ChatbotSlice {
  suggestedPrompts: SuggestedPrompt[];
  cannedQA: CannedQAPair[];
  threads: ChatThread[];
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
  | "setWikiData"
  | "hydrate"
  | "reset"
  | "isHydrated"
>;
