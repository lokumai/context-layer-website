import type { StateCreator } from "zustand";
import type { AppState, HydrationPayload, SessionSlice } from "../types";
import type { PersonaId } from "@/lib/personas";

const EMPTY_PAYLOAD: HydrationPayload = {
  workspaces: [],
  sources: [],
  wiki: null,
  intelligence: null,
  artifacts: [],
  chatbot: null,
  activity: [],
};

export const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set) => ({
  personaId: null,
  hydratedAt: null,
  isHydrated: false,
  hydrate: (payload, personaId) => set(projectPayload(payload, personaId)),
  reset: () => set(projectPayload(EMPTY_PAYLOAD, null)),
});

function projectPayload(p: HydrationPayload, personaId: PersonaId | null) {
  return {
    workspaces: p.workspaces,
    activeWorkspaceId: p.workspaces[0]?.id ?? null,
    sources: p.sources,
    wikiTrees: p.wiki?.tree ?? {},
    narrative: p.wiki?.narrative ?? null,
    sagaFlows: p.wiki?.sagaFlows ?? null,
    llms: p.wiki?.llms ?? {},
    health: p.intelligence?.health ?? null,
    security: p.intelligence?.security ?? null,
    coverage: p.intelligence?.coverage ?? null,
    dependencies: p.intelligence?.dependencies ?? null,
    knowledgeGraph: p.intelligence?.knowledgeGraph ?? null,
    artifacts: p.artifacts,
    suggestedPrompts: p.chatbot?.suggestedPrompts ?? [],
    cannedQA: p.chatbot?.cannedQA ?? [],
    threads: p.chatbot?.threads ?? [],
    jobs: p.activity,
    personaId,
    hydratedAt: personaId ? new Date().toISOString() : null,
    isHydrated: personaId !== null,
  };
}
