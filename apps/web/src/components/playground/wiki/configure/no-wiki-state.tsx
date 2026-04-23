"use client";

import { Sparkles, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import type { Source } from "@context-layer/mocks";
import { useStore } from "@/stores";

type SyncStrategy =
  | "per-pr-merge"
  | "per-commit"
  | "hourly"
  | "daily"
  | "weekly"
  | "manual";

const STRATEGIES: Array<{ id: SyncStrategy; label: string }> = [
  { id: "per-pr-merge", label: "Per PR merge (balanced default)" },
  { id: "per-commit", label: "Per commit (maximum freshness)" },
  { id: "hourly", label: "Hourly" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "manual", label: "Manual only" },
];

const INSTRUCTIONS_MAX = 5000;

export function NoWikiState({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false);
  const sources = useStore((s) => s.sources);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(sources.map((s) => s.id)));
  const [strategy, setStrategy] = useState<SyncStrategy>("per-pr-merge");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    setSelected(new Set(sources.map((s) => s.id)));
  }, [sources]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setOpen(false);
    onStart();
  }

  return (
    <section className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] px-10 py-16 text-center space-y-6 max-w-[760px] mx-auto">
      <div className="mx-auto w-14 h-14 rounded-comfortable bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
        <Sparkles size={28} strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        <h2 className="text-section-heading text-black">No Wiki yet.</h2>
        <p className="text-body text-[#4e4e4e] max-w-[520px] mx-auto">
          Pick which sources feed the Wiki and choose a sync cadence. Generation runs in the background; you can navigate away and come back.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={sources.length === 0}
        className="inline-flex items-center gap-2 bg-[rgba(245,242,239,0.8)] text-black rounded-warm-btn px-7 py-3 transition-transform hover:scale-[1.02] shadow-[var(--shadow-warm)] disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="generate-wiki-trigger"
      >
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-button-upper">Generate Wiki</span>
      </button>
      {sources.length === 0 ? (
        <p className="text-caption text-[#777169]">
          Add at least one source before generating.
        </p>
      ) : null}

      {open ? (
        <GenerationModal
          sources={sources}
          selected={selected}
          toggle={toggle}
          strategy={strategy}
          setStrategy={setStrategy}
          instructions={instructions}
          setInstructions={setInstructions}
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  );
}

function GenerationModal({
  sources,
  selected,
  toggle,
  strategy,
  setStrategy,
  instructions,
  setInstructions,
  onCancel,
  onSubmit,
}: {
  sources: Source[];
  selected: Set<string>;
  toggle: (id: string) => void;
  strategy: SyncStrategy;
  setStrategy: (s: SyncStrategy) => void;
  instructions: string;
  setInstructions: (s: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-section shadow-[var(--shadow-card)] p-8 space-y-6 text-left">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-button-upper text-[#777169]">First generation</p>
            <h2 className="text-card-heading text-black mt-1">Generate Wiki</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="text-[#777169] hover:text-black transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <section className="space-y-2">
            <p className="text-button-upper text-[#777169]">Sources</p>
            <div className="max-h-[220px] overflow-y-auto rounded-card shadow-[var(--shadow-inset-border)] divide-y divide-[rgba(0,0,0,0.05)]">
              {sources.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f9f9f9] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    className="accent-black"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-body-medium text-black truncate">{s.name}</span>
                    <span className="block text-caption text-[#777169] truncate">{s.path}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="text-caption text-[#777169]">
              {selected.size} of {sources.length} sources selected.
            </p>
          </section>

          <section className="space-y-2">
            <label htmlFor="sync-strategy" className="text-button-upper text-[#777169] block">
              Sync strategy
            </label>
            <select
              id="sync-strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as SyncStrategy)}
              className="w-full text-body-standard bg-white rounded-card px-4 py-2.5 shadow-[var(--shadow-inset-border)] focus:outline-none focus:shadow-[var(--shadow-outline-ring)]"
            >
              {STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-2">
            <label htmlFor="wiki-instructions" className="text-button-upper text-[#777169] block">
              Custom instructions (optional)
            </label>
            <textarea
              id="wiki-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value.slice(0, INSTRUCTIONS_MAX))}
              rows={4}
              placeholder="Tone, focus areas, exclusions — anything the agent should know."
              className="w-full text-body-standard bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] focus:outline-none focus:shadow-[var(--shadow-outline-ring)] resize-none"
            />
            <p className="text-caption text-[#777169] text-right">
              {instructions.length} / {INSTRUCTIONS_MAX}
            </p>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-button text-[#4e4e4e] hover:text-black px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 bg-black text-white rounded-pill px-6 py-2.5 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={14} strokeWidth={1.5} />
              <span className="text-button">Start generation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
