import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Persona,
  type WorkspaceState,
  type SyncStatus,
  seedForPersona,
  QUICK_POPULATE_SOURCES,
} from "@context-layer/mocks";

interface PlaygroundState {
  persona: Persona | null;
  workspaces: WorkspaceState[];
  activeWorkspaceId: string | null;
  syncStatus: SyncStatus;

  hydrateFromPersona: (persona: Persona) => void;
  setActiveWorkspace: (id: string | null) => void;
  setSyncStatus: (status: SyncStatus) => void;

  createWorkspace: (name: string) => string;
  addQuickPopulateSources: (workspaceId: string) => void;
  generateWiki: (workspaceId: string) => void;
  generateIntelligence: (workspaceId: string) => void;
  runDocsGenCard: (workspaceId: string, cardId: string) => void;

  resetActiveWorkspace: () => void;
  __resetAll: () => void;
}

const STORAGE_NAME = "playground";

function emptyWorkspaceState(id: string, name: string): WorkspaceState {
  const now = new Date().toISOString();
  return {
    workspace: {
      id,
      name,
      createdAt: now,
      lastActivityAt: now,
      stage: "empty",
      syncStatus: "live",
    },
    sources: [],
    wikiSummary: null,
    wikiPages: [],
    wikiJobs: [],
    intelligenceSummary: { workspaceId: id, lastRefreshedAt: null, freshness: "never" },
    intelligenceDashboards: [],
    chatThreads: [],
    docsGenCards: [],
    omniBoardArtifacts: [],
    libraryItems: [],
  };
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || `workspace-${Date.now()}`
  );
}

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      persona: null,
      workspaces: [],
      activeWorkspaceId: null,
      syncStatus: "live",

      hydrateFromPersona: (persona) => {
        const current = get().persona;
        if (current === persona) return;
        const seed = seedForPersona(persona);
        set({
          persona,
          workspaces: seed.workspaces,
          activeWorkspaceId: seed.workspaces[0]?.workspace.id ?? null,
          syncStatus: "live",
        });
      },

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      setSyncStatus: (status) => set({ syncStatus: status }),

      createWorkspace: (name) => {
        const id = slugify(name);
        set((s) => ({
          ...s,
          workspaces: [...s.workspaces, emptyWorkspaceState(id, name)],
          activeWorkspaceId: id,
        }));
        return id;
      },

      addQuickPopulateSources: (workspaceId) => {
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  workspace: {
                    ...ws.workspace,
                    stage: "sources-only",
                    lastActivityAt: new Date().toISOString(),
                  },
                  sources: QUICK_POPULATE_SOURCES.map((src) => ({ ...src, workspaceId })),
                }
          ),
        }));
      },

      generateWiki: (workspaceId) => {
        const full = seedForPersona("full").workspaces[0];
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  workspace: { ...ws.workspace, stage: "wiki-ready" },
                  wikiSummary: full.wikiSummary,
                  wikiPages: full.wikiPages,
                  wikiJobs: full.wikiJobs,
                }
          ),
        }));
      },

      generateIntelligence: (workspaceId) => {
        const full = seedForPersona("full").workspaces[0];
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  intelligenceSummary: full.intelligenceSummary,
                  intelligenceDashboards: full.intelligenceDashboards,
                }
          ),
        }));
      },

      runDocsGenCard: (workspaceId, cardId) => {
        const full = seedForPersona("full").workspaces[0];
        const fullCard = full.docsGenCards.find((c) => c.id === cardId);
        const libItem = fullCard?.libraryItemId
          ? full.libraryItems.find((l) => l.id === fullCard.libraryItemId)
          : undefined;
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((ws) =>
            ws.workspace.id !== workspaceId
              ? ws
              : {
                  ...ws,
                  docsGenCards: ws.docsGenCards.map((c) =>
                    c.id !== cardId
                      ? c
                      : {
                          ...c,
                          state: "done",
                          libraryItemId: fullCard?.libraryItemId ?? c.libraryItemId,
                        }
                  ),
                  libraryItems:
                    libItem && !ws.libraryItems.some((i) => i.id === libItem.id)
                      ? [...ws.libraryItems, libItem]
                      : ws.libraryItems,
                }
          ),
        }));
      },

      resetActiveWorkspace: () => {
        const { persona, activeWorkspaceId } = get();
        if (!persona) return;
        const seed = seedForPersona(persona);
        const seedWs = seed.workspaces.find((w) => w.workspace.id === activeWorkspaceId);
        if (!seedWs) {
          set((s) => ({
            ...s,
            workspaces: s.workspaces.filter((w) => w.workspace.id !== activeWorkspaceId),
            activeWorkspaceId: null,
          }));
          return;
        }
        set((s) => ({
          ...s,
          workspaces: s.workspaces.map((w) =>
            w.workspace.id === seedWs.workspace.id ? seedWs : w
          ),
        }));
      },

      __resetAll: () => {
        set({ persona: null, workspaces: [], activeWorkspaceId: null, syncStatus: "live" });
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        persona: s.persona,
        workspaces: s.workspaces,
        activeWorkspaceId: s.activeWorkspaceId,
      }),
    }
  )
);
