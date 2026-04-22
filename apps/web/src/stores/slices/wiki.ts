import type { StateCreator } from "zustand";
import type { AppState, WikiSlice } from "../types";

export const createWikiSlice: StateCreator<AppState, [], [], WikiSlice> = () => ({
  wikiTrees: {},
  narrative: null,
  sagaFlows: null,
  llms: {},
});
