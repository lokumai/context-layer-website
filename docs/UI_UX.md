# Context Layer — Playground UI/UX Specification

This is the descriptive UI/UX document for the Context Layer playground. Landing pages are standard marketing pages; this document focuses on the authenticated, workspace-scoped playground experience where the real product is demonstrated.

---

## 1. Guiding Philosophy & Mental Model

Before diving into page-by-page detail, we commit to a single unifying mental model that prevents information architecture overload.

Users of the playground do fundamentally two kinds of things with their codebase knowledge:

1. **They want to understand or consult** — living, always-synced views of the codebase. This is read-oriented, reference-like, and should always reflect the latest state.
2. **They want to produce or export** — one-shot jobs that emit a point-in-time artifact. This is write-oriented, frozen, and shareable.

Everything in the navigation follows this split. "Knowledge" is the destination for the first job. "Generate" is the destination for the second. The Library is the storage for whatever the second produces. Sources is the input layer that both depend on. The Chatbot is the cross-cutting conversational surface that queries all of it.

This model prevents the frequent confusion of "do I go to Wiki or DocsGen to see the architecture?" — Wiki is the living explanation, DocsGen produces a frozen architecture doc you can email to a stakeholder. Different jobs, different pages.

---

## 2. Global Layout & Navigation

### Top Navbar

The navbar is fixed at the top of every page inside the playground. It spans the full horizontal width and is divided into three regions:

**Left region (workspace context)**
- **Context Layer Logo** — clickable, redirects to the Workspaces page (exits the current workspace).
- **Active Workspace Pill** — shows the name of the currently active workspace. Clicking or hovering reveals a dropdown with:
  - A list of the most recently used workspaces (clickable to switch)
  - An "All Workspaces" link that navigates back to the Workspaces home page
  - An "Edit workspace name" action that opens a modal
  - A "Change workspace" action that opens a modal with a search bar and the full list of workspaces
- **Sync Heartbeat Indicator** — a subtle visual indicator (a small pulsing dot or pill) adjacent to the workspace pill, showing the current workspace-wide sync status at a glance: *Live* (green/steady), *Syncing…* (animated), *Queued*, or *Outdated*. This reinforces the "always fresh" promise everywhere in the product without being noisy.

**Center region (the five main destinations)**
- **Sources** — input layer for everything
- **Knowledge** ▼ (dropdown)
  - **Wiki** — living narrative knowledge base
  - **Intelligence** — dashboards and metrics
- **Chatbot** — conversational Q&A over all sources and knowledge
- **Generate** ▼ (dropdown)
  - **DocsGen** — on-demand documentation artifacts
  - **OmniBoard** — multimodal onboarding environment
  - **MCPGen** — MCP server generation (tentative; may be removed in the future)
- **Library** — central storage for all generated artifacts

**Right region (global actions)**
- **Profile circle** — shows the user's avatar. Clicking opens a modal (or dropdown) with account info, settings, and sign-out.

### Why "Generate" instead of "Tools"

"Tools" is semantically vague — it tells the user nothing about what happens when they click. "Generate" tells them the category of action they're about to take: something will be produced. This naming discipline makes the navbar a teaching surface, not just a list of links.

### Left vs. Right Separation Discipline

The left side of the navbar carries **workspace-scoped context** (logo returns to workspaces home, active workspace pill). The right side carries **global user actions** (profile, sign-out). This separation is intentional and should not be mixed. A user glancing at the navbar should instantly know "what am I inside?" (left) and "who am I?" (right).

### Sidebars

Sidebars are used only where a page has a collection of items to navigate between. They are collapsible / expandable, and always show the page name at the top.

| Page | Sidebar? | What it contains |
|---|---|---|
| Sources | No | Main-area grid/list view is the navigation |
| Wiki | Yes | Tabs as sidebar sections: Status, View, Configure, Logs |
| Intelligence | Yes | Dashboard categories (e.g., Health, Security, Tests, Dependencies) |
| Chatbot | Yes | Scrollable list of chat threads (standard chatbot pattern) |
| DocsGen | No | Tabbed bundles + card grid inside each tab |
| OmniBoard | No | Notebook-like environment |
| MCPGen | No | Single configuration view |
| Library | Yes | Filters (type, date, source, status) and folder-like navigation |

The rule: **a sidebar appears when the page has a collection of things to navigate between** (threads, doc types, categories, filters). Single-purpose pages don't need one.

---

## 3. Workspaces Page (Entry Point)

The Workspaces page is the gateway into the playground. Without selecting or creating a workspace, no other pages are accessible — no DocsGen, Chatbot, Wiki, or any other module.

### Layout

A grid of rectangular cards, each representing a workspace. Each workspace resembles a project that may be single-repo or multi-repo. Each card shows the workspace name and a small amount of metadata (created date, source count, last activity).

