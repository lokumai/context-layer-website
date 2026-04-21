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
