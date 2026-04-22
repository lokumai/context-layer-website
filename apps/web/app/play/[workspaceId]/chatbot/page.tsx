"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";
import { CitationChip } from "@/components/chat/citation-chip";

export default function ChatbotPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [activeThreadId, setActiveThreadId] = useState<string | null>(ws?.chatThreads[0]?.id ?? null);

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-12 mx-auto text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">Chatbot is locked</h2>
        <p className="text-neutral-500 mb-8">Generate the Wiki first so the chatbot has grounded knowledge to answer from.</p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          Go to Wiki Configure
        </Link>
      </div>
    );
  }

  const activeThread = ws.chatThreads.find((t) => t.id === activeThreadId) ?? ws.chatThreads[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-4 overflow-y-auto">
        <h3 className="font-waldenburg-bold text-[14px] uppercase tracking-[0.7px] mb-4 text-neutral-500">History</h3>
        {ws.chatThreads.length === 0 ? (
          <p className="text-[13px] text-neutral-400">No threads yet.</p>
        ) : (
          ws.chatThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              className={`block w-full text-left p-3 rounded-lg mb-1 text-[14px] font-medium ${t.id === activeThread?.id ? "bg-white shadow-sm border border-neutral-200" : "text-neutral-500 hover:bg-neutral-200"}`}
            >
              {t.title}
            </button>
          ))
        )}
      </aside>

      <div className="flex-1 flex flex-col bg-white relative">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
          {activeThread?.messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-[24px] p-6 ${
                  m.role === "user"
                    ? "bg-black text-white"
                    : "bg-white border border-neutral-200 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]"
                }`}
              >
                <p className="inter-airy text-[16px] leading-[1.6]">
                  {m.content}
                  {m.citations?.map((c) => <CitationChip key={c.label} citation={c} />)}
                </p>
              </div>
            </div>
          ))}
          {!activeThread && (
            <div className="text-center py-20">
              <h2 className="font-waldenburg text-[28px] mb-4">Start a conversation</h2>
              <p className="text-neutral-500">Ask about architecture, services, or how anything in your codebase works.</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="text-[12px] font-medium text-neutral-500 py-1">Grounded in:</span>
              <button className="bg-neutral-900 text-white text-[12px] px-3 py-1 rounded-full">✓ All Sources</button>
              <button className="bg-white border border-neutral-200 text-neutral-600 text-[12px] px-3 py-1 rounded-full hover:bg-neutral-50">✓ Wiki</button>
              <button className="bg-white border border-neutral-200 text-neutral-600 text-[12px] px-3 py-1 rounded-full hover:bg-neutral-50">+ Specific source</button>
            </div>
            <div className="bg-white rounded-[24px] border border-neutral-200 p-2 flex shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
              <input type="text" placeholder="Ask about your context…" className="flex-1 border-none focus:ring-0 px-4 text-[16px] bg-transparent" />
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
