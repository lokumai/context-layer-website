"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/stores";
import { FirstTimeWizard } from "@/components/playground/wizard/first-time-wizard";
import { AddSourceChooser } from "@/components/playground/sources/add-source-chooser";
import { SourceCard } from "@/components/playground/sources/source-card";
import { SourcePreviewModal } from "@/components/playground/sources/source-preview-modal";
import { SourceRow } from "@/components/playground/sources/source-row";
import {
  type SourceFilter,
  type SourceView,
  SourcesToolbar,
} from "@/components/playground/sources/sources-toolbar";
import { SourcesEmptyState } from "@/components/playground/sources/sources-empty-state";

export default function SourcesPage() {
  const sources = useStore((s) => s.sources);
  const isHydrated = useStore((s) => s.isHydrated);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SourceFilter>("all");
  const [view, setView] = useState<SourceView>("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sources.filter((s) => {
      if (filter !== "all" && s.kind !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.path.toLowerCase().includes(q)
      );
    });
  }, [sources, query, filter]);

  return (
    <div className="w-full px-6 lg:px-10 py-10">
      <header className="mb-8 space-y-3">
        <p className="text-button-upper text-[#777169]">Workspace · Input Layer</p>
        <h1 className="text-display-hero text-black">Sources</h1>
        <p className="text-body text-[#4e4e4e] max-w-[640px]">
          The single source of truth. Everything downstream — Wiki, Intelligence, Chatbot, Generate — derives from what's indexed here.
        </p>
      </header>

      <FirstTimeWizard />

      <SourcesToolbar
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        view={view}
        setView={setView}
      />

      {isHydrated && sources.length === 0 ? (
        <SourcesEmptyState />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" data-testid="sources-grid">
          {filtered.map((s) => (
            <SourceCard key={s.id} source={s} />
          ))}
          {filtered.length === 0 && sources.length > 0 ? (
            <p className="col-span-full text-center text-body text-[#777169] py-16">
              No sources match your search.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-2" data-testid="sources-list">
          {filtered.map((s) => (
            <SourceRow key={s.id} source={s} />
          ))}
          {filtered.length === 0 && sources.length > 0 ? (
            <p className="text-center text-body text-[#777169] py-16">
              No sources match your search.
            </p>
          ) : null}
        </div>
      )}

      <AddSourceChooser />
      <SourcePreviewModal />
    </div>
  );
}
