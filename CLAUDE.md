# AGENTS.md — Context Layer Website

> **One-line:** Decoupled ecosystem comprising a static marketing site (`apps/marketing`) and an auth-gated mock playground (`apps/web`). Mock-first by design: every "AI output" is pre-generated and served from `packages/mocks` so real agents can be swapped in later behind the same service interface.

This file is the canonical onboarding for AI coding agents (Claude Code, Cursor, Codex, Copilot, etc.) working on this repository. `CLAUDE.md` at the root mirrors this file verbatim.

---

## 1. Sources of Truth (read these before changing anything)

The project follows **Goal-Driven Development** — the docs below describe *what* and *why*; you decide *how*. Read them deeply, do not skim.

| Doc | Purpose |
|---|---|
| [docs/SEED.md](docs/SEED.md) | Tech stack, strategy, demo project, decisions log |
| [docs/UI_UX.md](docs/UI_UX.md) | Information architecture, page-by-page behavior, gating rules |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual identity — typography, color, shadow, motion language |
| [docs/PHASES.md](docs/PHASES.md) | High-level milestones (NOT a micro-task list) — read the lessons-learned block at the top |
| [docs/IMPROVE.md](docs/IMPROVE.md) | Active polish backlog — UX deltas requested by the founder |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker → GHCR → DigitalOcean App Platform pipeline |
| [docs/DEMO_STORIES.md](docs/DEMO_STORIES.md) | Step-by-step "without vs. with" demo scripts for the playground |
| `docs/sample_pages/` and `docs/screenshots/` | Visual references — inspiration, not copy-paste templates |

**If your context has been compacted and you are uncertain about SEED / UI_UX / DESIGN content, re-read those three before continuing.**

---

## 2. Setup Commands

```sh
bun install              # install all workspace deps
bun dev                  # turbo: run all dev servers (web on :3000, marketing on :3001, mcp on :8765)
bun run build            # turbo: production build
bun run lint             # biome lint
bun run format           # biome format --write
bun run test             # turbo: vitest + playwright across packages
```

Requires **Bun ≥ 1.0** and **Node ≥ 20** (for tooling that still expects Node).

---

## 3. Monorepo Structure

```
apps/
  marketing/     Next.js 16 (Static Export) — landing pages on GitHub Pages
  web/           Next.js 16 (Standalone) — auth-gated playground on DigitalOcean
packages/
  ui/            Shared shadcn/ui-based component library
  mocks/         @context-layer/mocks — pre-generated wiki / intelligence / artifacts
  mcp/           Streamable-HTTP MCP server (port 8765)
  config/        Shared tsconfig, biome, eslint stubs
deploy/docker/   Dockerfiles for web + mcp images
.github/workflows/  CI + deploy pipelines (build-push.yaml, deploy-pages.yaml)
```

`packages/mocks` is the **stable service abstraction** every UI surface consumes (`getWorkspace`, `listSources`, `getWikiTree`, `listArtifacts`, …). When real agents arrive later, only the loader implementation changes — UI never moves.

