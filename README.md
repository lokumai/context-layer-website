# Context Layer — Website

Landing pages and authenticated playground for the [Context Layer Ecosystem](https://github.com/amirkiarafiei/context-layer).

## What's Here

**Landing pages** — product overview, Context Layer, Code Translation, Code Modernization.

**Playground** — auth-gated demo of the Context Layer base product. Mock-first: all outputs are pre-generated; service interfaces are designed for zero-friction swap to real agents later.

Demo workspace: [microservices-product-catalog](https://github.com/amirkiarafiei/microservices-product-catalog) — 9 repos, TMForum/FastAPI, showcasing cross-repo saga flows that single-repo tools cannot produce.

## Stack

| Layer | Choice |
|---|---|
| Runtime / Package Manager | Bun |
| Monorepo | Turborepo |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Animation | Motion |
| Auth | Auth.js v5 |
| State | Zustand |
| Testing | Vitest + Playwright |
| Linting | Biome |

## Docs

- [docs/SEED.md](docs/SEED.md) — decisions log
- [docs/UI_UX.md](docs/UI_UX.md) — playground UI/UX spec
- [docs/DESIGN.md](docs/DESIGN.md) — design system

