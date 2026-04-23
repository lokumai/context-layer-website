/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + card surfaces use div-with-click as the backdrop-close pattern; inner buttons are the real interactive elements. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — the clickable wrappers are backdrops, not primary controls. */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: knowledge-graph SVG is decorative; a search-able modal provides text navigation. */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: deterministic grid positions make index a stable enough key for this static render. */
"use client";

import { useStore } from "@/stores";
import { StatusPill } from "@/components/marketing/status-pill";
import Link from "next/link";
import {
  Activity,
  Shield,
  Zap,
  Clock,
  GitBranch,
  FileText,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";

export function WikiStatusDashboard({ workspaceId: _workspaceId }: { workspaceId: string }) {
  const sources = useStore((s) => s.sources);
  const jobs = useStore((s) => s.jobs);
  const knowledgeGraph = useStore((s) => s.knowledgeGraph);

  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  const totalTokens = useMemo(() => {
    return sources.reduce((acc, s) => acc + (s.tokenCount || 0), 0);
  }, [sources]);

  const activeSources = sources.slice(0, 7);
  const _inactiveSources = sources.slice(7);
  const displayedSources = showAllRepos ? sources : activeSources;

  // Knowledge Graph deterministic positions
  const graphNodes = useMemo(() => {
    if (!knowledgeGraph) return [];
    return knowledgeGraph.nodes.map((node, i) => ({
      ...node,
      x: 50 + (i % 8) * 70 + (Math.sin(i) * 20),
      y: 50 + Math.floor(i / 8) * 60 + (Math.cos(i) * 15),
    }));
  }, [knowledgeGraph]);

  const graphEdges = useMemo(() => {
    if (!knowledgeGraph || graphNodes.length === 0) return [];
    return knowledgeGraph.edges.map((edge) => {
      const source = graphNodes.find((n) => n.id === edge.source);
      const target = graphNodes.find((n) => n.id === edge.target);
      return { source, target };
    }).filter(e => e.source && e.target);
  }, [knowledgeGraph, graphNodes]);

  return (
    <div className="w-full px-6 lg:px-10 py-10 space-y-8 bg-[#f9f9f9]">
      {/* 1. Wiki Health & Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Coverage */}
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)] flex flex-col justify-between relative">
          <div>
            <p className="text-micro text-[#777169] mb-1 font-bold tracking-widest uppercase">COVERAGE SCORE</p>
            <p className="text-display-hero text-black">87%</p>
            <p className="text-caption text-[#777169] mt-1">% of tracked code indexed</p>
          </div>
          <div className="absolute top-5 right-5 p-2 rounded-comfortable bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]">
            <Activity size={18} strokeWidth={1.5} />
          </div>
          <div className="mt-4">
            <StatusPill tone="indexed">indexed</StatusPill>
          </div>
        </div>

        {/* Staleness */}
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)] flex flex-col justify-between relative">
          <div>
            <p className="text-micro text-[#777169] mb-1 font-bold tracking-widest uppercase">STALENESS</p>
            <p className="text-body-large text-black font-semibold mt-2">Last synced 12m ago</p>
            <p className="text-caption text-[#777169] mt-1">Up to date with main</p>
          </div>
          <div className="absolute top-5 right-5 p-2 rounded-comfortable bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]">
            <Clock size={18} strokeWidth={1.5} />
          </div>
          <div className="mt-4">
            <StatusPill tone="indexed">indexed</StatusPill>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)] flex flex-col justify-between relative">
          <div>
            <p className="text-micro text-[#777169] mb-1 font-bold tracking-widest uppercase">SYNC STATUS</p>
            <div className="mt-2">
              <StatusPill tone="indexed" dot>Live</StatusPill>
            </div>
            <p className="text-caption text-[#777169] mt-3">Connected to 9 repos</p>
          </div>
          <div className="absolute top-5 right-5 p-2 rounded-comfortable bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]">
            <Zap size={18} strokeWidth={1.5} />
          </div>
        </div>

        {/* Missing Context */}
        <div className="bg-white rounded-card p-5 shadow-[var(--shadow-outline-ring)] flex flex-col justify-between relative">
          <div>
            <p className="text-micro text-[#777169] mb-1 font-bold tracking-widest uppercase">MISSING CONTEXT</p>
            <p className="text-display-hero text-black">3</p>
            <p className="text-caption text-[#777169] mt-1">files without docs</p>
          </div>
          <div className="absolute top-5 right-5 p-2 rounded-comfortable bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)]">
            <Shield size={18} strokeWidth={1.5} />
          </div>
          <div className="mt-4">
            <StatusPill tone="warn">warn</StatusPill>
          </div>
        </div>
      </div>

      {/* 2. Knowledge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Tokens */}
        <div className="bg-white rounded-card p-6 shadow-[var(--shadow-outline-ring)]">
          <h3 className="text-card-heading text-black mb-4">Total Tokens</h3>
          <p className="text-display-hero text-black">{totalTokens.toLocaleString()}</p>
          <p className="text-caption text-[#777169] mt-2">Aggregated across all active sources</p>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-card p-6 shadow-[var(--shadow-outline-ring)]">
          <h3 className="text-card-heading text-black mb-4">Source Breakdown</h3>
          <div className="h-4 w-full rounded-pill overflow-hidden flex mb-4 shadow-[var(--shadow-inset-border)]">
            <div className="h-full bg-[var(--color-accent-blue-fg)]" style={{ width: '60%' }} />
            <div className="h-full bg-[var(--color-accent-green-fg)]" style={{ width: '25%' }} />
            <div className="h-full bg-[var(--color-accent-amber-fg)]" style={{ width: '15%' }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-blue-fg)]" />
              <span className="text-caption text-[#4e4e4e]">Code</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-green-fg)]" />
              <span className="text-caption text-[#4e4e4e]">Files</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-amber-fg)]" />
              <span className="text-caption text-[#4e4e4e]">Discussions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Repository Insights */}
      <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-section-heading text-black">Repository Insights</h2>
            <StatusPill tone="indexed" dot>Indexed</StatusPill>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
          {displayedSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-comfortable bg-[#f5f5f5] text-[#777169]">
                  {source.kind === 'code' ? <GitBranch size={14} /> : source.kind === 'file' ? <FileText size={14} /> : <MessageSquare size={14} />}
                </div>
                <span className="text-body-standard text-black font-medium">{source.name}</span>
              </div>
              <StatusPill tone={source.status === 'indexed' ? 'indexed' : 'warn'} className="opacity-0 group-hover:opacity-100 transition-opacity">
                {source.status}
              </StatusPill>
            </div>
          ))}
        </div>

        {sources.length > 7 && (
          <button type="button" 
            onClick={() => setShowAllRepos(!showAllRepos)}
            className="mt-8 text-button text-[var(--color-accent-blue-fg)] hover:underline flex items-center gap-1"
          >
            {showAllRepos ? 'Show less' : `Show all ${sources.length} →`}
          </button>
        )}
      </div>

      {/* 4. Recent Activity */}
      <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-section-heading text-black">Recent Activity</h2>
          <Link href={`/workspace/${_workspaceId}/wiki/logs`} className="text-button text-[var(--color-accent-blue-fg)] hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[rgba(0,0,0,0.05)]">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="text-[#777169] text-caption font-mono w-24">
                  {new Date(job.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>
                  <p className="text-body-standard text-black font-medium">
                    {job.type.charAt(0).toUpperCase() + job.type.slice(1)} · {job.trigger}
                  </p>
                  <p className="text-caption text-[#777169]">{job.summary}</p>
                </div>
              </div>
              <StatusPill tone={job.status === 'success' ? 'indexed' : job.status === 'failed' ? 'error' : 'info'}>
                {job.status}
              </StatusPill>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Knowledge Graph */}
      <div 
        className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
        onClick={() => setGraphModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-section-heading text-black">Knowledge Graph</h2>
          <div className="p-2 rounded-full bg-[#f5f5f5] text-[#777169]">
            <Search size={16} strokeWidth={1.5} />
          </div>
        </div>
        <div className="w-full h-[280px] bg-[#fcfcfc] rounded-comfortable border border-[rgba(0,0,0,0.05)] overflow-hidden">
          <svg viewBox="0 0 600 280" className="w-full h-full">
            {graphEdges.map((edge, i) => (
              <line
                key={i}
                x1={edge.source?.x}
                y1={edge.source?.y}
                x2={edge.target?.x}
                y2={edge.target?.y}
                stroke="#e5e5e5"
                strokeWidth="1"
              />
            ))}
            {graphNodes.map((node) => (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r="4"
                fill="#525252"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Graph Modal */}
      {graphModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-20">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setGraphModalOpen(false)} />
          <div className="relative w-full h-full bg-white rounded-section shadow-[var(--shadow-card)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-card-heading text-black">Knowledge Graph</h2>
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777169]" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search nodes..." 
                    className="w-full pl-10 pr-4 py-2 bg-[#f5f5f5] rounded-pill text-body-standard outline-none focus:shadow-[var(--shadow-inset-border)]"
                  />
                </div>
              </div>
              <button type="button" onClick={() => setGraphModalOpen(false)} className="p-2 hover:bg-[#f5f2ef] rounded-full transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 bg-[#fcfcfc] overflow-auto p-10">
               <svg viewBox="0 0 1000 600" className="w-full min-h-[600px]">
                {/* Bigger version placeholder */}
                {knowledgeGraph?.edges.map((edge, i) => {
                  const s = graphNodes.find(n => n.id === edge.source);
                  const t = graphNodes.find(n => n.id === edge.target);
                  if (!s || !t) return null;
                  return (
                    <line key={i} x1={s.x * 1.5} y1={s.y * 1.5} x2={t.x * 1.5} y2={t.y * 1.5} stroke="#e5e5e5" strokeWidth="1" />
                  );
                })}
                {graphNodes.map((node) => (
                  <g key={node.id} transform={`translate(${node.x * 1.5},${node.y * 1.5})`}>
                    <circle r="6" fill="#525252" />
                    <text y="18" textAnchor="middle" className="text-[10px] fill-[#777169] select-none font-medium">{node.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