The first card in the grid is always a dotted-outline, unfilled rectangle with a "+" sign — the "Create Workspace" card.

### Creation

Clicking the "+" card opens a minimal modal: the only required field is the workspace name. No GitHub URLs are required at this stage. Sources are added later, inside the workspace, on the Sources page.

### Selection

Clicking an existing workspace card enters that workspace and lands the user on the Sources page (the default entry point inside a workspace, since without sources nothing else can happen).

### First-Time Workspace Wizard

When a workspace is entered for the very first time (no sources, no Wiki), the user is guided through a prescriptive wizard rather than dropped into an empty product. The wizard walks the user through:

1. **Add a source** — connect an integration (recommended) or upload manually
2. **Choose a sync strategy** — how often the Wiki should refresh (see Wiki Configure below)
3. **Configure the Wiki** — select which sources feed it, and optionally provide custom instructions
4. **Generate the first Wiki** — the only generation action that is inherently manual, because the user is choosing the initial scope

Once the first Wiki generation completes successfully, the workspace "graduates" — subsequent visits skip the wizard and land the user on Wiki Status (or wherever they last were). The wizard never re-appears for a graduated workspace.

### Empty State

If a user has no workspaces at all, the page shows a large welcoming empty state with a prominent "Create your first workspace" call-to-action.

---

## 4. Sources Page

Sources is the **single source of truth** for the workspace. Everything else — Wiki, Intelligence, DocsGen, OmniBoard, Chatbot — derives from what is indexed here.

### Purpose

This is where users add raw material to the workspace:

- **Code** — GitHub, GitLab, Bitbucket, Gitea, and similar (connected via OAuth), or zip-file uploads and URL paste as fallback. Supports single-repo and multi-repo workspaces.
- **Files** — External organizational documents (docx, pdf, markdown, plain text, or any other format) from connected sources like Google Drive, Notion, Confluence, SharePoint, or via manual upload. These are documents that aren't present in the repos themselves — internal standards, specs, meeting notes, RFCs, customer contracts, etc.
- **Discussion & Memory** (optional, feeds the Institutional Memory bundle) — Slack, Discord, Linear, Jira, GitHub Discussions when connected.

All files — regardless of original format — are converted to markdown and indexed. Everything in Sources becomes searchable and reachable by every agent in the system (Chatbot, WikiGen, Intelligence, every Generate tool).

### Layout

A Google-Drive-like interface:

- Toggle between grid view and list view
- Search bar at the top for searching by name or URL
- Filter by type (code, file, all)
- Each source is displayed as a card (grid) or row (list) with:
  - Name
  - Type icon (repo vs. file)
  - Indexing status badge
  - Last-indexed timestamp
