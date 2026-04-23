"use client";

import { Plug } from "lucide-react";
import { useCallback, useState } from "react";
import { useStore } from "@/stores";
import { ChatInput } from "./chat-input";
import { CitationProvider } from "./citation";
import { ChatbotEmptyState } from "./empty-state";
import { McpConfigModal } from "./mcp-config";
import { MessageList } from "./message-list";
import { ChatbotNeedsWikiState } from "./needs-wiki-state";
import { ThreadSidebar } from "./thread-sidebar";
import { useSendMessage } from "./use-send-message";

interface Props {
  workspaceId: string;
}

export function FullChatbot({ workspaceId }: Props) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  const threads = useStore((s) => s.threads);
  const activeThreadId = useStore((s) => s.activeThreadId);
  const createThread = useStore((s) => s.createThread);
  const [mcpOpen, setMcpOpen] = useState(false);

  const ensureThread = useCallback(() => {
    if (activeThreadId) return activeThreadId;
    return createThread();
  }, [activeThreadId, createThread]);

  const { send, abort, sending, thinking } = useSendMessage(activeThreadId, ensureThread);

  if (!workspace) return null;
  if (!workspace.hasWiki) return <ChatbotNeedsWikiState workspaceId={workspaceId} />;

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  return (
    <CitationProvider>
      <div className="flex h-[calc(100vh-64px)] bg-[#f9f9f9]" data-testid="chatbot-full-page">
        <ThreadSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <header className="px-6 py-3 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <h1 className="text-card-heading text-black">{activeThread?.title ?? "Chatbot"}</h1>
              <p className="text-caption text-[#777169]">Grounded in {workspace.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setMcpOpen(true)}
              className="inline-flex items-center gap-2 rounded-pill bg-white text-black px-3 py-1.5 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow text-button"
              data-testid="chatbot-mcp-button"
            >
              <Plug size={14} strokeWidth={1.5} />
              <span>MCP Config</span>
            </button>
          </header>

          {activeThread && activeThread.messages.length > 0 ? (
            <MessageList
              messages={activeThread.messages}
              workspaceId={workspaceId}
              thinking={thinking}
            />
          ) : (
            <ChatbotEmptyState onPromptClick={(text) => send(text)} />
          )}

          <ChatInput onSend={send} onStop={abort} sending={sending} />
        </main>

        {mcpOpen ? (
          <McpConfigModal workspaceId={workspaceId} onClose={() => setMcpOpen(false)} />
        ) : null}
      </div>
    </CitationProvider>
  );
}
