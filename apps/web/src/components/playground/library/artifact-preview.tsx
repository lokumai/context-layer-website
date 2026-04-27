/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + stop-propagation wrapper — real controls are buttons inside. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Escape is handled via a window listener; close X button is the keyboard path. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { X } from "lucide-react";
import { useEffect } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { MultimodalPreviewBody } from "@/components/playground/artifacts/multimodal-preview";
import { PreviewModal } from "@/components/playground/generate/docsgen/preview-modal";

// Library's artifact preview. Delegates to DocsGen's PreviewModal for
// markdown/pdf/json and renders the shared MultimodalPreviewBody (Phase 17
// extraction) for slides/audio/video.

export function ArtifactPreview({
  open,
  onClose,
  artifact,
}: {
  open: boolean;
  onClose: () => void;
  artifact: Artifact;
}) {
  if (!open) return null;

  if (artifact.format === "markdown" || artifact.format === "pdf" || artifact.format === "json") {
    return <PreviewModal open={open} onClose={onClose} artifact={artifact} />;
  }

  return <MultimodalPreview artifact={artifact} onClose={onClose} />;
}

function MultimodalPreview({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="artifact-preview-multimodal"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[860px] flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-4 border-b border-[#f5f5f5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-card-heading text-black truncate">{artifact.title}</h2>
            <StatusPill tone="info">Mock preview</StatusPill>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f9f9f9] text-[#4e4e4e] transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#fdfcfb]">
          <div className="max-w-3xl mx-auto">
            <MultimodalPreviewBody artifact={artifact} />
          </div>
        </div>
      </div>
    </div>
  );
}
