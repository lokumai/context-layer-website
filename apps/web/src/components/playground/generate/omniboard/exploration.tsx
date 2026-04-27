"use client";

import type { Artifact, ChatMessage } from "@context-layer/mocks";
import {
  ArrowRight,
  ChevronLeft,
  Library,
  MessagesSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusPill } from "@/components/marketing/status-pill";
import { MultimodalPreviewBody } from "@/components/playground/artifacts/multimodal-preview";
import { ChatInput } from "@/components/playground/chatbot/chat-input";
import { CitationProvider } from "@/components/playground/chatbot/citation";
import { MessageList } from "@/components/playground/chatbot/message-list";
import { matchAnswer } from "@/lib/chatbot/match";
import { streamAnswer } from "@/lib/chatbot/stream";
import { useStore } from "@/stores";
import type { ModalityPick } from "./landing";

// Phase 17 — NotebookLM-style exploration view. Replaces the old DoneSurface.
// The user lands here right after the simulated generation completes, with
// the artifact already saved to the Library, and can chat with a specialised
// surface that's seeded with knowledge of what was just produced.

interface Props {
  workspaceId: string;
  pick: ModalityPick;
  artifact: Artifact;
  onPlanAnother: () => void;
}

export function OmniBoardExploration({ workspaceId, pick, artifact, onPlanAnother }: Props) {
  return (
    <CitationProvider>
      <div
        className="flex flex-col h-[calc(100vh-64px)] bg-[#f9f9f9]"
        data-testid="omniboard-exploration"
      >
        <ExplorationHeader
          workspaceId={workspaceId}
          pick={pick}
          artifact={artifact}
          onPlanAnother={onPlanAnother}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-0">
          {/* Left: artifact viewer */}
          <section
            className="overflow-y-auto border-r border-[rgba(0,0,0,0.05)] bg-[#fdfcfb] px-6 lg:px-10 py-8"
            data-testid="omniboard-exploration-viewer"
          >
            <div className="max-w-3xl mx-auto">
              <MultimodalPreviewBody artifact={artifact} />
            </div>
          </section>

          {/* Right: exploration chat */}
          <section
            className="flex flex-col min-h-0 bg-white"
            data-testid="omniboard-exploration-chat"
          >
            <ExplorationChat workspaceId={workspaceId} pick={pick} artifact={artifact} />
          </section>
        </div>
      </div>
    </CitationProvider>
  );
}

// ────────────────────── header ──────────────────────

function ExplorationHeader({
  workspaceId,
  pick,
  artifact,
  onPlanAnother,
}: {
  workspaceId: string;
  pick: ModalityPick;
  artifact: Artifact;
  onPlanAnother: () => void;
}) {
  return (
    <header className="px-6 lg:px-10 py-4 bg-white border-b border-[rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-[10px] bg-[#fdf6ec] text-[#b45309] flex items-center justify-center shrink-0">
          <Sparkles size={18} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">
            OmniBoard · {pick.modality}
          </p>
          <h1
            className="text-card-heading text-black truncate"
            data-testid="exploration-artifact-title"
          >
            {artifact.title}
          </h1>
        </div>
        <StatusPill tone="indexed" dot>
          Saved to Library
        </StatusPill>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onPlanAnother}
          className="inline-flex items-center gap-1 rounded-pill px-4 py-1.5 text-button text-[#4e4e4e] hover:text-black hover:bg-[#f5f2ef] transition-colors"
          data-testid="exploration-plan-another"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          Plan another
        </button>
        <Link
          href={`/workspace/${workspaceId}/library`}
          className="inline-flex items-center gap-1 bg-black text-white rounded-pill px-4 py-1.5 text-button hover:bg-[#1a1a1a] transition-colors"
          data-testid="exploration-open-library"
        >
          <Library size={14} strokeWidth={1.5} />
          Open in Library
        </Link>
      </div>
    </header>
  );
}

// ────────────────────── chat panel ──────────────────────

function modalityPrompts(modality: ModalityPick["modality"]): string[] {
  if (modality === "slides") {
    return [
      "Summarise the deck in two sentences",
      "What's missing from the architecture section?",
      "Make the speaker notes shorter",
      "Add a slide on rollback",
    ];
  }
  if (modality === "audio") {
    return [
      "Summarise this episode in 30 seconds",
      "Add a chapter on saga compensation",
      "Make the intro punchier",
      "Trim the segment about the gateway",
    ];
  }
  return [
    "Summarise this video in two sentences",
    "Add a montage of the saga flows",
    "Use a darker colour palette",
    "Replace the closing slide with next steps",
  ];
}

function greetingFor(pick: ModalityPick, artifact: Artifact): string {
  return `Here's your ${pick.modality} "${artifact.title}". Ask anything about it, or request a revision — I'll draft what would change next time.`;
}

function ExplorationChat({
  workspaceId,
  pick,
  artifact,
}: {
  workspaceId: string;
  pick: ModalityPick;
  artifact: Artifact;
}) {
  const cannedQA = useStore((s) => s.cannedQA);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "assistant", content: greetingFor(pick, artifact) },
  ]);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const prompts = useMemo(() => modalityPrompts(pick.modality), [pick.modality]);

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

      const preface = `For this ${pick.modality} ("${artifact.title}"), here's how I'd answer — `;

      try {
        for await (const ev of streamAnswer(preface + match.content, {
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
    [artifact.title, cannedQA, pick.modality, sending],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  function requestRevision() {
    if (sending) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const note: ChatMessage = {
      role: "assistant",
      content: lastUser
        ? `Drafted a revision plan based on "${lastUser.content.slice(0, 80)}". The next regeneration would tighten the structure, refresh the citations, and incorporate your feedback.`
        : `Drafted a revision plan. The next regeneration would tighten the structure, refresh the citations, and clarify the most impactful sections.`,
    };
    setMessages((prev) => [...prev, note]);
  }

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const showSuggestions = messages.length <= 1;

  return (
    <>
      <header className="px-5 py-3 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessagesSquare size={16} strokeWidth={1.5} className="text-[#b45309]" />
          <p className="text-button-upper text-[#777169]">Explore this artifact</p>
        </div>
        <button
          type="button"
          onClick={requestRevision}
          disabled={sending}
          className="inline-flex items-center gap-1.5 rounded-pill bg-white text-[#4e4e4e] px-3 py-1.5 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] disabled:opacity-40 text-button transition-shadow"
          data-testid="exploration-request-revision"
        >
          <RefreshCw size={12} strokeWidth={1.5} />
          Request revision
        </button>
      </header>

      {showSuggestions ? (
        <div className="px-5 py-4 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-caption text-[#777169] mb-2">Try one of these:</p>
          <div className="grid grid-cols-1 gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="text-left rounded-card px-3 py-2 text-body shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow inline-flex items-center justify-between gap-2"
                data-testid="exploration-suggested-prompt"
              >
                <span className="text-black">{p}</span>
                <ArrowRight size={12} strokeWidth={1.5} className="text-[#9ca3af] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <MessageList messages={messages} workspaceId={workspaceId} thinking={thinking} compact />
      <ChatInput onSend={send} onStop={abort} sending={sending} compact />
    </>
  );
}
