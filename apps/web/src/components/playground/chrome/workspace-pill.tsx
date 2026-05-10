"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { RuntimeWorkspace } from "@/stores/types";

interface Props {
  workspace: RuntimeWorkspace;
  allWorkspaces: RuntimeWorkspace[];
}

export function WorkspacePill({ workspace, allWorkspaces }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white shadow-[var(--shadow-inset-border)] text-nav text-black hover:bg-[#f5f5f5] transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="max-w-[180px] truncate">{workspace.name}</span>
        <ChevronDown size={14} strokeWidth={1.5} className="text-[#777169]" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute left-0 mt-1 w-64 bg-white rounded-card shadow-[var(--shadow-card)] border border-[rgba(0,0,0,0.05)] overflow-hidden text-nav"
          >
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[#777169]">
              Recent workspaces
            </div>
            {allWorkspaces.map((w) => (
              <a
                key={w.id}
                href={`/workspace/${w.id}/sources`}
                className={`block px-3 py-2 text-black hover:bg-[#f9f9f9] ${w.id === workspace.id ? "bg-[#f5f2ef]" : ""}`}
              >
                {w.name}
              </a>
            ))}
            <div className="border-t border-[rgba(0,0,0,0.05)]" />
            <a href="/workspaces" className="block px-3 py-2 text-[#4e4e4e] hover:bg-[#f9f9f9]">
              All workspaces →
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
