# Sources & Knowledge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Sources management page (with persona-aware empty state + quick-populate), the Wiki sidebar with Status / View / Configure / Logs subpages, and the Intelligence dashboards page. All content is driven by the persona store from plan 08.

**Architecture:** Next.js App Router pages that read from `usePlaygroundStore`; no inline fixture data. User actions (add source, generate Wiki, generate Intelligence) call store mutations defined in plan 08 Task 7.

**Tech Stack:** Next.js 15, React, Zustand (via plan 08), Tailwind CSS v4.

> **Prerequisite:** Plan `2026-04-22-08-personas-and-fixtures.md` must be implemented first. Plan `2026-04-22-03-workspaces-shell.md` Task 3 (workspace layout) must be in place.

> **Source of Truth:** `../../SEED.md`, `../../UI_UX.md`, `../../DESIGN.md`.

---

### Task 1: Sources Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/sources/page.tsx`
- Create: `apps/web/components/sources/source-card.tsx`
- Create: `apps/web/components/sources/add-source-chooser.tsx`

- [ ] **Step 1: Source card**

```tsx
// apps/web/components/sources/source-card.tsx
import type { Source } from "@context-layer/mocks";

export function SourceCard({ source }: { source: Source }) {
  const badgeColor =
    source.status === "indexed"
      ? "bg-green-50 text-green-700"
      : source.status === "indexing"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";

  const icon = source.kind === "repo" ? "Repo" : source.kind === "file" ? "Doc" : "Chat";

  return (
    <div data-source-card className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-[11px] font-waldenburg-bold uppercase tracking-[0.5px]">
          {icon}
        </div>
        <span className={`px-3 py-1 text-[11px] font-semibold rounded-full uppercase ${badgeColor}`}>{source.status}</span>
      </div>
      <h3 className="font-waldenburg text-[22px] mb-2 truncate">{source.name}</h3>
      <p className="text-neutral-500 text-[13px]">
        {source.provider}
        {source.branch ? ` / ${source.branch}` : ""}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add Source chooser (empty persona only — displays quick-populate)**

```tsx
// apps/web/components/sources/add-source-chooser.tsx
"use client";

import { usePlaygroundStore } from "@/store/playground-store";

