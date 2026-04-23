"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "@/stores";
import { SourceStatusBadge } from "./status-badge";

export function SourcePreviewModal() {
  const activeId = useStore((s) => s.activeSourcePreviewId);
  const setActiveId = useStore((s) => s.setActiveSourcePreviewId);
  const source = useStore((s) => s.sources.find((x) => x.id === activeId));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setActiveId]);

  if (!activeId || !source) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div
        className="fixed inset-0"
        onClick={() => setActiveId(null)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[540px] h-full bg-white shadow-[var(--shadow-card)] flex flex-col overflow-hidden">
        <header className="sticky top-0 flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.05)] bg-white z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-button-upper text-[#777169]">Preview</span>
              <SourceStatusBadge status={source.status} />
            </div>
            <h2 className="text-card-heading">{source.name}</h2>
            <p className="text-caption text-[#777169]">{source.path}</p>
          </div>
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setActiveId(null)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {source.kind === "code" ? (
            <>
              <div className="bg-[#f9f9f9] rounded-card p-6 border border-[rgba(0,0,0,0.05)] text-center">
                <p className="text-body text-[#777169]">
                  Wiki preview lands with Phase 7 (Knowledge UI). For now this is
                  a placeholder.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FactCard label="Line Count" value={source.lineCount.toLocaleString()} />
                <FactCard label="Token Count" value={source.tokenCount.toLocaleString()} />
                <FactCard
                  label="Primary Language"
                  value={source.primaryLanguage}
                />
                <FactCard label="Category" value={source.category} />
              </div>
            </>
          ) : (
            <div className="bg-[#f9f9f9] rounded-card p-6 border border-[rgba(0,0,0,0.05)] text-center">
              <p className="text-body text-[#777169]">
                File preview opens in the Library (Phase 11).
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-card p-4 shadow-[var(--shadow-inset-border)]">
      <p className="text-button-upper text-[#777169] mb-1">{label}</p>
      <p className="text-body-medium text-black">{value}</p>
    </div>
  );
}
