import type { StateCreator } from "zustand";
import type { AppState, RuntimeWorkspace, WorkspacesSlice } from "../types";

export const createWorkspacesSlice: StateCreator<AppState, [], [], WorkspacesSlice> = (
  set,
) => ({
  workspaces: [],
  activeWorkspaceId: null,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  createWorkspace: (name, description) => {
    const id = `ws-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const ws: RuntimeWorkspace = {
      id,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id,
      createdAt: now,
      lastActivity: now,
      sourceCount: 0,
      syncStatus: "outdated",
      syncStrategy: "per-pr-merge",
      description: description ?? "",
      hasWiki: false,
      graduated: false,
      hasIntelligence: false,
      intelligenceRefreshedAt: null,
    };
    set((s) => ({ workspaces: [...s.workspaces, ws], activeWorkspaceId: id }));
    return id;
  },
  renameWorkspace: (id, name) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) => (w.id === id ? { ...w, name } : w)),
    })),
  setGraduated: (id, value) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id ? { ...w, graduated: value, hasWiki: value ? true : w.hasWiki } : w,
      ),
    })),
  setHasIntelligence: (id, value) =>
    set((s) => ({
      workspaces: s.workspaces.map((w) =>
        w.id === id
          ? {
              ...w,
              hasIntelligence: value,
              intelligenceRefreshedAt: value ? new Date().toISOString() : null,
            }
          : w,
      ),
    })),
});
