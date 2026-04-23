"use client";

import type { Source } from "@context-layer/mocks";
import { useStore } from "@/stores";
import { SourceActionsMenu } from "./source-actions-menu";
import { SourceIcon } from "./source-icon";
import { SourceStatusBadge } from "./status-badge";

function formatRelative(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (delta < day) return "today";
  return `${Math.round(delta / day)}d ago`;
}

export function SourceRow({ source }: { source: Source }) {
  const openPreview = useStore((s) => s.setActiveSourcePreviewId);
  return (
    <div
      className="flex items-center gap-4 bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-card)] transition-shadow"
      data-testid="source-row"
    >
      <button
        type="button"
        onClick={() => openPreview(source.id)}
        className="flex items-center gap-4 flex-1 min-w-0 text-left"
        aria-label={`Preview ${source.name}`}
      >
        <SourceIcon source={source} size={20} />
        <div className="flex-1 min-w-0">
          <p className="text-body-medium text-black truncate">{source.name}</p>
          <p className="text-caption text-[#777169] truncate">{source.path}</p>
        </div>
        <span className="text-caption text-[#777169] hidden md:block">
          {formatRelative(source.lastIndexed)}
        </span>
      </button>
      <SourceStatusBadge status={source.status} />
      <SourceActionsMenu source={source} />
    </div>
  );
}
