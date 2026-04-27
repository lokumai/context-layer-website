"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { StatusPill, type StatusTone } from "@/components/marketing/status-pill";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";

const REFRESH_STEPS = [
  "Recomputing health",
  "Re-scoring security",
  "Rebuilding dependency graph",
] as const;

function freshnessFromAge(iso: string | null): { tone: StatusTone; label: string } {
  if (!iso) return { tone: "neutral", label: "Not yet refreshed" };
  const delta = Date.now() - new Date(iso).getTime();
  const hour = 3_600_000;
  if (delta < 30 * 60_000) return { tone: "indexed", label: "Fresh" };
  if (delta < 24 * hour) return { tone: "info", label: "Recent" };
  return { tone: "warn", label: "Stale" };
}

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  if (delta < 60_000) return "just now";
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)}m ago`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)}h ago`;
  return `${Math.round(delta / 86_400_000)}d ago`;
}

/**
 * Compact freshness indicator + Refresh-Now button. Per Phase 13, this
 * lives inside each dashboard's heading row instead of a standalone strip
 * (no more `intelligence-config-header` row at the page top).
 */
export function IntelligenceFreshnessControls({ workspaceId }: { workspaceId: string }) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  const setHasIntelligence = useStore((s) => s.setHasIntelligence);
  const [refreshing, setRefreshing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  if (!workspace) return null;
  if (!workspace.hasIntelligence) return null;

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    const iter = simulateJob([...REFRESH_STEPS], () => undefined, {
      totalMs: 3000,
      minStepMs: 500,
    });
    while (true) {
      const next = await iter.next();
      if (next.done) break;
      setCurrentStep(next.value.step);
    }
    setHasIntelligence(workspaceId, true); // stamps new refresh timestamp
    setCurrentStep(null);
    setRefreshing(false);
  }

  const fresh = refreshing
    ? { tone: "info" as const, label: "Refreshing…" }
    : freshnessFromAge(workspace.intelligenceRefreshedAt);

  return (
    <div className="flex items-center gap-3" data-testid="intelligence-freshness-controls">
      <div className="hidden sm:flex items-center gap-2">
        <StatusPill tone={fresh.tone} dot>
          {fresh.label}
        </StatusPill>
        <span className="text-caption text-[#777169] truncate max-w-[200px]">
          {refreshing ? currentStep : `Updated ${relativeTime(workspace.intelligenceRefreshedAt)}`}
        </span>
      </div>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        className="inline-flex items-center gap-2 bg-white text-black rounded-pill px-4 py-1.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-outline-ring)] disabled:opacity-40 disabled:cursor-not-allowed text-button transition-shadow"
      >
        <RefreshCw size={14} strokeWidth={1.5} className={refreshing ? "animate-spin" : ""} />
        <span>{refreshing ? "Refreshing…" : "Refresh Now"}</span>
      </button>
    </div>
  );
}

// Backwards-compat alias — anything still importing the old name keeps working.
export const IntelligenceConfigHeader = IntelligenceFreshnessControls;
