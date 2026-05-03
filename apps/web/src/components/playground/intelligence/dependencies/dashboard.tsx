/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal overlays use div-with-click as backdrop-close; inner buttons handle real interactions. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — backdrops, not primary controls. */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: knowledge-graph SVG is decorative; a search-able modal provides text navigation. */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: deterministic data arrays with no reorder risk — index is a stable enough key for this static render. */
"use client";

import type { DependencyNode } from "@context-layer/mocks";
import { FilterX } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { useStore } from "@/stores";
import { IntelligenceFreshnessControls } from "../config-header";

export function IntelligenceDependencies({ workspaceId }: { workspaceId: string }) {
  const dependencies = useStore((state) => state.dependencies);
  const [repoFilter, setRepoFilter] = useState<string>("All");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  const [outdatedFilter, setOutdatedFilter] = useState<string>("All");

  const repoIds = useMemo(
    () =>
      dependencies
        ? ["All", ...Array.from(new Set(dependencies.nodes.map((n) => n.repoId)))]
        : ["All"],
    [dependencies],
  );

  if (!dependencies) {
    return <div className="p-8 text-body text-[#777169]">Loading dependency analytics...</div>;
  }

  const risks = ["All", "none", "low", "medium", "high"];
  const outdatedOptions = ["All", "Outdated", "Up-to-date"];

  const filteredDeps = dependencies.nodes.filter((n) => {
    const repoMatch = repoFilter === "All" || n.repoId === repoFilter;
    const riskMatch = riskFilter === "All" || n.risk === riskFilter;
    const outdatedMatch =
      outdatedFilter === "All" || (outdatedFilter === "Outdated" ? n.outdated : !n.outdated);
    return repoMatch && riskMatch && outdatedMatch;
  });

  const getRiskTone = (risk: DependencyNode["risk"]) => {
    if (risk === "high") return "error";
    if (risk === "medium") return "warn";
    if (risk === "low") return "info";
    return "neutral";
  };

  const clearFilters = () => {
    setRepoFilter("All");
    setRiskFilter("All");
    setOutdatedFilter("All");
  };

  const isFiltered = repoFilter !== "All" || riskFilter !== "All" || outdatedFilter !== "All";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-section-heading">Dependency Analytics</h1>
        <IntelligenceFreshnessControls workspaceId={workspaceId} />
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)]">
          <div className="text-micro font-bold text-[#777169] uppercase tracking-wider mb-2">
            Cross-repo dependencies
          </div>
          <div className="text-[32px] font-bold text-black leading-none">
            {dependencies.crossRepoCount}
          </div>
        </div>
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)]">
          <div className="text-micro font-bold text-[#777169] uppercase tracking-wider mb-2">
            Outdated packages
          </div>
          <div className="text-[32px] font-bold text-[#b45309] leading-none">
            {dependencies.outdatedCount}
          </div>
        </div>
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)]">
          <div className="text-micro font-bold text-[#777169] uppercase tracking-wider mb-2">
            Security CVEs
          </div>
          <div className="text-[32px] font-bold text-black leading-none opacity-40">0</div>
        </div>
      </div>

      {/* Filter row */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-2">
            <div className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              By Repo
            </div>
            <div className="flex flex-wrap gap-1.5">
              {repoIds.map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setRepoFilter(id)}
                  className={`px-2.5 py-1 rounded-pill text-micro font-bold transition-colors ${
                    repoFilter === id
                      ? "bg-[#4e4e4e] text-white"
                      : "bg-white border border-[rgba(0,0,0,0.1)] text-[#777169] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              By Risk
            </div>
            <div className="flex flex-wrap gap-1.5">
              {risks.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-2.5 py-1 rounded-pill text-micro font-bold transition-colors ${
                    riskFilter === r
                      ? "bg-[#4e4e4e] text-white"
                      : "bg-white border border-[rgba(0,0,0,0.1)] text-[#777169] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              Status
            </div>
            <div className="flex flex-wrap gap-1.5">
              {outdatedOptions.map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setOutdatedFilter(o)}
                  className={`px-2.5 py-1 rounded-pill text-micro font-bold transition-colors ${
                    outdatedFilter === o
                      ? "bg-[#4e4e4e] text-white"
                      : "bg-white border border-[rgba(0,0,0,0.1)] text-[#777169] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {o.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-button text-[#ef4444] hover:underline mt-6"
            >
              <FilterX size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-body text-[#4e4e4e] leading-relaxed max-w-4xl">{dependencies.summary}</p>

      {/* Deps table */}
      <div className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_180px_100px_120px] bg-[#f5f5f5] px-4 py-3 border-b border-[rgba(0,0,0,0.05)] text-micro font-bold text-[#777169] uppercase tracking-wider">
          <div>Package Name</div>
          <div>Version</div>
          <div>Latest</div>
          <div>Repo</div>
          <div>Risk</div>
          <div>Status</div>
        </div>

        {filteredDeps.length === 0 ? (
          <div className="p-12 text-center text-body text-[#777169]">
            No dependencies match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(0,0,0,0.03)]">
            {filteredDeps.map((node, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_120px_120px_180px_100px_120px] items-center px-4 py-4 hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="text-body-standard font-bold text-black pr-4 truncate">
                  {node.name}
                </div>
                <div className="text-caption font-mono text-[#4e4e4e]">{node.version}</div>
                <div className="text-caption font-mono text-[#777169]">
                  {node.latestVersion || "-"}
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-standard bg-[#f5f5f5] text-micro font-bold text-[#777169] uppercase tracking-wider truncate inline-block max-w-full">
                    {node.repoId}
                  </span>
                </div>
                <div>
                  <StatusPill tone={getRiskTone(node.risk)}>{node.risk}</StatusPill>
                </div>
                <div>
                  {node.outdated ? (
                    <StatusPill tone="error">outdated</StatusPill>
                  ) : (
                    <span className="text-micro font-bold text-[#9ca3af] uppercase tracking-wider">
                      up-to-date
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
