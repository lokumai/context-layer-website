import type { DocsGenBundle } from "@context-layer/mocks";

export const BUNDLES: { id: DocsGenBundle; label: string }[] = [
  { id: "structure", label: "Structure & Architecture" },
  { id: "spec", label: "Specification & Knowledge" },
  { id: "health", label: "Health & Risk" },
  { id: "agentify", label: "Agentify" },
  { id: "memory", label: "Institutional Memory" },
  { id: "research", label: "Research Docs" },
];

export function BundleTabs({ active, onChange }: { active: DocsGenBundle; onChange: (b: DocsGenBundle) => void }) {
  return (
    <div className="flex gap-8 border-b border-neutral-200 mb-8 overflow-x-auto">
      {BUNDLES.map((b) => (
        <button
          key={b.id}
          onClick={() => onChange(b.id)}
          className={`pb-4 font-medium text-[15px] whitespace-nowrap ${
            active === b.id ? "border-b-2 border-black" : "text-neutral-400 hover:text-black"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
