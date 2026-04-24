"use client";

import type { Artifact } from "@context-layer/mocks";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/stores";
import { ArtifactPreview } from "./artifact-preview";
import { DeleteConfirmModal } from "./delete-confirm";
import { LibraryEmptyState } from "./empty-state";
import { useLibraryFilters } from "./filter-hook";
import { LibraryGridView } from "./grid-view";
import { LibraryListView } from "./list-view";
import { NeedsWikiLibraryState } from "./needs-wiki-state";
import { LibrarySidebar } from "./sidebar";

export type LibraryView = "grid" | "list";

export function LibrarySurface({ workspaceId }: { workspaceId: string }) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  const artifacts = useStore((s) => s.artifacts);
  const removeArtifact = useStore((s) => s.removeArtifact);
  const api = useLibraryFilters(artifacts);

  const [view, setView] = useState<LibraryView>("grid");
  const [preview, setPreview] = useState<Artifact | null>(null);
  const [deleting, setDeleting] = useState<Artifact | null>(null);

  if (!workspace) return null;
  if (!workspace.hasWiki) return <NeedsWikiLibraryState workspaceId={workspaceId} />;

  const showingEmpty = artifacts.length === 0;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f9f9f9]" data-testid="library-surface">
      <LibrarySidebar api={api} totalCount={artifacts.length} />

      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-section-heading text-black">Library</h1>
            <p className="text-caption text-[#777169]">
              {api.filtered.length} of {artifacts.length} artifacts
            </p>
          </div>
          {!showingEmpty ? (
            <div
              className="inline-flex rounded-pill bg-white shadow-[var(--shadow-inset-border)] p-1"
              data-testid="library-view-toggle"
            >
              <ViewToggleButton
                active={view === "grid"}
                onClick={() => setView("grid")}
                label="Grid"
                icon={<LayoutGrid size={14} strokeWidth={1.5} />}
                testid="library-view-grid"
              />
              <ViewToggleButton
                active={view === "list"}
                onClick={() => setView("list")}
                label="List"
                icon={<List size={14} strokeWidth={1.5} />}
                testid="library-view-list"
              />
            </div>
          ) : null}
        </header>

        {showingEmpty ? (
          <LibraryEmptyState workspaceId={workspaceId} />
        ) : view === "grid" ? (
          <LibraryGridView
            artifacts={api.filtered}
            workspaceId={workspaceId}
            onPreview={setPreview}
            onDelete={setDeleting}
          />
        ) : (
          <LibraryListView
            artifacts={api.filtered}
            workspaceId={workspaceId}
            onPreview={setPreview}
            onDelete={setDeleting}
          />
        )}
      </main>

      {preview ? (
        <ArtifactPreview open onClose={() => setPreview(null)} artifact={preview} />
      ) : null}

      {deleting ? (
        <DeleteConfirmModal
          artifact={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeArtifact(deleting.id);
            setDeleting(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  label,
  icon,
  testid,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  testid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-button transition-colors ${
        active ? "bg-black text-white" : "text-[#4e4e4e] hover:text-black"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
