"use client";

import { Sparkles } from "lucide-react";
import { useStore } from "@/stores";

interface Props {
  onPromptClick: (text: string) => void;
}

export function ChatbotEmptyState({ onPromptClick }: Props) {
  const suggestedPrompts = useStore((s) => s.suggestedPrompts);

  return (
    <div
      className="flex-1 flex items-center justify-center px-6 py-10"
      data-testid="chatbot-empty-state"
    >
      <div className="max-w-2xl w-full text-center">
        <div className="mx-auto w-14 h-14 rounded-[16px] bg-[#fdf6ec] text-[#b45309] flex items-center justify-center mb-5">
          <Sparkles size={26} strokeWidth={1.5} />
        </div>
        <h2 className="text-section-heading text-black mb-2">Ask the workspace anything</h2>
        <p className="text-body text-[#4e4e4e] mb-8">
          Grounded answers from the Wiki, the codebase, and indexed files — with clickable citations
          back to the source.
        </p>

        {suggestedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedPrompts.slice(0, 6).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPromptClick(p.text)}
                className="text-left rounded-card bg-white shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] px-4 py-3 transition-shadow"
                data-testid="chatbot-suggested-prompt"
              >
                <p className="text-body-medium text-black line-clamp-2">{p.text}</p>
                {p.groundedIn ? (
                  <p className="text-caption text-[#777169] mt-1 uppercase tracking-[0.08em]">
                    {p.groundedIn}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
