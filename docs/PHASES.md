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

## Phase 5: The Marketing Entry Page & Navigation* **Delivered (2026-04-22, refined 2026-04-23):**
  * **Design Pivot:** Implemented "ElevenLabs × Engineering Dashboard" aesthetic. Soft-grey canvas (#f9f9f9) with 5-pair semantic accent palette (Success/Info/Warning/Error). Detailed in `DESIGN.md` §12.
  * **Brand Identity:** Established core taglines: "Codebase Knowledge & Intelligence Infrastructure" and "Build the context your codebase never had."
  * **Marketing Route Group:** Built `/`, `/product/*`, and `/design-system` with shared `<Navbar>` and `<Footer>`.
  * **Signature Hero:** `<ContextTriangleHero>` SVG animation telling the AI-SDLC story (Human ↔ Agent ↔ Codebase).
  * **IA Alignment:** Unified marketing and playground navigation around the 4-verb strategy: `01 Sources → 02 Knowledge → 03 Chatbot → 04 Generate`.
  * **Motion System:** Integrated `motion/react` with `<FadeUp>`, `<TerminalType>`, and sticky-scroll primitives; fully respects `prefers-reduced-motion`.
  * **Validation:** 53 Vitest units and 9 Playwright E2E tests covering routing, taglines, and responsive navigation.
Production build: all 4 marketing routes statically prerendered; middleware 92 kB.
* **Goal:** Construct the public-facing promotional pages and establish the root route (`/`) as the main entry point.
* **Execution Details:**
  * Ensure the absolute root route (`/`) is the Marketing Overview homepage.
  * The top-right navigation MUST feature a prominent "Playground" button that securely redirects unauthenticated users to `/login`.
  * Build the remaining marketing pages following `UI_UX.md`.
* **Definition of Done:** The `/` route displays the marketing homepage, the "Playground" button securely redirects, and all public paths are visually striking.

## Phase 6: Workspaces & Sources Manager

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * **Playground Architecture:** Created `(playground)` route group with server-side `auth()` gate. Unified navigation under `<PlaygroundNavbar>` with progressive gating (Knowledge/Chatbot locked until `hasWiki`).
  * **Workspace Management:** Implemented `/workspaces` selection grid and `<CreateWorkspaceModal>` with simulated back-end provisioning latency.
  * **Source Management:** Built `/workspace/[id]/sources` with grid/list views, real-time filtering, and `<SourceActionsMenu>` (Rename/Re-index/Delete).
  * **First-Time Wizard:** Multi-step onboarding pinned to Sources page for non-graduated workspaces.
  * **Intelligent Hydration:** Connected Zustand store to Phase 3 loaders, enabling persona-specific boots (Empty/Partial/Full).
  * **Fixes:** Applied professional "Stretched Link" pattern to SourceCard to resolve nested-button errors while maintaining a11y.
  * **Validation:** 59 Vitest units and 15 Playwright E2E tests covering per-persona landing states, store actions, and wizard graduation flows.
* **Goal:** Build the authenticated entry point and the primary source management interface.
* **Execution Details:** Implement the Workspaces and Sources pages strictly according to `UI_UX.md`. Connect them to the Zustand mock store.
* **Definition of Done:** A user can navigate from selecting a workspace down to viewing/managing its connected sources.

## Phase 7: Knowledge UI (The Living Wiki)

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * Wiki page with sidebar + 4 tab segments under `/workspace/[id]/wiki/{status,view,configure,logs}`; deep-linkable routes `/view/[repoId]/[slug]`.
  * **Configure tab** — 3-state machine (No-Wiki → Generating → Living); 8 s simulated generation with 6 step-accordions; Force Sync / Rebuild / Edit / Delete action row in Living; history card. Flips `hasWiki + graduated` on completion and fetches the full wiki substrate via the new `/api/mocks/wiki-payload` route.
  * **Status tab** (gemini-flash) — 5 sub-sections: Health & Coverage, Knowledge Stats, Repository Insights, Recent Activity, Knowledge Graph SVG with searchable expand modal.
  * **View tab** (gemini-flash) — 3-layer tree (Workspace · Repos · llms.txt) + `<WikiMarkdown>` renderer (react-markdown + remark-gfm, design-token styled, mermaid code-fence stub); export dropdown; chatbot floating bar → Phase-9-stub slide-over.
  * **Logs tab** (gemini-flash) — timeline table + split Diff / Agent-logs detail view.
  * **Wiki slice** — new `setWikiData` action + `WikiPayload` type; bootstrap unchanged (still persona-filtered); Configure "earns" the wiki slice via the new narrow route.
  * **Navbar gating update (UI_UX §9.9)** — Knowledge dropdown unlocks at `sources.length > 0` (so `partial` can reach Configure); Chatbot/Generate/Library still gated on `hasWiki`.
  * **Three carry-over fixes bundled** — Playground is now full-width (no inner `max-w`); navbar center destinations + workspace pill hide on `/workspaces`; `<SyncHeartbeat>` "Live" badge removed; logo stretches to full 64 px navbar height.
  * Tests — Vitest 63/63 (+4 new wiki-gating tests); Playwright 18/18 (+3 new `wiki.spec.ts` scenarios: partial Configure landing, full sidebar tabs unlocked, `/workspaces` hides center destinations). Build clean; lint clean on all Phase 7 files.
* **Goal:** Construct the 4-tab narrative knowledge base interface.
* **Execution Details:** Implement the Wiki module according to `UI_UX.md`. Ensure it seamlessly renders the mock markdown data generated in Phase 3.
* **Definition of Done:** A fully navigable Wiki supporting deep navigation, inline citations, and historical auditing.

## Phase 8: Knowledge UI (Intelligence Dashboards)

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * Intelligence page at `/workspace/[id]/intelligence/{overview,health,security,coverage,dependencies}` with a sidebar + two-tier gating (`hasWiki` → reachable; `hasIntelligence` → populated).
  * Runtime `hasIntelligence` + `intelligenceRefreshedAt` added to `RuntimeWorkspace`; bootstrap sets them only for the `full` persona; new store actions `setHasIntelligence` + `setIntelligenceData`.
  * New `/api/mocks/intelligence-payload` route + 10 s first-gen flow (6 accordion steps) that the `partial` persona can trigger from any dashboard page.
  * "Refresh Now" config header strip on every dashboard with a Fresh / Recent / Stale / Refreshing StatusPill.
  * 5 dashboards delegated to **gemini-cli Flash**: Overview (metric tiles + severity split + per-repo coverage + knowledge-graph snapshot), Health (filter pills + expandable fragile-area rows), Security (severity legend + findings table + per-row expand), Coverage (overall + per-repo cards), Dependencies (filters + table).
  * 67 / 67 Vitest (+4 new intelligence-store tests) · 20 / 20 Playwright (+2 `intelligence.spec.ts`: full populated, partial Wiki-first empty state) · build clean · lint clean on all Phase 8 files.

## Phase 9: The Universal Chatbot

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * Full chatbot page at `/workspace/[id]/chatbot`: three-pane layout (thread sidebar · messages · input with always-visible grounding chips), MCP-config button, suggested-prompt empty state, "Generate the Wiki first" fallback.
  * Shared **`<ChatbotSideDock>`** floating bar + slide-over mounted on every Wiki View page and every Intelligence dashboard; threads are stored in the single Zustand slice so a conversation started in the side-panel keeps going on the full page.
  * Streaming simulation (`lib/chatbot/stream.ts` + `lib/chatbot/match.ts`) — 1.2 s "thinking" phase then chunked deltas, abort-signal aware; answers are bag-of-words-matched against the 17 canned Q&A pairs and fall through to an "I don't have a grounded answer" stub.
  * **Citation primitive** (UI_UX §9.7) — one `<CitationChip>` + `<CitationDrawer>` pair rendered via a React context. Chips inside chat bubbles (`[1]`, `[2]`, warm-stone / blue / green tints by kind) open a 520 px right-hand drawer with an "Open in Wiki" deep-link + a code-preview stub for `@repoId/path:start-end` anchors.
  * Chatbot slice gained thread-CRUD actions — `createThread`, `appendMessage`, `patchLastMessage`, `renameThread`, `deleteThread`, `setActiveThread` — plus `activeThreadId` persisted across reloads.
  * Wiki View's Phase-9 stub slide-over retired; the old "Chatbot arrives in Phase 9" placeholder is gone.
  * Tests — Vitest 76/76 (+9 new: `chatbot-store` thread CRUD + `matchAnswer` + `chatbot-stream`); Playwright 23/23 (+3 new `chatbot.spec.ts`: partial chatbot nav locked, full page streams answer + opens citation drawer, Wiki View mounts the side dock). Build clean; lint clean on all Phase 9 files.

## Phase 10: Generate Tools (DocsGen & OmniBoard)

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * `/workspace/[id]/generate/{docsgen/[bundle], omniboard, mcpgen}` routes; `/generate` redirects into `/generate/docsgen/structure-architecture`. Generate dropdown in the navbar now points each entry at its own sub-route.
  * **DocsGen** — 6-bundle tabbed view (Structure & Architecture, Specification & Knowledge, Health & Risk, Agentify, Institutional Memory, Research Docs). Per-bundle card grid with a 3-state `<ArtifactCard>`: Idle (Generate CTA) → Running (6-step ~8 s `simulateJob` + progress bar) → Done (StatusPill + View + Regenerate). View opens a `<PreviewModal>` rendering the artifact's markdown via `WikiMarkdown`. Regenerate reopens the modal with defaults pre-filled.
  * **`DOCSGEN_CATALOG`** — single source of truth keyed off `cardSlug`, exactly matching the 21 Phase 3 mock artifacts, so the `full` persona lands on every tab with cards already in "Done" state. A Vitest integrity test asserts the match.
  * **OmniBoard** — specialized chatbot environment per UI_UX §7.2: landing with modality picker (Slides / Audio / Video × option chips) → split session (Phase 9 chat reused verbatim on the left + plan panel on the right that unlocks "Generate" once the user types a goal) → 15 s 5-step generation progress → success card with Library link. OmniBoard artifacts get `tool: "omniboard"` + the new `slides / audio / video` formats.
  * **Artifact type** — `format` union extended to 6 values, optional `tool: "docsgen" | "omniboard" | "mcpgen"` (existing mocks stamped with `"docsgen"` in the loader — no data file changes). Artifacts slice gained `addArtifact` (upsert by id), `replaceArtifact`, `removeArtifact`. `PersistedState` Omit list updated.
  * **MCPGen** placeholder: minimal "Tentative · UI_UX §7.3" card with disabled button — keeps the nav slot honest without committing design.
  * Delegated the 5 DocsGen UI leaves (`bundle-view`, `tabs-header`, `artifact-card`, `generate-modal`, `preview-modal`) to **gemini-cli Flash**; main agent built types, slice, routes, catalog, OmniBoard, tests.
  * 82 / 82 Vitest (+6 new: `artifacts-store` 3, `docsgen-catalog` 3) · 27 / 27 Playwright (+4 new across `docsgen.spec.ts` + `omniboard.spec.ts`: full persona Done grid, Regenerate running→done, partial Generate locked, OmniBoard end-to-end with artifact-count assertion) · build clean (5 new dynamic routes) · lint clean on every Phase 10 file.

## Phase 11: The Library (Artifact Storage)

* **Status:** `[x] Complete`
* **Delivered (2026-04-23):**
  * `/workspace/[id]/library` replaces the Phase-7 "Coming Soon" stub with the real Library — 2-column layout (filter sidebar + main grid/list area), per UI_UX §8.
  * **Filter sidebar**: search (title + description, case-insensitive), Source Tool pills (DocsGen / OmniBoard / MCPGen), DocsGen Bundle pills (6 from `DOCSGEN_CATALOG`, hidden when tool filter excludes DocsGen), Format pills (Markdown / PDF / JSON / Slides / Audio / Video), Status pills (Current / Superseded / Failed), Created-Within select (Any / 7d / 30d / 90d). Pure filter logic in `filter-hook.ts` — 9 new Vitest tests pin AND-combination, substring search, undefined-tool → docsgen default, and the 7-day cutoff.
  * **Grid/list toggle**: `<ArtifactTile>` for cards, `<ArtifactRow>` for rows; bundle-icon map (GitBranch / FileText / Shield / Bot / BookMarked / FlaskConical) overridden by format for OmniBoard outputs (FileImage / Headphones / Video).
  * **Actions menu** (kebab on every artifact): View → `<ArtifactPreview>` (delegates to Phase-10 `PreviewModal` for markdown/pdf/json; renders Slides / Audio / Video stubs for OmniBoard outputs — deck preview with page indicators, waveform + disabled play, poster-framed video); Download → alert stub; Regenerate → deep-links back to the originating Generate surface (no generation duplication); Delete → `<DeleteConfirmModal>` → `removeArtifact`.
  * **Empty states**: no Wiki → `NeedsWikiLibraryState`; Wiki but zero artifacts → `LibraryEmptyState` with DocsGen / OmniBoard CTAs; filtered-but-empty → "No artifacts match your filters." card.
  * Delegated all 8 leaf UI components (`sidebar`, `grid-view`, `list-view`, `artifact-tile`, `artifact-row`, `actions-menu`, `delete-confirm`, `empty-state`) to **gemini-cli Flash**; main agent built `filter-hook`, `library-surface`, `artifact-preview`, `needs-wiki-state`, tests, and PHASES.md.
  * 91 / 91 Vitest (+9 new `library-filters` tests) · 31 / 31 Playwright (+4 new `library.spec.ts`: partial locked, 21-tile full-persona landing + `agentify` filter→5, delete-flow count drop, grid↔list toggle + preview open) · build clean (Library route size 14 kB) · lint clean on every Phase 11 file.

## Phase 12: Context Layer MCP Server

* **Status:** `[ ] Pending`
* **Goal:** Build the MCP server integration exposing the playground's mocked knowledge base to external AI clients.
* **Execution Details:** Establish the `@context-layer/mcp` package. Implement the tools (`get_wiki_content`, `get_code_intelligence`, `ask_context_layer`) reading directly from the mock storage architecture.
* **Definition of Done:** An external MCP client can successfully retrieve accurate workspace data and simulated conversational responses.
