import type { StateCreator } from "zustand";
import type { AppState, UiSlice } from "../types";

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  navOpen: false,
  setNavOpen: (v) => set({ navOpen: v }),
  createWorkspaceModalOpen: false,
  setCreateWorkspaceModalOpen: (v) => set({ createWorkspaceModalOpen: v }),
  addSourceChooserOpen: false,
  setAddSourceChooserOpen: (v) => set({ addSourceChooserOpen: v }),
  activeSourcePreviewId: null,
  setActiveSourcePreviewId: (id) => set({ activeSourcePreviewId: id }),
  firstTimeWizardDismissedFor: [],
  dismissFirstTimeWizard: (workspaceId) =>
    set((s) => ({
      firstTimeWizardDismissedFor: s.firstTimeWizardDismissedFor.includes(workspaceId)
        ? s.firstTimeWizardDismissedFor
        : [...s.firstTimeWizardDismissedFor, workspaceId],
    })),
});
