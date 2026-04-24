"use client";

import type { ArtifactBundle } from "@context-layer/mocks";
import { ChevronDown, Search, X } from "lucide-react";
import { DOCSGEN_CATALOG } from "@/components/playground/generate/docsgen/catalog";
import type { LibraryFilterApi, WindowFilter } from "./filter-hook";

const TOOLS = [
  { label: "All", value: "all" },
  { label: "DocsGen", value: "docsgen" },
  { label: "OmniBoard", value: "omniboard" },
  { label: "MCPGen", value: "mcpgen" },
] as const;

const FORMATS = [
  { label: "All", value: "all" },
  { label: "Markdown", value: "markdown" },
  { label: "PDF", value: "pdf" },
  { label: "JSON", value: "json" },
  { label: "Slides", value: "slides" },
  { label: "Audio", value: "audio" },
  { label: "Video", value: "video" },
] as const;

const STATUSES = [
  { label: "All", value: "all" },
  { label: "Current", value: "current" },
  { label: "Superseded", value: "superseded" },
  { label: "Failed", value: "failed" },
] as const;

export function LibrarySidebar({ api, totalCount }: { api: LibraryFilterApi; totalCount: number }) {
  const isFiltered =
    api.filters.query !== "" ||
    api.filters.tool !== "all" ||
    api.filters.bundle !== "all" ||
    api.filters.format !== "all" ||
    api.filters.status !== "all" ||
    api.filters.window !== "any";

  return (
    <aside
      data-testid="library-sidebar"
      className="w-[280px] h-full flex-shrink-0 bg-white border-r border-[rgba(0,0,0,0.05)] overflow-y-auto flex flex-col"
    >
      <div className="p-6 flex flex-col gap-8">
        <section>
          <h4 className="text-button-upper text-[#777169] mb-3">SEARCH</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Filter by title..."
              value={api.filters.query}
              onChange={(e) => api.setFilter("query", e.target.value)}
              className="w-full bg-[#f9f9f9] border-none rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </section>

        <section>
          <h4 className="text-button-upper text-[#777169] mb-3">SOURCE TOOL</h4>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((tool) => (
              <button
                key={tool.value}
                type="button"
                data-testid={`tool-filter-${tool.value}`}
                onClick={() => api.setFilter("tool", tool.value)}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
                  api.filters.tool === tool.value
                    ? "bg-black text-white"
                    : "bg-[#f9f9f9] text-[#4e4e4e] hover:text-black"
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </section>

        {(api.filters.tool === "all" || api.filters.tool === "docsgen") && (
          <section>
            <h4 className="text-button-upper text-[#777169] mb-3">DOCSGEN BUNDLE</h4>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                data-testid="bundle-filter-all"
                onClick={() => api.setFilter("bundle", "all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                  api.filters.bundle === "all"
                    ? "bg-black text-white"
                    : "bg-transparent text-[#4e4e4e] hover:bg-[#f9f9f9] hover:text-black"
                }`}
              >
                All Bundles
              </button>
              {Object.entries(DOCSGEN_CATALOG).map(([slug, bundle]) => (
                <button
                  key={slug}
                  type="button"
                  data-testid={`bundle-filter-${slug}`}
                  onClick={() => api.setFilter("bundle", slug as ArtifactBundle)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                    api.filters.bundle === slug
                      ? "bg-black text-white"
                      : "bg-transparent text-[#4e4e4e] hover:bg-[#f9f9f9] hover:text-black"
                  }`}
                >
                  {bundle.title}
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <h4 className="text-button-upper text-[#777169] mb-3">FORMAT</h4>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((format) => (
              <button
                key={format.value}
                type="button"
                data-testid={`format-filter-${format.value}`}
                onClick={() => api.setFilter("format", format.value)}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
                  api.filters.format === format.value
                    ? "bg-black text-white"
                    : "bg-[#f9f9f9] text-[#4e4e4e] hover:text-black"
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-button-upper text-[#777169] mb-3">STATUS</h4>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <button
                key={status.value}
                type="button"
                data-testid={`status-filter-${status.value}`}
                onClick={() => api.setFilter("status", status.value)}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
                  api.filters.status === status.value
                    ? "bg-black text-white"
                    : "bg-[#f9f9f9] text-[#4e4e4e] hover:text-black"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-button-upper text-[#777169] mb-3">CREATED WITHIN</h4>
          <div className="relative">
            <select
              data-testid="window-filter"
              value={api.filters.window}
              onChange={(e) => api.setFilter("window", e.target.value as WindowFilter)}
              className="w-full bg-[#f9f9f9] border-none rounded-md px-3 py-2 text-sm appearance-none focus:ring-1 focus:ring-black transition-all cursor-pointer"
            >
              <option value="any">Any time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777169] pointer-events-none" />
          </div>
        </section>
      </div>

      <div className="mt-auto p-6 border-t border-[rgba(0,0,0,0.05)] bg-[#f9f9f9]/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-caption text-[#777169]">{totalCount} artifacts</span>
          {isFiltered && (
            <button
              type="button"
              data-testid="filter-reset"
              onClick={api.reset}
              className="text-button-upper text-[#777169] hover:text-black flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
