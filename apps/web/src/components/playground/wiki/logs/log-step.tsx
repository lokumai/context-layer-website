"use client";

import type { Job, JobStatus } from "@context-layer/mocks";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { StatusPill, type StatusTone } from "@context-layer/ui/components/marketing/status-pill";
import { CONTEXT_SPRING } from "@/lib/motion/spring";

const TONE: Record<JobStatus, StatusTone> = {
  success: "indexed",
  failed: "error",
  cancelled: "neutral",
  "in-progress": "info",
};

// Per-step sub-log lines synthesised from the step name + summary so the
// expanded accordion feels like a real agent execution log.
function fakeLogLines(step: Job["steps"][number]): string[] {
  const base = [`▸ ${step.name} started`, `  ${step.summary}`];
  if (step.status === "success") {
    base.push("  ✓ exit 0", `▸ ${step.name} finished`);
  } else if (step.status === "failed") {
    base.push("  ✗ non-zero exit");
  } else if (step.status === "in-progress") {
    base.push("  … running");
  } else if (step.status === "cancelled") {
    base.push("  ⊘ cancelled by user");
  }
  return base;
}

export function LogStep({ step }: { step: Job["steps"][number] }) {
  const [open, setOpen] = useState(false);
  const lines = fakeLogLines(step);

  return (
    <div
      className="bg-[#fafafa] rounded-card border border-[rgba(0,0,0,0.04)]"
      data-testid="log-step"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f5f2ef] transition-colors rounded-card"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown size={14} strokeWidth={1.5} className="text-[#777169]" />
        ) : (
          <ChevronRight size={14} strokeWidth={1.5} className="text-[#777169]" />
        )}
        <span className="font-mono text-caption text-black truncate flex-1">{step.name}</span>
        <StatusPill tone={TONE[step.status]}>{step.status}</StatusPill>
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
            <pre className="bg-[#0a0a0a] text-[#e5e5e5] font-mono text-caption px-4 py-3 m-3 mt-0 rounded-card leading-relaxed">
              {lines.join("\n")}
            </pre>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
