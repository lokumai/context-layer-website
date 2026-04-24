"use client";

import type { Artifact } from "@context-layer/mocks";
import { ArtifactTile } from "./artifact-tile";

export function LibraryGridView({
  artifacts,
  workspaceId,
  onPreview,
  onDelete,
}: {
  artifacts: Artifact[];
  workspaceId: string;
  onPreview: (a: Artifact) => void;
  onDelete: (a: Artifact) => void;
}) {
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card shadow-[var(--shadow-inset-border)] w-full">
        <p className="text-body text-[#777169]">No artifacts match your filters.</p>
      </div>
    );
  }

  return (
    <div
      data-testid="library-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {artifacts.map((artifact) => (
        <ArtifactTile
          key={artifact.id}
          artifact={artifact}
          workspaceId={workspaceId}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
