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

* **Status:** `[x] Complete`
* **Delivered (2026-04-24):**
  * New workspace package **`@context-layer/mcp`** — stdio-first MCP server built on `@modelcontextprotocol/sdk@1.29`, backed entirely by the existing `@context-layer/mocks` loaders.
  * Three canonical tools promised by the Phase 9 MCP-config modal are now live:
    * **`get_wiki_content`** — `scope: workspace | repo | page | llms` → narrative+saga / wiki tree+llms.txt / single page / llms index.
    * **`get_code_intelligence`** — `topic: overview | health | security | coverage | dependencies | graph`, optionally scoped by `repoId` (per-repo narrowing on every collection).
    * **`ask_context_layer`** — `question: string` → bag-of-words match against the 17 canned Q&A pairs (same algorithm as the Phase 9 chatbot, copy-adapted into `src/match.ts`); on miss returns a "no grounded answer" fallback plus 3 suggested starter prompts.
  * Two entry points: library factory `createMcpServer(config)` for any transport (tests, future HTTP host) + shebanged `src/bin.ts` stdio CLI so `npx -y @context-layer/mcp` from a Claude Desktop / Cursor config "just works". Env: `CONTEXT_LAYER_WORKSPACE` (advisory), `CONTEXT_LAYER_TOKEN` (reserved for production; ignored in mock mode).
  * Tests — Vitest 7/7 using the SDK's `InMemoryTransport.createLinkedPair()` paired-client pattern: tool advertisement, workspace/page wiki fetch, security-scoped intelligence, overview summary shape, Q&A match with citations, Q&A fallback text. Plus `src/scripts/smoke.ts` — an in-process CLI that invokes all six scenarios and exits 0.
  * Package inherits biome + tsconfig from `packages/config`; tsc + biome clean; web-app regression untouched (91 Vitest / 31 Playwright / production build all green).
  * README covers Claude Desktop / Cursor config JSON, programmatic usage, and per-tool reference — the publishable surface of the package.

## Phase 13: Kinetic Minimalism & Component Refinement
* **Status:** `[x] Complete`
* **Delivered (2026-04-24):**
  * **Motion primitives** — new `apps/web/src/lib/motion/spring.ts` exports `CONTEXT_SPRING` (stiffness 300 / damping 30 / mass 1), `MICRO_SPRING`, `LAYOUT_SPRING`, and `staggerDelay()`. Applied across WorkspaceCard + SourceCard ingress (initial + animate + whileHover lift) and to the layoutId Warp Effect.
  * **Warp Effect on the navbar** — `<NavDestinations>` now wraps its items in a `LayoutGroup`. The active background highlight is rendered as a `<motion.span layoutId="nav-active-bg">` so it slides between Sources / Knowledge / Chatbot / Generate / Library as the user navigates. Locked entries + `data-testid`s preserved.
  * **Glassmorphism (Near-White Frost)** — Navbar + Wiki sidebar + Library sidebar + Intelligence sidebar all bumped to `bg-white/80 backdrop-blur-[12px] shadow-[var(--shadow-inset-border)]` per AI Report §4.1.
  * **Workspaces page** — removed the "Gateway" pretitle; added a `workspaces-search-input` (filters by name + description, case-insensitive) above the grid; rebuilt `<WorkspaceCard>` to drop the "WORKSPACE" pretitle and the Wiki Live / source-count badges; new line-clamped `<workspace-card-name>` + `<workspace-card-description>` block; promoted Sources / Last Activity / Created into the footer; staggered Context Spring entrance across cards.
  * **CreateWorkspaceModal** — added an optional 280-char Description textarea; `createWorkspace(name, description?)` extended through the slice + types; defaults to empty string for backwards-compat.
  * **Sources page** — removed the "Workspace · Input Layer" subtitle; bumped pill + view-toggle backgrounds to `bg-white shadow-[var(--shadow-card)]` for proper contrast; SourceCard now `line-clamp-2` on names, status badge sits between the name/url block and the divider, "Last synced" → **"Last Sync with Knowledge"**, card uses Context Spring ingress + hover lift.
  * **Intelligence header rework** — removed the standalone `intelligence-config-header` strip from `page-shell.tsx`; refactored config-header into `<IntelligenceFreshnessControls>` (data-testid `intelligence-freshness-controls`); each of the 5 dashboards (Overview / Health / Security / Coverage / Dependencies) now renders its own heading row with the controls on the right; removed every "INTELLIGENCE · X" pretitle.
  * **Search bars** — Health filters per-repo rows by `repoId` + `fragileAreas[]`; Security filters findings by `title` + `description` + `category` (additive on top of severity / repo filters).
  * **Tests** — Vitest 97/97 (+6 new `workspace-search.test.ts` covering substring + AND combinations + undefined description); Playwright 37/37 (+6 new `phase13.spec.ts`: search filter, no WORKSPACE pretitle, no "Workspace · Input Layer" subtitle, "Last Sync with Knowledge" label, Health search input, no "Gateway" pretitle); existing `intelligence.spec.ts` migrated from `intelligence-config-header` testid to `intelligence-freshness-controls`. Production build clean. Biome clean on every Phase 13 file.

