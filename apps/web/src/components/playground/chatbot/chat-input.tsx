"use client";

import { ArrowUp, Square } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { type GroundingKey, GroundingRow } from "./grounding-row";

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  sending: boolean;
  compact?: boolean;
}

export function ChatInput({ onSend, onStop, sending, compact = false }: Props) {
  const [text, setText] = useState("");
  const [grounding, setGrounding] = useState<Record<GroundingKey, boolean>>({
    all: true,
    wiki: true,
    codebase: true,
    files: true,
  });

  function toggle(key: GroundingKey) {
    setGrounding((prev) => {
      if (key === "all") {
        const next = !prev.all;
        return { all: next, wiki: next, codebase: next, files: next };
      }
      const updated = { ...prev, [key]: !prev[key] };
      updated.all = updated.wiki && updated.codebase && updated.files;
      return updated;
    });
  }

  function submit() {
    if (sending) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const pad = compact ? "px-4 py-3" : "px-10 py-5";

  return (
    <div className={`border-t border-[rgba(0,0,0,0.06)] bg-white ${pad}`}>
      <div className={compact ? "space-y-3" : "max-w-3xl mx-auto space-y-3"}>
        <GroundingRow value={grounding} onToggle={toggle} />
        <div
          className="flex items-end gap-3 rounded-card bg-white shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow px-4 py-3"
          data-testid="chatbot-input-shell"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={compact ? 2 : 2}
            placeholder="Ask anything grounded in your workspace…"
            className="flex-1 resize-none bg-transparent text-body text-black placeholder:text-[#9ca3af] outline-none"
            data-testid="chatbot-input"
          />
          {sending ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex items-center gap-1 rounded-pill bg-[#fef2f2] text-[#b91c1c] px-3 py-1.5 text-button hover:bg-[#fee2e2] transition-colors"
              data-testid="chatbot-stop"
            >
              <Square size={12} strokeWidth={2} />
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim()}
              className="inline-flex items-center gap-1 rounded-full bg-black text-white w-9 h-9 justify-center hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
              data-testid="chatbot-send"
            >
              <ArrowUp size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
