import type { StateCreator } from "zustand";
import type { AppState, SourcesSlice } from "../types";

export const createSourcesSlice: StateCreator<AppState, [], [], SourcesSlice> = () => ({
  sources: [],
});
