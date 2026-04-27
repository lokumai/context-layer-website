"use client";

import { useCallback, useState } from "react";
import { useStore } from "@/stores";
import type { WikiPayload } from "@/stores/types";
import { GenerationInProgress } from "./generation-in-progress";
import { HistoryCard } from "./history-card";
import { LivingState } from "./living-state";
import { NoWikiState } from "./no-wiki-state";

export type ConfigureMode = "idle" | "generating" | "living";

export function WikiConfigure({ workspaceId }: { workspaceId: string }) {
  const hasWiki = useStore((s) => s.workspaces.find((w) => w.id === workspaceId)?.hasWiki ?? false);
  const setGraduated = useStore((s) => s.setGraduated);
  const setWikiData = useStore((s) => s.setWikiData);

  const [mode, setMode] = useState<ConfigureMode>(hasWiki ? "living" : "idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepLogs, setStepLogs] = useState<Record<number, string[]>>({});

  const handleGenerationComplete = useCallback(async () => {
    // Narrow fetch — never persona-filtered; the Configure tab has "earned" it.
    try {
      const res = await fetch("/api/mocks/wiki-payload", { credentials: "same-origin" });
      if (res.ok) {
        const payload = (await res.json()) as WikiPayload;
        setWikiData(payload);
      }
    } catch (err) {
      console.error("[wiki-payload]", err);
    }
    setGraduated(workspaceId, true);
    setMode("living");
  }, [setGraduated, setWikiData, workspaceId]);

  return (
    <div className="w-full px-6 lg:px-10 py-10 space-y-8" data-testid="wiki-configure">
      <header className="space-y-2 max-w-[720px]">
        <p className="text-button-upper text-[#777169]">Wiki · Configure</p>
        <h1 className="text-section-heading text-black">
          Define the rules. The Wiki takes care of itself.
        </h1>
        <p className="text-body text-[#4e4e4e]">
          The first generation is the only inherently manual step. Once launched, WikiSync keeps the
          Wiki fresh on your chosen cadence.
        </p>
      </header>

      {mode === "idle" ? (
        <NoWikiState
          onStart={() => {
            setMode("generating");
            setCurrentStep(0);
            setStepLogs({});
          }}
        />
      ) : null}

      {mode === "generating" ? (
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
          onComplete={handleGenerationComplete}
          onCancel={() => {
            setMode("idle");
            setCurrentStep(0);
            setStepLogs({});
          }}
        />
      ) : null}

      {mode === "living" ? (
        <LivingState
          workspaceId={workspaceId}
          onRebuild={() => {
            setMode("generating");
            setCurrentStep(0);
            setStepLogs({});
          }}
          onDelete={() => {
            setGraduated(workspaceId, false);
            setWikiData({ tree: {}, narrative: null, sagaFlows: null, llms: {} });
            setMode("idle");
          }}
        />
      ) : null}

      <HistoryCard workspaceId={workspaceId} />
    </div>
  );
}
