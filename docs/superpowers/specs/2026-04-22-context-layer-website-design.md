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
  - `packages/mocks`: A data package containing the static outputs representing the context-layer generation processes.

## State Management & Auth
- **Global Playground State:** Managed via `Zustand` to handle the active workspace, synchronization heartbeat indicator, and progressive unlocking (e.g., locking chatbot until the first Wiki is generated).
- **Authentication:** `Auth.js v5` provides a mock authentication layer (using a hardcoded dummy user) to simulate secure gates.

## Routing Strategy
The application divides into public marketing paths and the authenticated playground:

**Marketing Pages:**
- `/` - Main Ecosystem Overview
- `/product/context-layer` - Base Product
- `/product/code-translation` - Premium Translation
- `/product/code-modernization` - Premium Modernization

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
Playground features progressively unlock:
1. Entry requires creating a workspace.
2. Generating a Wiki requires at least one source.
3. Access to Knowledge, Chatbot, Generate, and Library requires the completion of the first Wiki generation.

## Test & QA
- **Linting & Formatting:** Biome
- **Testing:** Vitest (unit tests) and Playwright (end-to-end user flows for the first-time wizard and generation pipelines).