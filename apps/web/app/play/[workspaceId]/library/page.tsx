"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Library, Search, Sparkles } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { LibraryItemRow } from "@/components/library/library-item-row";
import type { LibrarySourceTool } from "@context-layer/mocks";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

const TOOL_FILTERS: { id: LibrarySourceTool | "all"; label: string; hint: string }[] = [
  { id: "all", label: "Everything", hint: "All artifacts" },
  { id: "docsgen", label: "DocsGen", hint: "Frozen docs" },
  { id: "omniboard", label: "OmniBoard", hint: "Multimodal" },
  { id: "mcpgen", label: "MCPGen", hint: "MCP descriptors" },
];

export default function LibraryPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [filter, setFilter] = useState<LibrarySourceTool | "all">("all");
  const [query, setQuery] = useState("");

  if (!ws) return null;

  const items = ws.libraryItems
    .filter((i) => (filter === "all" ? true : i.sourceTool === filter))
    .filter((i) => (query ? (i.title + i.sourceTool).toLowerCase().includes(query.toLowerCase()) : true));

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 py-12 md:px-10 md:py-16">
      {/* Header */}
      <FadeIn>
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div>
            <SectionLabel>Library</SectionLabel>
            <h1 className="font-display mt-5 text-[52px] leading-[1.02] tracking-display md:text-[64px]">
              Every <span className="font-editorial">artifact</span>, always saved.
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
              The destination for every frozen output produced by DocsGen, OmniBoard, and MCPGen. Re-download, share, or regenerate anytime.
            </p>
          </div>

          <Card variant="outline" padding="spacious" radius="large">
            <SectionLabel>Inventory</SectionLabel>
            <div className="mt-3 font-display text-[44px] leading-none">{ws.libraryItems.length}</div>
            <div className="mt-2 text-[12.5px] text-[var(--color-ink-muted)]">
              total artifact{ws.libraryItems.length === 1 ? "" : "s"} stored in this workspace.
            </div>
          </Card>
        </div>
      </FadeIn>

      {ws.libraryItems.length === 0 ? (
        <EmptyState workspaceId={workspaceId} />
      ) : (
        <>
          {/* Action bar */}
          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 md:max-w-md">
                <Search size={15} strokeWidth={1.6} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-whisper)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the library…"
                  className="w-full rounded-full bg-white pl-11 pr-4 py-3 text-[14px] shadow-inset focus:outline-none focus:shadow-[rgba(138,90,43,0.12)_0_0_0_3px,rgba(0,0,0,0.075)_0_0_0_0.5px_inset,rgba(0,0,0,0.06)_0_0_0_1px]"
                />
              </div>

              <div className="flex gap-1 rounded-full bg-black/[0.04] p-1 shadow-inset">
                {TOOL_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "relative rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors",
                      filter === f.id ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    {filter === f.id && (
                      <motion.span
                        layoutId="library-filter-active"
                        className="absolute inset-0 rounded-full bg-white shadow-whisper"
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Grid */}
          {items.length === 0 ? (
            <Card variant="quiet" radius="section" padding="spacious" className="text-center">
              <p className="text-[14px] text-[var(--color-ink-muted)]">
                No artifacts match the current filter{query ? ` for "${query}"` : ""}.
              </p>
            </Card>
          ) : (
            <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((i) => (
                <StaggerChild key={i.id}>
                  <LibraryItemRow item={i} />
                </StaggerChild>
              ))}
            </Stagger>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ workspaceId }: { workspaceId: string }) {
  return (
    <FadeIn>
      <Card variant="outline" padding="none" radius="section" className="relative overflow-hidden px-10 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 mesh-warm opacity-60" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
          <IconTile icon={Library} size="xl" tone="warm" />
          <h2 className="font-display text-[40px] leading-[1.05] tracking-display md:text-[52px]">
            Generate your <span className="font-editorial">first</span> artifact.
          </h2>
          <p className="text-[15.5px] text-[var(--color-ink-muted)]">
            Artifacts from DocsGen and OmniBoard land here — frozen, shareable, downloadable. Start with a structure doc or an onboarding deck.
          </p>
          <div className="flex gap-3">
            <Link href={`/play/${workspaceId}/generate/docsgen`}>
              <Button variant="primary" size="xl">
                <Sparkles size={14} strokeWidth={1.8} />
                Open DocsGen
              </Button>
            </Link>
            <Link href={`/play/${workspaceId}/generate/omniboard`}>
              <Button variant="outline" size="xl">OmniBoard</Button>
            </Link>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
}
