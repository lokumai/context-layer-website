"use client";

import type { Source } from "@context-layer/mocks";
import { useStore } from "@/stores";
import { SourceActionsMenu } from "./source-actions-menu";
import { SourceIcon } from "./source-icon";
import { SourceStatusBadge } from "./status-badge";

function formatRelative(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const min = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;
  if (delta < min) return "just now";
  if (delta < hour) return `${Math.round(delta / min)}m ago`;
  if (delta < day) return `${Math.round(delta / hour)}h ago`;
  const days = Math.round(delta / day);
  return `${days}d ago`;
}

export function SourceCard({ source }: { source: Source }) {
  const openPreview = useStore((s) => s.setActiveSourcePreviewId);

  return (
    <div
      className="relative text-left group bg-white rounded-card p-5 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-card)] transition-all duration-300 border border-transparent hover:border-[rgba(0,0,0,0.04)]"
      data-testid="source-card"
    >
      {/* 
        The "Stretched Link" Pattern: 
        This button covers the entire card area via 'absolute inset-0'.
        It remains invisible but provides the primary interaction and a11y label.
      */}
      <button
        type="button"
        onClick={() => openPreview(source.id)}
        className="absolute inset-0 w-full h-full opacity-0 z-0 cursor-pointer"
        aria-label={`Open preview for ${source.name}`}
      />

      {/* 
        Content layer: 
        We use 'pointer-events-none' so clicks pass through to the stretched button,
        but 'pointer-events-auto' on nested interactive elements (like the Actions Menu).
      */}
      <div className="relative z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-5">
          <SourceIcon source={source} />
          <div className="flex items-center gap-1 pointer-events-auto">
            <SourceStatusBadge status={source.status} />
            <SourceActionsMenu source={source} />
          </div>
        </div>
        <h3 className="text-card-heading text-black mb-1 truncate leading-tight">
          {source.name}
        </h3>
        <p className="text-caption text-[#777169] inter-airy truncate">{source.path}</p>
        <div className="pt-4 mt-5 border-t border-[#f5f5f5] flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase text-[#9ca3af] font-semibold tracking-[0.08em]">
              Last synced
            </span>
            <span className="text-caption text-black">{formatRelative(source.lastIndexed)}</span>
          </div>
          <span
            aria-hidden
            className="text-[#9ca3af] group-hover:text-black transition-colors"
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}
