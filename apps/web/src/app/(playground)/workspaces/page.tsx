"use client";

import { useStore } from "@/stores";
import { CreateWorkspaceCard } from "@/components/playground/workspaces/create-workspace-card";
import { CreateWorkspaceModal } from "@/components/playground/workspaces/create-workspace-modal";
import { WorkspaceCard } from "@/components/playground/workspaces/workspace-card";
import { WorkspacesEmptyState } from "@/components/playground/workspaces/workspaces-empty-state";

export default function WorkspacesPage() {
  const workspaces = useStore((s) => s.workspaces);
  const isHydrated = useStore((s) => s.isHydrated);

  const showEmptyState = isHydrated && workspaces.length === 0;

  return (
    <div className="w-full px-6 lg:px-10 py-12">
      <header className="mb-10 space-y-3">
        <p className="text-button-upper text-[#777169]">Gateway</p>
        <h1 className="text-display-hero text-black">Workspaces</h1>
        <p className="text-body text-[#4e4e4e] max-w-[560px]">
          A workspace holds every source you want indexed together. Pick one to enter, or create a new one.
        </p>
      </header>

      {showEmptyState ? (
        <WorkspacesEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CreateWorkspaceCard />
          {workspaces.map((w) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
      )}

      <CreateWorkspaceModal />
    </div>
  );
}
