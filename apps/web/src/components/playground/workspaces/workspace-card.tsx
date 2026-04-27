"use client";

import { ArrowUpRight, Calendar, Clock, FileCode } from "lucide-react";
import { motion } from "motion/react";
import { type MouseEvent, useRef } from "react";
import { CONTEXT_SPRING, staggerDelay } from "@/lib/motion/spring";
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

export function WorkspaceCard({
  workspace,
  index = 0,
}: {
  workspace: RuntimeWorkspace;
  index?: number;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  // Description is mock-populated for the `full` persona; user-created
  // workspaces start with an empty string until the create modal collects
  // one. When empty we render a subtle placeholder so the card height stays
  // consistent across the grid.
  const description = workspace.description?.trim();

  return (
    <motion.a
      ref={ref}
      href={`/workspace/${workspace.id}/sources`}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...CONTEXT_SPRING, delay: staggerDelay(index) }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col gap-4 rounded-large bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow overflow-hidden"
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
        <h3
          className="text-card-heading text-black line-clamp-2 break-words flex-1"
          data-testid="workspace-card-name"
        >
          {workspace.name}
        </h3>
        <ArrowUpRight
          size={18}
          strokeWidth={1.5}
          className="text-[#9ca3af] group-hover:text-black shrink-0 transition-colors mt-1"
        />
      </div>

      <p
        className="relative text-body text-[#4e4e4e] line-clamp-2 min-h-[2.6em]"
        data-testid="workspace-card-description"
      >
        {description || <span className="text-[#9ca3af] italic">No description</span>}
      </p>

      <dl className="relative grid grid-cols-3 gap-3 pt-3 border-t border-[rgba(0,0,0,0.05)]">
        <Fact
          icon={<FileCode size={14} strokeWidth={1.5} />}
          label="Sources"
          value={`${workspace.sourceCount}`}
        />
        <Fact
          icon={<Clock size={14} strokeWidth={1.5} />}
          label="Last activity"
          value={formatRelative(workspace.lastActivity)}
        />
        <Fact
          icon={<Calendar size={14} strokeWidth={1.5} />}
          label="Created"
          value={formatRelative(workspace.createdAt)}
        />
      </dl>
    </motion.a>
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
