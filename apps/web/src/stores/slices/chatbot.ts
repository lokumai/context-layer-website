import type { ChatMessage, ChatThread } from "@context-layer/mocks";
import type { StateCreator } from "zustand";
import type { AppState, ChatbotSlice } from "../types";

// Thread ids are derived from timestamp + random tail so they're stable across
// the streaming simulation (the streaming patch needs a stable target).
const makeThreadId = () =>
  `thread-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const createChatbotSlice: StateCreator<AppState, [], [], ChatbotSlice> = (set) => ({
  suggestedPrompts: [],
  cannedQA: [],
  threads: [],
  activeThreadId: null,

  setActiveThread: (id) => set({ activeThreadId: id }),

  createThread: (title) => {
    const id = makeThreadId();
    const thread: ChatThread = {
      id,
      title: title?.trim() || "New conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ threads: [thread, ...s.threads], activeThreadId: id }));
    return id;
  },

  appendMessage: (threadId, message) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              // Auto-derive title from the first user message if still "New conversation".
              title:
                t.title === "New conversation" && message.role === "user"
                  ? message.content.slice(0, 60)
                  : t.title,
              messages: [...t.messages, message],
            }
          : t,
      ),
    })),

  patchLastMessage: (threadId, content) =>
    set((s) => ({
      threads: s.threads.map((t) => {
        if (t.id !== threadId) return t;
        if (t.messages.length === 0) return t;
        const last = t.messages[t.messages.length - 1];
        const patched: ChatMessage = { ...last, content };
        return { ...t, messages: [...t.messages.slice(0, -1), patched] };
      }),
    })),

  renameThread: (threadId, title) =>
    set((s) => ({
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, title } : t)),
    })),

  deleteThread: (threadId) =>
    set((s) => ({
      threads: s.threads.filter((t) => t.id !== threadId),
      activeThreadId: s.activeThreadId === threadId ? null : s.activeThreadId,
    })),
});
