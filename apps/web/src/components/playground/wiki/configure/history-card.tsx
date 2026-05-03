"use client";

import { History } from "lucide-react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { useStore } from "@/stores";

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (delta < 3_600_000) return `${Math.max(1, Math.round(delta / 60_000))}m ago`;
  if (delta < day) return `${Math.round(delta / 3_600_000)}h ago`;
  return `${Math.round(delta / day)}d ago`;
}

export function HistoryCard({ workspaceId }: { workspaceId: string }) {
  const jobs = useStore((s) => s.jobs).slice(0, 5);
  if (jobs.length === 0) return null;
  return (
    <section className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-6 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-standard bg-[#f5f5f5] text-[#525252] flex items-center justify-center">
            <History size={14} strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-button-upper text-[#777169]">Recent Activity</p>
            <h3 className="text-body-large text-black">Past generations and syncs</h3>
          </div>
        </div>
        <a
          href={`/workspace/${workspaceId}/wiki/logs`}
          className="text-button text-[#4e4e4e] hover:text-black underline underline-offset-2"
        >
          View all →
        </a>
      </header>
      <ul className="divide-y divide-[rgba(0,0,0,0.05)]">
        {jobs.map((j) => (
          <li key={j.id} className="flex items-center gap-4 py-2.5">
            <span className="text-micro font-mono text-[#777169] w-16">
              {relativeTime(j.startedAt)}
            </span>
            <span className="text-body-medium text-black flex-1 truncate">
              {j.type} · {j.trigger}
            </span>
            <span className="text-caption text-[#4e4e4e] hidden md:inline">
              {j.durationMs ? `${Math.round(j.durationMs / 1000)}s` : "—"}
            </span>
            <StatusPill
              tone={j.status === "success" ? "indexed" : j.status === "failed" ? "error" : "info"}
            >
              {j.status}
            </StatusPill>
          </li>
        ))}
      </ul>
    </section>
  );
}
