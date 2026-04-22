import type { StateCreator } from "zustand";
import type { AppState, UiSlice } from "../types";

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  navOpen: false,
  setNavOpen: (v) => set({ navOpen: v }),
});
