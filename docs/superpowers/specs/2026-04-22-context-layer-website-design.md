# Context Layer Website Design Spec

**Date:** 2026-04-22
**Topic:** Context Layer Landing Pages and Mock Playground

> **Source of Truth:** This specification strictly adheres to the definitions established in `../../SEED.md`, `../../UI_UX.md`, and `../../DESIGN.md`. All design and functional implementations MUST reference these core documents. It is highly recommended that the implementer actively views and reads these source of truth documents before and during implementation.

## Overview
This document specifies the technical architecture and design structure for the Context Layer website, an authenticated playground mimicking the final agentic product. It serves as an exportable demo grounded in pre-generated data from the `microservices-product-catalog` workspace.

## Architecture
The project employs a monorepo setup optimized for modularity and future agent integration:
- **Runtime & Manager:** Bun
- **Structure:** Turborepo
- **Packages:**
  - `apps/web`: Next.js 15 App Router containing marketing landing pages and the authenticated playground.
  - `packages/ui`: Shared design system components built on `shadcn/ui` and styled via Tailwind CSS v4.
  - `packages/config`: Common configuration files (Biome, TypeScript, Tailwind).
  - `packages/mocks`: Persona-aware fixture package. Exports a single canonical dataset (the `microservices-product-catalog` workspace in its finished state) plus `seedForPersona(persona)` which derives the `full`, `partial`, and `empty` starting states. See plan `2026-04-22-08-personas-and-fixtures.md`.

## State Management & Auth
- **Global Playground State:** Managed via `Zustand` (with the `persist` middleware) to hold the active persona, workspaces, sources, Wiki, Intelligence, chat threads, DocsGen cards, OmniBoard artifacts, and Library items. Progressive gating is computed from this state (e.g., Chatbot is locked until the active workspace has a `wikiSummary`). Persisted under a persona-scoped localStorage key so in-browser progress survives reloads but each persona stays isolated.
- **Authentication:** `Auth.js v5` Credentials provider accepting three fixed usernames — `full`, `partial`, `empty` — each producing a session with a `persona` claim. The `/play` layout reads the persona from the session and hydrates the store from `seedForPersona(persona)`.

## Personas & Fixtures
Three demo personas expose different starting points over the same underlying fixture:
- **`full`** — the finished product. Every page populated: 9 indexed microservice repos shown as separate repositories, Wiki, Intelligence dashboards, 3 canned chat threads, all DocsGen cards Done, 12 Library items.
- **`partial`** — sources + Wiki done, nothing else. Intelligence dashboards, Library items, chat threads, and OmniBoard artifacts are empty. DocsGen cards are all Idle. Demoers click through the "fill in the gaps" journey.
- **`empty`** — zero workspaces. The Workspaces page shows the create-your-first empty state. A one-click "Quick-populate demo sources" shortcut (only visible on this persona) seeds the 9 microservice repos without typing 9 URLs by hand.

Each persona is resettable via a **Reset Workspace** action in the navbar, which rewinds the active workspace to its persona seed. All personas converge on the `full` state if the user completes every generate action.

The `microservices-product-catalog` single-repo project is modeled as 9 separate repositories in the mock. Supporting demo docs (TMForum spec, architecture memos) are added as external file sources.

## Routing Strategy
The application divides into public marketing paths and the authenticated playground:

**Marketing Pages:**
- `/` - Main Ecosystem Overview
- `/product/context-layer` - Base Product
- `/product/code-translation` - Premium Translation
- `/product/code-modernization` - Premium Modernization
- `/login` - Persona selector (full / partial / empty)

**Authenticated Playground (`/play`):**
- `/play/workspaces` - Workspace grid and first-time wizard initiation.
- `/play/[workspaceId]/sources` - Management of connected repositories and files.
- `/play/[workspaceId]/knowledge/wiki` - Living narrative knowledge base with 3-layer sidebar.
- `/play/[workspaceId]/knowledge/intelligence` - Dashboards and code metrics.
- `/play/[workspaceId]/chatbot` - Full-page interactive chatbot with grounding controls.
- `/play/[workspaceId]/generate/docsgen` - Tabbed artifact generation pipelines.
- `/play/[workspaceId]/generate/omniboard` - Multimodal conversational onboarding environment.
- `/play/[workspaceId]/library` - Central artifact repository.

## Visual Design & Aesthetics
The design rigorously follows the "ElevenLabs" aesthetic defined in `docs/DESIGN.md`:
- **Typography:** `Waldenburg` (weight 300) for ethereal display headings; `Inter` for airy body copy (+0.14px-0.18px letter-spacing).
- **Color Palette:** Pure white (`#ffffff`) and Light Gray (`#f5f5f5`) canvases contrasted by Warm Stone (`#f5f2ef`).
- **Shadows:** Ultra-subtle multi-layered shadow stacks (sub-0.1 opacity) defining edge elevation and volume.
- **Buttons:** 9999px pill shapes incorporating warm-tint shadows. `WaldenburgFH` used exclusively for uppercase CTAs.

## Progressive Gating
Playground features progressively unlock, driven by the active workspace's state:
1. Entry requires creating (or selecting) a workspace.
2. The Wiki Configure tab requires at least one source.
3. The Wiki Status / View / Logs tabs, Chatbot, Generate (DocsGen / OmniBoard / MCPGen), Intelligence, and Library all require a `wikiSummary` on the active workspace.
4. Populated Intelligence dashboards require a second-tier gate: explicit first-time Intelligence generation.

Each persona begins at a different point along this chain: `empty` at step 1, `partial` at step 4 (Wiki done, Intelligence and downstream empty), `full` past step 4.

## Test & QA
- **Linting & Formatting:** Biome
- **Testing:** Vitest (unit tests) and Playwright (end-to-end user flows for the first-time wizard and generation pipelines).