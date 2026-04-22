import type { StateCreator } from "zustand";
import type { AppState, IntelligenceSlice } from "../types";

export const createIntelligenceSlice: StateCreator<AppState, [], [], IntelligenceSlice> = () => ({
  health: null,
  security: null,
  coverage: null,
  dependencies: null,
  knowledgeGraph: null,
});
