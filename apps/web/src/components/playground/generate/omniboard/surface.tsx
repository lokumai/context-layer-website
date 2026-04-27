"use client";

import type { Artifact, ArtifactFormat } from "@context-layer/mocks";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useStore } from "@/stores";
import { OmniBoardExploration } from "./exploration";
import { OmniBoardGenerationProgress } from "./generation-progress";
import { type ModalityPick, OmniBoardLanding } from "./landing";
import { OmniBoardSession } from "./session";

// Per UI_UX §7.2, OmniBoard is a specialized chatbot environment:
// Landing → modality picked → Session (chat + plan) → Generate → Progress
// → **Exploration** (NotebookLM-style — Phase 17 replaced the old Done card).

type SessionPhase =
  | { kind: "landing" }
  | { kind: "session"; pick: ModalityPick }
  | { kind: "generating"; pick: ModalityPick; goal: string }
  | { kind: "exploring"; pick: ModalityPick; artifact: Artifact };

export function OmniBoardSurface({ workspaceId }: { workspaceId: string }) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  // Session phase is local UI state that starts at landing; the wiki gate
  // is re-evaluated from the store on every render so late hydration flips
  // "needs-wiki" → "landing" correctly.
  const [phase, setPhase] = useState<SessionPhase>({ kind: "landing" });
  const addArtifact = useStore((s) => s.addArtifact);

  const startSession = useCallback((pick: ModalityPick) => {
    setPhase({ kind: "session", pick });
  }, []);

  const beginGeneration = useCallback((pick: ModalityPick, goal: string) => {
    setPhase({ kind: "generating", pick, goal });
  }, []);

  const finishGeneration = useCallback(
    (pick: ModalityPick, goal: string) => {
      const format = modalityToFormat(pick.modality);
      const artifact: Artifact = {
        id: `omni-${pick.modality}-${Date.now().toString(36)}`,
        bundle: "research-docs",
        title: `${pick.option} · ${pick.modality[0].toUpperCase()}${pick.modality.slice(1)}`,
        description: goal.slice(0, 140) || `OmniBoard-generated ${pick.modality}.`,
        cardSlug: `omni-${pick.modality}-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        sizeBytes:
          pick.modality === "slides" ? 48_000 : pick.modality === "audio" ? 2_300_000 : 18_000_000,
        format,
        status: "current",
        sourceRepos: [],
        markdown: buildOmniBoardStub(pick, goal),
        tool: "omniboard",
      };
      addArtifact(artifact);
      setPhase({ kind: "exploring", pick, artifact });
    },
    [addArtifact],
  );

  if (!workspace) return null;
  if (!workspace.hasWiki) return <NeedsWikiEmpty workspaceId={workspaceId} />;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#f9f9f9]" data-testid="omniboard-surface">
      {phase.kind === "landing" ? <OmniBoardLanding onPick={startSession} /> : null}

      {phase.kind === "session" ? (
        <OmniBoardSession
          workspaceId={workspaceId}
          pick={phase.pick}
          onBack={() => setPhase({ kind: "landing" })}
          onGenerate={(goal) => beginGeneration(phase.pick, goal)}
        />
      ) : null}

      {phase.kind === "generating" ? (
        <OmniBoardGenerationProgress
          pick={phase.pick}
          onComplete={() => finishGeneration(phase.pick, phase.goal)}
        />
      ) : null}

      {phase.kind === "exploring" ? (
        <OmniBoardExploration
          workspaceId={workspaceId}
          pick={phase.pick}
          artifact={phase.artifact}
          onPlanAnother={() => setPhase({ kind: "landing" })}
        />
      ) : null}
    </div>
  );
}

function NeedsWikiEmpty({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="max-w-2xl mx-auto py-24 text-center" data-testid="omniboard-needs-wiki">
      <div className="mx-auto w-[56px] h-[56px] rounded-[16px] bg-[#ede9fe] text-[#6d28d9] flex items-center justify-center mb-6">
        <BookOpen size={28} strokeWidth={1.5} />
      </div>
      <h1 className="text-section-heading text-black mb-3">
        Generate the Wiki first to unlock OmniBoard.
      </h1>
      <p className="text-body text-[#4e4e4e] mb-6">
        OmniBoard plans onboarding artifacts from your workspace's Wiki. Generate one first.
      </p>
      <Link
        href={`/workspace/${workspaceId}/wiki/configure`}
        className="inline-flex items-center gap-2 bg-black text-white rounded-pill px-5 py-2 text-button hover:bg-[#1a1a1a] transition-colors"
      >
        Go to Wiki Configure
      </Link>
    </div>
  );
}

function modalityToFormat(modality: ModalityPick["modality"]): ArtifactFormat {
  return modality; // "slides" | "audio" | "video" are all valid ArtifactFormat values
}

function buildOmniBoardStub(pick: ModalityPick, goal: string): string {
  return `# ${pick.option} · ${pick.modality}

> Goal: ${goal || "Onboard new team members onto the workspace."}

This is a mock OmniBoard artifact. In production, this ${pick.modality} would be a real
multimodal output generated from the workspace's Wiki + indexed sources, tailored to the
\`${pick.option}\` style.

## Outline

1. Workspace overview
2. Architecture at a glance
3. Domain language
4. The critical flows
5. Where to look when things break
`;
}
