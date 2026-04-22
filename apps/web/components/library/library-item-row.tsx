"use client";

import type { LibraryItem } from "@context-layer/mocks";
import { motion } from "motion/react";
import {
  ArrowDownToLine,
  Code2,
  File as FileIcon,
  FileArchive,
  FileText,
  Film,
  Music,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Badge } from "@/components/ui/badge";

function iconForMime(mime: string): LucideIcon {
  if (mime.startsWith("audio/")) return Music;
  if (mime.startsWith("video/")) return Film;
  if (mime === "application/pdf") return FileText;
  if (mime === "text/markdown") return FileText;
  if (mime === "application/zip") return FileArchive;
  if (mime === "application/json") return Code2;
  return FileIcon;
}

function formatSize(bytes: number): string {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes > 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function LibraryItemRow({ item }: { item: LibraryItem }) {
  const Icon = iconForMime(item.mime);
  const tone = item.mime.startsWith("audio/") ? "warm" : "neutral";

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 320, damping: 24 }} className="h-full">
      <SpotlightCard intensity="soft" className="h-full">
        <Card data-library-item variant="inset" padding="spacious" radius="large" interactive className="flex h-full flex-col gap-5">
          <div className="flex items-start justify-between">
            <IconTile icon={Icon} size="md" tone={tone === "warm" ? "warm" : "neutral"} />
            {item.bundle && <Badge tone="neutral">{item.bundle}</Badge>}
          </div>

          <div className="min-w-0">
            <h3
              className="font-display text-[18px] leading-[1.2] text-[var(--color-ink)] truncate"
              title={item.title}
            >
              {item.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-[11.5px] text-[var(--color-ink-muted)]">
              <span className="capitalize font-medium">{item.sourceTool}</span>
              <span className="text-[var(--color-ink-whisper)]">·</span>
              <span className="font-mono">{formatSize(item.sizeBytes)}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                Created
              </span>
              <span className="text-[12px] font-medium text-[var(--color-ink)]">{item.createdAt.slice(0, 10)}</span>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] transition-all hover:bg-[var(--color-surface-elevated)]"
            >
              <ArrowDownToLine size={11} strokeWidth={1.8} />
              Download
            </button>
          </div>
        </Card>
      </SpotlightCard>
    </motion.div>
  );
}
