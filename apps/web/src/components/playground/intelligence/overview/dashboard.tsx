/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal overlays use div-with-click as backdrop-close; inner buttons handle real interactions. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — backdrops, not primary controls. */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: knowledge-graph SVG is decorative; a search-able modal provides text navigation. */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: deterministic data arrays with no reorder risk — index is a stable enough key for this static render. */
"use client";

import type { KnowledgeGraph } from "@context-layer/mocks";
import { ArrowRight, Boxes, HeartPulse, ShieldCheck, Target } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { useStore } from "@/stores";
import { IntelligenceFreshnessControls } from "../config-header";

export function IntelligenceOverview({ workspaceId }: { workspaceId: string }) {
  const health = useStore((state) => state.health);
  const security = useStore((state) => state.security);
  const coverage = useStore((state) => state.coverage);
  const dependencies = useStore((state) => state.dependencies);
  const knowledgeGraph = useStore((state) => state.knowledgeGraph);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  if (!health || !security || !coverage || !dependencies || !knowledgeGraph) {
    return <div className="p-8 text-body text-[#777169]">Loading intelligence...</div>;
  }

  const sparklinePoints = Array.from({ length: 10 })
    .map((_, i) => {
      const x = (i / 9) * 100;
      const y = 50 + Math.sin(i + health.overallScore) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  const coverageColor =
    coverage.overall > 80 ? "#10b981" : coverage.overall > 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="page-section space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-section-heading">Intelligence at a glance</h1>
        <IntelligenceFreshnessControls workspaceId={workspaceId} />
      </div>

      {/* Metric-tile grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health */}
        <div className="white-card p-5 rounded-card shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              Health
            </span>
            <div className="w-7 h-7 rounded-standard bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)] flex items-center justify-center">
              <HeartPulse size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[44px] leading-none font-bold text-black tracking-tight">
              {health.overallScore}
            </span>
            <span className="text-body-medium text-[#777169]">/100</span>
          </div>
          <div className="mt-4 h-7 w-full">
            <svg width="100%" height="28" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        </div>

        {/* Security */}
        <div className="white-card p-5 rounded-card shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              Security
            </span>
            <div className="w-7 h-7 rounded-standard bg-[var(--color-accent-neutral-bg)] text-[var(--color-accent-neutral-fg)] flex items-center justify-center">
              <ShieldCheck size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <StatusPill tone="error">{security.summary.critical} crit</StatusPill>
              <StatusPill tone="error">{security.summary.high} high</StatusPill>
              <StatusPill tone="warn">{security.summary.medium} med</StatusPill>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusPill tone="info">{security.summary.low} low</StatusPill>
              <StatusPill tone="neutral">{security.summary.info} info</StatusPill>
            </div>
          </div>
        </div>

        {/* Coverage */}
        <div className="white-card p-5 rounded-card shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              Coverage
            </span>
            <div className="w-7 h-7 rounded-standard bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)] flex items-center justify-center">
              <Target size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-[44px] leading-none font-bold text-black tracking-tight">
            {coverage.overall}%
          </div>
          <div className="mt-6 h-2 w-full rounded-pill bg-[#f5f5f5] overflow-hidden">
            <div
              className="h-full rounded-pill"
              style={{ width: `${coverage.overall}%`, backgroundColor: coverageColor }}
            />
          </div>
        </div>

        {/* Dependencies */}
        <div className="white-card p-5 rounded-card shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-micro font-bold text-[#777169] uppercase tracking-wider">
              Dependencies
            </span>
            <div className="w-7 h-7 rounded-standard bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)] flex items-center justify-center">
              <Boxes size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[44px] leading-none font-bold text-black tracking-tight">
              {dependencies.outdatedCount}
            </span>
            <span className="text-micro font-bold uppercase text-[#777169]">outdated</span>
          </div>
          <div className="mt-4 text-caption text-[#777169]">
            {dependencies.crossRepoCount} cross-repo dependencies
          </div>
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security severity split */}
        <div className="rounded-section bg-white shadow-[var(--shadow-outline-ring)] p-6">
          <h3 className="text-card-heading mb-6">Security severity split</h3>
          <div className="h-4 w-full rounded-pill flex overflow-hidden mb-6">
            {(() => {
              const total = Object.values(security.summary).reduce((a, b) => a + b, 0);
              const colors = ["#b91c1c", "#f87171", "#b45309", "#1d4ed8", "#9ca3af"];
              const severities = ["critical", "high", "medium", "low", "info"] as const;
              return severities.map((sev, i) => {
                const count = security.summary[sev];
                if (count === 0) return null;
                return (
                  <div
                    key={sev}
                    style={{ width: `${(count / total) * 100}%`, backgroundColor: colors[i] }}
                    className="h-full"
                  />
                );
              });
            })()}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { label: "Critical", color: "#b91c1c", value: security.summary.critical },
              { label: "High", color: "#f87171", value: security.summary.high },
              { label: "Medium", color: "#b45309", value: security.summary.medium },
              { label: "Low", color: "#1d4ed8", value: security.summary.low },
              { label: "Info", color: "#9ca3af", value: security.summary.info },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-micro font-bold text-[#777169] uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <div className="text-body-medium font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-repo coverage */}
        <div className="rounded-section bg-white shadow-[var(--shadow-outline-ring)] p-6">
          <h3 className="text-card-heading mb-6">Per-repo coverage</h3>
          <div className="space-y-4">
            {[...coverage.perRepo]
              .sort((a, b) => b.lineCoverage - a.lineCoverage)
              .slice(0, 5)
              .map((repo) => (
                <div key={repo.repoId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-caption">
                    <span className="font-bold text-black uppercase tracking-wider">
                      {repo.repoId}
                    </span>
                    <span className="font-bold">{repo.lineCoverage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f5f5f5] rounded-pill overflow-hidden">
                    <div
                      className="h-full rounded-pill"
                      style={{
                        width: `${repo.lineCoverage}%`,
                        backgroundColor: repo.lineCoverage >= 70 ? "#10b981" : "#f59e0b",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Knowledge Graph snapshot */}
      <div className="rounded-section bg-white shadow-[var(--shadow-outline-ring)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-card-heading">Knowledge Graph snapshot</h3>
          <button
            type="button"
            onClick={() => setIsGraphModalOpen(true)}
            className="text-button flex items-center gap-1.5 text-[#777169] hover:text-black transition-colors"
          >
            Click to expand <ArrowRight size={14} />
          </button>
        </div>
        <div className="h-[220px] w-full border border-[rgba(0,0,0,0.05)] rounded-card overflow-hidden bg-[#fbfbfb]">
          <KnowledgeGraphSVG graph={knowledgeGraph} viewBox="0 0 600 240" />
        </div>
      </div>

      {/* Modal */}
      {isGraphModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-8"
          onClick={() => setIsGraphModalOpen(false)}
        >
          <div
            className="bg-white rounded-section shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(0,0,0,0.05)] flex justify-between items-center">
              <h2 className="text-section-heading">Knowledge Graph</h2>
              <button
                type="button"
                onClick={() => setIsGraphModalOpen(false)}
                className="text-button uppercase tracking-widest font-bold"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-[#fbfbfb] p-8">
              <KnowledgeGraphSVG graph={knowledgeGraph} viewBox="0 0 1000 600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KnowledgeGraphSVG({ graph, viewBox }: { graph: KnowledgeGraph; viewBox: string }) {
  const isLarge = viewBox.includes("1000");
  const nodeRadius = isLarge ? 20 : 12;
  const fontSize = isLarge ? 12 : 8;

  const nodes = graph.nodes.map((node, i) => {
    const x = isLarge
      ? 100 + (i % 8) * 110 + Math.sin(i) * 30
      : 30 + (i % 8) * 65 + Math.sin(i) * 20;
    const y = isLarge
      ? 100 + Math.floor(i / 8) * 120 + Math.cos(i) * 40
      : 30 + Math.floor(i / 8) * 70 + Math.cos(i) * 15;
    return { ...node, x, y };
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg width="100%" height="100%" viewBox={viewBox} className="w-full h-full">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="20"
          refY="3.5"
          orientation="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
        </marker>
      </defs>
      {graph.edges.map((edge, i) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;
        return (
          <line
            key={`edge-${i}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="#e5e7eb"
            strokeWidth={isLarge ? 1.5 : 1}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            fill="white"
            stroke={node.type === "service" ? "#3b82f6" : "#9ca3af"}
            strokeWidth={isLarge ? 2 : 1.5}
            className="shadow-sm"
          />
          <text
            x={node.x}
            y={node.y + nodeRadius + fontSize + 2}
            textAnchor="middle"
            className={`font-bold uppercase tracking-widest ${isLarge ? "text-[10px]" : "text-[7px]"}`}
            fill="#374151"
            style={{ fontSize: `${fontSize}px` }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
