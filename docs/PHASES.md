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

* **Status:** `[x] Complete`
* **Delivered (2026-04-22):**
  * **Auth.js v5 (beta.31)** with Credentials provider. Three demo personas (`empty` / `partial` / `full`) gated by env vars `AUTH_EMPTY_PASSWORD` / `AUTH_PARTIAL_PASSWORD` / `AUTH_FULL_PASSWORD`. Production refuses missing vars; dev warns and falls back to `changeme-<persona>`. Env-var names are dynamically constructed in `apps/web/src/lib/personas.ts` — zero plaintext passwords in source.
  * **Session shape** — JWT strategy, `personaId` embedded via `jwt` + `session` callbacks; typed through TypeScript module augmentation on `next-auth`.
  * **Zustand store** (v5.0.12) split into 9 domain slices: `workspaces`, `sources`, `wiki`, `intelligence`, `artifacts`, `chatbot`, `activity`, `ui` (transient, excluded from persist), `session` (meta).
  * **Persona-keyed `persist` middleware** — `context-layer:empty|partial|full` localStorage buckets; `partialize` excludes the UI slice + action functions.
  * **`/api/mocks/bootstrap`** — single branch-point route handler that reads the session's `personaId`, applies the persona filter, and returns a typed hydration payload from the Phase 3 loaders. Future phases swap this for a real backend without touching the store or UI.
  * **`HydrationProvider`** — fetches bootstrap once per persona on sign-in, writes into the store, flips `isHydrated`; resets on logout.
  * **Next.js middleware** — protects every path except the marketing roots (`/`, `/login`, `/product/**`) and Auth.js endpoints; unauthenticated hits to playground URLs redirect to `/login?callbackUrl=...`.
  * **`/login` page** — DESIGN.md-aligned form (Raleway 300 heading, inset-border inputs, black-pill submit), generic error messaging (no username-vs-password leak), wrapped in `Suspense` for static prerender.
  * **`simulate-latency.ts`** — async generator primitive for the fake-job progress UI_UX §9.10 requires; plumbing for Phase 6+ generation flows.
  * **Tests** — 38 Vitest (personas env-var gate + fallback + hard-fail, store hydration + persist key scoping, bootstrap filters per persona, credential authorize, middleware path classification, login page RTL); 4 Playwright e2e (unauthenticated redirect + sign-in as each persona with localStorage + bootstrap-response assertions).
* **Goal:** Implement the client-side state engine and a secure, hardcoded authentication layer suitable for public deployment.
* **Execution Details:**
  * Implement `Zustand` (with persist middleware) and `Auth.js v5`.
  * Create a robust hydration mechanism that populates the Zustand store with Phase 3 mock data based on the logged-in persona (`empty`, `partial`, `full`).
  * **Security Imperative:** You MUST use strict environment variables (e.g., `AUTH_FULL_PASSWORD`) to securely gate the personas. Do not hardcode passwords in the codebase.
* **Definition of Done:** The `/login` page securely authenticates users via `.env` variables, and the application cleanly boots into different structural states based on the logged-in persona.

## Phase 5: The Marketing Entry Page & Navigation

