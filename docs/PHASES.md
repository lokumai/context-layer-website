# Context Layer — Development Phases

> **CRITICAL INSTRUCTION FOR AI AGENTS (THE "LESSON LEARNED"):**
> You are engaging in **Goal-Driven Development**. These phases are strictly high-level milestones, NOT detailed task lists. Your **absolute sources of truth** for all features, layouts, and logic are:
>
> 1. `docs/SEED.md` (Tech stack & strategy)
> 2. `docs/UI_UX.md` (Information architecture, features, & behavior)
> 3. `docs/DESIGN.md` (Visual identity, typography, shadows)
>
> You MUST read those documents deeply. Decide for yourself *how* to implement the features based on the goals outlined in `UI_UX.md`. Do not wait for explicit micro-instructions. Use `docs/sample_pages` and `docs/screenshots` for inspiration, but do not copy them blindly. But read them and see the images at least.
>
> **Smart Subagent Delegation:** Do not aggressively delegate every task to a subagent. Delegation should be reserved ONLY for tasks whose nature strictly benefits from isolated execution rather than inline execution by the main agent. Specifically, delegate tasks where isolating the subagent's context from the main chat history does not reduce the quality of the output. When you do delegate, you MUST ensure that you provide the subagent with absolutely all necessary information, docs, references, background, and context. Lack of context for a subagent is highly problematic. After the subagent completes its task, the main agent must rigorously review, test, and analyze the output.
>
> **Comprehensive Testing:** At the end of EVERY phase, you must run general tests (both unit/e2e and visual verification) for the *entire* phase. This is separate from subagent verification. Do not mark a phase as complete until the whole system works cohesively.
>
> NOTE: This system has github CLI installed. You can use it.
>
> NOTE: WHENEVER the FULL CONTEXT of SEED and UI/UX or DECISION is lost or compacted in your context, read them again and make sure all of them with all parts are always fresh in your context.

---

## Phase 1: Project Setup & Core Infrastructure

* **Status:** `[x] Complete`
* **Goal:** Establish the production-ready Next.js 15 monorepo foundation.
* **Execution Details:** Implement the technical infrastructure detailed in `SEED.md` (Turborepo, Bun, Next.js 15, `shadcn/ui`, Tailwind v4, Biome, Vitest/Playwright).
* **Definition of Done:** The monorepo compiles successfully without warnings, `shadcn/ui` is functional, the testing suite runs successfully, and the architecture cleanly separates the web app from shared packages.

## [x] Phase 2: Design System & Typography Foundation
**Status:** Complete
**Goal:** Establish the global visual identity and design primitives.

### Deliverables
- [x] **Typography system**: Raleway 300 (display) and Inter (body) wired as CSS variables.
- [x] **Color Palette**: Implementation of warm stone tints and neutral black/whites.
- [x] **Shadow System**: Multi-layered sub-0.1 opacity shadow stacks.
- [x] **Component Primitives**: Global CSS classes for buttons, cards, and text roles.
- [x] **Verification**: Design system showcase page and token unit tests.

## Phase 3: Mock Data Architecture & Generation (DeepWiki Integration)

* **Status:** `[x] Complete`
* **Delivered (2026-04-22):**
  * `packages/mocks/` — typed loader-backed mock package published as `@context-layer/mocks`.
  * 9 source entries (virtual repos over the real monorepo subpaths).
  * Workspace narrative + cross-repo saga-flows doc (mermaid timelines).
  * 9 per-repo wikis (api-gateway multi-page; others consolidated) + per-repo `llms.txt` + master workspace `llms.txt`.
  * Intelligence metrics — health (84), security (19 findings), coverage (81.4 %), dependencies (30+ nodes), knowledge graph (24/46).
  * 21 DocsGen artifacts covering all six bundles.
  * 17 chatbot Q&A pairs with dual wiki + code citations; 10 suggested prompts.
  * 10 WikiGen/sync jobs for the Logs tab.
  * Loader barrel (`getWorkspace`, `listSources`, `getWikiTree`, `listArtifacts`, …) — the stable service abstraction every later phase consumes.
  * 22 Vitest loader/integrity tests + a standalone `verify.ts` script — all green.
* **Goal:** Generate a comprehensive mock dataset from `amirkiarafiei/microservices-product-catalog` using DeepWiki to hydrate the playground.
* **Execution Details:**
  * Utilize DeepWiki MCP tools to analyze the target repository.
  * Treat each microservice as a separate repository added to the sources.
  * Generate the 3-layer knowledge system (repo wikis, workspace narrative, `llms.txt`) and all necessary DocsGen/Intelligence metrics (excluding audio/video/slides).
  * **Architecture Decision:** Decide on the best storage format (e.g., a `packages/mocks` module with `metadata.json` and local markdown files).
