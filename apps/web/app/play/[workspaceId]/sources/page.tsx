"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, Upload } from "lucide-react";
import type { Source } from "@context-layer/mocks";
import { usePlaygroundStore } from "@/store/playground-store";
import { SourceCard } from "@/components/sources/source-card";
import { AddSourceChooser } from "@/components/sources/add-source-chooser";
import { SourcePreviewModal } from "@/components/sources/source-preview-modal";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";
import { cn } from "@/lib/cn";

const KIND_FILTERS = [
  { id: "all", label: "All" },
  { id: "repo", label: "Code" },
  { id: "file", label: "Files" },
  { id: "discussion", label: "Memory" },
] as const;

type KindFilter = (typeof KIND_FILTERS)[number]["id"];

export default function SourcesPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const persona = usePlaygroundStore((s) => s.persona);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    if (!workspace) return [];
    const q = query.trim().toLowerCase();
    return workspace.sources.filter((s) => {
      if (kind !== "all" && s.kind !== kind) return false;
      if (!q) return true;
      return (s.name + " " + s.provider + " " + (s.url ?? "")).toLowerCase().includes(q);
    });
  }, [workspace, query, kind]);

  if (!workspace) return null;
  const hasSources = workspace.sources.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-6 py-12 md:px-10 md:py-16">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Sources</SectionLabel>
            <h1 className="font-display mt-5 text-[52px] leading-[1.02] tracking-display md:text-[64px]">
              The <span className="font-editorial">single source</span> of truth.
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
              Everything here is converted to markdown, indexed, and reachable by every agent in the product.
              {hasSources && (
                <span className="ml-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                  · {workspace.sources.length} source{workspace.sources.length === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>
          <Button variant="warm" size="lg" uppercase onClick={() => setChooserOpen(true)}>
            <Plus size={14} strokeWidth={1.8} />
            Add source
          </Button>
        </div>
      </FadeIn>

      {/* Action bar */}
      {hasSources && (
        <FadeIn delay={0.12} className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-md">
            <Search size={15} strokeWidth={1.6} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-whisper)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your sources…"
              className="w-full rounded-full bg-white pl-11 pr-4 py-3 text-[14px] shadow-inset focus:outline-none focus:shadow-[rgba(138,90,43,0.12)_0_0_0_3px,rgba(0,0,0,0.075)_0_0_0_0.5px_inset,rgba(0,0,0,0.06)_0_0_0_1px]"
            />
          </div>

          <div className="flex gap-1 rounded-full bg-black/[0.04] p-1 shadow-inset">
            {KIND_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setKind(f.id)}
                className={cn(
                  "rounded-full px-5 py-1.5 text-[12.5px] font-medium transition-all",
                  kind === f.id
                    ? "bg-white text-[var(--color-ink)] shadow-whisper"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Grid / empty */}
      <div className="mt-10">
        {!hasSources ? (
          <EmptyState persona={persona} onAdd={() => setChooserOpen(true)} />
        ) : filtered.length === 0 ? (
          <Card variant="quiet" radius="section" padding="spacious" className="text-center">
            <p className="text-[14.5px] text-[var(--color-ink-muted)]">
              No sources match "{query}"{kind !== "all" ? ` in ${kind}` : ""}.
            </p>
          </Card>
        ) : (
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <StaggerChild key={s.id}>
                <SourceCard source={s} onClick={setPreviewSource} />
              </StaggerChild>
            ))}
          </Stagger>
        )}
      </div>

      {/* Bottom sync-more callout */}
      {hasSources && (
        <FadeIn delay={0.2} className="mt-24">
          <Card
            variant="quiet"
            padding="none"
            radius="section"
            className="relative overflow-hidden px-10 py-14 text-center"
          >
            <div className="pointer-events-none absolute inset-0 mesh-warm opacity-40" />
            <div className="pointer-events-none absolute inset-0 grid-pattern opacity-15" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
              <IconTile icon={Upload} size="lg" tone="warm" />
              <h2 className="font-display text-[32px] leading-[1.08] tracking-display md:text-[40px]">
                Sync <span className="font-editorial">more</span> context.
              </h2>
              <p className="text-[14.5px] text-[var(--color-ink-muted)]">
                Extend the workspace by connecting Drive, Notion, Slack, or uploading local files. Everything becomes searchable by the Wiki and the chatbot the moment it's indexed.
              </p>
              <div className="flex gap-3">
                <Button variant="white" size="md">Browse integrations</Button>
                <Button variant="primary" size="md" onClick={() => setChooserOpen(true)}>
                  <Plus size={13} strokeWidth={1.8} />
                  Quick upload
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {chooserOpen && <AddSourceChooser workspaceId={workspaceId} onClose={() => setChooserOpen(false)} />}
      <SourcePreviewModal source={previewSource} onClose={() => setPreviewSource(null)} />
    </div>
  );
}

function EmptyState({ persona, onAdd }: { persona: string | null; onAdd: () => void }) {
  return (
    <FadeIn>
      <Card variant="outline" padding="none" radius="section" className="relative overflow-hidden px-10 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 mesh-warm opacity-60" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
          <IconTile icon={Upload} size="xl" tone="warm" />
          <h2 className="font-display text-[40px] leading-[1.05] tracking-display md:text-[52px]">
            Add your <span className="font-editorial">first</span> source.
          </h2>
          <p className="text-[15.5px] text-[var(--color-ink-muted)]">
            Connect a GitHub repo, a Drive folder, a Notion space — or upload a pdf. Everything becomes markdown-indexed and reachable by every agent in the product.
          </p>
          <Button variant="primary" size="xl" onClick={onAdd}>
            <Plus size={14} strokeWidth={1.8} />
            Add source
          </Button>
          {persona === "empty" && (
            <p className="max-w-md text-[12px] text-[var(--color-ink-whisper)]">
              This is the empty demo persona. The Add Source dialog will surface a "Quick-populate demo sources" button that seeds the 9 microservice repos for you.
            </p>
          )}
        </div>
      </Card>
    </FadeIn>
  );
}
