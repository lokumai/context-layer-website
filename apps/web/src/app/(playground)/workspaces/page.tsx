"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateWorkspaceCard } from "@/components/playground/workspaces/create-workspace-card";
import { CreateWorkspaceModal } from "@/components/playground/workspaces/create-workspace-modal";
import { WorkspaceCard } from "@/components/playground/workspaces/workspace-card";
import { WorkspacesEmptyState } from "@/components/playground/workspaces/workspaces-empty-state";
import { filterWorkspaces } from "@/lib/workspaces/search";
import { useStore } from "@/stores";

export default function WorkspacesPage() {
  const workspaces = useStore((s) => s.workspaces);
  const isHydrated = useStore((s) => s.isHydrated);
  const [query, setQuery] = useState("");

  const showEmptyState = isHydrated && workspaces.length === 0;
  const filtered = useMemo(() => filterWorkspaces(workspaces, query), [workspaces, query]);

  return (
    <div className="w-full px-6 lg:px-10 py-12">
      <header className="mb-8 space-y-3">
        <h1 className="text-display-hero text-black">Workspaces</h1>
        <p className="text-body text-[#4e4e4e] max-w-[560px]">
          A workspace holds every source you want indexed together. Pick one to enter, or create a
          new one.
        </p>
      </header>

      {!showEmptyState ? (
        <div className="mb-6 max-w-md">
          <div
            className="relative flex items-center bg-white rounded-pill shadow-[var(--shadow-card)] focus-within:shadow-[var(--shadow-outline-ring)] transition-shadow"
            data-testid="workspaces-search-shell"
          >
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-4 text-[#9ca3af] pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workspaces…"
              className="w-full bg-transparent pl-11 pr-10 py-2.5 text-body text-black placeholder:text-[#9ca3af] outline-none rounded-pill"
              data-testid="workspaces-search-input"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 p-1 rounded-full text-[#9ca3af] hover:text-black hover:bg-[#f5f2ef] transition-colors"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {showEmptyState ? (
        <WorkspacesEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CreateWorkspaceCard />
          {filtered.map((w, i) => (
            <WorkspaceCard key={w.id} workspace={w} index={i} />
          ))}
          {query && filtered.length === 0 ? (
            <p
              className="col-span-full text-body text-[#777169] py-10 text-center"
              data-testid="workspaces-no-matches"
            >
              No workspaces match "{query}".
            </p>
          ) : null}
        </div>
      )}

      <CreateWorkspaceModal />
    </div>
  );
}
