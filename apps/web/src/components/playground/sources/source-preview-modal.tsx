/** biome-ignore-all lint/a11y/noStaticElementInteractions: scrim div is the backdrop close target; real keyboard path is the X button + Escape listener. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: scrim has aria-hidden + Escape window handler. */
"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONTEXT_SPRING } from "@/lib/motion/spring";
import { useStore } from "@/stores";
import { KnowledgeSyncBadge } from "./knowledge-sync-badge";
import { SourcePreviewBody } from "./source-preview-body";
import { SourceStatusBadge } from "./status-badge";

const COLLAPSED_WIDTH = 540;
const EXPANDED_WIDTH = 900;
const MIN_WIDTH = 380;
const MAX_WIDTH_VW = 0.95;

export function SourcePreviewModal() {
  const activeId = useStore((s) => s.activeSourcePreviewId);
  const setActiveId = useStore((s) => s.setActiveSourcePreviewId);
  const source = useStore((s) => s.sources.find((x) => x.id === activeId));

  const [expanded, setExpanded] = useState(false);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const draggingRef = useRef(false);

  // The expand toggle owns the canonical width; drag is a manual override
  // that resets when the user collapses or closes.
  const close = useCallback(() => {
    setActiveId(null);
    setExpanded(false);
    setDragWidth(null);
  }, [setActiveId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      const fromRight = window.innerWidth - ev.clientX;
      const clamped = Math.min(
        Math.max(fromRight, MIN_WIDTH),
        Math.floor(window.innerWidth * MAX_WIDTH_VW),
      );
      setDragWidth(clamped);
    };
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const open = activeId !== null && source !== undefined;
  const width = dragWidth ?? (expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50" data-testid="source-preview-overlay">
          <motion.div
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed top-0 right-0 h-full bg-white shadow-[var(--shadow-card)] flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0, width }}
            exit={{ x: "100%" }}
            transition={CONTEXT_SPRING}
            style={{ width }}
            data-testid="source-preview-panel"
            data-expanded={expanded ? "true" : "false"}
          >
            {/* Drag handle on the left edge — mouse-only (the expand button + Escape provide the keyboard path). */}
            <div
              aria-hidden="true"
              onMouseDown={startDrag}
              className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-[#f5f2ef] transition-colors z-20"
              data-testid="source-preview-drag-handle"
            />

            <header className="sticky top-0 flex items-start justify-between gap-3 p-6 border-b border-[rgba(0,0,0,0.05)] bg-white z-10">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SourceStatusBadge status={source.status} />
                  <KnowledgeSyncBadge status={source.knowledgeSync} />
                </div>
                <h2 className="text-card-heading line-clamp-2 break-words">{source.name}</h2>
                <p className="text-caption text-[#777169] truncate">{source.path}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label={expanded ? "Collapse panel" : "Expand panel"}
                  onClick={() => {
                    setExpanded((v) => !v);
                    setDragWidth(null);
                  }}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                  data-testid="source-preview-expand"
                >
                  {expanded ? (
                    <Minimize2 size={16} strokeWidth={1.5} />
                  ) : (
                    <Maximize2 size={16} strokeWidth={1.5} />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Close preview"
                  onClick={close}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
              <SourcePreviewBody source={source} />
            </main>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
