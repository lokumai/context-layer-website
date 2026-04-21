# Playground Shell & Workspaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the workspace selection gateway, the first-time setup wizard, and the authenticated layout wrapper that enforces access gates.

**Architecture:** Next.js App Router layouts for authentication and workspace context encapsulation.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`. It is highly recommended that the implementer actively views and reads these source of truth documents before and during implementation.

---

### Task 1: Authenticated Playground Layout

**Files:**
- Create: `apps/web/app/play/layout.tsx`

- [ ] **Step 1: Create the `/play` layout**
This layout ensures the user is authenticated and renders the TopNavbar.

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";

export default async function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login"); // Fallback to auth
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play
git commit -m "feat: add authenticated playground layout wrapper"
```

### Task 2: Workspaces Landing Page

**Files:**
- Create: `apps/web/app/play/workspaces/page.tsx`

- [ ] **Step 1: Create Workspaces Grid**
Adhering to UI_UX.md section 3.

```tsx
'use client';
import Link from 'next/link';

export default function WorkspacesPage() {
  return (
    <div className="max-w-screen-xl mx-auto w-full px-8 py-16">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-12">Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Create New Card */}
        <button className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-neutral-500 hover:border-black hover:text-black transition-all min-h-[200px]">
          <span className="text-[32px] mb-2">+</span>
          <span className="font-inter font-medium">Create Workspace</span>
        </button>

        {/* Demo Workspace Card */}
        <Link href="/play/microservices-product-catalog/sources" className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all min-h-[200px] flex flex-col">
          <h2 className="font-waldenburg text-[24px] mb-2">microservices-product-catalog</h2>
          <p className="text-neutral-500 text-[14px] mt-auto">9 Sources • Synced 2h ago</p>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/workspaces
git commit -m "feat: build workspaces selection page"
```

### Task 3: Workspace Context Wrapper

**Files:**
- Create: `apps/web/app/play/[workspaceId]/layout.tsx`

- [ ] **Step 1: Create Workspace Layout**
Updates the global store with the active workspace.

```tsx
'use client';
import { useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playground-store';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const setActiveWorkspace = usePlaygroundStore((state) => state.setActiveWorkspace);

  useEffect(() => {
    setActiveWorkspace(params.workspaceId);
    return () => setActiveWorkspace('');
  }, [params.workspaceId, setActiveWorkspace]);

  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]
git commit -m "feat: add workspace context layout wrapper"
```
