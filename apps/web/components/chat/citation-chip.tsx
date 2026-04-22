"use client";

import type { ChatCitation } from "@context-layer/mocks";

export function CitationChip({
  citation,
  onClick,
}: {
  citation: ChatCitation;
  onClick?: (target: string) => void;
}) {
  return (
    <button
      onClick={() => onClick?.(citation.target)}
      title={citation.target}
      className="mx-0.5 inline-flex items-baseline rounded-[6px] border border-black/5 bg-[var(--color-warm-stone)] px-2 py-0.5 font-mono text-[11.5px] font-medium text-[var(--color-ink)] shadow-warm hover:shadow-[rgba(78,50,23,0.1)_0_4px_10px] transition-shadow"
    >
      [{citation.label}]
    </button>
  );
}
