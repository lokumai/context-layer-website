import { createJSONStorage, type PersistOptions } from "zustand/middleware";
import type { AppState, PersistedState } from "./types";

export const PERSIST_VERSION = 1;

export function persistKey(personaId: string | null): string {
  return `context-layer:${personaId ?? "anon"}`;
}

export function persistConfig(): PersistOptions<AppState, PersistedState> {
  return {
    name: persistKey(null),
    version: PERSIST_VERSION,
    storage: createJSONStorage(() => {
      if (typeof window === "undefined") {
        // Harmless no-op during SSR; zustand never actually reads from it on the server.
        return {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        };
      }
      return window.localStorage;
    }),
    partialize: (state) => ({
      workspaces: state.workspaces,
      activeWorkspaceId: state.activeWorkspaceId,
      sources: state.sources,
      wikiTrees: state.wikiTrees,
      narrative: state.narrative,
      sagaFlows: state.sagaFlows,
      llms: state.llms,
      health: state.health,
      security: state.security,
      coverage: state.coverage,
      dependencies: state.dependencies,
      knowledgeGraph: state.knowledgeGraph,
      artifacts: state.artifacts,
      suggestedPrompts: state.suggestedPrompts,
      cannedQA: state.cannedQA,
      threads: state.threads,
      activeThreadId: state.activeThreadId,
      jobs: state.jobs,
      personaId: state.personaId,
      hydratedAt: state.hydratedAt,
    }),
  };
}