* **Status:** `[x] Complete`
* **Delivered (2026-04-22, refined 2026-04-23):**

  **Route structure**
  * Public `(marketing)` route group wrapping `/`, `/product/context-layer`, `/product/code-translation`, `/product/code-modernization`, and an internal `/design-system` (the Phase 2 showcase moved here).
  * Shared fixed `<Navbar>` with pulsing `<PlaygroundButton>` (top-right) that routes unauthenticated users to `/login` — Phase 4 middleware handles the rest.
  * `<Footer>` with 3-column link grid + copyright.
  * Mobile: hamburger collapse at `<1024px`; Playground button stays visible as a compact pill.

  **Motion primitives** (`apps/web/src/components/motion/`)
  * `<FadeUp>`, `<ScrollSection>` + `<StickyScrollGroup>` (sticky-scroll context), `<MagneticButton>`, `<GlowPulse>`, `<TerminalType>`. All respect `prefers-reduced-motion`.
  * `motion@12.38.0` added as a dependency; consumed via `motion/react`.

  **Signature hero animation — `<ContextTriangleHero>`**
  * Tells the full AI-SDLC story in one SVG: 5 source cards at the bottom (`offering-service/src/main.py`, `RFCs/architecture.pdf`, …) → amber scan-line travels upward → central green "Context" node fills progressively with Workspace / Repo / llms.txt check-rows → pulsing halo → tendrils drawn to **Human Dev** (top-left, blue) and **AI Agent** (top-right, green) → triangle edges (blue / green / amber) with traveling dots showing bidirectional context flow.
  * Reduced-motion fallback keeps every element visible, all animations off.

  **Design pivot (Phase 5.1) — "ElevenLabs × Engineering Dashboard"**
  * Appended **§12 "Dev-Friendly Mode"** to `docs/DESIGN.md`: grey canvas `#f9f9f9` replaces pure white; 5-pair semantic accent palette (indexed-green / info-blue / warn-amber / error-red / neutral) with strict rules (status pills + small icon accents only, never large surfaces); `lucide-react` iconography at 14 / 18 / 28 px, stroke 1.5; denser bento-grid conventions; `bg-blueprint` utility for tech panels. Premium foundation §1–§11 fully preserved — hero blocks still ethereal, density wins below the fold.
  * `globals.css` — canvas + accent tokens + body bg shift.

  **Marketing content grounded in the real product philosophy**
  * **H1** (verbatim): "Codebase Knowledge & Intelligence Infrastructure."
  * **Signature tagline** (verbatim): "Build the context your codebase never had."
  * **Closing tagline** (verbatim): "Knowledge is better when it's contextual."
  * **Narrative sections**: Backward-Engineering wedge (vs Cursor / Claude Code / Copilot), AI-SDLC Triangle explainer, market positioning (Forward↔Backward + Horizontal↔Vertical 2×2 quadrants), Land-and-Expand sales strategy.

  **Product map uses the 4-verb user-facing IA** (UI_UX §2 made primary)
  * `01 Sources → 02 Knowledge (Wiki + Intelligence) → 03 Chatbot → 04 Generate (DocsGen + OmniBoard + MCPGen)` — same grouping as the playground navbar, so users learn the mental model before they enter.
  * Dark-accent "Foundation" strip reinforces the moat ("Persistent · Versioned · Always-Synced Wiki") without exposing backend module names.

  **Context Layer product page restructured around the same 4 verbs**
  * "Built on the Wiki" prelude with 3 promise cards (Persistent / Multi-Layer / Always-Synced).
  * Capability scroller has 4 sections (Sources, Knowledge, Chatbot, Generate). Each group names its user-facing modules correctly: Wiki, Intelligence, Chatbot, DocsGen, OmniBoard, MCPGen (tentative).

  **Code Translation + Code Modernization pages**
  * Refinement delegated to **gemini-cli Flash** (`gemini-3-flash-preview`) using the refined CL page as strict template. Pro not used — per user's quota note.
  * Claude reviewed + integrated + fixed 3 post-delegation lint items (`any` cast, unused imports, array-index keys).

  **Naming hygiene** — zero backend module names (`WikiGen` / `WikiSync` / `IntelliGen` / `QnA Chatbot`) anywhere in visible marketing copy. Grep confirms clean across `apps/web/src/app/(marketing)/`. Only user-facing names appear: Wiki, Intelligence, Chatbot, DocsGen, OmniBoard, MCPGen.

  **Tests**
  * Vitest 53/53 — marketing routing smoke, navbar Playground-button routing, motion primitive rendering, `home-hero.test.tsx` locking the three core taglines + the 4-verb IA presence.
  * Playwright 9/9 — 4 auth + 5 marketing; each route verified for H1 + Playground button visibility; navbar Playground button routes to `/login`.
  * Production build: all 4 marketing routes statically prerendered; middleware 92 kB.
* **Goal:** Construct the public-facing promotional pages and establish the root route (`/`) as the main entry point.
* **Execution Details:**
  * Ensure the absolute root route (`/`) is the Marketing Overview homepage.
  * The top-right navigation MUST feature a prominent "Playground" button that securely redirects unauthenticated users to `/login`.
  * Build the remaining marketing pages following `UI_UX.md`.
* **Definition of Done:** The `/` route displays the marketing homepage, the "Playground" button securely redirects, and all public paths are visually striking.

