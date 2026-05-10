"use client";

import type { Artifact, ArtifactBundle } from "@context-layer/mocks";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { TriangleLoader } from "@/components/playground/loaders/triangle-loader";
import { TrickleLogs } from "@/components/playground/loaders/trickle-logs";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";
import type { DocsGenCard, DocsGenOutputFormat } from "./catalog";
import { GenerateModal } from "./generate-modal";
import { PreviewModal } from "./preview-modal";
import { artifactIconFor, IconMark } from "../../icons/icon-mark";

export function ArtifactCard({
  bundle,
  card,
  workspaceId: _workspaceId,
}: {
  bundle: ArtifactBundle;
  card: DocsGenCard;
  workspaceId: string;
}) {
  const artifact = useStore((s) =>
    s.artifacts.find((a) => a.bundle === bundle && a.cardSlug === card.cardSlug),
  );
  const addArtifact = useStore((s) => s.addArtifact);

  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState({ i: 0, total: 6, label: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const icon = artifactIconFor(bundle, "markdown");

  const handleGenerate = async (data: {
    sources: string[];
    format: string;
    instructions: string;
  }) => {
    setIsModalOpen(false);
    setIsRunning(true);

    const steps = [
      "Gathering sources",
      "Parsing code",
      "Composing outline",
      "Drafting content",
      "Applying style",
      "Emitting artifact",
    ];

    const iter = simulateJob(steps, () => undefined, {
      totalMs: 8000,
      minStepMs: 500,
    });

    while (true) {
      const next = await iter.next();
      if (next.done) break;
      setStep({ i: next.value.index, total: next.value.total, label: next.value.step });
    }

    const newArtifact: Artifact = {
      id: artifact?.id || `${card.cardSlug}-${Date.now().toString(36)}`,
      bundle,
      cardSlug: card.cardSlug,
      title: card.title,
      description: card.description,
      markdown: `# ${card.title}\n\n_${card.description}_\n\nGenerated ${new Date().toISOString()}.`,
      tool: "docsgen",
      createdAt: new Date().toISOString(),
      status: "current",
      sizeBytes: (Math.floor(Math.random() * 50) + 10) * 1024,
      format: data.format as DocsGenOutputFormat,
      sourceRepos: data.sources,
    };

    addArtifact(newArtifact);
    setIsRunning(false);
  };

  const state = isRunning ? "running" : artifact ? "done" : "idle";

  return (
    <div
      className="bg-white rounded-xl border border-[#e5e5e5] p-5 flex flex-col h-full transition-all hover:border-[#d0d0d0] hover:shadow-sm"
      data-testid={`artifact-card-${card.cardSlug}`}
      data-state={state}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-[#f9f9f9] text-black">
          <IconMark icon={icon} size={22} className="w-[22px] h-[22px]" />
        </div>
        {artifact && !isRunning && <StatusPill tone="indexed">Generated</StatusPill>}
      </div>

      <div className="flex-1">
        <h3 className="text-card-heading text-black mb-1">{card.title}</h3>
        <p className="text-body text-[#4e4e4e] line-clamp-2">{card.description}</p>
      </div>

      <div className="mt-6 pt-5 border-t border-[#f5f5f5]">
        {isRunning ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TriangleLoader size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-body-medium text-black truncate">{step.label}</p>
                <p className="text-caption text-[#777169]">
                  Step {step.i + 1} of {step.total}
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${((step.i + 1) / step.total) * 100}%` }}
              />
            </div>
            <TrickleLogs topic="docsgen" />
          </div>
        ) : artifact ? (
          <div className="flex items-center justify-between">
            <div className="text-nav text-[#888] flex flex-col">
              <span>
                {Math.round(artifact.sizeBytes / 1024)}KB • {artifact.format?.toUpperCase()}
              </span>
              <span className="text-[11px] opacity-70">Just now</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-3 py-1.5 rounded-pill text-button bg-[#f5f2ef] text-black hover:bg-[#ece8e4] transition-colors"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-full text-[#4e4e4e] hover:text-black hover:bg-[#f9f9f9] transition-colors"
                title="Regenerate"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 bg-black text-white rounded-pill text-button hover:bg-[#1a1a1a] transition-colors"
          >
            Generate
          </button>
        )}
      </div>

      <GenerateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={card}
        existingArtifact={artifact}
        onSubmit={handleGenerate}
      />

      {artifact && (
        <PreviewModal
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          artifact={artifact}
        />
      )}
    </div>
  );
}
