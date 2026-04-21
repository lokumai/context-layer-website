# DocsGen & Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the DocsGen tabbed-bundles page with persona-aware card states, and the Library page with filters and artifact grid. Generating a card on partial/empty personas advances the store state and adds items to the Library.

**Architecture:** Next.js pages read `docsGenCards[]` and `libraryItems[]` from `usePlaygroundStore`. The "Generate" action on a card calls `runDocsGenCard` (defined in plan 08 Task 7), which moves the card to `done` and appends the seeded Library item.

**Tech Stack:** Next.js 15, React, Zustand (via plan 08), Tailwind CSS v4.

> **Prerequisite:** Plan `2026-04-22-08-personas-and-fixtures.md` implemented.

> **Source of Truth:** `../../SEED.md`, `../../UI_UX.md`, `../../DESIGN.md`.

---

### Task 1: DocsGen Tabbed View

**Files:**
- Create: `apps/web/app/play/[workspaceId]/generate/docsgen/page.tsx`
- Create: `apps/web/components/docsgen/bundle-tabs.tsx`
- Create: `apps/web/components/docsgen/card.tsx`

The 6 bundles from UI_UX.md section 7.1:

| Bundle id | Label |
|---|---|
| `structure` | Structure & Architecture |
| `spec` | Specification & Knowledge |
| `health` | Health & Risk |
| `agentify` | Agentify |
| `memory` | Institutional Memory |
| `research` | Research Docs |

- [ ] **Step 1: Bundle tabs**