- Clicking a source opens a modal showing its content (similar to Google Drive's file preview)

### Indexing Status Badges

Every source carries a status badge that tells the user whether it's usable by agents:

- **Indexed** — ready, green, no friction
- **Indexing…** — spinner, in-progress
- **Error** — red with a small "?" icon; hovering the "?" reveals a tooltip explaining what went wrong and how to fix it

### Adding a Source

When a user clicks "Add Source", they are presented with a chooser showing the available connection options grouped by category (rather than forcing a manual URL/zip path first). The OAuth integrations are the happy path — they're what enables continuous sync on that source. Manual options remain available as a fallback.

Example groupings surfaced in the "Add Source" flow:

| Category | Options |
|---|---|
| **Code** | GitHub, GitLab, Bitbucket, Gitea (OAuth) · Paste URL · Upload zip |
| **Docs & Wikis** | Notion, Confluence, Google Drive, SharePoint (OAuth) · Upload file |
| **Discussion / Memory** | Slack, Discord, Linear, Jira, GitHub Discussions (OAuth) |

Each integration option shows its logo, name, and connection status. Clicking opens the appropriate OAuth flow or upload dialog.

### Continuous Sync on Connected Sources

When a source is added via an OAuth integration, a **per-source auto-sync toggle** is available on the source card. Manual uploads (zip, pasted files) cannot auto-sync — there is nothing to poll against — so the toggle is hidden or disabled for them. The toggle's default is "on" for newly connected integrations, inheriting the workspace's sync strategy (defined in Wiki Configure).

This is the technical prerequisite for the "living Wiki" promise: without an integration, the Wiki can only be refreshed by the user re-uploading material manually.

### Deployment-Aware Hierarchy

For on-premise and air-gapped deployments (where OAuth to external services is not possible), the UI flips the hierarchy: manual upload and local git remotes become the primary options, and external integrations are either disabled or routed through the customer's own infrastructure. This is a deployment-time configuration rather than a user-runtime toggle — the product adapts to the environment it's installed in.

### Actions

Users can:
- Add sources (a prominent button at the top, opening the integration/manual chooser)
- Rename sources
- Delete sources
- Re-index sources (triggers re-conversion and re-indexing)
- Toggle auto-sync on connected sources

### No Sidebar

Sources has no sidebar. The grid/list IS the navigation.

### Empty State

When a workspace has no sources, a large empty-state card appears: "Add your first source." The primary actions mirror the integration-first philosophy: "Connect GitHub" and "Connect Google Drive" (or whichever categories are most common) are prominent, with "Upload files" and "Paste URL" visible as secondary fallbacks.

---

## 5. Knowledge Section

Knowledge is the top-level group containing Wiki and Intelligence. Both are living, always-synced views of the codebase — they update automatically as sources change. The distinction between them:

| Wiki | Intelligence |
|---|---|
| Prose, narrative | Dashboards, metrics, charts |
| Human-oriented reading | Data-oriented scanning |
| "Explain the auth system" | "Show test coverage % per service" |
| Markdown pages | Interactive visualizations |
| Updated by WikiSync | Updated by scheduled analyses |

They answer different kinds of questions and deserve separate real estate.

### 5.1 Wiki Page

The Wiki is the living narrative knowledge base of the codebase. It is what a DeepWiki or CodeWiki would produce, but extended: multi-repo, multi-layer, on-premise, and deeply integrated with the rest of the product suite.

The Wiki has a sidebar with four entries (these replace the earlier "pill tabs" concept): **Status**, **View**, **Configure**, **Logs**. Each is a subpage.

#### 5.1.1 Wiki Status

This is the welcome / overview tab of the Wiki. It should feel engaging and alive — stats, cards, charts, graphs. It is the first thing a user sees when they enter the Wiki.

It surfaces:

1. **Wiki Health & Coverage**
   - Coverage Score: percentage of repository code / files currently indexed in the Wiki
   - Staleness Indicator: time since last sync (e.g., "Last synced 2 hours ago")
   - Sync Status: real-time badge (Ready, Syncing…, Outdated)
   - Missing Context: number of "blind spots" — files or folders not yet documented

2. **Knowledge Stats**
   - Total Tokens: total size of the knowledge base (e.g., "1.2M tokens")
   - Source Breakdown: ratio of code vs. external files

3. **Repository Insights** (expandable list / modal)
   - Active Repos/Files/Folders: those currently contributing to this Wiki
   - Inactive Repos/Files/Folders: those that exist in Sources but are not currently contributing

4. **Recent Activity**
   - Mini-log of the last 3 WikiGen / WikiSync jobs
   - "View all activities" button linking to the Logs tab

5. **Knowledge Graph**
   - A node-edge visualization of the knowledge base
   - Expandable as a modal with a search bar on top, so users can explore nodes/edges in depth without leaving the page

The Status page updates in real-time and reflects the latest state of the Wiki, sources, and codebase. A manual refresh button is provided for users who want to force a refresh.

#### 5.1.2 Wiki View (the Viewer)

The three-layer Wiki structure:

1. **Workspace-level** — a high-level summary of the entire multi-repo workspace, even for single-repo cases. A single markdown file, typically not exceeding ~10K tokens. This describes the whole system.
2. **Repo-level** — a DeepWiki/CodeWiki-style set of nested markdown pages per repository. Headers, sections, diagrams, code snippets.
3. **llms.txt** — the most granular layer, rebranded from "file-level wiki" to match the emerging industry standard (popularized by Mintlify and used by many libraries to feed full project context into AI agents). This is a set of markdown files plus an index page, optimized for LLM consumption rather than human reading. File-level granularity for humans is handled on-demand via the Chatbot with agentic RAG and live code discovery — a persistent file-level wiki isn't necessary.

The viewer itself is modeled on DeepWiki: a scrollable file-system-style tree on the left spanning vertically, collapsible/expandable, with the selected page's rendered markdown content in the main area. Mermaid diagrams, ASCII art, code snippets, and citations all render inline.

Users can **export** the Wiki (or individual pages) as markdown or PDF.

**Chatbot side-panel integration.** A floating chatbot bar sits at the bottom of the Wiki viewer. Clicking it does **not** redirect the user to the full Chatbot page — doing so would yank the user out of the document they're reading. Instead, it opens a right-hand slide-over (~450-550px wide), overlaying the content without replacing it. The underlying Wiki page remains visible and scrollable. When the chatbot cites `[2]`, clicking the citation scrolls the underlying page to the referenced section. Users can always "expand to full page" from the side-panel if they want more room or thread history.

The same side-panel behavior is available on the Intelligence page.

#### 5.1.3 Wiki Configure (Generate / Sync / Delete)

**The living Wiki is the default.** Once the first Wiki is generated, WikiSync maintains it automatically in the background according to the chosen sync strategy. The Configure tab is where the user defines the rules of that automation — not where they have to manually click "Sync" every time a PR merges.

The only moment that is inherently manual is the **first generation**: the user must choose which sources feed the Wiki and provide any initial instructions. After that, sync happens automatically. Manual refreshes remain available as an explicit "Force" action for edge cases.

**What the Configure page does**

- Lets users generate the Wiki from scratch (first time, or after a deletion)
- Defines the **sync strategy** — how often WikiSync refreshes the Wiki automatically
- Lets users trigger a manual "Force Sync Now" or "Force Rebuild" when they want to override the schedule
- Lets users change source selection and instructions at any time (changes apply on the next sync)
- Lets users delete the Wiki and start over

**Sync Strategy options**

The user selects a strategy from a clear set of choices. This can be workspace-wide (one strategy for the entire Wiki) or per-source (mixed strategies for different repos) depending on granularity needs:

| Strategy | Trigger | Best for |
|---|---|---|
| **Per commit** | Every push to any tracked branch | Teams that want maximum freshness, accept noise |
| **Per PR merge to main** | Every merge into the main/trunk branch | **Balanced default** — avoids noise during dev, captures stable state |
| **Scheduled — Hourly** | Fixed hourly cadence | Even cadence, time-based planning |
| **Scheduled — Daily** | Once per day at a chosen time | Low-traffic repos, overnight updates |
| **Scheduled — Weekly** | Once per week at a chosen day/time | Slow-moving documentation or stable repos |
| **Manual only** | Never auto-syncs; user triggers explicitly | Air-gapped, paranoid, or compliance-heavy contexts |

The strategy is editable anytime. Changing it applies to the next sync cycle.

**Source selection at generation time**

When generating or re-generating, the user explicitly picks which sources (code repos, external files) should feed into this Wiki. The selection uses the sources already added on the Sources page — Sources is always the single source of truth.

**Optional custom instructions**

At generation time, the user has an optional text area (up to ~5K tokens) to provide custom instructions to the WikiGen agent — tone, focus areas, exclusions, or any other human-in-the-loop guidance.

**Non-blocking background job**

When a user clicks "Generate," the UI does **not** lock. It's a background job. The user can navigate away and come back. The progress is surfaced as a progress indicator plus a vertical list of steps (e.g., "3 / 5 steps completed").

**Step-level accordion logs**

Each step in the list is an accordion. Expanding it shows agent-level logs — a high-level summary of what the agent is currently doing. Different LLMs and agentic frameworks surface their thinking differently: Claude Code uses randomized "spinner verbs", Gemini emits "thought signatures", and other frameworks expose their own streams. Our UI has to normalize this into a coherent, beautiful representation regardless of the underlying engine. In the MVP / greenfield phase we can show a simple signature or summary; the architecture should allow richer representations later as different frameworks are plugged in.

**Stop, resume, cancel**

The user can stop the generation at any time. They can resume it later (if the underlying framework supports it) or cancel the job completely.

**Dynamic UI states**

The Configure page content changes based on the state of the Wiki:

- **No Wiki yet (first-time)** — A card informing the user that no Wiki has been generated, with a prominent "Generate Wiki" button. Clicking opens the first-time generation modal (source selection + optional instructions + sync strategy). This is typically surfaced through the first-time workspace wizard.
- **Generation in progress** — Progress indicator + step accordions in the main area.
- **Living state (generation complete)** — The default steady-state view. A summary card showing: current sync strategy, last sync time, last-run outcome, sources currently feeding the Wiki, and the active instructions. Prominent actions: **Force Sync Now**, **Force Rebuild**, **Change Sync Strategy**, **Edit Sources**, **Edit Instructions**, **Delete Wiki**.
- **Always present** — A history card showing past generation/sync jobs and which sources contributed to each, so users can re-run a previous configuration or compare outcomes. (The full timeline lives in the Logs tab.)

#### 5.1.4 Wiki Logs

The Wiki Logs tab is the audit trail and version history for the Wiki.

**Timeline of jobs**

A chronological list of all generation and sync jobs. Each entry shows: timestamp, type (generate / sync / regenerate / delete), triggering event (commit, manual, scheduled), duration, status.

**Diff view — a major differentiator**

Since the Wiki is stored as markdown in git, every WikiSync run is a commit. Clicking a job opens a split view:

- **Left panel** — the diff of what changed. Files added, removed, modified; lines added and removed. This is a native git diff.
- **Right panel** — the agent logs for that run. What steps were taken, what decisions the agent made, what sources were consulted.

This is powerful for enterprise customers and a strong selling point: *"An auditor asks what changed in the last quarter's architecture docs? Here's the git log with full agent rationale."* It makes "versioned knowledge base" a tangible, visible property — not just marketing copy.

### 5.2 Intelligence Page

Intelligence is the sibling of Wiki under the Knowledge group. It provides always-on, dashboard-style views of the codebase's health, risks, security posture, and other metric-driven aspects.

**What lives here**

- Health dashboards (tech debt, fragile areas, architecture violations)
- Security posture (vulnerabilities, exposure)
- Test coverage landscape (which critical flows lack coverage)
- Dependency analytics (cross-repo, outdated, risky)
- Other metric-driven views as the product grows

**Why it's separate from Wiki**

Wiki is prose. Intelligence is data. Users scanning a test coverage heatmap are doing a different cognitive task than users reading a narrative about the auth system. They deserve different UIs.

**Why it's separate from DocsGen**

DocsGen's Health & Risk bundle generates a **frozen, exportable PDF/markdown snapshot** of this same data — suitable for audits, stakeholder reports, compliance attachments. Intelligence, by contrast, is the **live, interactive dashboard** version. Same underlying data, two presentations for two jobs:

- "I want to see how we're doing right now" → Intelligence
- "I need a PDF to attach to the Q3 security review" → DocsGen's Health & Risk bundle → Library

**Sidebar**

Intelligence has a sidebar listing the dashboard categories. The main area renders the selected dashboard.

**Chatbot side-panel**

Same behavior as Wiki — the chatbot can be opened as a right-hand slide-over, with the underlying dashboard visible behind it and clickable citations.

---

## 6. Chatbot Page

The Chatbot is the universal conversational surface over everything in the workspace — Sources, Wiki, and codebase. It becomes available only after the first Wiki has been generated; until then, the Chatbot entry in the navbar is locked and points the user back to Wiki Configure. This ensures every answer the Chatbot produces is grounded in a canonical, indexed knowledge base rather than raw un-contextualized sources.

### Full Page vs. Side-Panel

Two surfaces, one backend:

- **Full Chatbot page** (navbar entry) — expanded interface with thread history, source filtering controls, MCP config, and the full chat experience
- **Chatbot side-panel** (from Wiki or Intelligence) — a compact slide-over of the same chatbot, same threads, same backend. Users can expand to the full page from inside the side-panel

Threads are shared between both surfaces. Starting a chat in the Wiki side-panel and then going to the full Chatbot page shows the same thread ready to continue.

### Layout (Full Page)

- **Sidebar** — scrollable list of chat threads, newest at top. Standard chatbot pattern.
- **Main area** — the active thread.
- **Input bar** — at the bottom, with Send and Stop buttons, plus the grounding filter chips described below.

### Grounding Filter (above the input)

Users can scope which sources the chatbot grounds answers in. This is **always visible** as a chip row directly above the input — not hidden in a modal or a dropdown:

A chip row shows: `Grounded in: [All] [✓ Wiki] [✓ Codebase] [✓ Files] [+ Add specific source]`

Chips toggle on/off. Users can also open "Add specific source" to pick individual repos or files for fine-grained grounding. By default, everything is on.

### Agent Visibility

The Chatbot surfaces agent internals:

- Agent actions and tool calls (almost every event published by the underlying agentic framework)
- Thinking tokens when available
- Tool call inputs and outputs (collapsed by default, expandable)

### Citations & Source Drawer

Every chatbot answer is grounded in the selected sources, and the chatbot **must** provide citations. Citations render as beautiful clickable links in the chat message (similar to reference-style links in DeepWiki, `[1]`, `[2]`, or `@file:line-range` syntax rendered as pill-shaped chips).

**Clicking a citation** opens a tab on the right side of the screen (as a slide-over or panel) showing the referenced content — whether it's a PDF file, a code file, or a Wiki page — automatically scrolled to the exact line range the citation refers to. This requires a formatting convention (`@`, `#`, or another convention) that the agent uses consistently, and a formatter on the UI side that renders it as a clickable chip.

### MCP Config Button

Somewhere on the page (but unobtrusive — likely in a header or settings area), there is a button that surfaces the MCP server configuration for the Chatbot. This lets AI agents (Claude Code, Cursor, etc.) connect to this workspace's knowledge as a tool.

### Status Page Data Access

The information shown on the Wiki Status page (coverage, staleness, source breakdown, knowledge graph) is **also accessible to the Chatbot agent as context**, so it can answer meta-questions about the workspace like "how complete is our Wiki?" or "which repos haven't been indexed yet?"

### Empty State

A fresh thread shows suggested starter prompts ("Explain the authentication flow", "Which services depend on the pricing service?", "Summarize the saga orchestration pattern"), tailored to the active workspace if possible.

### Optional: Global Copilot Bubble

As a future nice-to-have, a small bubble in the bottom-right corner of every page can open a compact, UI-focused assistant that helps users understand how to use the playground itself. This is distinct from the main Chatbot — this is a copilot for **navigating the product**, aware of the current page and what the user can do on it. Low priority, not required for the MVP.

---

## 7. Generate Section

Generate is the top-level group for one-shot production jobs. Every tool under Generate produces an artifact, and every artifact is stored in the Library.

### 7.1 DocsGen Page

DocsGen is the artifact publisher. It does **one thing**: produces static, exportable documentation artifacts. It does not compete with the Wiki (which is living reference) or Intelligence (which is a live dashboard).

**Tabbed view**

DocsGen uses a tabbed interface at the top of the page, one tab per bounded-context bundle:

- **Structure & Architecture** — semantic repo-map, cross-repo dependency maps, end-to-end data flow diagrams, DB schema docs. Selling narrative: *"See the bones of your system — how repos, services, and data flows connect."*
- **Specification & Knowledge** — README, SRS (reverse-engineered), API docs, unified API catalog (Swagger/GraphQL). Selling narrative: *"Reverse-engineer the specs nobody ever wrote."*
- **Health & Risk** — tech debt audit (SonarQube equivalent), security vulnerability report (CodeQL equivalent), test coverage landscape, test plans. Selling narrative: *"Know where your codebase is fragile, exposed, or untested."* Note: the live dashboard version of these lives in Intelligence; this bundle produces the exportable frozen-in-time snapshot.
- **Agentify** — agent-specific configuration files that make the codebase agent-ready: AGENTS.md, CLAUDE.md, skill.md, style guides, machine-readable architecture boundaries, guardrails, semantic conventions. The name "Agentify" captures the intent: we have an existing project and want to *make it agent-ready* by giving agents the necessary project context. (Previously named "Agent Infrastructure.")
- **Institutional Memory** — multi-repo release notes, changelogs, analyst/compliance docs, chronological memory snapshots mined from PR discussions, commits, and merges. Integrates with Entire Checkpoints CLI for agent provenance capture. Selling narrative: *"Turn your git history and PR discussions into organizational knowledge."*
- **Research Docs** (optional bundle) — scientific library documentation with arXiv/Semantic Scholar integration. Selling narrative: *"Bridge the gap between papers and production."*

**Card-based generation inside each tab**

Each tab contains a grid of cards. Each card represents a specific artifact the bundle can produce (e.g., inside "Structure & Architecture", the cards might be: Repo-Map, Dependency-Map, Data-Flow-Diagram, DB-Schema).

**Card states**

Each card has three states:

| State | Presentation |
|---|---|
| **Idle** | Card with title, short description, "Generate" button |
| **Running** | Card tinted, spinner, progress bar with steps (same pattern as Wiki Configure) |
| **Done** | Card with completion indicator, "View in Library" link, "Regenerate" option |

**Generation modal**

Clicking "Generate" on a card opens a modal. The modal is structurally the same as the Wiki Configure modal — this consistency reduces cognitive load:

- Source selection (which repos / files from Sources should this artifact be based on)
- Optional custom instructions (5K token text area)
- Bundle-specific options (e.g., output format: markdown or PDF; level of detail; specific subsystems)

On submit, the modal closes. The card transitions to the "Running" state. When complete, the artifact is saved to the Library and the card transitions to "Done."

**No sidebar**

DocsGen doesn't need a sidebar — the tabs are the navigation, and inside each tab the card grid is the navigation.

### 7.2 OmniBoard Page

OmniBoard is the multimodal onboarding environment — designed to reduce time-to-productivity from months to weeks for new developers or users on a legacy codebase.

**Mental model: a specialized chatbot environment**

OmniBoard is not a separate product with its own thread history. It's a **specialized variant of the main Chatbot**, scoped to the onboarding artifact being planned, generated, and explored. The chatbot inside OmniBoard is aware of the onboarding context and can discuss, plan, and iterate on artifacts.

This means: no separate threading system, no new chatbot to maintain. OmniBoard is an *environment* that happens to embed a variant of the main Chatbot, focused on onboarding workflows.

**The flow**

1. User enters OmniBoard. The chatbot greets them with a planning-oriented prompt ("What kind of onboarding artifact do you want? Slides, podcast, video?").
2. User specifies what they want. The chatbot helps them plan and customize — what sections to include, what depth, what style, what audience.
3. When the plan is ready, the chatbot surfaces a human-in-the-loop approval step: a summary of what will be generated. The user approves (or edits and re-approves).
4. On approval, a long-running job starts (generation can take ~30 minutes for rich multimodal outputs). The job runs in the background — the user can leave and come back.
5. When the job completes, the artifact is saved to the Library. The user can also stay in OmniBoard and use it as an **exploration environment** (similar to NotebookLM) — asking questions about the generated content, playing the podcast, viewing slides, requesting revisions.

**Modalities**

- **Text** — markdown, ASCII art, mermaid diagrams
- **Audio** — voice recordings and podcasts, open-source audio models or ElevenLabs
- **Video** — slides with voiceovers (HTML, PPTX, or image generation)

**Slides options**
- Detailed Slides: comprehensive deck with full text and details, suitable for emailing or reading standalone
- Summary Slides: key points and highlights

**Audio options**
- Deep Dive: detailed explanations of the code and architecture
- Summary: key points and highlights
- Podcast: two voices discussing and debating the codebase

**Video options**
- Detailed Presentation: full content, suitable for emailing or reading standalone
- Summary Presentation: key points and highlights

**No sidebar**

OmniBoard is a single environment — the conversation + artifact views are the navigation.

### 7.3 MCPGen Page (Tentative)

MCPGen is currently an idea rather than a committed feature. It may be removed in the future. If kept, its role is: auto-generate Model Context Protocol server descriptors from internal APIs, SDKs, and CLI tools in the workspace, so AI agents can instantly understand how to use the company's internal tooling.

**What it would produce**

- MCP server descriptor JSON (saved to the Library for download/inspection)
- Potentially a live MCP endpoint per workspace (hybrid model: the Library stores the descriptor, MCPGen maintains a "live endpoints" view)

**Note:** Further design is deferred. The navbar slot exists to hold the space; the page itself is minimal until we commit.

---

## 8. Library Page

The Library is the central storage for every artifact produced by the Generate tools. It is the **destination** for any "frozen-in-time" output — DocsGen docs, OmniBoard slides/podcasts/videos, MCPGen descriptors.

### Purpose & Mental Model

If Wiki and Intelligence are "always fresh," the Library is "always saved." Users come here to find, re-download, share, or re-generate any artifact they've produced in this workspace.

### Layout

Modeled loosely on Google Drive:

- **Sidebar** — filter and navigation controls:
  - By type (DocsGen doc, OmniBoard slide deck, OmniBoard podcast, MCP descriptor, etc.)
  - By source tool (DocsGen / OmniBoard / MCPGen)
  - By DocsGen bundle (Structure & Architecture, Agentify, etc.)
  - By date
  - By status (current, superseded, failed)
  - Search bar at the top of the sidebar for filtering by name

- **Main area** — toggle between grid and list views. Each artifact is a card (grid) or row (list) showing: title, type icon, bundle, timestamp, size, status.

### Actions on Each Artifact

- **View** — opens the artifact in a modal (inline rendering for markdown/PDF; audio/video players for OmniBoard outputs)
- **Download / export** — markdown, PDF, or original format
- **Regenerate** — re-runs the original generation job with optional modifications
- **Share** — link or export (future)
- **Delete**

### Empty State

When a workspace has no artifacts yet: a large empty-state card with "Generate your first artifact" and links to DocsGen and OmniBoard.

---

## 9. Cross-Cutting UX Patterns

These patterns apply across the entire playground and should be treated as design rules, not per-page decisions.

### 9.1 Empty States Everywhere

Every page has a meaningful empty state. This is not optional — empty states are an opportunity to teach users the next action.

| Page | Empty state |
|---|---|
| Workspaces | "Create your first workspace" |
| Sources | "Add your first source" — primary CTAs are integration connectors (Connect GitHub / Google Drive / etc.) with manual upload as fallback |
| Wiki (Status) | "No Wiki yet — generate one from Configure" (or prompts the user into the first-time wizard if applicable) |
| Wiki (View) | "No Wiki yet — generate one from Configure" |
| Wiki (Logs) | "No generation jobs yet" |
| Intelligence | "Generate the Wiki to unlock insights" |
| Chatbot (new thread, Wiki present) | Suggested starter prompts tailored to the workspace |
| Chatbot (locked, no Wiki yet) | "Generate the Wiki first to unlock the Chatbot" with a shortcut to Wiki Configure |
| DocsGen (bundle tab) | Cards are always visible; "Done" state is empty until first generation. If no Wiki yet, cards prompt the user to generate one first. |
| OmniBoard | Welcome message from the chatbot + "Plan your first artifact" (requires Wiki) |
| Library | "Generate your first artifact" with links to Generate tools |

### 9.2 Chatbot Side-Panel as a Universal Pattern

The Chatbot side-panel (right-hand slide-over) is available on any page where users consult content and might want to ask questions about it — Wiki, Intelligence, Library (future). It is **not** a page takeover. The underlying content stays visible, scrollable, and interactive. Clicking citations inside the side-panel scrolls the underlying content.

### 9.3 Generation Flow Consistency

Any "generate something" flow in the product — Wiki Configure, DocsGen cards, OmniBoard planning — follows the **same pattern**:

1. Source selection (from Sources)
2. Optional custom instructions (text area)
3. Submit → background job
4. Progress with steps + accordions for agent logs
5. Stop / resume / cancel available
6. On completion: success state + actions (view, export, regenerate, re-sync, delete)

This consistency is a feature. Users learn the pattern once; it applies everywhere.

### 9.4 Workspace-Scoped vs. Global Actions

The navbar enforces the distinction:

- **Left side** = workspace context (logo, active workspace pill, workspace switcher)
- **Center** = workspace-scoped destinations (Sources, Knowledge, Chatbot, Generate, Library)
- **Right side** = global user actions (profile, settings, sign-out)

Never mix. Workspace-scoped settings (e.g., "default generation options for this workspace") belong inside the workspace, not in the global profile modal.

### 9.5 Agent Log Representation

Different LLMs and agentic frameworks surface their thinking differently. Our UI must normalize this. In the MVP phase, we display a simple high-level summary or signature for each step. The architecture should allow this to be upgraded later as richer streams become available from different frameworks (Claude Code spinner verbs, Gemini thought signatures, LangChain / DeepAgents event streams, etc.).

### 9.6 Indexing Status as a First-Class Concept

Anything ingested (sources, Wiki contents, generated artifacts) carries a **status badge**: Indexed, Indexing…, Error. Errors always carry a "?" icon that reveals a tooltip explaining what went wrong and how to fix it. This is the pattern for any ingestion-related failure anywhere in the product.

### 9.7 Citations as a First-Class Primitive

Citations appear in two places: Wiki content (to code / other Wiki pages) and Chatbot answers (to Wiki, code, or files). The rendering and click behavior should be **identical** in both places — a clickable pill chip that opens the referenced content in a right-side panel, scrolled to the exact location. The formatting convention (e.g., `@file.py:42-58`) must be consistent and well-documented so agents and UI both produce/consume the same format.

### 9.8 Real-Time Freshness Signals

Wiki Status, Intelligence, and the Sources page all need to convey "is what I'm looking at current?" This is done via:

- Sync status badges (Ready / Syncing / Outdated)
- Staleness indicators ("Last synced 2 hours ago")
- Manual refresh buttons where appropriate
- The global **sync heartbeat indicator** near the workspace pill in the navbar (see Section 2)

This builds trust in the "always fresh" promise of Knowledge.

### 9.9 Progressive Gating by Dependency Graph

Pages unlock progressively as the user completes the minimum setup each depends on. Until the two foundational prerequisites are in place — **at least one source added** and **the first Wiki generated** — the rest of the product is locked. This enforces that every downstream capability operates on a real knowledge base rather than an empty shell.

Locked pages remain visible in the navbar but are disabled (or grayed out) and surface an explicit "needs X first" message when the user clicks them, pointing back to the missing prerequisite.

| Page | Unlocked when | Reasoning |
|---|---|---|
| Sources | Always | It is the input — there is nothing to unlock before it |
| Wiki — Configure tab | After at least one source is added | The user needs source material to configure a generation |
| Wiki — Status / View / Logs | After the first Wiki generation completes | There is nothing to display before a Wiki exists |
| Chatbot | After the first Wiki generation completes | The Chatbot's value depends on a canonical, indexed knowledge base to ground in; we don't want users getting low-quality answers from raw, un-contextualized sources |
| Intelligence | After the first Wiki generation completes | Dashboards depend on indexed, analyzed knowledge |
| Generate (DocsGen / OmniBoard / MCPGen) | After the first Wiki generation completes | Every Generate tool is built on top of the Wiki |
| Library | After the first Wiki generation completes | Becomes relevant only once artifacts can be produced |

The First-Time Workspace Wizard (Section 3) is the primary UX vehicle for walking the user past these gates on their initial visit — it walks them through adding a source, configuring sync, and generating the first Wiki, at which point the entire product unlocks.

---

## 10. Summary Map

```
Workspaces (entry gateway)
    ↓
Sources (single source of truth — inputs)
    ↓
    ├── Knowledge (living, always fresh)
    │     ├── Wiki      ← prose, narrative, 3 layers (workspace / repo / llms.txt)
    │     └── Intelligence  ← dashboards, metrics (health, security, tests, deps)
    │
    ├── Chatbot (conversational surface; also side-panel over Wiki/Intelligence)
    │
    ├── Generate (one-shot jobs → artifacts)
    │     ├── DocsGen     ← 6 bundles (Structure, Spec, Health, Agentify, Memory, Research)
    │     ├── OmniBoard   ← multimodal onboarding (text / audio / video)
    │     └── MCPGen      ← MCP server descriptors (tentative)
    │
    └── Library (storage for everything Generate produces)
```

This is the canonical information architecture. Every future decision — new pipelines, new artifact types, new dashboards — should slot into this map cleanly. If a new feature doesn't fit, the feature is likely misconceived, or the map needs an explicit, deliberated update.
