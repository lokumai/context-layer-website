"use client";

import type { ReactNode } from "react";
import { ChatbotSideDock } from "@/components/playground/chatbot/slide-over";
import { useStore } from "@/stores";
import { IntelligenceNeedsWikiState } from "./empty-state-needs-wiki";
import { GenerateIntelligenceSurface } from "./generation";

// Wraps every Intelligence dashboard page with:
//   - hasWiki gate → "Generate Wiki first" empty state
//   - hasWiki + !hasIntelligence → Generate/Progress surface
//   - hasWiki + hasIntelligence → just renders the dashboard (each dashboard
//     owns its own heading row + freshness controls — Phase 13 removed the
//     standalone config-header strip).

export function IntelligencePageShell({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: ReactNode;
}) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  if (!workspace) return null;

  if (!workspace.hasWiki) {
    return <IntelligenceNeedsWikiState workspaceId={workspaceId} />;
  }

  if (!workspace.hasIntelligence) {
    return (
      <div className="w-full px-6 lg:px-10 py-10 space-y-6">
        <GenerateIntelligenceSurface workspaceId={workspaceId} />
      </div>
    );
  }

  return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-6" data-testid="intelligence-page">
      {children}
      <ChatbotSideDock workspaceId={workspaceId} contextLabel="Ask about these metrics…" />
    </div>
  );
}
