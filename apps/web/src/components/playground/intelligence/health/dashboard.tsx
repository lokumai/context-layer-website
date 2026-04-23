/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal overlays use div-with-click as backdrop-close; inner buttons handle real interactions. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — backdrops, not primary controls. */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: knowledge-graph SVG is decorative; a search-able modal provides text navigation. */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: deterministic data arrays with no reorder risk — index is a stable enough key for this static render. */
"use client";

import { useStore } from "@/stores";
import { StatusPill } from "@/components/marketing/status-pill";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export function IntelligenceHealth({ workspaceId: _workspaceId }: { workspaceId: string }) {
  const health = useStore((state) => state.health);
  const [filter, setFilter] = useState<string>("All");
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());

  if (!health) {
    return <div className="p-8 text-body text-[#777169]">Loading health metrics...</div>;
  }

  const repoIds = ["All", ...health.perRepo.map(r => r.repoId)];

  const toggleExpand = (repoId: string) => {
    const next = new Set(expandedRepos);
    if (next.has(repoId)) next.delete(repoId);
    else next.add(repoId);
    setExpandedRepos(next);
  };

  const filteredRepos = filter === "All" 
    ? health.perRepo 
    : health.perRepo.filter(r => r.repoId === filter);

  const getStatusTone = (score: number) => {
    if (score > 80) return "indexed";
    if (score > 60) return "warn";
    return "error";
  };

  const getStatusLabel = (score: number) => {
    if (score > 80) return "Healthy";
    if (score > 60) return "Degrading";
    return "Critical";
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-micro uppercase tracking-widest text-[#777169] mb-1 font-semibold">
          HEALTH
        </div>
        <h1 className="text-section-heading">Health & Fragility</h1>
      </div>

      {/* Overall score card */}
      <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center border-r border-[rgba(0,0,0,0.05)] pr-8">
          <div className="text-[64px] font-bold leading-none text-black">{health.overallScore}</div>
          <div className="text-caption font-bold text-[#777169] mb-3">/ 100</div>
          <StatusPill tone={getStatusTone(health.overallScore)}>
            {getStatusLabel(health.overallScore)}
          </StatusPill>
        </div>
        <div className="flex-1">
          <p className="text-body text-[#4e4e4e] leading-relaxed">
            {health.summary}
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {repoIds.map(id => (
          <button type="button"
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-pill text-button transition-colors ${
              filter === id 
                ? "bg-[#4e4e4e] text-white" 
                : "bg-white border border-[rgba(0,0,0,0.1)] text-[#777169] hover:bg-[#f5f5f5]"
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      {/* Per-repo list */}
      <div className="space-y-2">
        {filteredRepos.map(repo => {
          const isExpanded = expandedRepos.has(repo.repoId);
          const tone = getStatusTone(repo.score);
          return (
            <div key={repo.repoId} className="bg-white rounded-card shadow-[var(--shadow-inset-border)] overflow-hidden">
              <button type="button" 
                onClick={() => toggleExpand(repo.repoId)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="text-[#9ca3af]">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body-medium font-bold text-black uppercase tracking-wider">{repo.repoId}</span>
                    <span className="text-body-medium font-bold">{repo.score}</span>
                  </div>
                  <div className="h-2 w-full bg-[#f5f5f5] rounded-pill overflow-hidden">
                    <div 
                      className="h-full rounded-pill" 
                      style={{ 
                        width: `${repo.score}%`, 
                        backgroundColor: tone === "indexed" ? "#10b981" : tone === "warn" ? "#f59e0b" : "#ef4444" 
                      }}
                    />
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 ml-4 min-w-[140px]">
                  <span className="text-caption text-[#4e4e4e]">{repo.architectureViolations} violations</span>
                  <span className="text-caption text-[#4e4e4e]">{repo.codeSmells} code smells</span>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-14 pb-6 pt-2 bg-[#fdfdfd] border-t border-[rgba(0,0,0,0.03)]">
                  <h4 className="text-micro font-bold text-[#777169] uppercase tracking-wider mb-3">Fragile Areas</h4>
                  <ul className="space-y-2">
                    {repo.fragileAreas.map((area, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-standard text-[#4e4e4e]">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-accent-amber-fg)] flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
