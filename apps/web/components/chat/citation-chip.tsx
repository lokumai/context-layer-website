import type { ChatCitation } from "@context-layer/mocks";

export function CitationChip({ citation }: { citation: ChatCitation }) {
  return (
    <button
      title={citation.target}
      className="inline-block bg-neutral-100 text-[12px] px-2 py-0.5 rounded-full ml-1 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
    >
      [{citation.label}]
    </button>
  );
}
