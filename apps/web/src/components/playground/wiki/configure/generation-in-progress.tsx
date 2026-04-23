"use client";

import { CheckCircle2, ChevronDown, ChevronRight, CircleDashed, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { simulateJob } from "@/lib/simulate-latency";
import { StatusPill } from "@/components/marketing/status-pill";

const STEPS = [
  "Clone sources",
  "Parse ASTs",
  "Extract semantics",
  "Compose workspace narrative",
  "Generate per-repo wikis",
  "Emit llms.txt",
] as const;

const LOG_FRAGMENTS = [
  "Orchestrating…",
  "Synthesising…",
  "Reading source map…",
  "Cross-referencing modules…",
  "Committing to repo wiki…",
  "Running quality pass…",
  "Embedding canonical refs…",
  "Normalising markdown…",
];

interface Props {
  currentStep: number;
  stepLogs: Record<number, string[]>;
  onStepAdvance: (stepIdx: number, log: string) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export function GenerationInProgress({
  currentStep,
  stepLogs,
  onStepAdvance,
  onComplete,
  onCancel,
}: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const cancelled = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const iter = simulateJob([...STEPS], () => undefined, {
        totalMs: 8000,
        minStepMs: 600,
      });
      let stepIdx = 0;
      while (true) {
        const next = await iter.next();
        if (cancelled.current) return;
        if (next.done) break;
        const fragment = LOG_FRAGMENTS[stepIdx % LOG_FRAGMENTS.length];
        onStepAdvance(stepIdx, `[${new Date().toISOString().slice(11, 19)}] ${fragment} ${next.value.step}`);
        stepIdx += 1;
      }
      if (!cancelled.current) onComplete();
    })();
    return () => {
      cancelled.current = true;
    };
  }, [onStepAdvance, onComplete]);

  function handleCancel() {
    if (window.confirm("Cancel Wiki generation?")) {
      cancelled.current = true;
      onCancel();
    }
  }

  return (
    <section className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-8 space-y-6" data-testid="wiki-generating">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-button-upper text-[#1d4ed8]">Generation in progress</p>
          <h2 className="text-card-heading text-black">
            Generating your first Wiki…
          </h2>
          <p className="text-caption text-[#4e4e4e]">
            {Math.min(currentStep + 1, STEPS.length)} / {STEPS.length} steps running · background job
          </p>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="text-button text-[#b91c1c] hover:underline underline-offset-2"
        >
          Cancel
        </button>
      </header>

      <div className="h-1.5 w-full bg-[#f5f5f5] rounded-pill overflow-hidden">
        <div
          className="h-full bg-[#1d4ed8] transition-all duration-500"
          style={{ width: `${Math.min(((currentStep + 1) / STEPS.length) * 100, 100)}%` }}
        />
      </div>

      <ol className="space-y-2">
        {STEPS.map((step, i) => {
          const state =
            i < currentStep ? "done" : i === currentStep ? "active" : "pending";
          const isOpen = expanded[i] ?? state === "active";
          const logs = stepLogs[i] ?? [];
          return (
            <li
              key={step}
              className="bg-[#f9f9f9] rounded-card shadow-[var(--shadow-inset-border)]"
            >
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [i]: !isOpen }))}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                aria-expanded={isOpen}
              >
                <span className="shrink-0">
                  {state === "done" ? (
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#047857]" />
                  ) : state === "active" ? (
                    <Loader2 size={16} strokeWidth={1.5} className="text-[#1d4ed8] animate-spin" />
                  ) : (
                    <CircleDashed size={16} strokeWidth={1.5} className="text-[#9ca3af]" />
                  )}
                </span>
                <span className="flex-1 text-body-medium text-black">{step}</span>
                {state === "done" ? <StatusPill tone="indexed">Done</StatusPill> : null}
                {state === "active" ? <StatusPill tone="info">Running</StatusPill> : null}
                {isOpen ? (
                  <ChevronDown size={14} strokeWidth={1.5} className="text-[#777169]" />
                ) : (
                  <ChevronRight size={14} strokeWidth={1.5} className="text-[#777169]" />
                )}
              </button>
              {isOpen && logs.length > 0 ? (
                <div className="px-4 pb-3 font-mono text-caption text-[#4e4e4e] space-y-0.5">
                  {logs.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
