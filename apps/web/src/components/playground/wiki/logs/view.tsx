"use client";

import { Terminal } from "lucide-react";
import { useStore } from "@/stores";
import { LogRow } from "./log-row";

export function WikiLogsView({ workspaceId: _workspaceId }: { workspaceId: string }) {
  const jobs = useStore((s) => s.jobs);

  return (
    <div className="w-full px-6 lg:px-10 py-10 space-y-6 bg-[#f9f9f9] min-h-screen">
      <header className="space-y-1">
        <h1 className="text-section-heading text-black">Wiki · Logs</h1>
        <p className="text-body text-[#4e4e4e]">
          Every generation and sync commit, with full diff + agent execution logs. Click a row to
          expand.
        </p>
      </header>

      {jobs.length === 0 ? (
        <div
          className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] flex flex-col items-center justify-center py-24 gap-2 opacity-60"
          data-testid="wiki-logs-empty"
        >
          <Terminal size={40} strokeWidth={1} />
          <p className="text-body-large">No generation jobs yet</p>
          <p className="text-caption">Visit Configure to start indexing.</p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="wiki-logs-timeline">
          {jobs.map((job) => (
            <LogRow key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