* **Definition of Done:** The complete text-based, multi-repo mock dataset is structured, generated, and saved.

## Phase 4: State Management & Secure Hardcoded Auth

* **Status:** `[ ] Pending`
* **Goal:** Implement the client-side state engine and a secure, hardcoded authentication layer suitable for public deployment.
* **Execution Details:**
  * Implement `Zustand` (with persist middleware) and `Auth.js v5`.
  * Create a robust hydration mechanism that populates the Zustand store with Phase 3 mock data based on the logged-in persona (`empty`, `partial`, `full`).
  * **Security Imperative:** You MUST use strict environment variables (e.g., `AUTH_FULL_PASSWORD`) to securely gate the personas. Do not hardcode passwords in the codebase.
* **Definition of Done:** The `/login` page securely authenticates users via `.env` variables, and the application cleanly boots into different structural states based on the logged-in persona.

## Phase 5: The Marketing Entry Page & Navigation

* **Status:** `[ ] Pending`
* **Goal:** Construct the public-facing promotional pages and establish the root route (`/`) as the main entry point.
* **Execution Details:**
  * Ensure the absolute root route (`/`) is the Marketing Overview homepage.
  * The top-right navigation MUST feature a prominent "Playground" button that securely redirects unauthenticated users to `/login`.
  * Build the remaining marketing pages following `UI_UX.md`.
* **Definition of Done:** The `/` route displays the marketing homepage, the "Playground" button securely redirects, and all public paths are visually striking.

## Phase 6: Workspaces & Sources Manager

* **Status:** `[ ] Pending`
* **Goal:** Build the authenticated entry point and the primary source management interface.
* **Execution Details:** Implement the Workspaces and Sources pages strictly according to `UI_UX.md`. Connect them to the Zustand mock store.
* **Definition of Done:** A user can navigate from selecting a workspace down to viewing/managing its connected sources.

## Phase 7: Knowledge UI (The Living Wiki)

* **Status:** `[ ] Pending`
* **Goal:** Construct the 4-tab narrative knowledge base interface.
* **Execution Details:** Implement the Wiki module according to `UI_UX.md`. Ensure it seamlessly renders the mock markdown data generated in Phase 3.
* **Definition of Done:** A fully navigable Wiki supporting deep navigation, inline citations, and historical auditing.

## Phase 8: Knowledge UI (Intelligence Dashboards)

* **Status:** `[ ] Pending`
* **Goal:** Build the data-driven analytics and metrics dashboards.
* **Execution Details:** Implement the Intelligence dashboards according to `UI_UX.md`. Apply the secondary gating logic ensuring the page only populates after an explicit "Intelligence Generation" trigger.
* **Definition of Done:** When hydrated with the `full` persona, the page displays rich, interactive charts.

## Phase 9: The Universal Chatbot

* **Status:** `[ ] Pending`
* **Goal:** Implement the primary conversational surface (full page and contextual side-panel).
* **Execution Details:** Implement the Chatbot interfaces according to `UI_UX.md` and style them according to `DESIGN.md`. Ensure grounding controls and warm-stone citation chips are fully interactive.
* **Definition of Done:** A visually distinct chat interface that handles conversation threads seamlessly.

## Phase 10: Generate Tools (DocsGen & OmniBoard)

* **Status:** `[ ] Pending`
* **Goal:** Build the interfaces for one-shot artifact production.
* **Execution Details:** Implement DocsGen and OmniBoard according to `UI_UX.md`. For generation jobs, mock the progress indicators before transitioning the state.
* **Definition of Done:** Users can seamlessly configure a generation job via modals, watch a progress indicator, and see the job complete.

## Phase 11: The Library (Artifact Storage)

* **Status:** `[ ] Pending`
* **Goal:** Construct the central repository for generated artifacts.
* **Execution Details:** Implement the Library according to `UI_UX.md`. Ensure it accurately filters and displays the mock artifacts generated in Phase 3.
* **Definition of Done:** The Library effectively filters and displays the array of mock artifacts.

## Phase 12: Context Layer MCP Server

* **Status:** `[ ] Pending`
* **Goal:** Build the MCP server integration exposing the playground's mocked knowledge base to external AI clients.
* **Execution Details:** Establish the `@context-layer/mcp` package. Implement the tools (`get_wiki_content`, `get_code_intelligence`, `ask_context_layer`) reading directly from the mock storage architecture.
* **Definition of Done:** An external MCP client can successfully retrieve accurate workspace data and simulated conversational responses.
