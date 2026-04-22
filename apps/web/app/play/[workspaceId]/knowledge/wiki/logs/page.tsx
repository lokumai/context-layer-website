"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, GitCommit, Minus, Plus, Timer } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/meta-field";
import { IconTile } from "@/components/ui/icon-tile";

export default function WikiLogsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const jobs = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId)?.wikiJobs ?? []);

  if (jobs.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={GitCommit} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[40px] leading-[1.05] tracking-display">
          No jobs <span className="font-editorial">yet.</span>
        </h1>
        <p className="mt-4 text-[14.5px] text-[var(--color-ink-muted)]">
          Every Wiki sync becomes a git commit. Once you run one, it'll appear here with full agent rationale.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 py-12 md:px-10 md:py-16">
      <FadeIn>
        <SectionLabel>Wiki · Logs</SectionLabel>
        <h1 className="font-display mt-5 text-[52px] leading-[1.02] tracking-display">
          Every sync is a <span className="font-editorial">commit.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
          The audit trail your auditors actually want. Browse every run, inspect the diff, read the agent's rationale.
        </p>
      </FadeIn>

      <ol className="relative space-y-5 border-l border-[var(--color-border-subtle)] pl-10">
        {jobs.map((j, i) => (
          <JobEntry key={j.id} job={j} isLatest={i === 0} />
        ))}
      </ol>
    </div>
  );
}

function JobEntry({
  job: j,
  isLatest,
}: {
  job: ReturnType<typeof usePlaygroundStore.getState>["workspaces"][number]["wikiJobs"][number];
  isLatest: boolean;
}) {
  const [open, setOpen] = useState(isLatest);

  return (
    <li className="relative">
      <span
        className={cn(
          "absolute -left-[43px] top-6 flex h-5 w-5 items-center justify-center rounded-full",
          isLatest ? "bg-[var(--color-ink)] text-white" : "bg-white ring-1 ring-[var(--color-border-strong)] text-[var(--color-ink-muted)]",
        )}
      >
        <GitCommit size={10} strokeWidth={2} />
      </span>

      <Card variant="inset" padding="spacious" radius="large" className="overflow-hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-[22px] leading-none capitalize">
                {j.type} <span className="text-[var(--color-ink-whisper)]">·</span>{" "}
                <span className="font-editorial text-[var(--color-ink-muted)]">{j.trigger}</span>
              </h3>
              <Badge tone={j.status === "success" ? "success" : j.status === "failed" ? "danger" : "warn"}>
                {j.status}
              </Badge>
              {isLatest && <Badge tone="warm">Latest</Badge>}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 font-mono text-[11.5px] text-[var(--color-ink-whisper)]">
              <span>{j.startedAt}</span>
              <span className="flex items-center gap-1">
                <Timer size={11} strokeWidth={1.8} />
                {(j.durationMs / 1000).toFixed(0)}s
              </span>
              <span className="font-mono uppercase tracking-[0.14em]">{j.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1 text-emerald-700">
              <Plus size={11} strokeWidth={2} />
              {j.diffSummary.linesAdded}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <Minus size={11} strokeWidth={2} />
              {j.diffSummary.linesRemoved}
            </span>
            <span className="text-[var(--color-ink-muted)]">{j.diffSummary.filesAdded + j.diffSummary.filesModified} files</span>
          </div>
        </div>

        <div className="mt-5 border-t border-[var(--color-border-subtle)] pt-4">
          <button
            onClick={() => setOpen((o) => !o)}
            className="group flex items-center gap-2 text-[12.5px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={cn("transition-transform", open && "rotate-180")}
            />
            Agent logs · {j.agentLogs.length} step{j.agentLogs.length === 1 ? "" : "s"}
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <ul className="mt-4 space-y-2 rounded-[12px] bg-[var(--color-ink)] px-5 py-4 font-mono text-[12px] leading-relaxed text-white/80">
                  {j.agentLogs.map((log, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-3"
                    >
                      <span className="text-white/40">›</span>
                      <span>{log}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </li>
  );
}
