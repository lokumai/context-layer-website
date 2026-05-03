"use client";

import { BookOpen, Sparkles } from "lucide-react";

export function EmptyStateNeedsWiki({
  workspaceId,
  tabLabel,
}: {
  workspaceId: string;
  tabLabel: string;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-16 text-center bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-10 space-y-6">
      <div className="mx-auto w-14 h-14 rounded-comfortable bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
        <BookOpen size={28} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <p className="text-button-upper text-[#777169]">Wiki {tabLabel}</p>
        <h2 className="text-section-heading text-black">
          Generate the Wiki to unlock {tabLabel.toLowerCase()}.
        </h2>
        <p className="text-body text-[#4e4e4e] max-w-[460px] mx-auto">
          The Configure tab is where you choose which sources feed the Wiki and launch the first
          generation. Once the Wiki exists, this tab lights up.
        </p>
      </div>
      <a
        href={`/workspace/${workspaceId}/wiki/configure`}
        className="inline-flex items-center gap-2 bg-[rgba(245,242,239,0.8)] text-black rounded-warm-btn px-7 py-3 transition-transform hover:scale-[1.02] shadow-[var(--shadow-warm)]"
      >
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-button-upper">Open Configure</span>
      </a>
    </div>
  );
}
