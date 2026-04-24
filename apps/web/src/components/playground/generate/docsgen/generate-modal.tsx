/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + stop-propagation wrapper — real controls are buttons inside. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Escape is handled via a window listener; close X button is the keyboard path. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/stores";
import type { DocsGenCard } from "./catalog";

export function GenerateModal({
  open,
  onClose,
  card,
  existingArtifact,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  card: DocsGenCard;
  existingArtifact?: Artifact;
  onSubmit: (data: { sources: string[]; format: string; instructions: string }) => void;
}) {
  const sources = useStore((s) => s.sources);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedSources(existingArtifact?.sourceRepos || sources.map((s) => s.id));
      setSelectedFormat(existingArtifact?.format || card.outputFormats[0]);
      setInstructions("");
    }
  }, [open, existingArtifact, sources, card]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleToggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="generate-modal"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[640px] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#f5f5f5] flex items-center justify-between">
          <div>
            <h2 className="text-card-heading text-black">
              {existingArtifact ? "Regenerate" : "Generate"} {card.title}
            </h2>
            <p className="text-nav text-[#888]">Configure your artifact parameters</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f9f9f9] text-[#4e4e4e] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-nav text-black mb-4 font-medium">Select Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sources.map((s) => {
                const isSelected = selectedSources.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSource(s.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-black bg-[#f9f9f9] shadow-sm"
                        : "border-[#e5e5e5] hover:border-[#d0d0d0]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-black border-black text-white"
                          : "border-[#d0d0d0] bg-white"
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-nav text-black truncate font-medium">{s.name}</p>
                      <p className="text-[11px] text-[#888] truncate">{s.path}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-nav text-black mb-4 font-medium">Output Format</h3>
            <div className="flex gap-4">
              {card.outputFormats.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFormat(f)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border flex-1 transition-all ${
                    selectedFormat === f
                      ? "border-black bg-[#f9f9f9] shadow-sm"
                      : "border-[#e5e5e5] hover:border-[#d0d0d0]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      selectedFormat === f ? "border-black" : "border-[#d0d0d0]"
                    }`}
                  >
                    {selectedFormat === f && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                  <span className="text-nav text-black capitalize">{f}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-nav text-black font-medium">Custom Instructions</h3>
              <span className="text-[11px] text-[#888]">{instructions.length}/5000</span>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              maxLength={5000}
              placeholder="E.g. Focus on the internal billing logic and ignore the public documentation."
              className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl p-4 text-body text-black placeholder:text-[#aaa] focus:outline-none focus:border-black transition-colors resize-none"
            />
          </section>
        </div>

        <div className="px-6 py-5 border-t border-[#f5f5f5] flex items-center justify-end gap-3 bg-[#fcfcfc]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-pill text-button text-[#4e4e4e] hover:text-black hover:bg-[#f0f0f0] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              onSubmit({
                sources: selectedSources,
                format: selectedFormat,
                instructions,
              })
            }
            disabled={selectedSources.length === 0}
            className="px-8 py-2 bg-black text-white rounded-pill text-button hover:bg-[#1a1a1a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {existingArtifact ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
