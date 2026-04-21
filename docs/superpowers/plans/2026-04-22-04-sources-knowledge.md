# Sources & Knowledge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Sources management page, the living Wiki viewer, and Intelligence dashboards.

**Architecture:** Next.js pages with mock data representing the `microservices-product-catalog` workspace.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`.

---

### Task 1: Sources Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/sources/page.tsx`

- [ ] **Step 1: Build Sources Page**
Adhering to UI_UX.md section 4.

```tsx
export default function SourcesPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Sources</h1>
          <p className="inter-airy text-[20px] text-neutral-600">The single source of truth for this workspace.</p>
        </div>
        <button className="bg-warm-stone px-8 py-3 rounded-[30px] shadow-[rgba(78,50,23,0.04)_0px_6px_16px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          + Add Source
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Source Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">Repo</div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-semibold rounded-full uppercase">Indexed</span>
          </div>
          <h3 className="font-waldenburg text-[24px] mb-2">catalog-service</h3>
          <p className="text-neutral-500 text-[14px]">GitHub / main</p>
        </div>
        {/* Mock File Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">Doc</div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-semibold rounded-full uppercase">Indexed</span>
          </div>
          <h3 className="font-waldenburg text-[24px] mb-2">TMForum_Spec.pdf</h3>
          <p className="text-neutral-500 text-[14px]">Google Drive</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/sources
git commit -m "feat: build sources management page"
```

### Task 2: Wiki Layout and Status Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/layout.tsx`
- Create: `apps/web/app/play/[workspaceId]/knowledge/wiki/page.tsx`

- [ ] **Step 1: Create Wiki Layout with Sidebar**
Adhering to UI_UX.md section 5.1.

```tsx
import Link from 'next/link';

export default function WikiLayout({ children, params }: { children: React.ReactNode, params: { workspaceId: string } }) {
  const base = `/play/${params.workspaceId}/knowledge/wiki`;
  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-2">
        <h2 className="font-waldenburg text-[24px] mb-6">Wiki</h2>
        <Link href={`${base}`} className="font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-neutral-200">Status</Link>
        <Link href={`${base}/view`} className="font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-neutral-200">View</Link>
        <Link href={`${base}/configure`} className="font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-neutral-200">Configure</Link>
        <Link href={`${base}/logs`} className="font-medium text-[15px] px-3 py-2 rounded-lg hover:bg-neutral-200">Logs</Link>
      </aside>
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Wiki Status Page**

```tsx
export default function WikiStatusPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-waldenburg text-[36px] mb-8">Wiki Status</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <h3 className="text-neutral-500 text-[12px] uppercase font-bold tracking-widest mb-2">Coverage Score</h3>
          <p className="font-waldenburg text-[48px]">100%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
          <h3 className="text-neutral-500 text-[12px] uppercase font-bold tracking-widest mb-2">Total Tokens</h3>
          <p className="font-waldenburg text-[48px]">1.2M</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/knowledge
git commit -m "feat: build wiki layout and status page"
```
