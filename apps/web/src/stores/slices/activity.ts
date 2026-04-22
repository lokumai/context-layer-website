import type { StateCreator } from "zustand";
import type { ActivitySlice, AppState } from "../types";

export const createActivitySlice: StateCreator<AppState, [], [], ActivitySlice> = () => ({
  jobs: [],
});
