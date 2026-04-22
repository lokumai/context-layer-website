"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  FileText,
  GitBranch,
  Hash,
  MessageCircle,
  StickyNote,
} from "lucide-react";
import type { Source } from "@context-layer/mocks";
import { cn } from "@/lib/cn";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Badge } from "@/components/ui/badge";

const PROVIDER_ICON: Record<string, typeof GitBranch> = {
  github: GitBranch,
  gitlab: GitBranch,
  bitbucket: GitBranch,
  gitea: GitBranch,
  gdrive: FileText,
  notion: StickyNote,
  confluence: StickyNote,
  sharepoint: StickyNote,
  slack: Hash,
  discord: MessageCircle,
  linear: Hash,
  jira: Hash,
  "github-discussions": MessageCircle,
  upload: FileText,
  url: FileText,
};

export function SourceCard({ source }: { source: Source }) {
  const Icon = PROVIDER_ICON[source.provider] ?? FileText;
  const tone = source.status === "indexed" ? "success" : source.status === "indexing" ? "warn" : "danger";

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>
      <SpotlightCard intensity="soft" className="h-full">
        <Card
          data-source-card
          variant="inset"
          padding="spacious"
          radius="large"
          interactive
          className="flex h-full flex-col gap-6"
        >
          <div className="flex items-start justify-between">
            <IconTile icon={Icon} size="md" />
            <Badge tone={tone}>{source.status}</Badge>
          </div>

          <div>
            <h3
              className="font-display text-[22px] leading-[1.15] text-[var(--color-ink)] truncate"
              title={source.name}
            >
              {source.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-[12.5px] text-[var(--color-ink-muted)]">
              <span className="font-mono uppercase tracking-[0.14em]">{source.provider}</span>
              {source.branch && (
                <>
                  <span className="text-[var(--color-ink-whisper)]">/</span>
                  <span className="font-mono">{source.branch}</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-[var(--color-border-subtle)] pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                Last Indexed
              </span>
              <span className="text-[12.5px] font-medium text-[var(--color-ink)]">
                {source.lastIndexedAt.slice(0, 10)}
              </span>
            </div>
            <ArrowUpRight
              size={15}
              strokeWidth={1.6}
              className={cn(
                "text-[var(--color-ink-whisper)] transition-all duration-300",
                "group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--color-ink)]",
              )}
            />
          </div>
        </Card>
      </SpotlightCard>
    </motion.div>
  );
}