```tsx
// apps/web/components/docsgen/bundle-tabs.tsx
import type { DocsGenBundle } from "@context-layer/mocks";

export const BUNDLES: { id: DocsGenBundle; label: string }[] = [
  { id: "structure", label: "Structure & Architecture" },
  { id: "spec", label: "Specification & Knowledge" },
  { id: "health", label: "Health & Risk" },
  { id: "agentify", label: "Agentify" },
  { id: "memory", label: "Institutional Memory" },
  { id: "research", label: "Research Docs" },
];

export function BundleTabs({ active, onChange }: { active: DocsGenBundle; onChange: (b: DocsGenBundle) => void }) {
  return (
    <div className="flex gap-8 border-b border-neutral-200 mb-8 overflow-x-auto">
      {BUNDLES.map((b) => (
        <button
          key={b.id}
          onClick={() => onChange(b.id)}
          className={`pb-4 font-medium text-[15px] whitespace-nowrap ${
            active === b.id ? "border-b-2 border-black" : "text-neutral-400 hover:text-black"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Generation card**

```tsx
// apps/web/components/docsgen/card.tsx
"use client";

import { useState } from "react";
import type { DocsGenCard } from "@context-layer/mocks";
import { usePlaygroundStore } from "@/store/playground-store";

export function DocsGenCardView({ card, workspaceId }: { card: DocsGenCard; workspaceId: string }) {
  const runCard = usePlaygroundStore((s) => s.runDocsGenCard);
  const [running, setRunning] = useState(false);

  async function handleClick() {
    if (card.state === "done" || running) return;
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    runCard(workspaceId, card.id);
    setRunning(false);
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-waldenburg text-[22px]">{card.title}</h3>
        {card.state === "done" && (
          <span className="px-3 py-1 text-[11px] font-semibold rounded-full uppercase bg-green-50 text-green-700">Done</span>
        )}
      </div>
      <p className="text-[14px] text-neutral-500 mb-8 flex-1">{card.description}</p>
      <button
        onClick={handleClick}
        disabled={running || card.state === "done"}
        className="w-full bg-black text-white py-3 rounded-[30px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
      >
        {running ? "Generating…" : card.state === "done" ? "Regenerate" : "Generate"}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: DocsGen page**

```tsx
// apps/web/app/play/[workspaceId]/generate/docsgen/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";
import { BUNDLES, BundleTabs } from "@/components/docsgen/bundle-tabs";
import { DocsGenCardView } from "@/components/docsgen/card";
import type { DocsGenBundle } from "@context-layer/mocks";

export default function DocsGenPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [activeBundle, setActiveBundle] = useState<DocsGenBundle>("structure");

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-12 mx-auto text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">DocsGen is locked</h2>
        <p className="text-neutral-500 mb-8">Generate the Wiki first — every artifact is built on top of it.</p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          Go to Wiki Configure
        </Link>
      </div>
    );
  }

  const cards = ws.docsGenCards.filter((c) => c.bundle === activeBundle);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">DocsGen</h1>
        <p className="inter-airy text-[20px] text-neutral-600">Generate point-in-time exportable artifacts.</p>
      </header>

      <BundleTabs active={activeBundle} onChange={setActiveBundle} />

      {cards.length === 0 ? (
        <p className="text-neutral-500">No cards defined in this bundle yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => <DocsGenCardView key={c.id} card={c} workspaceId={workspaceId} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/generate/docsgen apps/web/components/docsgen
git commit -m "feat(docsgen): state-driven tabbed bundles with generate action"
```

---

### Task 2: Library Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/library/page.tsx`
- Create: `apps/web/components/library/library-item-row.tsx`

- [ ] **Step 1: Library item row**

```tsx
// apps/web/components/library/library-item-row.tsx
import type { LibraryItem } from "@context-layer/mocks";

export function LibraryItemRow({ item }: { item: LibraryItem }) {
  const icon = item.mime.startsWith("audio/") ? "Audio" : item.mime.startsWith("video/") ? "Video" : item.mime === "application/pdf" ? "PDF" : "File";

  return (
    <div data-library-item className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] flex flex-col">
      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-4 text-[11px] font-waldenburg-bold uppercase tracking-[0.5px]">
        {icon}
      </div>
      <h3 className="font-waldenburg text-[18px] mb-2 truncate" title={item.title}>{item.title}</h3>
      <p className="text-[12px] text-neutral-500 mb-4 capitalize">
        {item.sourceTool} • {item.createdAt.slice(0, 10)}
      </p>
      <button className="text-[13px] font-medium border border-neutral-200 px-4 py-1.5 rounded-full w-full hover:bg-neutral-50 mt-auto">
        Download
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Library page**

```tsx
// apps/web/app/play/[workspaceId]/library/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { LibraryItemRow } from "@/components/library/library-item-row";
import type { LibrarySourceTool } from "@context-layer/mocks";

const TOOL_FILTERS: { id: LibrarySourceTool | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "docsgen", label: "DocsGen" },
  { id: "omniboard", label: "OmniBoard" },
  { id: "mcpgen", label: "MCPGen" },
];

export default function LibraryPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [filter, setFilter] = useState<LibrarySourceTool | "all">("all");

  if (!ws) return null;

  const items = filter === "all" ? ws.libraryItems : ws.libraryItems.filter((i) => i.sourceTool === filter);

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-4">
        <h2 className="font-waldenburg text-[24px] mb-4">Library</h2>
        <h3 className="font-waldenburg-bold text-[12px] uppercase text-neutral-500 tracking-[0.7px]">Source</h3>
        <ul className="flex flex-col gap-1">
          {TOOL_FILTERS.map((f) => (
            <li key={f.id}>
              <button
                onClick={() => setFilter(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] ${filter === f.id ? "bg-white shadow-sm border border-neutral-200 font-medium" : "hover:bg-neutral-200 text-neutral-600"}`}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 overflow-y-auto p-8">
        {items.length === 0 ? (
          <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
            <h2 className="font-waldenburg text-[32px] mb-4">Generate your first artifact</h2>
            <p className="text-neutral-500 mb-8">Artifacts from DocsGen and OmniBoard land here.</p>
            <Link href={`/play/${workspaceId}/generate/docsgen`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
              Open DocsGen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {items.map((i) => <LibraryItemRow key={i.id} item={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/library apps/web/components/library
git commit -m "feat(library): state-driven filter sidebar and artifact grid"
```
