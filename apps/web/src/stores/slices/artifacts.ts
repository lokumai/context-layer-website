import type { StateCreator } from "zustand";
import type { AppState, ArtifactsSlice } from "../types";

export const createArtifactsSlice: StateCreator<AppState, [], [], ArtifactsSlice> = () => ({
  artifacts: [],
});