## Phase 6: Workspaces & Sources Manager

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**

  **Route structure**
  * New `(playground)` route group with server-side `auth()` gate + `<PlaygroundNavbar>`.
  * `/workspaces` — gateway grid (UI_UX §3).
  * `/workspace/[id]/sources` — primary source management (UI_UX §4).
  * `/workspace/[id]/{knowledge,chatbot,generate,library}` — polite "Coming soon / Phase 7+" placeholder pages (gemini-flash delegated).
  * Middleware tweaked: authenticated `/login` → `/workspaces` (honors `callbackUrl` if set).
  * Login page default + marketing `<PlaygroundButton>` default `href` → `/workspaces`.

  **Playground chrome (UI_UX §2)**
  * `<PlaygroundNavbar>` fixed-top 64 px, three regions: left (logo + `<WorkspacePill>` + `<SyncHeartbeat>`), center (5 destinations with progressive gating), right (`<ProfileMenu>`).
  * `<WorkspacePill>` dropdown — recent workspaces + "All workspaces".
  * `<SyncHeartbeat>` — 4 states (live / syncing / queued / outdated) mapped to §12 accent palette.
  * `<ProfileMenu>` — persona initial avatar, sign-out that also resets store + persist key.
  * `<NavDestinations>` — progressive gating per UI_UX §9.9: Knowledge / Chatbot / Generate / Library render locked (`data-locked="true"` + Lock icon + tooltip "Generate the first Wiki to unlock") when `!hasWiki`. Full persona unlocks all; partial only has Sources unlocked.

  **Workspaces page**
  * Responsive grid (1/2/3/4 cols) — dotted-outline "+" Create card first, then one `<WorkspaceCard>` per workspace.
  * `<WorkspaceCard>` — Raleway 300 title, 3-fact metadata row, StatusPill row ("Wiki Live" vs "Wiki Pending" + source count), cursor-follow warm-stone gradient on hover.
  * `<CreateWorkspaceModal>` — single-input form; simulated latency (1.2 s) streams "Allocating workspace… → Wiring providers… → Ready"; routes to `/workspace/{newId}/sources`.
  * `<WorkspacesEmptyState>` — Warm Stone "Create Workspace" CTA for the `empty` persona.

  **Sources page** (modeled on `docs/sample_pages/sources.html`)
  * Sticky toolbar: inset-shadow search (name / URL / path, debounced), 4 filter pills (All · Code · Files · Discussion), Grid/List view toggle, Warm Stone "Add Source" signature CTA.
  * `<SourceCard>` (grid) — icon well per kind (blue GitBranch for code, green FileText for file, amber MessageSquare for discussion), colored `<SourceStatusBadge>` (Indexed / Indexing… / Error), hover elevation from `--shadow-inset-border` → `--shadow-card`.
  * `<SourceRow>` (list view) — compact row with the same metadata.
  * `<SourceActionsMenu>` `⋯` — Rename / Re-index (simulated 3.5 s latency with log stream; card badge cycles Indexed → Indexing… → Indexed) / Toggle auto-sync (disabled for `upload` + `url` categories) / Delete (with confirm).
  * `<AddSourceChooser>` (gemini-flash delegated) — 3 category rows × 5–6 integrations each; clicking runs a 4.5 s simulated job with log stream ("Contacting provider → Authorizing → Cloning repository → Analyzing AST → Building index → Committing to wiki"); synthesizes a `Source` record and dispatches `addSource`.
  * `<SourcePreviewModal>` (gemini-flash delegated) — right-side slide-over with status header + 2×2 fact grid for code sources; stub for files/discussion.
  * `<SourcesEmptyState>` — integration-first CTAs (Connect GitHub, Connect Google Drive, Upload files, Paste URL).

  **First-Time Workspace Wizard (UI_UX §3)**
  * Pinned at top of Sources page when `activeWorkspace.graduated === false` and the user hasn't dismissed it this session.
  * Step 1 (Add a source) — fully functional; auto-marks done when `sources.length > 0`.
  * Step 2 (Choose a sync strategy) — functional `<select>` with 6 UI_UX-approved options; auto-marks done on select.
  * Steps 3–5 (Configure Wiki / Generate Wiki / Generate Intelligence) — placeholder rows with `Phase 7+` neutral pills.
  * Session-scoped "Continue exploring Sources" dismiss link.

  **Store actions** (Phase 4 slices gained mutation surface)
  * Workspaces: `createWorkspace` (returns id), `renameWorkspace`, `setGraduated`. New runtime fields on `RuntimeWorkspace`: `hasWiki`, `graduated`.
  * Sources: `addSource`, `removeSource`, `renameSource`, `markIndexing`, `markIndexed`, `markError`, `toggleAutoSync`.
  * UI: `createWorkspaceModalOpen`, `addSourceChooserOpen`, `activeSourcePreviewId`, `firstTimeWizardDismissedFor`.
  * Bootstrap sets `hasWiki: true + graduated: true` only for the `full` persona; `partial` has both false (so gating locks Knowledge and siblings; wizard visible at step 2).
  * `persist` middleware's partialize expanded to exclude all new action functions; UI slice still fully excluded from persistence.

  **Tests**
  * Vitest 59/59 — new `workspace-store-actions.test.ts` covers create/rename/graduate + source add/remove/rename/index/autoSync + UI slice toggles + wizard dismissal idempotency.
  * Playwright 15/15 — new `playground.spec.ts` covers per-persona landing state (empty → empty-state, partial/full → workspace card), workspace entry → Sources page with 9 source cards, wizard visibility, and progressive-gating assertion on `nav-knowledge` via `data-locked`.
  * Production build clean; 4 new `/workspace/[id]/*` routes registered as dynamic (session-dependent), 1 `/workspaces` route dynamic.

  **Notes**
  * Marketing `<PlaygroundButton>` href change also means unauthenticated marketing clicks now route to `/login?callbackUrl=%2Fworkspaces` via middleware — and post-auth lands users correctly inside the playground.
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
