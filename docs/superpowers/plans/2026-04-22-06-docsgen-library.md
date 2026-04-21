# DocsGen & Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the one-shot artifact generation pipelines (DocsGen) and central storage (Library).

**Architecture:** Next.js pages utilizing tabbed navigation for DocsGen bundles and filterable grids for the Library.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`.

---

### Task 1: DocsGen Bundles

**Files:**
- Create: `apps/web/app/play/[workspaceId]/generate/docsgen/page.tsx`

- [ ] **Step 1: Build DocsGen Tabbed View**
Adhering to UI_UX.md section 7.1.

```tsx
export default function DocsGenPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">DocsGen</h1>
        <p className="inter-airy text-[20px] text-neutral-600">Generate point-in-time exportable artifacts.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-neutral-200 mb-8 overflow-x-auto">
        <button className="pb-4 border-b-2 border-black font-medium text-[15px] whitespace-nowrap">Structure & Architecture</button>
        <button className="pb-4 text-neutral-400 hover:text-black font-medium text-[15px] whitespace-nowrap">Specification & Knowledge</button>
        <button className="pb-4 text-neutral-400 hover:text-black font-medium text-[15px] whitespace-nowrap">Health & Risk</button>
        <button className="pb-4 text-neutral-400 hover:text-black font-medium text-[15px] whitespace-nowrap">Agentify</button>
        <button className="pb-4 text-neutral-400 hover:text-black font-medium text-[15px] whitespace-nowrap">Institutional Memory</button>
      </div>

      {/* Generation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] flex flex-col">
          <h3 className="font-waldenburg text-[24px] mb-2">Semantic Repo Map</h3>
          <p className="text-[14px] text-neutral-500 mb-8 flex-1">Cross-repo dependency map and data flow diagrams.</p>
          <button className="w-full bg-black text-white py-3 rounded-[30px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">Generate</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/generate/docsgen
git commit -m "feat: build docsgen tabbed interface and generation cards"
```

### Task 2: Library Page

**Files:**
- Create: `apps/web/app/play/[workspaceId]/library/page.tsx`

- [ ] **Step 1: Build Library Page**
Adhering to UI_UX.md section 8.

```tsx
export default function LibraryPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Filters Sidebar */}
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-4">
        <h2 className="font-waldenburg text-[24px] mb-4">Library</h2>
        <div className="space-y-2">
          <h3 className="font-waldenburg-bold text-[12px] uppercase text-neutral-500 tracking-[0.7px]">Type</h3>
          <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" /> DocsGen Docs</label>
          <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" /> OmniBoard Audio</label>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">PDF</div>
            <h3 className="font-medium text-[16px] mb-2 truncate">Structure Map Q1</h3>
            <p className="text-[12px] text-neutral-500 mb-4">DocsGen • 2 days ago</p>
            <button className="text-[13px] font-medium border border-neutral-200 px-4 py-1.5 rounded-full w-full hover:bg-neutral-50">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/play/\[workspaceId\]/library
git commit -m "feat: build library page with filters and artifact grid"
```
