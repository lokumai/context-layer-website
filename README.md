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
- **Core**: Next.js 15 (App Router), Turborepo, Bun
- **UI**: Tailwind CSS v4, Motion, Lucide, shadcn/ui
- **State/Auth**: Zustand (Persona-keyed Persist), Auth.js v5
- **Quality**: Vitest, Playwright, Biome

---

## 🚀 Getting Started
1. **Install**: `bun install`
2. **Dev**: `bun run dev`
3. **Demo Personas**: Sign in via `/login` using the following passwords (set in `.env.local`):
   - `empty`: Zero-state onboarding
   - `partial`: Active sources, no Wiki generated
   - `full`: Complete 9-repo workspace with Wiki, Intelligence, and Chatbot history

---

## 🚢 Deployment
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Docker + GitHub Actions + DigitalOcean App Platform pipeline. Connect Claude Desktop to a remote MCP endpoint.

## 🎬 Client demos
- [AGENTS.md](AGENTS.md) — Project briefing for AI coding agents + the portable Siloed Agent Persona block.
- [docs/DEMO_STORIES.md](docs/DEMO_STORIES.md) — Three "Without vs With" Claude Code demo scripts (Saga Trace, Multi-Repo Audit, Black-Box SDK).

## 📚 Documentation
- [docs/DESIGN.md](docs/DESIGN.md) — ElevenLabs × Engineering Dashboard visual identity.
- [docs/UI_UX.md](docs/UI_UX.md) — Core information architecture and user flows.
- [docs/PHASES.md](docs/PHASES.md) — Milestone tracking and delivery logs.
- [docs/SEED.md](docs/SEED.md) — Technical foundation and initial decisions.
