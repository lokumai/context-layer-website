"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistConfig, persistKey } from "./persist-config";
import { createActivitySlice } from "./slices/activity";
import { createArtifactsSlice } from "./slices/artifacts";
import { createChatbotSlice } from "./slices/chatbot";
import { createIntelligenceSlice } from "./slices/intelligence";
import { createSessionSlice } from "./slices/session";
import { createSourcesSlice } from "./slices/sources";
import { createUiSlice } from "./slices/ui";
import { createWikiSlice } from "./slices/wiki";
import { createWorkspacesSlice } from "./slices/workspaces";
import type { AppState } from "./types";

// Root store. A single `create()` composes every slice. Persona-keyed
// persistence is handled via `setPersistKey()` — the HydrationProvider calls
// it before hydration so each persona has its own localStorage bucket.

export const useStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createWorkspacesSlice(set, get, api),
      ...createSourcesSlice(set, get, api),
      ...createWikiSlice(set, get, api),
      ...createIntelligenceSlice(set, get, api),
      ...createArtifactsSlice(set, get, api),
      ...createChatbotSlice(set, get, api),
      ...createActivitySlice(set, get, api),
      ...createUiSlice(set, get, api),
      ...createSessionSlice(set, get, api),
    }),
    persistConfig(),
  ),
);

export function setPersistKey(personaId: string | null): void {
  useStore.persist.setOptions({ name: persistKey(personaId) });
}

export type { AppState, HydrationPayload } from "./types";
