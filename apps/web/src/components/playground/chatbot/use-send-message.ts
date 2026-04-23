"use client";

import type { ChatMessage } from "@context-layer/mocks";
import { useCallback, useRef, useState } from "react";
import { matchAnswer } from "@/lib/chatbot/match";
import { streamAnswer } from "@/lib/chatbot/stream";
import { useStore } from "@/stores";

// Centralised send logic. Both the full Chatbot page and the side-panel call
// this same hook so behavior (thinking → streaming → citations) stays
// identical across surfaces.

export interface SendMessageState {
  sending: boolean;
  thinking: boolean;
  abort: () => void;
  send: (text: string) => Promise<void>;
}

export function useSendMessage(
  threadId: string | null,
  ensureThread: () => string,
): SendMessageState {
  const cannedQA = useStore((s) => s.cannedQA);
  const appendMessage = useStore((s) => s.appendMessage);
  const patchLastMessage = useStore((s) => s.patchLastMessage);

  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const id = threadId ?? ensureThread();
      const controller = new AbortController();
      abortRef.current = controller;

      setSending(true);
      setThinking(true);

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      appendMessage(id, userMsg);

      const match = matchAnswer(trimmed, cannedQA);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        citations: match.citations,
      };
      appendMessage(id, assistantMsg);

      try {
        for await (const ev of streamAnswer(match.content, { signal: controller.signal })) {
          if (ev.kind === "thinking") continue;
          if (ev.kind === "chunk") {
            setThinking(false);
            patchLastMessage(id, ev.running);
          }
          if (ev.kind === "done") {
            patchLastMessage(id, ev.full);
          }
          if (controller.signal.aborted) break;
        }
      } finally {
        setThinking(false);
        setSending(false);
        abortRef.current = null;
      }
    },
    [sending, threadId, ensureThread, cannedQA, appendMessage, patchLastMessage],
  );

  return { sending, thinking, abort, send };
}
