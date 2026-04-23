"use client";

import type { SyncStatus } from "@context-layer/mocks";

const TONE: Record<SyncStatus, { bg: string; fg: string; label: string; pulse: boolean }> = {
  live: { bg: "#ecfdf5", fg: "#047857", label: "Live", pulse: false },
  syncing: { bg: "#eff6ff", fg: "#1d4ed8", label: "Syncing", pulse: true },
  queued: { bg: "#fffbeb", fg: "#b45309", label: "Queued", pulse: false },
  outdated: { bg: "#f5f5f5", fg: "#525252", label: "Outdated", pulse: false },
};

export function SyncHeartbeat({ status }: { status: SyncStatus }) {
  const t = TONE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[10px] uppercase tracking-[0.08em] font-semibold"
      style={{ backgroundColor: t.bg, color: t.fg }}
      title={`Workspace sync: ${t.label}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full bg-current ${t.pulse ? "animate-pulse" : ""}`}
      />
      {t.label}
    </span>
  );
}
