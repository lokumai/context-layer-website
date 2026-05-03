/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + stop-propagation wrapper — real controls are buttons inside. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Escape is handled via a window listener; close X button is the keyboard path. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { Copy, Download, X } from "lucide-react";
import { useEffect } from "react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { WikiMarkdown } from "@/components/playground/wiki/view/markdown";

export function PreviewModal({
  open,
  onClose,
  artifact,
}: {
  open: boolean;
  onClose: () => void;
  artifact: Artifact;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleCopy = () => {
    alert("Copied to clipboard");
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="preview-modal"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[860px] flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#f5f5f5] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-card-heading text-black truncate">{artifact.title}</h2>
            <StatusPill tone="indexed">{artifact.format?.toUpperCase() || "MARKDOWN"}</StatusPill>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-pill text-button text-[#4e4e4e] hover:text-black hover:bg-[#f9f9f9] transition-colors"
            >
              <Copy size={16} />
              <span>Copy Markdown</span>
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#f9f9f9] text-[#4e4e4e] transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>
            <div className="w-px h-4 bg-[#e5e5e5] mx-1" />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f9f9f9] text-[#4e4e4e] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[#fdfcfb]">
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5e5e5] p-10 shadow-sm">
            <WikiMarkdown markdown={artifact.markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
