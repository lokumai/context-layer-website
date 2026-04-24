"use client";

import type { ChatMessage } from "@context-layer/mocks";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/playground/chatbot/chat-input";
import { CitationProvider } from "@/components/playground/chatbot/citation";
import { MessageList } from "@/components/playground/chatbot/message-list";
import { matchAnswer } from "@/lib/chatbot/match";
import { streamAnswer } from "@/lib/chatbot/stream";
import { useStore } from "@/stores";
import type { ModalityPick } from "./landing";

// OmniBoard's chat is a local-state variant of the Phase 9 chatbot.
// We don't write to the global threads slice — OmniBoard sessions are
// per-visit, scoped to the pick, and thrown away when the user leaves.

interface Props {
  workspaceId: string;
  pick: ModalityPick;
  onBack: () => void;
  onGenerate: (goal: string) => void;
}

export function OmniBoardSession({ workspaceId, pick, onBack, onGenerate }: Props) {
  const cannedQA = useStore((s) => s.cannedQA);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: greetingFor(pick),
    },
  ]);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const lastUserGoal = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "user") return m.content;
    }
    return "";
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      const controller = new AbortController();
      abortRef.current = controller;

      setSending(true);
      setThinking(true);
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const match = matchAnswer(trimmed, cannedQA);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        citations: match.citations,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      try {
        for await (const ev of streamAnswer(omniBoardPreface(pick) + match.content, {
          signal: controller.signal,
        })) {
          if (ev.kind === "thinking") continue;
          if (ev.kind === "chunk" || ev.kind === "done") {
            setThinking(false);
            const running = ev.kind === "chunk" ? ev.running : ev.full;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: running };
              return next;
            });
          }
          if (controller.signal.aborted) break;
        }
      } finally {
        setThinking(false);
        setSending(false);
        abortRef.current = null;
      }
    },
    [cannedQA, pick, sending],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  return (
    <CitationProvider>
      <div className="flex h-[calc(100vh-64px)] bg-white" data-testid="omniboard-session">
        <section className="flex-1 flex flex-col min-w-0 border-r border-[rgba(0,0,0,0.05)]">
          <header className="px-6 py-3 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">
                OmniBoard · {pick.modality}
              </p>
              <h1 className="text-card-heading text-black">{pick.option}</h1>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-button text-[#4e4e4e] hover:text-black px-3 py-1.5 rounded-pill hover:bg-[#f5f2ef] transition-colors"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
              Change modality
            </button>
          </header>

          <MessageList messages={messages} workspaceId={workspaceId} thinking={thinking} />
          <ChatInput onSend={send} onStop={abort} sending={sending} />
        </section>

        <aside className="w-[360px] shrink-0 bg-[#f9f9f9] flex flex-col">
          <PlanPanel pick={pick} goal={lastUserGoal} onGenerate={onGenerate} />
        </aside>
      </div>
    </CitationProvider>
  );
}

function PlanPanel({
  pick,
  goal,
  onGenerate,
}: {
  pick: ModalityPick;
  goal: string;
  onGenerate: (goal: string) => void;
}) {
  const ready = goal.length > 0;
  return (
    <div
      className="flex-1 flex flex-col px-6 py-6 overflow-y-auto"
      data-testid="omniboard-plan-panel"
    >
      <header className="mb-5">
        <div className="w-10 h-10 rounded-[10px] bg-white shadow-[var(--shadow-inset-border)] flex items-center justify-center mb-3">
          <Sparkles size={18} strokeWidth={1.5} className="text-[#b45309]" />
        </div>
        <h2 className="text-card-heading text-black">Plan</h2>
        <p className="text-caption text-[#777169]">
          As you describe what you want, this panel summarises the job before you kick it off.
        </p>
      </header>

      <dl className="space-y-4 mb-6">
        <Row label="Modality" value={pick.modality} />
        <Row label="Style" value={pick.option} />
        <Row label="Goal" value={goal || "—"} />
      </dl>

      <button
        type="button"
        onClick={() => onGenerate(goal)}
        disabled={!ready}
        className="mt-auto inline-flex items-center justify-center gap-2 bg-black text-white rounded-pill px-5 py-2.5 text-button hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        data-testid="omniboard-generate-button"
      >
        Generate {pick.modality}
        <ArrowRight size={14} strokeWidth={1.75} />
      </button>
      {!ready ? (
        <p className="text-caption text-[#777169] text-center mt-2">
          Describe your goal in the chat to unlock generation.
        </p>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption text-[#777169] uppercase tracking-[0.08em] mb-1">{label}</dt>
      <dd className="text-body-medium text-black">{value}</dd>
    </div>
  );
}

function greetingFor(pick: ModalityPick): string {
  return `I'll help you plan "${pick.option}" as a ${pick.modality}. Tell me who this is for and what they most need to understand — then I'll line up the outline before we generate.`;
}

function omniBoardPreface(pick: ModalityPick): string {
  return `For this ${pick.modality} (${pick.option}) I'd suggest the following framing — `;
}
