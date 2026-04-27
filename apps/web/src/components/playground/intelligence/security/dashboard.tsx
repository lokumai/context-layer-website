/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal overlays use div-with-click as backdrop-close; inner buttons handle real interactions. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — backdrops, not primary controls. */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: knowledge-graph SVG is decorative; a search-able modal provides text navigation. */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: deterministic data arrays with no reorder risk — index is a stable enough key for this static render. */
"use client";

import { ChevronDown, ChevronRight, FilterX, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { useStore } from "@/stores";
import { IntelligenceFreshnessControls } from "../config-header";

type Severity = "critical" | "high" | "medium" | "low" | "info";

export function IntelligenceSecurity({ workspaceId }: { workspaceId: string }) {
  const security = useStore((state) => state.security);
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null);
  const [repoFilter, setRepoFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set());

  const repoIds = useMemo(
    () =>
      security ? ["All", ...Array.from(new Set(security.findings.map((f) => f.repoId)))] : ["All"],
    [security],
  );

  if (!security) {
    return <div className="p-8 text-body text-[#777169]">Loading security report...</div>;
  }

  const filteredFindings = security.findings.filter((f) => {
    const sevMatch = !severityFilter || f.severity === severityFilter;
    const repoMatch = repoFilter === "All" || f.repoId === repoFilter;
    if (!sevMatch || !repoMatch) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    const next = new Set(expandedFindings);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFindings(next);
  };

  const clearFilters = () => {
    setSeverityFilter(null);
    setRepoFilter("All");
  };

  const getSeverityTone = (sev: Severity) => {
    if (sev === "critical" || sev === "high") return "error";
    if (sev === "medium") return "warn";
    if (sev === "low") return "info";
    return "neutral";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-section-heading">Vulnerabilities & Findings</h1>
        <IntelligenceFreshnessControls workspaceId={workspaceId} />
      </div>

      {/* Search bar */}
      <div className="max-w-md">
        <div
          className="relative flex items-center bg-white rounded-pill shadow-[var(--shadow-card)] focus-within:shadow-[var(--shadow-outline-ring)] transition-shadow"
          data-testid="security-search-shell"
        >
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-4 text-[#9ca3af] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter findings by title, description, or category…"
            className="w-full bg-transparent pl-11 pr-10 py-2.5 text-body text-black placeholder:text-[#9ca3af] outline-none rounded-pill"
            data-testid="security-search-input"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 p-1 rounded-full text-[#9ca3af] hover:text-black hover:bg-[#f5f2ef] transition-colors"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Severity legend row */}
      <div className="flex flex-wrap gap-3">
        {(["critical", "high", "medium", "low", "info"] as Severity[]).map((sev) => (
          <button
            type="button"
            key={sev}
            onClick={() => setSeverityFilter(severityFilter === sev ? null : sev)}
            className={`transition-opacity ${severityFilter && severityFilter !== sev ? "opacity-40" : "opacity-100"}`}
          >
            <StatusPill tone={getSeverityTone(sev)} className="cursor-pointer">
              {security.summary[sev]} {sev}
            </StatusPill>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {repoIds.map((id) => (
            <button
              type="button"
              key={id}
              onClick={() => setRepoFilter(id)}
              className={`px-3 py-1.5 rounded-pill text-caption font-bold transition-colors ${
                repoFilter === id
                  ? "bg-[#4e4e4e] text-white"
                  : "bg-white border border-[rgba(0,0,0,0.1)] text-[#777169] hover:bg-[#f5f5f5]"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
        {(severityFilter || repoFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-button text-[#ef4444] hover:underline"
          >
            <FilterX size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* Findings table */}
      <div className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] overflow-hidden">
        <div className="grid grid-cols-[100px_140px_1fr_200px_120px_40px] bg-[#f5f5f5] px-4 py-3 border-b border-[rgba(0,0,0,0.05)] text-micro font-bold text-[#777169] uppercase tracking-wider">
          <div>Severity</div>
          <div>Category</div>
          <div>Title</div>
          <div>Location</div>
          <div>Repo</div>
          <div className="text-center">↓</div>
        </div>

        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center text-body text-[#777169]">No matching findings.</div>
        ) : (
          <div className="divide-y divide-[rgba(0,0,0,0.03)]">
            {filteredFindings.map((finding) => {
              const isExpanded = expandedFindings.has(finding.id);
              return (
                <div key={finding.id} className="group">
                  <button
                    type="button"
                    onClick={() => toggleExpand(finding.id)}
                    className="w-full grid grid-cols-[100px_140px_1fr_200px_120px_40px] items-center px-4 py-4 hover:bg-[#f9f9f9] transition-colors text-left"
                  >
                    <div>
                      <StatusPill tone={getSeverityTone(finding.severity)}>
                        {finding.severity}
                      </StatusPill>
                    </div>
                    <div className="text-caption font-bold text-[#4e4e4e]">{finding.category}</div>
                    <div className="text-body-standard font-bold text-black pr-4 truncate">
                      {finding.title}
                    </div>
                    <div className="text-micro font-mono text-[#777169] truncate">
                      {finding.file}:{finding.line}
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-standard bg-[#f5f5f5] text-micro font-bold text-[#777169] uppercase tracking-wider">
                        {finding.repoId}
                      </span>
                    </div>
                    <div className="text-[#9ca3af] flex justify-center">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-8 pb-6 pt-2 bg-[#fdfdfd] border-t border-[rgba(0,0,0,0.03)]">
                      <div className="text-micro font-bold text-[#777169] uppercase tracking-wider mb-2">
                        Description
                      </div>
                      <p className="text-body text-[#4e4e4e] leading-relaxed max-w-3xl">
                        {finding.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
