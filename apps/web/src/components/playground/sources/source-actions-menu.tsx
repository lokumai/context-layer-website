"use client";

import type { Source } from "@context-layer/mocks";
import { MoreHorizontal, Pencil, RefreshCw, Trash2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";

const REINDEX_STEPS = [
  "Re-contacting provider",
  "Pulling latest",
  "Re-analyzing",
  "Re-indexing",
] as const;

export function SourceActionsMenu({ source }: { source: Source }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const rename = useStore((s) => s.renameSource);
  const remove = useStore((s) => s.removeSource);
  const markIndexing = useStore((s) => s.markIndexing);
  const markIndexed = useStore((s) => s.markIndexed);
  const toggleAutoSync = useStore((s) => s.toggleAutoSync);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  async function doRename() {
    setOpen(false);
    const next = window.prompt("Rename source", source.name);
    if (next?.trim() && next.trim() !== source.name) {
      rename(source.id, next.trim());
    }
  }

  async function doReindex() {
    setOpen(false);
    markIndexing(source.id);
    const iter = simulateJob([...REINDEX_STEPS], () => markIndexed(source.id), {
      totalMs: 3500,
      minStepMs: 400,
    });
    while (true) {
      const next = await iter.next();
      if (next.done) break;
    }
  }

  async function doDelete() {
    setOpen(false);
    if (window.confirm(`Delete source "${source.name}"? This cannot be undone.`)) {
      remove(source.id);
    }
  }

  function doToggleAutoSync() {
    setOpen(false);
    toggleAutoSync(source.id);
  }

  const canAutoSync = source.category !== "upload" && source.category !== "url";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1 rounded-standard text-[#777169] hover:bg-[#f5f5f5] hover:text-black"
        aria-label={`Actions for ${source.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal size={18} strokeWidth={1.5} />
      </button>
      {open ? (
        // biome-ignore lint/a11y/noStaticElementInteractions: wrapper only catches bubbled clicks from inner buttons; inner <MenuBtn>s are the interactive elements
        <div
          className="absolute right-0 mt-1 w-48 bg-white rounded-card shadow-[var(--shadow-card)] border border-[rgba(0,0,0,0.05)] overflow-hidden text-nav"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <MenuBtn onClick={doRename} icon={<Pencil size={14} strokeWidth={1.5} />}>
            Rename
          </MenuBtn>
          <MenuBtn onClick={doReindex} icon={<RefreshCw size={14} strokeWidth={1.5} />}>
            Re-index
          </MenuBtn>
          <MenuBtn
            onClick={doToggleAutoSync}
            icon={<Zap size={14} strokeWidth={1.5} />}
            disabled={!canAutoSync}
          >
            {source.autoSync ? "Disable auto-sync" : "Enable auto-sync"}
          </MenuBtn>
          <div className="border-t border-[rgba(0,0,0,0.05)]" />
          <MenuBtn onClick={doDelete} icon={<Trash2 size={14} strokeWidth={1.5} />} destructive>
            Delete
          </MenuBtn>
        </div>
      ) : null}
    </div>
  );
}

function MenuBtn({
  children,
  onClick,
  icon,
  disabled,
  destructive,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-2 inline-flex items-center gap-2 hover:bg-[#f9f9f9] disabled:opacity-40 disabled:cursor-not-allowed ${destructive ? "text-[#b91c1c]" : "text-black"}`}
    >
      {icon}
      {children}
    </button>
  );
}
