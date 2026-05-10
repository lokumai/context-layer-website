"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { TriangleLoader } from "@/components/playground/loaders/triangle-loader";
import { TrickleLogs } from "@/components/playground/loaders/trickle-logs";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";
import type { IntelligencePayload } from "@/stores/types";

const STEPS = [
  "Scanning Health",
  "Running Security Analysis",
  "Collecting Coverage Data",
  "Analysing Dependencies",
  "Building Knowledge Graph",
  "Finalising Report",
] as const;

const LOG_FRAGMENTS = [
  "Warming up the analyser…",
  "Walking AST…",
  "Cross-referencing…",
  "Computing metrics…",
  "Projecting results…",
  "Publishing dashboard…",
];

type Mode = "idle" | "generating";

export function GenerateIntelligenceSurface({ workspaceId }: { workspaceId: string }) {
  const [mode, setMode] = useState<Mode>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepLogs, setStepLogs] = useState<Record<number, string[]>>({});
  const setIntelligenceData = useStore((s) => s.setIntelligenceData);
  const setHasIntelligence = useStore((s) => s.setHasIntelligence);

  const handleComplete = useCallback(async () => {
    try {
      const res = await fetch("/api/mocks/intelligence-payload", {
        credentials: "same-origin",
      });
      if (res.ok) {
        const payload = (await res.json()) as IntelligencePayload;
        setIntelligenceData(payload);
      }
    } catch (err) {
      console.error("[intelligence-payload]", err);
    }
    setHasIntelligence(workspaceId, true);
  }, [setIntelligenceData, setHasIntelligence, workspaceId]);

  if (mode === "idle") {
    return (
      <GenerateIntelligenceCard
        onStart={() => {
          setMode("generating");
          setCurrentStep(0);
          setStepLogs({});
        }}
      />
    );
  }

  return (
    <GenerationInProgress
      currentStep={currentStep}
      stepLogs={stepLogs}
      onStepAdvance={(stepIdx, log) => {
        setCurrentStep(stepIdx);
        setStepLogs((prev) => ({
          ...prev,
          [stepIdx]: [...(prev[stepIdx] ?? []), log],
        }));
      }}
      onComplete={handleComplete}
      onCancel={() => {
        setMode("idle");
        setCurrentStep(0);
        setStepLogs({});
      }}
    />
  );
}

function GenerateIntelligenceCard({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] px-10 py-16 text-center space-y-6 max-w-[760px] mx-auto"
      data-testid="generate-intelligence-card"
    >
      <div className="mx-auto w-14 h-14 rounded-comfortable bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
        <Sparkles size={28} strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        <h2 className="text-section-heading text-black">Intelligence isn't generated yet.</h2>
        <p className="text-body text-[#4e4e4e] max-w-[520px] mx-auto">
          Intelligence scans your codebase for health, security, coverage, and dependencies. This is
          a long-running job — it can take a while the first time. Subsequent refreshes chain
          automatically after every Wiki sync.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 bg-[rgba(245,242,239,0.8)] text-black rounded-warm-btn px-7 py-3 transition-transform hover:scale-[1.02] shadow-[var(--shadow-warm)]"
        data-testid="generate-intelligence-trigger"
      >
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-button-upper">Generate Intelligence</span>
      </button>
    </section>
  );
}

interface ProgressProps {
  currentStep: number;
  stepLogs: Record<number, string[]>;
  onStepAdvance: (stepIdx: number, log: string) => void;
  onComplete: () => void;
  onCancel: () => void;
}

function GenerationInProgress({
  currentStep,
  stepLogs,
  onStepAdvance,
  onComplete,
  onCancel,
}: ProgressProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const cancelled = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const iter = simulateJob([...STEPS], () => undefined, {
        totalMs: 5500,
        minStepMs: 400,
      });
      let stepIdx = 0;
      while (true) {
        const next = await iter.next();
        if (cancelled.current) return;
        if (next.done) break;
        const fragment = LOG_FRAGMENTS[stepIdx % LOG_FRAGMENTS.length];
        onStepAdvance(
          stepIdx,
          `[${new Date().toISOString().slice(11, 19)}] ${fragment} — ${next.value.step}`,
        );
        stepIdx += 1;
      }
      if (!cancelled.current) onComplete();
    })();
    return () => {
      cancelled.current = true;
    };
  }, [onStepAdvance, onComplete]);

  function handleCancel() {
    if (window.confirm("Cancel Intelligence generation?")) {
      cancelled.current = true;
      onCancel();
    }
  }

  return (
    <section
      className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-8 space-y-6 max-w-[900px] mx-auto"
      data-testid="intelligence-generating"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <TriangleLoader size={56} />
          <div className="space-y-1">
            <p className="text-button-upper text-[#1d4ed8]">Generation in progress</p>
            <h2 className="text-card-heading text-black">Generating Intelligence…</h2>
            <p className="text-caption text-[#4e4e4e]">
              {Math.min(currentStep + 1, STEPS.length)} / {STEPS.length} steps running · background
              job
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="text-button text-[#b91c1c] hover:underline underline-offset-2"
        >
          Cancel
        </button>
      </header>

      <TrickleLogs topic="intelligence" complete={currentStep >= STEPS.length} />

      <div className="h-1.5 w-full bg-[#f5f5f5] rounded-pill overflow-hidden">
        <div
          className="h-full bg-[#1d4ed8] transition-all duration-500"
          style={{
            width: `${Math.min(((currentStep + 1) / STEPS.length) * 100, 100)}%`,
          }}
        />
      </div>

      <ol className="space-y-2">
        {STEPS.map((step, i) => {
          const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
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
