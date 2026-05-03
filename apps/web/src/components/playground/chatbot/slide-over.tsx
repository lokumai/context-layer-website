"use client";

import { ExternalLink, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useStore } from "@/stores";
import { ChatInput } from "./chat-input";
import { CitationProvider } from "./citation";
import { ChatbotEmptyState } from "./empty-state";
import { MessageList } from "./message-list";
import { useSendMessage } from "./use-send-message";

interface Props {
  workspaceId: string;
  /** Short contextual label shown under the header — "Ask about this page" lives here. */
  contextLabel?: string;
}

// A floating "Ask about this page…" pill + a right-hand slide-over panel.
// Reused on Wiki View and every Intelligence page.
// Threads are shared with the full Chatbot page via the store.

export function ChatbotSideDock({ workspaceId, contextLabel }: Props) {
  const [open, setOpen] = useState(false);
  const isHydrated = useStore((s) => s.isHydrated);
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));

  // Hide entirely if we are hydrated and we definitely know there is no wiki.
  // While hydrating, we assume the wiki might exist so we render the button (prevents SSR layout shift/test flakiness).
  if (isHydrated && !workspace?.hasWiki) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-white shadow-[var(--shadow-card)] px-5 py-3 flex items-center gap-2 hover:shadow-[var(--shadow-outline-ring)] transition-shadow border border-[rgba(0,0,0,0.05)]"
        data-testid="chatbot-dock-button"
      >
        <MessageSquare size={18} strokeWidth={1.5} className="text-[#b45309]" />
        <span className="text-body-medium text-[#4e4e4e]">
          {contextLabel ?? "Ask the workspace…"}
        </span>
      </button>

      {open ? <ChatbotSlideOver workspaceId={workspaceId} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ChatbotSlideOver({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const threads = useStore((s) => s.threads);
  const activeThreadId = useStore((s) => s.activeThreadId);
  const createThread = useStore((s) => s.createThread);

  const ensureThread = useCallback(() => {
    if (activeThreadId) return activeThreadId;
    return createThread();
  }, [activeThreadId, createThread]);

  const { send, abort, sending, thinking } = useSendMessage(activeThreadId, ensureThread);
  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  return (
    <CitationProvider>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close; explicit X button provides keyboard path */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop div */}
      <div className="fixed inset-0 bg-black/5 backdrop-blur-[1px] z-40" onClick={onClose} />
      <aside
        className="fixed right-0 top-0 h-screen w-full max-w-[520px] bg-white shadow-[var(--shadow-card)] z-50 flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Chatbot"
        data-testid="chatbot-slide-over"
      >
        <header className="px-5 py-3 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <h2 className="text-card-heading text-black">Chatbot</h2>
            <p className="text-caption text-[#777169]">Grounded in this workspace</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={`/workspace/${workspaceId}/chatbot`}
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f5f2ef] transition-colors"
              title="Open full chatbot"
              aria-label="Open full chatbot"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f5f2ef] transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {activeThread && activeThread.messages.length > 0 ? (
          <MessageList
            messages={activeThread.messages}
            workspaceId={workspaceId}
            thinking={thinking}
            compact
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ChatbotEmptyState onPromptClick={(text) => send(text)} />
          </div>
        )}

        <ChatInput onSend={send} onStop={abort} sending={sending} compact />
      </aside>
    </CitationProvider>
  );
}
