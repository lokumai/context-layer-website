"use client";

import { BookOpen, Code2, FileText, Layers, Plus } from "lucide-react";

export type GroundingKey = "all" | "wiki" | "codebase" | "files";

interface Props {
  value: Record<GroundingKey, boolean>;
  onToggle: (key: GroundingKey) => void;
}

const CHIPS: Array<{ key: GroundingKey; label: string; Icon: typeof BookOpen }> = [
  { key: "all", label: "All", Icon: Layers },
  { key: "wiki", label: "Wiki", Icon: BookOpen },
  { key: "codebase", label: "Codebase", Icon: Code2 },
  { key: "files", label: "Files", Icon: FileText },
];

export function GroundingRow({ value, onToggle }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-1" data-testid="chatbot-grounding-row">
      <span className="text-caption text-[#777169] uppercase tracking-[0.08em] mr-1">
        Grounded in
      </span>
      {CHIPS.map(({ key, label, Icon }) => {
        const active = value[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            aria-pressed={active}
            data-testid={`grounding-chip-${key}`}
            className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-caption transition-colors ${
              active
                ? "bg-[#fdf6ec] text-[#b45309] shadow-[var(--shadow-inset-border)]"
                : "bg-white text-[#777169] shadow-[var(--shadow-inset-border)] hover:text-black"
            }`}
          >
            <Icon size={12} strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-caption text-[#777169] hover:text-black transition-colors"
        title="Source selection coming soon"
      >
        <Plus size={12} strokeWidth={1.5} />
        <span>Add specific source</span>
      </button>
    </div>
  );
}
