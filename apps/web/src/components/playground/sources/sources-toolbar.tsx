"use client";

import type { SourceKind } from "@context-layer/mocks";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { LAYOUT_SPRING } from "@/lib/motion/spring";
import { useStore } from "@/stores";

export type SourceFilter = "all" | SourceKind;
export type SourceView = "grid" | "list";

const FILTERS: Array<{ id: SourceFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "code", label: "Code" },
  { id: "file", label: "Files" },
  { id: "discussion", label: "Discussion" },
];

export function SourcesToolbar({
  query,
  setQuery,
  filter,
  setFilter,
  view,
  setView,
}: {
  query: string;
  setQuery: (v: string) => void;
  filter: SourceFilter;
  setFilter: (v: SourceFilter) => void;
  view: SourceView;
  setView: (v: SourceView) => void;
}) {
  const openChooser = useStore((s) => s.setAddSourceChooserOpen);
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between mb-8">
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative w-full sm:w-80">
          <Search
            aria-hidden
            size={16}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your sources…"
            className="w-full pl-11 pr-4 py-2.5 rounded-pill shadow-[var(--shadow-card)] bg-white text-body-standard focus:outline-none focus:shadow-[var(--shadow-outline-ring)] transition-shadow"
          />
        </div>
        <LayoutGroup id="source-filters">
          <div className="flex p-1 bg-white rounded-pill shadow-[var(--shadow-card)]">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`relative px-4 py-1.5 rounded-pill text-caption font-medium transition-colors ${filter === f.id ? "text-black" : "text-[#777169] hover:text-black hover:bg-[#f9f9f9]"}`}
                data-testid={`filter-${f.id}`}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="filter-active-bg"
                    transition={LAYOUT_SPRING}
                    className="absolute inset-0 rounded-pill bg-[#f5f2ef]"
                    aria-hidden
                  />
                )}
                <span className="relative z-[1]">{f.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="flex p-1 bg-white rounded-pill shadow-[var(--shadow-card)]">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-pill transition-colors ${view === "grid" ? "bg-[#f5f2ef] text-black" : "text-[#777169] hover:text-black hover:bg-[#f9f9f9]"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-1.5 rounded-pill transition-colors ${view === "list" ? "bg-[#f5f2ef] text-black" : "text-[#777169] hover:text-black hover:bg-[#f9f9f9]"}`}
            aria-label="List view"
          >
            <List size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => openChooser(true)}
        className="inline-flex items-center gap-2 bg-[rgba(245,242,239,0.8)] text-black rounded-warm-btn px-7 py-2.5 shadow-[var(--shadow-warm)] hover:scale-[1.02] transition-transform"
        data-testid="add-source-trigger"
      >
        <Plus size={16} strokeWidth={1.5} />
        <span className="text-button-upper">Add Source</span>
      </button>
    </div>
  );
}
