import type { StateCreator } from "zustand";
import type { AppState, WikiPayload, WikiSlice } from "../types";

export const createWikiSlice: StateCreator<AppState, [], [], WikiSlice> = (set) => ({
  wikiTrees: {},
  narrative: null,
  sagaFlows: null,
  llms: {},
  setWikiData: (payload: WikiPayload) =>
    set({
      wikiTrees: payload.tree,
      narrative: payload.narrative,
      sagaFlows: payload.sagaFlows,
      llms: payload.llms,
    }),
});
