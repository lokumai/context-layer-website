# Playground Shell & Workspaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the workspace selection gateway, the Create Workspace modal, the first-time setup wizard entry point, and the workspace-scoped layout. All content is driven by the persona-aware Zustand store defined in plan 08.

**Architecture:** Next.js App Router layouts; pages read `workspaces[]` from `usePlaygroundStore`; Create/Reset actions mutate the store via its exposed actions.

**Tech Stack:** Next.js 15, React, Zustand (via plan 08), Tailwind CSS v4.

> **Prerequisite:** Plan `2026-04-22-08-personas-and-fixtures.md` must be implemented first — this plan's pages consume its store and fixtures.

> **Source of Truth:** All technical and design decisions derive from `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`. Read them before implementing.

---

### Task 1: Authenticated Playground Layout

**Owned by plan 08 Task 8.** `apps/web/app/play/layout.tsx` is authored there (it must mount `PersonaHydrator` immediately inside the tree before `TopNavbar` so session-driven hydration is ready before the navbar reads state). Do not rewrite it here.

---

### Task 2: Workspaces Landing Page (state-driven)

**Files:**
- Create: `apps/web/app/play/workspaces/page.tsx`
- Create: `apps/web/components/workspaces/create-workspace-modal.tsx`

- [ ] **Step 1: Create the Create Workspace modal**

```tsx
// apps/web/components/workspaces/create-workspace-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const createWorkspace = usePlaygroundStore((s) => s.createWorkspace);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    const id = createWorkspace(name.trim());
    router.push(`/play/${id}/sources`);
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
        <h2 className="font-waldenburg text-[28px] mb-6">Create Workspace</h2>
        <label className="block">
          <span className="text-[13px] font-medium text-neutral-600 uppercase tracking-[0.7px] mb-2 block">Workspace name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="workspace name"
            autoFocus
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-black"
          />
        </label>
        <div className="flex gap-3 mt-8 justify-end">
          <button onClick={onClose} className="px-6 py-2 text-neutral-500 hover:text-black text-[14px] font-medium">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || submitting}
            className="bg-black text-white px-8 py-2 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[13px] disabled:opacity-40"
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the Workspaces page**

```tsx
// apps/web/app/play/workspaces/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { CreateWorkspaceModal } from "@/components/workspaces/create-workspace-modal";

export default function WorkspacesPage() {
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const [modalOpen, setModalOpen] = useState(false);

  const isEmpty = workspaces.length === 0;

  return (
    <div className="max-w-screen-xl mx-auto w-full px-8 py-16">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-12">Workspaces</h1>

      {isEmpty ? (
        <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
          <h2 className="font-waldenburg text-[32px] mb-4">Create your first workspace</h2>
          <p className="inter-airy text-[16px] text-neutral-500 mb-8 max-w-lg mx-auto">
            A workspace is a collection of code and documents you want to understand, document, or generate from.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
          >
            + Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setModalOpen(true)}
            className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-neutral-500 hover:border-black hover:text-black transition-all min-h-[200px]"
          >
            <span className="text-[32px] mb-2">+</span>
            <span className="font-inter font-medium">Create Workspace</span>
          </button>

          {workspaces.map(({ workspace, sources, wikiSummary }) => (
            <Link
              key={workspace.id}
              href={`/play/${workspace.id}/${wikiSummary ? "knowledge/wiki" : "sources"}`}
              className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all min-h-[200px] flex flex-col"
            >
              <h2 className="font-waldenburg text-[24px] mb-2">{workspace.name}</h2>
              <span className="inline-block text-[11px] font-waldenburg-bold uppercase tracking-[0.7px] text-neutral-500 mb-auto">
                {workspace.stage}
              </span>
              <p className="text-neutral-500 text-[14px] mt-auto">
                {sources.length} source{sources.length === 1 ? "" : "s"}
                {wikiSummary ? ` • Synced ${wikiSummary.lastSyncedAt.slice(0, 10)}` : " • No Wiki yet"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && <CreateWorkspaceModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/play/workspaces apps/web/components/workspaces
git commit -m "feat: workspaces page with empty state and create modal"
```

---

### Task 3: Workspace Context Layout

**Files:**
- Create: `apps/web/app/play/[workspaceId]/layout.tsx`

- [ ] **Step 1: Create the workspace layout**

```tsx
// apps/web/app/play/[workspaceId]/layout.tsx
"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const setActiveWorkspace = usePlaygroundStore((s) => s.setActiveWorkspace);
  const exists = usePlaygroundStore((s) => s.workspaces.some((w) => w.workspace.id === workspaceId));
  const persona = usePlaygroundStore((s) => s.persona);

  useEffect(() => {
    if (exists) setActiveWorkspace(workspaceId);
  }, [workspaceId, exists, setActiveWorkspace]);

  // Wait for hydration before rendering not-found
  if (persona === null) return null;
  if (!exists) return notFound();

  return <div className="flex-1 flex flex-col">{children}</div>;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/layout.tsx
git commit -m "feat: workspace context layout with existence guard"
```

---

### Task 4: First-Time Wizard Entry (lightweight)

When the empty persona lands on `/play/<id>/sources` and the workspace has no sources yet, the Sources page itself handles the wizard (see plan 04). No separate wizard route is needed — the page's empty state IS the wizard step for this mock.

No files in this plan. This task is a placeholder so readers know where the wizard lives.

- [ ] **Step 1:** Mark as complete once plan 04 Task 1 (Sources page) is implemented with its empty state + quick-populate action.
