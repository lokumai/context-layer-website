"use client";

import type { Job, JobStatus } from "@context-layer/mocks";
import { ChevronDown, ChevronRight, GitCompare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { StatusPill, type StatusTone } from "@context-layer/ui/components/marketing/status-pill";
import { CONTEXT_SPRING } from "@/lib/motion/spring";
import { DiffRenderer } from "./diff-renderer";
import { LogStep } from "./log-step";

const TONE: Record<JobStatus, StatusTone> = {
  success: "indexed",
  failed: "error",
  cancelled: "neutral",
  "in-progress": "info",
};

function formatDuration(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 1000)}s`;
}

function shortSha(jobId: string): string {
  // Stable 7-char "commit" tag from the job id so each row reads commit-like.
  return jobId
    .replace(/[^a-f0-9]/gi, "")
    .slice(-7)
    .padStart(7, "0");
}

export function LogRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const stats = job.diffStats ?? { added: 0, modified: 0, removed: 0 };
  const totalDelta = stats.added + stats.modified + stats.removed;

  return (
    <article
      className="bg-white rounded-card shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-card)] transition-shadow"
      data-testid="log-row"
      data-state={open ? "expanded" : "collapsed"}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full grid grid-cols-[20px_1fr_auto] items-start gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="text-[#9ca3af] mt-0.5">
          {open ? (
            <ChevronDown size={16} strokeWidth={1.5} />
          ) : (
            <ChevronRight size={16} strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-caption text-[#777169]">{shortSha(job.id)}</span>
            <span className="text-button-upper text-[#1d4ed8] uppercase">{job.type}</span>
            <span className="text-caption text-[#777169]">·</span>
            <span className="text-caption text-[#4e4e4e] capitalize">{job.trigger}</span>
            {job.repoIds.slice(0, 3).map((r) => (
              <span
                key={r}
                className="px-2 py-0.5 rounded-pill bg-[#f5f2ef] text-caption text-[#4e4e4e] font-mono"
              >
                {r}
              </span>
            ))}
            {job.repoIds.length > 3 ? (
              <span className="text-caption text-[#777169]">+{job.repoIds.length - 3}</span>
            ) : null}
          </div>
          <p className="text-body-medium text-black line-clamp-1">{job.summary}</p>
          <p className="text-caption text-[#777169]">
            {new Date(job.startedAt).toLocaleString()} · {formatDuration(job.durationMs)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {totalDelta > 0 ? (
            <span className="hidden sm:inline-flex items-center gap-2 text-caption font-mono">
              <span className="text-[var(--color-accent-green-fg)]">+{stats.added}</span>
              <span className="text-[var(--color-accent-amber-fg)]">~{stats.modified}</span>
              <span className="text-[var(--color-accent-red-fg)]">-{stats.removed}</span>
            </span>
          ) : null}
          <StatusPill tone={TONE[job.status]}>{job.status}</StatusPill>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={CONTEXT_SPRING}
            className="overflow-hidden"
          >
            <div className="border-t border-[rgba(0,0,0,0.04)] px-4 py-4 space-y-4">
              <section className="space-y-2">
                <header className="flex items-center justify-between">
                  <h4 className="text-button-upper text-[#777169]">Agent execution</h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDiff((v) => !v);
                    }}
                    className="inline-flex items-center gap-1.5 text-caption text-[#1d4ed8] hover:underline"
                    data-testid="log-toggle-diff"
                  >
                    <GitCompare size={12} strokeWidth={1.75} />
                    {showDiff ? "Hide diff" : "View diff"}
                  </button>
                </header>
                <ul className="space-y-2">
                  {job.steps.map((step) => (
                    <li key={step.name}>
                      <LogStep step={step} />
                    </li>
                  ))}
                </ul>
              </section>

              {showDiff ? <DiffRenderer job={job} /> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
