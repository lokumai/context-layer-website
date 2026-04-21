# Marketing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the public-facing marketing pages explaining the Context Layer ecosystem and premium add-ons.

**Architecture:** Next.js static pages with responsive grid layouts.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4.

> **Source of Truth:** All technical and design decisions in this plan derive from and strictly adhere to `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`.

---

### Task 1: Product Landing Pages

**Files:**
- Create: `apps/web/app/product/context-layer/page.tsx`
- Create: `apps/web/app/product/code-translation/page.tsx`
- Create: `apps/web/app/product/code-modernization/page.tsx`

- [ ] **Step 1: Build Base Context Layer Page**

```tsx
import Link from 'next/link';

export default function ContextLayerProductPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-8 py-24 text-center">
      <h1 className="font-waldenburg text-[64px] tracking-[-0.96px] mb-6">Context Layer Base</h1>
      <p className="inter-airy text-[24px] text-neutral-600 mb-12 max-w-3xl mx-auto">
        The persistent, versioned, multi-repository knowledge base that bridges the gap between human developers, AI agents, and your codebase.
      </p>
      <Link href="/play/workspaces">
        <button className="bg-black text-white px-8 py-4 rounded-full font-medium text-[16px] shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] hover:opacity-80 transition-all">
          Try the Playground
        </button>
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Build Translation Page**

```tsx
export default function CodeTranslationPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-8 py-24 text-center">
      <h1 className="font-waldenburg text-[64px] tracking-[-0.96px] mb-6">Code Translation</h1>
      <p className="inter-airy text-[24px] text-neutral-600 mb-12 max-w-3xl mx-auto">
        Re-implement projects in new languages effortlessly, powered by the deep semantic understanding of the Context Wiki.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Build Modernization Page**

```tsx
export default function CodeModernizationPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-8 py-24 text-center">
      <h1 className="font-waldenburg text-[64px] tracking-[-0.96px] mb-6">Code Modernization</h1>
      <p className="inter-airy text-[24px] text-neutral-600 mb-12 max-w-3xl mx-auto">
        Transform legacy monoliths into modern microservices with AI that actually understands your entire architecture.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/product
git commit -m "feat: build product marketing landing pages"
```
