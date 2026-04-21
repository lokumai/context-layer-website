# Chatbot & OmniBoard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full-page chatbot, grounding filters, and the OmniBoard multimodal generation environment.

**Architecture:** Next.js pages containing mock conversational threads and generated output placeholders.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`. It is highly recommended that the implementer actively views and reads these source of truth documents before and during implementation.

---

### Task 1: Full-Page Chatbot

**Files:**
- Create: `apps/web/app/play/[workspaceId]/chatbot/page.tsx`

- [ ] **Step 1: Build Chatbot Page Layout**
Adhering to UI_UX.md section 6 and utilizing DESIGN.md styling.

```tsx
export default function ChatbotPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Thread Sidebar */}
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-4 overflow-y-auto">
        <h3 className="font-waldenburg-bold text-[14px] uppercase tracking-[0.7px] mb-4 text-neutral-500">History</h3>
        <div className="p-3 bg-white rounded-lg shadow-sm mb-2 text-[14px] font-medium border border-neutral-200 cursor-pointer">Saga Orchestration Details</div>
        <div className="p-3 text-neutral-500 rounded-lg hover:bg-neutral-200 text-[14px] cursor-pointer">TMForum API Specs</div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
          {/* Mock Agent Message */}
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-neutral-200 rounded-[24px] p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
              <p className="inter-airy text-[16px] leading-[1.6]">
                The product catalog uses a transactional outbox pattern to emit events to the Kafka broker.
                <span className="inline-block bg-neutral-100 text-[12px] px-2 py-0.5 rounded-full ml-2 text-neutral-600 cursor-pointer hover:bg-neutral-200">[1] catalog-service/outbox.py</span>
              </p>
            </div>
          </div>
        </div>

        {/* Input Area with Grounding Chips */}
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="text-[12px] font-medium text-neutral-500 py-1">Grounded in:</span>
              <button className="bg-neutral-900 text-white text-[12px] px-3 py-1 rounded-full">✓ All Sources</button>
            </div>
            <div className="bg-white rounded-[24px] border border-neutral-200 p-2 flex shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
              <input type="text" placeholder="Ask about your context..." className="flex-1 border-none focus:ring-0 px-4 text-[16px]" />
              <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/chatbot
git commit -m "feat: implement full-page chatbot with grounding filters"
```

### Task 2: OmniBoard Environment

**Files:**
- Create: `apps/web/app/play/[workspaceId]/generate/omniboard/page.tsx`

- [ ] **Step 1: Build OmniBoard Layout**
Adhering to UI_UX.md section 7.2 (specialized chatbot + artifact panel).

```tsx
export default function OmniBoardPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* OmniBoard Chat */}
      <div className="flex-1 flex flex-col bg-white p-8">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4 text-center">OmniBoard</h1>
        <p className="inter-airy text-[20px] text-neutral-600 text-center mb-12">Multimodal onboarding generation hub.</p>
        
        <div className="max-w-2xl mx-auto w-full bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
          <p className="text-[16px] mb-4">I can help you generate onboarding artifacts. What would you like to create today?</p>
          <div className="flex gap-4">
            <button className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-[14px] hover:bg-neutral-100">Slides</button>
            <button className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-[14px] hover:bg-neutral-100">Podcast</button>
            <button className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-[14px] hover:bg-neutral-100">Video</button>
          </div>
        </div>
      </div>

      {/* Artifact Panel */}
      <aside className="w-96 border-l border-black/[0.05] bg-neutral-50 p-6 overflow-y-auto">
        <h3 className="font-waldenburg text-[24px] mb-6">Generated Artifacts</h3>
        <div className="bg-white p-5 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] mb-4">
          <h4 className="font-medium text-[16px] mb-2">Architecture Summary Podcast</h4>
          <p className="text-[14px] text-neutral-500 mb-4">12 mins • Two-speaker format</p>
          <button className="w-full bg-warm-stone py-2 rounded-[30px] text-[14px] font-medium shadow-[rgba(78,50,23,0.04)_0px_6px_16px]">Play Audio</button>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/generate/omniboard
git commit -m "feat: implement omniboard multimodal generation hub"
```
