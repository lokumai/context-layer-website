# Context Layer Website — Seed Document

Chronological decisions and context for designing the Context Layer ecosystem website.

---

## 2026-04-06 — Website Purpose & Strategy

**Goal:** A website for the Context Layer Ecosystem that explains the product with concrete examples and interactive animations, plus an authenticated playground where customers can demo the product.

### Pages

**Landing pages:**
- Main page (ecosystem overview)
- Context Layer product page (base product) (CL)
- Code Translation product page (premium) (CT)
- Code Modernization product page (premium) (CM)

**Playground (auth-gated):**
- Only the Context Layer (CL) base product is available in the playground (not CT/CM)
- TUBITAK is omitted from the website since it is a subset of Context Layer itself

### Playground strategy: Mock-first

No real agents or workflows are implemented. The playground is a **demo that mimics the final product**:
- Select a pre-loaded multi-repo workspace
- All inputs and outputs are pre-generated beforehand
- User interactions trigger fake loading screens to replicate real UX
- The UI is designed so real agent implementations can be plugged in later with minimal refactoring (service abstraction pattern — all playground components consume shared interfaces; swap mock for real implementation later, zero UI changes)

**Playground pipelines (all mocked):**

| Pipeline | What user sees |
|---|---|
| **Context Wiki** | Browseable 3-layer wiki (workspace / repo / file) with sidebar navigation |
| **DocsGen** | Tabbed viewer with 6 bundle tabs, each showing a polished artifact |
| **QnA Chatbot** | Chat interface with fake typing animation, suggested questions, pre-canned Q&A pairs |
| **OmniBoard** | Tab switcher: Text / Audio / Video |
| **MCPGen** | Code viewer with syntax-highlighted MCP descriptor JSON |

### Demo project

**Project:** [microservices-product-catalog](https://github.com/amirkiarafiei/microservices-product-catalog) — a TMForum-compatible product catalog (Python/FastAPI + Next.js).

**Why this project:**
- 7 microservices + shared lib + UI = natural multi-repo split (9 repos in one workspace)
- TMForum standard — enterprise telecom customers instantly recognize it
- Rich patterns: CQRS, distributed sagas, transactional outbox, event-driven
- Right complexity: 14.2K lines, 120+ tests — impressive enough to demo, feasible to pre-generate
- Owned by us — no licensing issues, full control

**Key demo moment:** Workspace-level wiki showing cross-repo saga flows spanning 4 services — something single-repo tools like DeepWiki cannot produce.

**Note:** Context Layer is language-agnostic. Demo uses Python but same analysis works on any stack.

---
`
## 2026-04-06 — Tech Stack Decision

**Alternatives considered:**
- A: Bun + Turborepo (modern & lean)
- B: pnpm + Turborepo (battle-tested)
- C: Bun + Nx (enterprise-grade)

**Decision: Alternative A — Bun + Turborepo**

| Layer | Choice |
|---|---|
| **Runtime / Package Manager** | Bun |
| **Monorepo** | Turborepo |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui |
| **Animation** | Motion (formerly Framer Motion) |
| **Auth** | Auth.js (NextAuth v5) |
| **State (playground)** | Zustand |
| **Testing** | Vitest + Playwright |
| **Linting** | Biome |

**Why A:** Sweet spot for current scope. Fast, minimal tooling overhead. If monorepo grows significantly, can migrate to Nx later.

**Future agent integration:** [DeepAgentsJS](https://github.com/langchain-ai/deepagentsjs). Company strategy is monorepo with TS frontends + TS backends.
