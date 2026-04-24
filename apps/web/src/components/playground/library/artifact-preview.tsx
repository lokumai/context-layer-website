/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + stop-propagation wrapper — real controls are buttons inside. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Escape is handled via a window listener; close X button is the keyboard path. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { FileImage, Headphones, Pause, Play, Video, X } from "lucide-react";
import { useEffect } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { PreviewModal } from "@/components/playground/generate/docsgen/preview-modal";
import { WikiMarkdown } from "@/components/playground/wiki/view/markdown";

// Library's artifact preview. Delegates to DocsGen's PreviewModal for
// markdown/pdf/json and renders mock players for the OmniBoard modalities.

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

        <div className="flex-1 overflow-y-auto p-8 bg-[#fdfcfb] space-y-6">
          {artifact.format === "slides" ? <SlidesStub artifact={artifact} /> : null}
          {artifact.format === "audio" ? <AudioStub artifact={artifact} /> : null}
          {artifact.format === "video" ? <VideoStub artifact={artifact} /> : null}

          <section className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5e5e5] p-8 shadow-sm">
            <h3 className="text-card-heading text-black mb-4">Notes</h3>
            <WikiMarkdown markdown={artifact.markdown} />
          </section>
        </div>
      </div>
    </div>
  );
}

function SlidesStub({ artifact }: { artifact: Artifact }) {
  const slideCount = Math.max(8, Math.round(artifact.sizeBytes / 4800));
  return (
    <section
      className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm"
      data-testid="preview-slides-stub"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileImage size={18} strokeWidth={1.5} className="text-[#ca8a04]" />
        <span className="text-body-medium text-black">Slide deck · {slideCount} slides</span>
      </div>
      <div className="aspect-video bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-[12px] flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-button-upper text-[#92400e] mb-3">Slide 1 / {slideCount}</p>
          <h4 className="text-section-heading text-[#78350f]">{artifact.title}</h4>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: Math.min(slideCount, 10) }).map((_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static list rendered once per artifact
            key={i}
            className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#92400e]" : "bg-[#fde68a]"}`}
          />
        ))}
      </div>
    </section>
  );
}

function AudioStub({ artifact }: { artifact: Artifact }) {
  const lengthMin = Math.max(3, Math.round(artifact.sizeBytes / 500_000));
  return (
    <section
      className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm"
      data-testid="preview-audio-stub"
    >
      <div className="flex items-center gap-3 mb-4">
        <Headphones size={18} strokeWidth={1.5} className="text-[#6d28d9]" />
        <span className="text-body-medium text-black">Audio · ~{lengthMin} min</span>
      </div>
      <div className="flex items-center gap-4 bg-[#f5f2ef] rounded-[14px] px-5 py-4">
        <button
          type="button"
          disabled
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center opacity-40 cursor-not-allowed"
          aria-label="Play"
        >
          <Play size={18} strokeWidth={1.75} />
        </button>
        <div className="flex-1">
          <svg viewBox="0 0 400 40" className="w-full h-8 text-[#8b5cf6]" aria-hidden="true">
            <title>Waveform stub</title>
            {Array.from({ length: 60 }).map((_, i) => {
              const h = 8 + ((i * 7) % 22);
              return (
                <rect
                  // biome-ignore lint/suspicious/noArrayIndexKey: deterministic waveform bars
                  key={i}
                  x={i * 7}
                  y={20 - h / 2}
                  width={3}
                  height={h}
                  fill="currentColor"
                  opacity={0.6}
                />
              );
            })}
          </svg>
        </div>
        <Pause size={16} strokeWidth={1.5} className="text-[#9ca3af]" />
      </div>
    </section>
  );
}

function VideoStub({ artifact }: { artifact: Artifact }) {
  return (
    <section
      className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm"
      data-testid="preview-video-stub"
    >
      <div className="flex items-center gap-3 mb-4">
        <Video size={18} strokeWidth={1.5} className="text-[#1d4ed8]" />
        <span className="text-body-medium text-black">Video presentation</span>
      </div>
      <div className="aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[12px] relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            disabled
            className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center opacity-60 cursor-not-allowed"
            aria-label="Play video"
          >
            <Play size={22} strokeWidth={1.5} />
          </button>
        </div>
        <p className="absolute bottom-4 left-4 text-caption text-white/70 uppercase tracking-[0.08em]">
          {artifact.title}
        </p>
      </div>
    </section>
  );
}
