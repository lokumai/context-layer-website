import type { Artifact } from "@context-layer/mocks";
import type { StateCreator } from "zustand";
import type { AppState, ArtifactsSlice } from "../types";

export const createArtifactsSlice: StateCreator<AppState, [], [], ArtifactsSlice> = (set) => ({
  artifacts: [],

  addArtifact: (artifact: Artifact) =>
    set((s) => ({ artifacts: [artifact, ...s.artifacts.filter((a) => a.id !== artifact.id)] })),

  replaceArtifact: (id: string, next: Artifact) =>
    set((s) => ({
      artifacts: s.artifacts.map((a) => (a.id === id ? next : a)),
    })),

  removeArtifact: (id: string) =>
    set((s) => ({ artifacts: s.artifacts.filter((a) => a.id !== id) })),
});