## Phase 14: Sources Manager & Modal Upgrades
* **Status:** `[ ] Pending`
* **Goal:** Bring the input layer to full compliance with the updated UI/UX specifications.
* **Execution Details:**
  * Overhaul the "Add Source" modal to use a vertical list of cards with a "more..." expansion button rather than a horizontal scroller.
  * Implement the strict status badge pipeline on sources: `Processing` → `Indexed` → `Synced` / `Outdated`.
  * Add snappy entrance/exit transitions and drag-to-expand functionality to sidebars.
  * Provide realistic mock previews instead of empty placeholders in the source detail sidebar.

## Phase 15: Content Rendering & The "Illusion of Processing"
* **Status:** `[ ] Pending`
* **Goal:** Ensure the mock data feels real, both during generation and while reading.
* **Execution Details:**
  * Implement the "Triangle Loading State" geometric morph for fake latency.
  * Introduce proper syntax highlighting (dark theme) for `typescript` and other code blocks in the Wiki View.
  * Integrate a Mermaid renderer for architecture diagrams in the Wiki and DocsGen.
  * Ensure "Generating" states across the app show trickling, realistic fake agent logs rather than a simple spinner.

## Phase 16: Wiki Logs Audit & Graph Depth
* **Status:** `[ ] Pending`
* **Goal:** Fix the non-compliant UI elements that promise deep data but currently deliver stubs.
* **Execution Details:**
  * Rebuild the Wiki Logs split view to actually render a "native git diff" of what changed in the mock data, side-by-side with agent logs.
  * Wire up the Knowledge Graph search bar in the modal so it actually filters nodes/edges.
  * Fix the First-Time Workspace Wizard so it properly guides users through steps 3, 4, and 5 (Wiki Configure and Intelligence) instead of acting as a stale placeholder.

## Phase 17: OmniBoard "NotebookLM" Exploration
* **Status:** `[ ] Pending`
* **Goal:** Fulfill the promise of a multimodal exploration environment.
* **Execution Details:**
  * Modify the OmniBoard generation flow so it doesn't dead-end at a "Done" screen.
  * After artifact generation, automatically transition into an exploration session.
  * Allow the user to view the artifact (Slides/Video/Audio placeholder) while chatting with the specialized OmniBoard chatbot to ask questions about it or request revisions.

## Phase 18: MCP Server Web Transport & Polish
* **Status:** `[ ] Pending`
* **Goal:** Prepare the `@context-layer/mcp` package for live, external demo consumption.
* **Execution Details:**
  * Extend the MCP server to support HTTP/SSE transport (in addition to stdio) so it can be exposed securely over the web.
  * Refine the tools (`get_wiki_content`, `get_code_intelligence`) to ensure they handle the multi-repo mock data perfectly and output highly structured, agent-friendly text.

## Phase 19: Client-Centric Demo Scenarios
* **Status:** `[ ] Pending`
* **Goal:** Create bulletproof, repeatable demo scenarios to impress clients.
* **Execution Details:**
  * Define and script exactly how to run 3 "Wow Factor" scenarios using an external tool like Claude Code connected to our MCP.
  * Scenario 1: Multi-repository Knowledge (Claude fixing a cross-repo saga flow).
  * Scenario 2: Multi-repo Code Intelligence (Claude analyzing tech debt across 7 services).
  * Scenario 3: External Library API checks (Claude querying the chatbot for up-to-date specs).

## Phase 20: Monorepo Dockerization & DigitalOcean Deployment
* **Status:** `[ ] Pending`
* **Goal:** Take the entire simulated playground and MCP server live.
* **Execution Details:**
  * Create robust `Dockerfile`s for the Next.js frontend and the MCP server.
  * Set up GitHub Actions to push images to the GitHub Container Registry.
  * Configure for DigitalOcean deployment, ensuring all `.env` gates (Auth personas, MCP tokens) are securely injected.
  * Verify the live URLs work flawlessly for marketing, playground login, and remote MCP connections.
