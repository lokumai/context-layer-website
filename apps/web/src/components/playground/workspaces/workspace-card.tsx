"use client";

import { Calendar, FileCode, Clock, ArrowUpRight } from "lucide-react";
import { type MouseEvent, useRef } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import type { RuntimeWorkspace } from "@/stores/types";

function formatRelative(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (delta < day) return "today";
  const days = Math.round(delta / day);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

export function WorkspaceCard({ workspace }: { workspace: RuntimeWorkspace }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <a
      ref={ref}
      href={`/workspace/${workspace.id}/sources`}
      onMouseMove={onMove}
      className="group relative flex flex-col gap-5 rounded-large bg-white p-6 shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow overflow-hidden"
      data-testid="workspace-card"
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(360px circle at var(--x) var(--y), rgba(78,50,23,0.06), transparent 60%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <p className="text-button-upper text-[#777169]">Workspace</p>
          <h3 className="text-card-heading text-black truncate">{workspace.name}</h3>
        </div>
        <ArrowUpRight size={18} strokeWidth={1.5} className="text-[#9ca3af] group-hover:text-black shrink-0 transition-colors" />
      </div>

      <dl className="relative grid grid-cols-3 gap-3 text-caption">
        <Fact icon={<FileCode size={14} strokeWidth={1.5} />} label="Sources" value={`${workspace.sourceCount}`} />
        <Fact icon={<Clock size={14} strokeWidth={1.5} />} label="Last activity" value={formatRelative(workspace.lastActivity)} />
        <Fact icon={<Calendar size={14} strokeWidth={1.5} />} label="Created" value={formatRelative(workspace.createdAt)} />
      </dl>

      <div className="relative flex flex-wrap items-center gap-2 pt-3 border-t border-[rgba(0,0,0,0.05)]">
        {workspace.hasWiki ? (
          <StatusPill tone="indexed" dot>Wiki Live</StatusPill>
        ) : (
          <StatusPill tone="warn" dot>Wiki Pending</StatusPill>
        )}
        <StatusPill tone={workspace.sourceCount > 0 ? "info" : "neutral"} dot>
          {workspace.sourceCount} {workspace.sourceCount === 1 ? "source" : "sources"}
        </StatusPill>
      </div>
    </a>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-[#777169]">
        {icon}
        {label}
      </span>
      <span className="text-body-medium text-black">{value}</span>
    </div>
  );
}
