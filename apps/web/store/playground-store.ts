import { create } from 'zustand';

interface PlaygroundState {
  activeWorkspaceId: string | null;
  syncStatus: 'live' | 'syncing' | 'queued' | 'outdated';
  hasSources: boolean;
  hasWiki: boolean;
  setActiveWorkspace: (id: string) => void;
  setSyncStatus: (status: 'live' | 'syncing' | 'queued' | 'outdated') => void;
  setHasSources: (val: boolean) => void;
  setHasWiki: (val: boolean) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  activeWorkspaceId: null,
  syncStatus: 'live',
  hasSources: false,
  hasWiki: false,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setHasSources: (val) => set({ hasSources: val }),
  setHasWiki: (val) => set({ hasWiki: val }),
}));
