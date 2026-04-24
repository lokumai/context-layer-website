"use client";

import type { Artifact } from "@context-layer/mocks";
import { ArtifactRow } from "./artifact-row";

export function LibraryListView({
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
      data-testid="library-list"
      className="overflow-x-auto bg-white rounded-card shadow-[var(--shadow-inset-border)]"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[rgba(0,0,0,0.05)]">
            <th className="py-3 pl-4 w-4"></th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Artifact
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Tool
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Bundle
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Format
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Size
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Created
            </th>
            <th className="py-3 px-2 text-button-upper text-[#777169] font-medium text-[11px]">
              Status
            </th>
            <th className="py-3 pr-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact) => (
            <ArtifactRow
              key={artifact.id}
              artifact={artifact}
              workspaceId={workspaceId}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