All mock data is generated from [`amirkiarafiei/microservices-product-catalog`](https://github.com/amirkiarafiei/microservices-product-catalog), treated as 9 virtual repos in one workspace.

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Runtime / Package Manager | Bun |
| Monorepo | Turborepo |
| Framework | Next.js 16 (App Router, standalone output) |
| React | React 19 |
| Next.js Features | cacheComponents, reactCompiler |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + custom primitives in `packages/ui` |
| Animation | Motion (formerly Framer Motion) |
| Icons | Lucide |
| Auth | Auth.js v5 (3 demo personas: `empty` / `partial` / `full`) |
| State | Zustand (persona-keyed persist) |
| MCP server | Streamable-HTTP, exposes mock workspace to Claude Desktop / Code |
| Testing | Vitest (unit) + Playwright (e2e) |
| Lint / Format | Biome |
| Deployment | Docker → GHCR → DigitalOcean App Platform |

---

## 5. Code Style & Conventions

- **Biome owns formatting and lint.** Do not introduce ESLint or Prettier configs. Run `bun run format` before committing.
- **Tailwind v4 utility classes** for styling. Avoid CSS modules unless a primitive in `packages/ui` requires it.
- **TypeScript everywhere**, strict mode. Avoid `any`; prefer `unknown` + narrowing.
- **Server Components by default.** Mark client boundaries with `"use client"` only when needed (state, refs, browser APIs, animation).
- **Comments:** default to none. Only write a comment when the *why* is non-obvious. Never write multi-paragraph docstrings or block comments.
- **No emojis in source files** unless explicitly asked.
- **shadcn/ui** primitives live under `packages/ui`. Add new primitives there, not in `apps/web`, when reuse is plausible.

---

## 6. Naming Conventions (CRITICAL — applies to every UI string and marketing page)

The product has **internal module names** (folder names in `context-layer-info`) and **user-facing labels**. They are not the same. Surfacing internal names in the UI is a recurring regression.

| Internal (backend folder) | User-facing label (UI + marketing) |
|---|---|
| WikiGen / WikiSync / Context Wiki | **Wiki** |
| IntelliGen | **Intelligence** (or **Code Intelligence**) |
| QnA Chatbot | **Chatbot** (or **Ask AI**) |
| DocsGen | **DocsGen** ✓ keep |
| OmniBoard | **OmniBoard** ✓ keep |
| MCPGen | **MCPGen** ✓ keep (tentative module) |

**Information architecture** — every navigation, page title, and marketing copy must follow the canonical 4-verb grouping:

```
Sources → Knowledge (Wiki + Intelligence) → Chatbot → Generate (DocsGen + OmniBoard + MCPGen)
                                              ↓
                                          Library  (destination for every Generate output)
```

Do not flatten this into a list of modules. The grouping is the product story.

---

## 7. Progressive Gating (UX rule, not a technical detail)

No downstream capability (Chatbot, Intelligence, Generate, Library) is reachable until **(a)** at least one source is added AND **(b)** the first Wiki has been generated. Intelligence is a secondary gate — separate generation trigger after the Wiki exists. Do not bypass these gates when adding new pages or routes.

The first-time workspace wizard walks users past these gates in 5 steps: Add source → Sync strategy → Configure Wiki → Generate Wiki → (optional) Generate Intelligence.

---

## 8. Demo Personas

The playground is mock-first. Sign in via `/login` with passwords set in `.env.local`:

| Persona | State |
|---|---|
| `empty` | Zero-state — only the "create workspace" wizard is reachable |
| `partial` | Sources added, no Wiki generated yet — partial gating |
| `full` | Complete 9-repo workspace with Wiki, Intelligence, and Chatbot history |

State is persisted per-persona via Zustand. Switching personas should reset the visible state cleanly.

---

## 9. Testing Instructions

- Unit tests: Vitest. Web app tests live in `apps/web/src/__tests__/`. Co-locating `*.test.ts(x)` next to the file under test is also acceptable for new packages.
- E2E: Playwright configs live in both `apps/web/playwright.config.ts` and `apps/marketing/playwright.config.ts`.
- Run `bun run test` from the repo root before opening a PR.
- For UI/UX changes: type-checks pass ≠ feature works. Always start `bun dev` and exercise the actual page in a browser. If you cannot open a browser, say so explicitly — do not claim success.
- At the end of every phase (per [docs/PHASES.md](docs/PHASES.md)), run the full suite (unit + e2e + visual) before marking it complete.

---

## 10. Pull Request Guidelines

- Keep PRs scoped. Bug fixes don't need surrounding cleanup; one-shot operations don't need a helper.
- Conventional-commit-ish prefixes are fine (`feat:`, `fix:`, `chore:`) — match recent history (see `git log`).
- Include screenshots or short clips for any visible UI change.
- Never push directly to `main`. PR + review.
- `git push` to `main` triggers production deploys via GitHub Actions: `deploy-pages.yaml` (marketing → GitHub Pages) and `build-push.yaml` (web + mcp images → GHCR, picked up by DigitalOcean). Only push when you intend to ship.

---

## 11. Things to Never Do

- **Do not surface backend module names** (`WikiGen`, `WikiSync`, `IntelliGen`, `QnA Chatbot`) in any UI string or marketing page. See §6.
- **Do not bypass the IA grouping** (Sources / Knowledge / Chatbot / Generate / Library). See §6.
- **Do not bypass progressive gating.** See §7.
- **Do not add ESLint / Prettier** — Biome only.
- **Do not run destructive git operations** (`reset --hard`, `push --force`, `branch -D`) without explicit user approval.
- **Do not skip pre-commit hooks** with `--no-verify`. If a hook fails, fix the underlying issue.
- **Do not commit secrets.** `.env.local` is the only place auth passwords go locally; production secrets live in DigitalOcean encrypted env vars.
- **Do not aggressively delegate every task to a subagent.** Reserve delegation for tasks whose nature genuinely benefits from isolated execution. When you do delegate, brief the subagent fully — lack of context produces shallow work.

---

## 12. Smart Subagent Delegation

When delegating to a subagent, the subagent has zero context from this conversation. Always provide:

1. The full goal and *why* it matters
2. Pointers to the relevant docs (SEED / UI_UX / DESIGN — see §1)
3. The constraints from §6, §7, §11 of this file
4. A clear scope boundary so the subagent does not over-reach

**Delegation to other providers:** If you need to delegate tasks to subagents from other providers (e.g., `gemini-cli`, `copilot-cli`, etc.), you **MUST** refer to the necessary skill for specific instructions on cross-provider delegation protocol.

After the subagent returns, **review and verify the actual changes**. The summary describes intent, not what was done.

---

## 13. Deployment

- **Marketing**: Push to `main` → `deploy-pages.yaml` builds the static export and publishes to GitHub Pages.
- **Playground + MCP**: Push to `main` → `build-push.yaml` builds Docker images and pushes them to GHCR (`context-layer-web`, `context-layer-mcp`); DigitalOcean App Platform pulls the new tags and rolls out.
- See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full dual-target setup, secrets, the `.do/app.yaml` spec, and local Docker testing.

---

## 14. Quick Links

- Top-level [README.md](README.md)
- Project docs: [docs/](docs/)
- Visual references: [docs/screenshots/](docs/screenshots/), [docs/sample_pages/](docs/sample_pages/)
- Workspace mocks: [packages/mocks/](packages/mocks/)
