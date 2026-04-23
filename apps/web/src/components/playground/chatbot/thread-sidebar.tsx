"use client";

import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useStore } from "@/stores";

export function ThreadSidebar() {
  const threads = useStore((s) => s.threads);
  const activeThreadId = useStore((s) => s.activeThreadId);
  const setActiveThread = useStore((s) => s.setActiveThread);
  const createThread = useStore((s) => s.createThread);
  const deleteThread = useStore((s) => s.deleteThread);

  return (
    <aside
      className="w-[280px] shrink-0 border-r border-[rgba(0,0,0,0.05)] bg-white flex flex-col h-full"
      data-testid="chatbot-thread-sidebar"
    >
      <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => createThread()}
          className="w-full inline-flex items-center justify-center gap-2 bg-black text-white rounded-pill px-4 py-2 text-button hover:bg-[#1a1a1a] transition-colors"
          data-testid="chatbot-new-thread"
        >
          <MessageSquarePlus size={14} strokeWidth={1.5} />
          <span>New thread</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {threads.length === 0 ? (
          <p className="px-3 py-6 text-caption text-[#777169] text-center">
            No conversations yet. Start by asking something below.
          </p>
        ) : (
          <ul className="space-y-1">
            {threads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <li key={t.id}>
                  <div
                    className={`group flex items-center gap-2 px-3 py-2 rounded-[10px] cursor-pointer transition-colors ${
                      isActive ? "bg-[#f5f2ef]" : "hover:bg-[#f9f9f9]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveThread(t.id)}
                      className="flex-1 text-left truncate text-body-medium text-black"
                    >
                      {t.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteThread(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-[#ececec] transition-opacity"
                      aria-label="Delete thread"
                    >
                      <Trash2 size={14} strokeWidth={1.5} className="text-[#777169]" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
