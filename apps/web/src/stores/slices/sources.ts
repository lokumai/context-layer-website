import type { StateCreator } from "zustand";
import type { AppState, SourcesSlice } from "../types";

export const createSourcesSlice: StateCreator<AppState, [], [], SourcesSlice> = (set) => ({
  sources: [],
  addSource: (source) =>
    set((s) => ({
      sources: s.sources.some((x) => x.id === source.id)
        ? s.sources
        : [...s.sources, source],
    })),
  removeSource: (id) =>
    set((s) => ({ sources: s.sources.filter((x) => x.id !== id) })),
  renameSource: (id, newName) =>
    set((s) => ({
      sources: s.sources.map((x) => (x.id === id ? { ...x, name: newName } : x)),
    })),
  markIndexing: (id) =>
    set((s) => ({
      sources: s.sources.map((x) => (x.id === id ? { ...x, status: "indexing" } : x)),
    })),
  markIndexed: (id) =>
    set((s) => ({
      sources: s.sources.map((x) =>
        x.id === id
          ? { ...x, status: "indexed", lastIndexed: new Date().toISOString() }
          : x,
      ),
    })),
  markError: (id, _message) =>
    set((s) => ({
      sources: s.sources.map((x) => (x.id === id ? { ...x, status: "error" } : x)),
    })),
  toggleAutoSync: (id) =>
    set((s) => ({
      sources: s.sources.map((x) => (x.id === id ? { ...x, autoSync: !x.autoSync } : x)),
    })),
});