export function AddSourceChooser({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const addQuickPopulate = usePlaygroundStore((s) => s.addQuickPopulateSources);
  const persona = usePlaygroundStore((s) => s.persona);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
        <h2 className="font-waldenburg text-[28px] mb-2">Add Source</h2>
        <p className="text-neutral-500 text-[14px] mb-8">Pick an integration or a manual option.</p>

        {persona === "empty" && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-waldenburg text-[18px] mb-2">Demo shortcut</h3>
            <p className="text-[13px] text-amber-900 mb-4">
              Populate all 9 microservice repositories in one click. This is only shown in the empty demo persona.
            </p>
            <button
              onClick={() => {
                addQuickPopulate(workspaceId);
                onClose();
              }}
              className="bg-black text-white px-6 py-2 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[13px]"
            >
              Quick-populate demo sources
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {["GitHub", "GitLab", "Google Drive", "Notion", "Upload file", "Paste URL"].map((label) => (
            <button
              key={label}
              onClick={onClose}
              className="text-left px-4 py-3 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all text-[14px] font-medium"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-neutral-400 mt-6">
          In this mock, integration buttons are placeholders. Use Quick-populate for the demo dataset.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Sources page**

```tsx
// apps/web/app/play/[workspaceId]/sources/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";
import { SourceCard } from "@/components/sources/source-card";
import { AddSourceChooser } from "@/components/sources/add-source-chooser";

export default function SourcesPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [chooserOpen, setChooserOpen] = useState(false);

  if (!workspace) return null;
  const { sources } = workspace;

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Sources</h1>
          <p className="inter-airy text-[20px] text-neutral-600">The single source of truth for this workspace.</p>
        </div>
        <button
          onClick={() => setChooserOpen(true)}
          className="bg-warm-stone px-8 py-3 rounded-[30px] shadow-[rgba(78,50,23,0.04)_0px_6px_16px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
        >
          + Add Source
        </button>
      </header>

      {sources.length === 0 ? (
        <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
          <h2 className="font-waldenburg text-[32px] mb-4">Add your first source</h2>
          <p className="inter-airy text-[16px] text-neutral-500 mb-8 max-w-lg mx-auto">
            Connect GitHub, Google Drive, or upload files. Everything you add becomes searchable by every agent in the product.
          </p>
          <button
            onClick={() => setChooserOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
          >
            + Add Source
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sources.map((s) => <SourceCard key={s.id} source={s} />)}
        </div>
      )}

      {chooserOpen && <AddSourceChooser workspaceId={workspaceId} onClose={() => setChooserOpen(false)} />}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/sources apps/web/components/sources
git commit -m "feat(sources): state-driven page with quick-populate for empty persona"
```

---

### Task 2: Wiki Sidebar Layout

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/layout.tsx`

- [ ] **Step 1: Layout with 4 subpage links**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/wiki/layout.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const ITEMS = [
  { href: "", label: "Status" },
  { href: "/view", label: "View" },
  { href: "/configure", label: "Configure" },
  { href: "/logs", label: "Logs" },
];

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const base = `/play/${workspaceId}/knowledge/wiki`;

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-1">
        <h2 className="font-waldenburg text-[24px] mb-6">Wiki</h2>
        {ITEMS.map((item) => {
          const href = `${base}${item.href}`;
          const active = pathname === href;
          return (
            <Link
              key={item.label}
              href={href}
              className={`font-medium text-[15px] px-3 py-2 rounded-lg ${active ? "bg-white shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]" : "hover:bg-neutral-200"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/wiki/layout.tsx
git commit -m "feat(wiki): sidebar layout with Status/View/Configure/Logs"
```

---

### Task 3: Wiki Status Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/page.tsx`

- [ ] **Step 1: Build the page**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/wiki/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiStatusPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">No Wiki yet</h2>
        <p className="inter-airy text-[16px] text-neutral-500 mb-8">
          Generate a Wiki from your sources to unlock downstream capabilities.
        </p>
        <Link
          href={`/play/${workspaceId}/knowledge/wiki/configure`}
          className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
        >
          Configure & Generate
        </Link>
      </div>
    );
  }

  const s = ws.wikiSummary;
  return (
    <div className="max-w-4xl">
      <h1 className="font-waldenburg text-[36px] mb-8">Wiki Status</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatCard label="Coverage Score" value={`${s.coverageScore}%`} />
        <StatCard label="Total Tokens" value={s.totalTokens} />
        <StatCard label="Last Synced" value={s.lastSyncedAt.slice(0, 10)} />
        <StatCard label="Missing Context" value={`${s.missingContextCount}`} />
      </div>
      <section className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
        <h3 className="font-waldenburg text-[20px] mb-4">Active Repos</h3>
        <ul className="flex flex-wrap gap-2">
          {s.activeRepoIds.map((r) => (
            <li key={r} className="text-[13px] px-3 py-1 bg-neutral-100 rounded-full">{r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <h3 className="text-neutral-500 text-[12px] uppercase font-bold tracking-widest mb-2">{label}</h3>
      <p className="font-waldenburg text-[48px]">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/wiki/page.tsx
git commit -m "feat(wiki): status page with summary stats"
```

---

### Task 4: Wiki View Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/view/page.tsx`

- [ ] **Step 1: Tree + markdown viewer**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/wiki/view/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiViewPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const pages = ws?.wikiPages ?? [];
  const [activeId, setActiveId] = useState<string>(pages[0]?.id ?? "");

  const active = useMemo(() => pages.find((p) => p.id === activeId) ?? pages[0], [pages, activeId]);

  if (pages.length === 0) {
    return <p className="text-neutral-500">No Wiki yet. Configure and generate one.</p>;
  }

  return (
    <div className="flex gap-8 min-h-[calc(100vh-200px)]">
      <aside className="w-64 shrink-0 border-r border-neutral-200 pr-4">
        <ul className="flex flex-col gap-1">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setActiveId(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] ${p.id === active?.id ? "bg-neutral-100 font-medium" : "hover:bg-neutral-50 text-neutral-600"}`}
              >
                {p.pathSegments.join(" / ")}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <article className="flex-1 prose max-w-none">
        <pre className="whitespace-pre-wrap font-inter text-[15px] leading-[1.7]">{active?.markdown ?? ""}</pre>
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/wiki/view
git commit -m "feat(wiki): view page with tree navigation"
```

---

### Task 5: Wiki Configure Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/configure/page.tsx`

- [ ] **Step 1: Configure + Generate**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/wiki/configure/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiConfigurePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateWiki = usePlaygroundStore((s) => s.generateWiki);
  const [generating, setGenerating] = useState(false);

  if (!ws) return null;

  const hasSources = ws.sources.length > 0;
  const hasWiki = ws.wikiSummary != null;

  async function handleGenerate() {
    if (!hasSources || generating) return;
    setGenerating(true);
    // Fake progress delay so the UX feels like a real job.
    await new Promise((r) => setTimeout(r, 1500));
    generateWiki(workspaceId);
    setGenerating(false);
    router.push(`/play/${workspaceId}/knowledge/wiki`);
  }

  if (!hasSources) {
    return (
      <div className="max-w-xl">
        <h1 className="font-waldenburg text-[36px] mb-4">Add sources first</h1>
        <p className="text-neutral-500 mb-6">The Wiki needs at least one source to generate from.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-waldenburg text-[36px] mb-4">{hasWiki ? "Reconfigure Wiki" : "Generate Wiki"}</h1>
        <p className="text-neutral-500">
          Select which sources feed the Wiki. Auto-sync keeps it fresh. This demo skips source selection and uses all indexed sources.
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
        <h3 className="font-waldenburg text-[20px] mb-2">Sync strategy</h3>
        <p className="text-[13px] text-neutral-500 mb-4">Per PR merge to main (balanced default)</p>
      </div>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
      >
        {generating ? "Generating…" : hasWiki ? "Force Rebuild" : "Generate Wiki"}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/wiki/configure
git commit -m "feat(wiki): configure page with fake generation flow"
```

---

### Task 6: Wiki Logs Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/logs/page.tsx`

- [ ] **Step 1: Timeline of jobs**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/wiki/logs/page.tsx
"use client";

import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiLogsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const jobs = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId)?.wikiJobs ?? []);

  if (jobs.length === 0) {
    return <p className="text-neutral-500">No generation jobs yet.</p>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-waldenburg text-[36px] mb-8">Wiki Logs</h1>
      <ul className="space-y-4">
        {jobs.map((j) => (
          <li key={j.id} className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-waldenburg text-[18px] capitalize">{j.type} • {j.trigger}</h3>
                <p className="text-[13px] text-neutral-500">{j.startedAt} • {(j.durationMs / 1000).toFixed(0)}s</p>
              </div>
              <span className={`px-3 py-1 text-[11px] font-semibold rounded-full uppercase ${j.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {j.status}
              </span>
            </div>
            <div className="text-[13px] text-neutral-600 mb-3">
              +{j.diffSummary.filesAdded} files • {j.diffSummary.linesAdded} lines added • {j.diffSummary.linesRemoved} removed
            </div>
            <details>
              <summary className="text-[13px] cursor-pointer text-neutral-500 hover:text-black">Agent logs</summary>
              <ul className="mt-3 space-y-1 text-[12px] text-neutral-600 font-mono bg-neutral-50 p-3 rounded-lg">
                {j.agentLogs.map((log, i) => <li key={i}>› {log}</li>)}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/wiki/logs
git commit -m "feat(wiki): logs page with job timeline"
```

---

### Task 7: Intelligence Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/intelligence/page.tsx`

- [ ] **Step 1: Dashboard grid with generate gate**

```tsx
// apps/web/app/play/[workspaceId]/knowledge/intelligence/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function IntelligencePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateIntelligence = usePlaygroundStore((s) => s.generateIntelligence);
  const [generating, setGenerating] = useState(false);

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-8">
        <h2 className="font-waldenburg text-[28px] mb-4">Generate the Wiki first</h2>
        <p className="text-neutral-500">Intelligence analyses depend on an indexed Wiki.</p>
      </div>
    );
  }

  if (ws.intelligenceDashboards.length === 0) {
    return (
      <div className="max-w-xl p-8">
        <h2 className="font-waldenburg text-[28px] mb-4">Generate Intelligence</h2>
        <p className="text-neutral-500 mb-6">Dashboards appear after the first analysis run.</p>
        <button
          onClick={async () => {
            setGenerating(true);
            await new Promise((r) => setTimeout(r, 1500));
            generateIntelligence(workspaceId);
            setGenerating(false);
          }}
          disabled={generating}
          className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
        >
          {generating ? "Analyzing…" : "Generate Intelligence"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6">
        <h2 className="font-waldenburg text-[24px] mb-6">Intelligence</h2>
        <ul className="flex flex-col gap-1">
          {ws.intelligenceDashboards.map((d) => (
            <li key={d.id} className="px-3 py-2 rounded-lg text-[14px] text-neutral-600 hover:bg-neutral-200 font-medium">
              {d.title}
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {ws.intelligenceDashboards.map((d) => (
          <section key={d.id}>
            <h3 className="font-waldenburg text-[24px] mb-4">{d.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {d.widgets.map((w) => (
                <div key={w.id} className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
                  <h4 className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold mb-2">{w.title}</h4>
                  <p className="font-waldenburg text-[28px]">{w.value}</p>
                  {w.detail && <p className="text-[12px] text-neutral-500 mt-2">{w.detail}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge/intelligence
git commit -m "feat(intelligence): dashboards with Wiki+Intel two-tier gate"
```
