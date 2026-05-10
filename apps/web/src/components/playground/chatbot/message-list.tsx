/** biome-ignore-all lint/suspicious/noArrayIndexKey: chat messages render in append-only order; positional indices are stable per render and re-render on change-of-length is desired. */
"use client";

import type { ChatMessage } from "@context-layer/mocks";
import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CitationChip } from "./citation";

interface Props {
  messages: ChatMessage[];
  workspaceId: string;
  thinking: boolean;
  compact?: boolean;
}

export function MessageList({ messages, workspaceId, thinking, compact = false }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const lastContent = messages[messages.length - 1]?.content ?? "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps listed intentionally to re-run scroll-to-bottom on new message / streamed chunk / thinking toggle.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking, lastContent]);

  const pad = compact ? "px-4 py-5" : "px-10 py-8";

  return (
    <div className={`flex-1 overflow-y-auto ${pad}`} data-testid="chatbot-messages">
      <div className={compact ? "space-y-4" : "max-w-3xl mx-auto space-y-6"}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={`${i}-${m.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble
                message={m}
                workspaceId={workspaceId}
                isStreaming={
                  i === messages.length - 1 &&
                  m.role === "assistant" &&
                  thinking === false &&
                  m.content.length === 0
                }
              />
            </motion.div>
          ))}
          {thinking ? (
            <motion.div
              key="thinking-bubble"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
            >
              <ThinkingBubble />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  workspaceId,
  isStreaming,
}: {
  message: ChatMessage;
  workspaceId: string;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const Icon = isUser ? User : Bot;
  const iconTone = isUser ? "bg-black text-white" : "bg-[#fdf6ec] text-[#b45309]";
  const bubbleTone = isUser ? "bg-[#f5f2ef]" : "bg-white border border-[rgba(0,0,0,0.05)]";

  return (
    <div className="flex gap-3" data-testid={`chatbot-message-${message.role}`}>
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${iconTone}`}
      >
        <Icon size={14} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`rounded-card ${bubbleTone} px-4 py-3`}>
          {message.content ? (
            <RenderWithCitations
              content={message.content}
              citations={message.citations ?? []}
              workspaceId={workspaceId}
            />
          ) : isStreaming ? (
            <span className="inline-block w-2 h-4 bg-[#b45309] animate-pulse rounded-sm" />
          ) : (
            <p className="text-body text-[#777169] italic">…</p>
          )}
        </div>
        {!isUser && message.citations && message.citations.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5" data-testid="chatbot-citations">
            {message.citations.map((c, i) => (
              <CitationChip key={c.id} citation={c} workspaceId={workspaceId} index={i + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Splits text on `[n]` markers and replaces each with the matching citation chip.
function RenderWithCitations({
  content,
  citations,
  workspaceId,
}: {
  content: string;
  citations: NonNullable<ChatMessage["citations"]>;
  workspaceId: string;
}) {
  const parts = content.split(/(\[\d+\])/g);
  return (
    <p className="text-body text-black whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        const m = /^\[(\d+)\]$/.exec(part);
        if (m) {
          const idx = Number(m[1]);
          const citation = citations[idx - 1];
          if (citation) {
            return (
              <span key={i} className="inline-block align-middle mx-0.5">
                <CitationChip citation={citation} workspaceId={workspaceId} index={idx} />
              </span>
            );
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3" data-testid="chatbot-thinking">
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-[#fdf6ec] text-[#b45309]">
        <Bot size={14} strokeWidth={1.5} />
      </div>
      <div className="rounded-card bg-white border border-[rgba(0,0,0,0.05)] px-4 py-3">
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-[pulse_1.2s_ease-in-out_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-[pulse_1.2s_ease-in-out_0.2s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-[pulse_1.2s_ease-in-out_0.4s_infinite]" />
        </span>
      </div>
    </div>
  );
}
