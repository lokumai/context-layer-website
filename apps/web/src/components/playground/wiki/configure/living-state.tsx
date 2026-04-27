"use client";

import { FileText, Inbox, ListChecks, RefreshCw, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";

export function LivingState({
  workspaceId,
  onRebuild,
  onDelete,
}: {
  workspaceId: string;
  onRebuild: () => void;
  onDelete: () => void;
}) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  const sources = useStore((s) => s.sources);
  const markSynced = useStore((s) => s.markSynced);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncLabel, setLastSyncLabel] = useState("Just now");

  async function handleForceSync() {
    if (syncing) return;
    setSyncing(true);
    const iter = simulateJob(["Pulling latest", "Diffing", "Committing"], () => undefined, {
      totalMs: 3000,
    });
    while (true) {
      const next = await iter.next();
      if (next.done) break;
    }
    // Phase 14: every source the Wiki feeds on is now back in lock-step.
    for (const s of sources) markSynced(s.id);
    setLastSyncLabel("Just now");
    setSyncing(false);
  }

  if (!workspace) return null;

  return (
    <section
      className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-8 space-y-6"
      data-testid="wiki-living"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusPill tone="indexed" dot>
              Wiki Live
            </StatusPill>
            <StatusPill tone="info">Persistent · Versioned</StatusPill>
          </div>
          <h2 className="text-card-heading text-black">Your Wiki is live.</h2>
          <p className="text-caption text-[#4e4e4e]">
            WikiSync maintains it automatically on the schedule below.
          </p>
        </div>
      </header>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Fact
          icon={<RefreshCw size={14} strokeWidth={1.5} />}
          label="Sync strategy"
          value={strategyLabel(workspace.syncStrategy)}
        />
        <Fact icon={<Zap size={14} strokeWidth={1.5} />} label="Last sync" value={lastSyncLabel} />
        <Fact
          icon={<ListChecks size={14} strokeWidth={1.5} />}
          label="Last-run outcome"
          value="Success · 0 errors"
        />
        <Fact
          icon={<Inbox size={14} strokeWidth={1.5} />}
          label="Sources feeding"
          value={`${sources.length} of ${sources.length}`}
        />
      </dl>

      <div className="bg-[#f9f9f9] rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)]">
        <p className="text-button-upper text-[#777169] mb-1">Active instructions</p>
        <p className="text-body-standard text-[#4e4e4e]">
          <em>None provided at generation time.</em>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-[rgba(0,0,0,0.05)]">
        <ActionButton
          icon={<RefreshCw size={14} strokeWidth={1.5} />}
          label={syncing ? "Syncing…" : "Force Sync Now"}
          onClick={handleForceSync}
          disabled={syncing}
          primary
        />
        <ActionButton
          icon={<Zap size={14} strokeWidth={1.5} />}
          label="Force Rebuild"
          onClick={onRebuild}
        />
        <ActionButton
          icon={<RefreshCw size={14} strokeWidth={1.5} />}
          label="Change Sync Strategy"
          onClick={() =>
            window.alert("Sync strategy modal arrives with the rest of Configure polish.")
          }
        />
        <ActionButton
          icon={<Inbox size={14} strokeWidth={1.5} />}
          label="Edit Sources"
          onClick={() =>
            window.alert("Source-picker modal re-opens with the existing checkbox UI.")
          }
        />
        <ActionButton
          icon={<FileText size={14} strokeWidth={1.5} />}
          label="Edit Instructions"
          onClick={() => window.alert("Instructions modal — same textarea as first-gen.")}
        />
        <ActionButton
          icon={<Trash2 size={14} strokeWidth={1.5} />}
          label="Delete Wiki"
          onClick={() => {
            if (
              window.confirm(
                "Delete the Wiki and start over? Your Wiki markdown will be cleared. This cannot be undone.",
              )
            ) {
              onDelete();
            }
          }}
          destructive
        />
      </div>
    </section>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[#777169]">
        {icon}
        {label}
      </span>
      <span className="text-body-medium text-black">{value}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  primary,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  destructive?: boolean;
}) {
  const cls = primary
    ? "bg-black text-white hover:opacity-90"
    : destructive
      ? "bg-white text-[#b91c1c] shadow-[var(--shadow-inset-border)] hover:bg-[#fef2f2]"
      : "bg-white text-black shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-button transition-shadow ${cls} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function strategyLabel(s: string): string {
  const map: Record<string, string> = {
    "per-commit": "Per commit",
    "per-pr-merge": "Per PR merge",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    manual: "Manual only",
  };
  return map[s] ?? s;
}
