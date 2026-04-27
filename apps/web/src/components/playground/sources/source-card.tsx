"use client";

import type { Source } from "@context-layer/mocks";
import { motion } from "motion/react";
import { CONTEXT_SPRING } from "@/lib/motion/spring";
import { useStore } from "@/stores";
import { KnowledgeSyncBadge } from "./knowledge-sync-badge";
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
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={CONTEXT_SPRING}
      whileHover={{ y: -2 }}
      className="relative text-left group bg-white rounded-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow border border-[rgba(0,0,0,0.04)]"
      data-testid="source-card"
    >
      {/*
        The "Stretched Link" Pattern: this button covers the entire card area
        via `absolute inset-0`, transparent but a11y-labeled. Inner action
        controls override pointer-events to remain interactive.
      */}
      <button
        type="button"
        onClick={() => openPreview(source.id)}
        className="absolute inset-0 w-full h-full opacity-0 z-0 cursor-pointer"
        aria-label={`Open preview for ${source.name}`}
      />

      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start gap-3 mb-3">
          <SourceIcon source={source} />
          <div className="flex-1 min-w-0">
            <h3
              className="text-body-large text-black font-semibold leading-snug line-clamp-2 break-words"
              data-testid="source-card-name"
            >
              {source.name}
            </h3>
            <p className="text-caption text-[#777169] inter-airy truncate mt-0.5">{source.path}</p>
          </div>
          <div className="flex items-center pointer-events-auto -mr-1 -mt-1">
            <SourceActionsMenu source={source} />
          </div>
        </div>

        {/*
          Status row sits between the name/url block and the bottom divider.
          Two orthogonal axes (per Phase 14 / IMPROVE.md):
            • Indexing status: Processing → Indexed → (Error)
            • Knowledge sync : Synced vs. Outdated
        */}
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-[#f5f5f5]">
          <SourceStatusBadge status={source.status} />
          <KnowledgeSyncBadge status={source.knowledgeSync} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase text-[#9ca3af] font-semibold tracking-[0.08em]">
              Last Sync with Knowledge
            </span>
            <span className="text-caption text-black">{formatRelative(source.lastIndexed)}</span>
          </div>
          <span aria-hidden className="text-[#9ca3af] group-hover:text-black transition-colors">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
