# Chatbot & OmniBoard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full-page Chatbot with grounding controls and the OmniBoard multimodal artifact environment. Threads and artifacts come from the persona store.

**Architecture:** Next.js pages read `chatThreads[]` and `omniBoardArtifacts[]` from `usePlaygroundStore`. No inline mock content. Chatbot is gated behind Wiki-ready (checked via store).

**Tech Stack:** Next.js 15, React, Zustand (via plan 08), Tailwind CSS v4.

> **Prerequisite:** Plan `2026-04-22-08-personas-and-fixtures.md` implemented. Plan `2026-04-22-04-sources-knowledge.md` Task 3 (Wiki Status) for the gating convention.

> **Source of Truth:** `../../SEED.md`, `../../UI_UX.md`, `../../DESIGN.md`.

---

### Task 1: Full-Page Chatbot

**Files:**
- Create: `apps/web/app/play/[workspaceId]/chatbot/page.tsx`
- Create: `apps/web/components/chat/citation-chip.tsx`

- [ ] **Step 1: Citation chip**

```tsx
// apps/web/components/chat/citation-chip.tsx
import type { ChatCitation } from "@context-layer/mocks";

export function CitationChip({ citation }: { citation: ChatCitation }) {
  return (
    <button
      title={citation.target}
      className="inline-block bg-neutral-100 text-[12px] px-2 py-0.5 rounded-full ml-1 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
    >
      [{citation.label}]
    </button>
  );
}
```

- [ ] **Step 2: Chatbot page**

```tsx
// apps/web/app/play/[workspaceId]/chatbot/page.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/chatbot apps/web/components/chat
git commit -m "feat(chatbot): state-driven threads with citations and grounding filter"
```

---

### Task 2: OmniBoard Environment

**Files:**
- Create: `apps/web/app/play/[workspaceId]/generate/omniboard/page.tsx`

- [ ] **Step 1: Build OmniBoard**

```tsx
// apps/web/app/play/[workspaceId]/generate/omniboard/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function OmniBoardPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-12 mx-auto text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">OmniBoard is locked</h2>
        <p className="text-neutral-500 mb-8">Generate the Wiki first.</p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          Go to Wiki Configure
        </Link>
      </div>
    );
  }

  const artifacts = ws.omniBoardArtifacts;

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col bg-white p-8">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4 text-center">OmniBoard</h1>
        <p className="inter-airy text-[20px] text-neutral-600 text-center mb-12">Multimodal onboarding generation hub.</p>

        <div className="max-w-2xl mx-auto w-full bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
          <p className="text-[16px] mb-4">I can help you generate onboarding artifacts. What would you like to create today?</p>
          <div className="flex gap-3 flex-wrap">
            {["Slides", "Podcast", "Video", "Deep-dive"].map((opt) => (
              <button key={opt} className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-[14px] hover:bg-neutral-100">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-96 border-l border-black/[0.05] bg-neutral-50 p-6 overflow-y-auto">
        <h3 className="font-waldenburg text-[24px] mb-6">Generated Artifacts</h3>
        {artifacts.length === 0 ? (
          <p className="text-[14px] text-neutral-500">No artifacts yet. Plan one with the chatbot.</p>
        ) : (
          artifacts.map((a) => (
            <div key={a.id} className="bg-white p-5 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] mb-4">
              <h4 className="font-medium text-[15px] mb-2">{a.title}</h4>
              <p className="text-[13px] text-neutral-500 mb-4 capitalize">
                {a.variant}
                {a.durationSec ? ` • ${Math.round(a.durationSec / 60)} min` : ""}
              </p>
              <button className="w-full bg-warm-stone py-2 rounded-[30px] text-[13px] font-medium shadow-[rgba(78,50,23,0.04)_0px_6px_16px]">
                {a.modality === "audio" ? "Play Audio" : a.modality === "video" ? "Play Video" : "View"}
              </button>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/generate/omniboard
git commit -m "feat(omniboard): state-driven artifacts and gated entry"
```
