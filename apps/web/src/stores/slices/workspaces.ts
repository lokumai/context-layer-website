import type { StateCreator } from "zustand";
import type { AppState, WorkspacesSlice } from "../types";

export const createWorkspacesSlice: StateCreator<AppState, [], [], WorkspacesSlice> = (
  set,
) => ({
  workspaces: [],
  activeWorkspaceId: null,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
});
