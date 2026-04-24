"use client";

import { FileImage, Headphones, Video } from "lucide-react";
import type { ComponentType } from "react";

export type Modality = "slides" | "audio" | "video";

export interface ModalityPick {
  modality: Modality;
  option: string;
}

interface Bundle {
  modality: Modality;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  accent: string;
  options: string[];
  description: string;
}

const BUNDLES: Bundle[] = [
  {
    modality: "slides",
    label: "Slides",
    icon: FileImage,
    accent: "#fef3c7",
    description: "Shareable decks — suitable for emailing, reading standalone, or presenting.",
    options: ["Detailed Slides", "Summary Slides"],
  },
  {
    modality: "audio",
    label: "Audio",
    icon: Headphones,
    accent: "#ede9fe",
    description: "Walkthroughs and podcast-style explanations of the codebase.",
    options: ["Deep Dive", "Summary", "Podcast"],
  },
  {
    modality: "video",
    label: "Video",
    icon: Video,
    accent: "#eef6ff",
    description: "Slide-on-voice video presentations for richer onboarding sessions.",
    options: ["Detailed Presentation", "Summary Presentation"],
  },
];

export function OmniBoardLanding({ onPick }: { onPick: (pick: ModalityPick) => void }) {
  return (
    <div
      className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-10"
      data-testid="omniboard-landing"
    >
      <header className="text-center max-w-2xl mx-auto">
        <p className="text-button-upper text-[#777169] mb-2">OmniBoard</p>
        <h1 className="text-section-heading text-black mb-3">
          Plan your first onboarding artifact
        </h1>
        <p className="text-body text-[#4e4e4e]">
          Pick a modality and a style. OmniBoard runs a specialized chatbot to help you plan, then
          generates the artifact in the background.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {BUNDLES.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.modality}
              className="bg-white rounded-card p-6 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow flex flex-col"
              data-testid={`omniboard-modality-${b.modality}`}
            >
              <div
                className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-4"
                style={{ backgroundColor: b.accent, color: "#3f3f46" }}
              >
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-card-heading text-black mb-1">{b.label}</h3>
              <p className="text-body text-[#4e4e4e] mb-5">{b.description}</p>
              <div className="mt-auto space-y-2">
                {b.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onPick({ modality: b.modality, option: opt })}
                    className="w-full text-left rounded-pill px-4 py-2 text-button bg-[#f9f9f9] text-black hover:bg-[#f5f2ef] transition-colors"
                    data-testid={`omniboard-option-${b.modality}-${slugify(opt)}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}
