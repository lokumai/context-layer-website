"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { simulateJob } from "@/lib/simulate-latency";
import type { ModalityPick } from "./landing";

const STEPS = [
  "Gathering context from the Wiki",
  "Outlining the narrative",
  "Composing content",
  "Rendering modality output",
  "Finalising artifact",
] as const;

export function OmniBoardGenerationProgress({
  pick,
  onComplete,
}: {
  pick: ModalityPick;
  onComplete: () => void;
}) {
  const [current, setCurrent] = useState<{ i: number; label: string }>({
    i: 0,
    label: STEPS[0],
  });
  const completedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const iter = simulateJob([...STEPS], () => undefined, {
        totalMs: 15000,
        minStepMs: 1200,
      });
      while (!cancelled) {
        const n = await iter.next();
        if (n.done) break;
        setCurrent({ i: n.value.index, label: n.value.step });
      }
      if (!cancelled && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  const percent = Math.min(100, Math.round(((current.i + 1) / STEPS.length) * 100));

  return (
    <div className="max-w-xl mx-auto py-16 px-6" data-testid="omniboard-generation-progress">
      <div className="bg-white rounded-card shadow-[var(--shadow-card)] p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-[16px] bg-[#fdf6ec] text-[#b45309] flex items-center justify-center mb-5">
          <Sparkles size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-section-heading text-black mb-2">Generating {pick.option}</h2>
        <p className="text-body text-[#4e4e4e] mb-6">
          In production, this {pick.modality} generation can take up to 30 minutes. Feel free to
          leave — we'll save it to the Library when it's ready.
        </p>

        <div className="h-2 w-full rounded-full bg-[#f0f0f0] overflow-hidden mb-4">
          <div
            className="h-full bg-black transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-body-medium text-black">{current.label}…</p>
        <p className="text-caption text-[#777169] mt-1">
          Step {current.i + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
