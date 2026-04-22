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

// The shape that /api/mocks/bootstrap returns. This is the on-the-wire
// contract the hydration pipeline binds to — downstream phases substitute
// real backends by serving the same shape.

export interface HydrationPayload {
  workspaces: Workspace[];
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
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string | null) => void;
}

export interface SourcesSlice {
  sources: Source[];
}

export interface WikiSlice {
  wikiTrees: Record<string, WikiTree>;
  narrative: WorkspaceNarrative | null;
  sagaFlows: SagaFlowsDoc | null;
  llms: Record<string, LlmsTxt>;
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

// The persisted subset — everything except the UI slice and the hydration-flag
// bits that the in-memory hydration pipeline owns.
export type PersistedState = Omit<AppState, "navOpen" | "setNavOpen" | "setActiveWorkspace" | "hydrate" | "reset" | "isHydrated">;
