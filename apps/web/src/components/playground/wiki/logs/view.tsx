/** biome-ignore-all lint/suspicious/noArrayIndexKey: step list is stable and bounded per job; using composite key with step.name below. */
"use client";

import { useStore } from "@/stores";
import { StatusPill } from "@/components/marketing/status-pill";
import {
  ChevronRight,
  FileText,
  Terminal,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Job } from "@context-layer/mocks";

export function WikiLogsView({ workspaceId: _workspaceId }: { workspaceId: string }) {
  const jobs = useStore((s) => s.jobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const formatDuration = (ms: number | null) => {
    if (ms === null) return "--";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusTone = (status: string) => {
    switch (status) {
      case "success":
        return "indexed";
      case "failed":
        return "error";
      case "cancelled":
        return "neutral";
      case "in-progress":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <div className="w-full px-6 lg:px-10 py-10 space-y-6 bg-[#f9f9f9] min-h-screen">
      <div className="space-y-1">
        <h1 className="text-section-heading text-black">Wiki · Logs</h1>
        <p className="text-body text-[#4e4e4e]">
          Every generation and sync commit, with full diff + agent rationale.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.05)] bg-[#fafafa]">
          <span className="text-button-upper text-[#777169]">Timeline</span>
          {selectedJob && (
            <button type="button"
              onClick={() => setSelectedJob(null)}
              className="text-caption text-[var(--color-accent-blue-fg)] hover:underline flex items-center gap-1"
            >
              Deselect
              <X size={12} />
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-micro text-[#777169] border-b border-[rgba(0,0,0,0.05)] uppercase tracking-widest font-bold">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Terminal size={40} strokeWidth={1} />
                      <p className="text-body-large">No generation jobs yet</p>
                      <p className="text-caption">Visit Configure to start indexing.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={cn(
                      "group cursor-pointer transition-colors",
                      selectedJob?.id === job.id
                        ? "bg-[#f5f2ef]"
                        : "hover:bg-[#f9f9f9]"
                    )}
                  >
                    <td className="px-4 py-3 text-caption text-[#4e4e4e] whitespace-nowrap">
                      {new Date(job.startedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-body-standard text-black font-medium capitalize">
                      {job.type}
                    </td>
                    <td className="px-4 py-3 text-body-standard text-[#4e4e4e] capitalize">
                      {job.trigger}
                    </td>
                    <td className="px-4 py-3 text-caption text-[#777169]">
                      {formatDuration(job.durationMs)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={getStatusTone(job.status)}>
                        {job.status}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight
                        size={16}
                        className={cn(
                          "inline-block transition-transform",
                          selectedJob?.id === job.id ? "rotate-90" : "group-hover:translate-x-1"
                        )}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View */}
      {selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* LEFT: Diff */}
          <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-card-heading text-black">Diff</h3>
              <div className="flex items-center gap-2">
                {selectedJob.diffStats && (
                  <>
                    <StatusPill tone="indexed">+{selectedJob.diffStats.added}</StatusPill>
                    <StatusPill tone="info">~{selectedJob.diffStats.modified}</StatusPill>
                    <StatusPill tone="error">-{selectedJob.diffStats.removed}</StatusPill>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {[
                "workspace-narrative.md",
                `${selectedJob.repoIds[0] || "repo"}/wiki/overview.md`,
                `${selectedJob.repoIds[0] || "repo"}/llms.txt`,
              ].map((path, i) => (
                <div
                  key={path}
                  className="flex items-center justify-between px-3 py-2 bg-[#fafafa] rounded-card border border-[rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-[#777169]" />
                    <span className="text-caption font-mono text-[#4e4e4e]">
                      {path}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-micro font-bold">
                    <span className="text-[var(--color-accent-green-fg)]">+{i * 12 + 4}</span>
                    <span className="text-[var(--color-accent-red-fg)]">-{i * 2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Agent logs */}
          <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] space-y-4">
            <h3 className="text-card-heading text-black">Agent logs</h3>
            <div className="space-y-3">
              {selectedJob.steps.map((step, i) => (
                <div
                  key={`${step.name}-${i}`}
                  className="px-3 py-2 bg-[#f9f9f9] rounded-card border border-[rgba(0,0,0,0.03)] flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-body-medium text-black truncate">
                      {step.name}
                    </p>
                    <p className="text-caption text-[#4e4e4e] line-clamp-2">
                      {step.summary}
                    </p>
                  </div>
                  <StatusPill
                    tone={getStatusTone(step.status)}
                    className="shrink-0"
                  >
                    {step.status}
                  </StatusPill>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
