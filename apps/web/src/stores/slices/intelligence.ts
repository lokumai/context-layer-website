import type { StateCreator } from "zustand";
import type { AppState, IntelligencePayload, IntelligenceSlice } from "../types";

export const createIntelligenceSlice: StateCreator<AppState, [], [], IntelligenceSlice> = (
  set,
) => ({
  health: null,
  security: null,
  coverage: null,
  dependencies: null,
  knowledgeGraph: null,
  setIntelligenceData: (payload: IntelligencePayload) =>
    set({
      health: payload.health,
      security: payload.security,
      coverage: payload.coverage,
      dependencies: payload.dependencies,
      knowledgeGraph: payload.knowledgeGraph,
    }),
});
