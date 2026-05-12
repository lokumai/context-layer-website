# Context Layer

**AI-native Codebase Knowledge & Intelligence Infrastructure.**

"Build the context your codebase never had."

---

## 🏗️ The Infrastructure
Context Layer is an **AI-native infrastructure** that automatically builds, syncs, and evolves the context your projects have been missing — making codebases both **Agent-ready** and **Human-ready**.

### 🛠️ Capabilities
- **01 Sources**: Connect GitHub, local files, or discussion threads as raw context streams.
- **02 Knowledge**: Multi-layer Narrative Wiki + Intelligence Dashboards (Security, Health, Coverage).
- **03 Chatbot**: Grounding-first agent with citation-backed responses and code-anchor deep-linking.
- **04 Generate**: DocsGen (Institutional Memory bundles), OmniBoard (Slides/Audio/Video), and MCPGen.
- **05 Library**: Central versioned repository for all generated artifacts.

---

## 🛠️ Technical Stack
Built on the "Vercel Meta" 2026 stack:
- **Core**: Next.js 16 (App Router), Turborepo, Bun
- **UI**: Tailwind CSS v4, Motion, Lucide, shadcn/ui
- **State/Auth**: Zustand (Persona-keyed Persist), Auth.js v5
- **Quality**: Vitest, Playwright, Biome

---

## 🚀 Getting Started

### 1. Installation
```sh
bun install
```

### 2. Development (Run All)
```sh
bun dev
```
*   **Playground**: [localhost:3000](http://localhost:3000)
*   **Marketing**: [localhost:3001](http://localhost:3001)
*   **MCP Server**: [localhost:8765](http://localhost:8765)

### 3. Build (Production)
```sh
bun run build
```

---

## 🛠️ Workspace Management

Use these commands to work on specific parts of the ecosystem without starting everything.

| Command | Action |
|---|---|
| `bun run dev --filter=marketing` | Run only the Marketing site (:3001) |
| `bun run dev --filter=web` | Run only the Playground (:3000) |
| `bun run build --filter=marketing` | Build static export for Marketing |
| `bun run build --filter=web` | Build standalone bundle for Playground |
| `bun run lint` | Lint everything with Biome |
| `bun run test` | Run all Vitest + Playwright tests |

---

## 👤 Demo Personas
Sign in via `/login` using the following passwords (set in `.env.local`):
- `empty`: Zero-state onboarding
- `partial`: Active sources, no Wiki generated
- `full`: Complete workspace (9 code repos + 5 supplementary sources) with Wiki, Intelligence, and Chatbot history

---

## 🚢 Deployment
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Dual-pipeline (GitHub Pages + DigitalOcean) and remote MCP setup.

## 🎬 Client demos
- [AGENTS.md](AGENTS.md) — Briefing for AI agents + the portable Siloed Agent Persona.

## 📚 Documentation
- [docs/DESIGN.md](docs/DESIGN.md) — Visual identity & motion language.
- [docs/UI_UX.md](docs/UI_UX.md) — IA grouping & user flows.
- [docs/PHASES.md](docs/PHASES.md) — Milestone tracking.
- [docs/SEED.md](docs/SEED.md) — Tech foundation.
