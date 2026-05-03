import Link from "next/link";
import {
  BookOpen,
  FileText,
  GitBranch,
  Headphones,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Plug,
  Sparkles,
  Upload,
} from "lucide-react";
import { StatusPill } from "./status-pill";

// The primary "what we do" section on the home page.
// Teaches the playground's 4-verb user-facing IA before the user enters:
//   Sources → Knowledge (Wiki + Intelligence) → Chatbot → Generate (DocsGen + OmniBoard + MCPGen).

export function ProductBento() {
  return (
    <div className="space-y-6">
      {/* Step strip */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-pill flex items-center justify-center text-[12px] font-semibold"
              style={{ backgroundColor: s.bg, color: s.fg }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <p className="text-nav text-[#4e4e4e]">{s.title}</p>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="w-6 h-px bg-[rgba(0,0,0,0.15)]" />
            ) : null}
          </div>
        ))}
      </div>

      {/* Group bento 2×2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GroupCard
          step="01"
          accent="info"
          icon={<Inbox size={28} strokeWidth={1.5} />}
          title="Sources"
          kicker="What you bring"
          body="Connect code, docs, and discussion. One indexed substrate feeds every downstream agent."
          items={[
            {
              icon: <GitBranch size={14} strokeWidth={1.5} />,
              label: "Code",
              sub: "GitHub · GitLab · Bitbucket · Gitea",
            },
            {
              icon: <FileText size={14} strokeWidth={1.5} />,
              label: "Files",
              sub: "Drive · Notion · Confluence · upload",
            },
            {
              icon: <Upload size={14} strokeWidth={1.5} />,
              label: "Discussion",
              sub: "Slack · Linear · Jira · GitHub Discussions",
            },
          ]}
        />
        <GroupCard
          step="02"
          accent="indexed"
          icon={<BookOpen size={28} strokeWidth={1.5} />}
          title="Knowledge"
          kicker="What we sync"
          body="Living wikis and live dashboards. Always fresh, always versioned, always multi-repo."
          items={[
            {
              icon: <BookOpen size={14} strokeWidth={1.5} />,
              label: "Wiki",
              sub: "Workspace · Repo · llms.txt",
            },
            {
              icon: <LayoutDashboard size={14} strokeWidth={1.5} />,
              label: "Intelligence",
              sub: "Health · Security · Coverage · Deps",
            },
          ]}
        />
        <GroupCard
          step="03"
          accent="warn"
          icon={<MessageSquare size={28} strokeWidth={1.5} />}
          title="Chatbot"
          kicker="Ask anything, grounded"
          body="A conversational surface over every source and wiki. Every answer cites both a wiki anchor and an `@file:line` code location."
          items={[
            {
              icon: <MessageSquare size={14} strokeWidth={1.5} />,
              label: "Grounded Q&A",
              sub: "Wiki + Code + Files citations",
            },
          ]}
        />
        <GroupCard
          step="04"
          accent="neutral"
          icon={<Sparkles size={28} strokeWidth={1.5} />}
          title="Generate"
          kicker="One-shot artifacts"
          body="Frozen, shareable outputs. Docs you can email, onboarding packs you can play, MCP descriptors your agents can consume."
          items={[
            {
              icon: <FileText size={14} strokeWidth={1.5} />,
              label: "DocsGen",
              sub: "6 bundles of exportable docs",
            },
            {
              icon: <Headphones size={14} strokeWidth={1.5} />,
              label: "OmniBoard",
              sub: "Text · Audio · Video onboarding",
            },
            {
              icon: <Plug size={14} strokeWidth={1.5} />,
              label: "MCPGen",
              sub: "MCP descriptors (tentative)",
            },
          ]}
        />
      </div>

      {/* Foundation footer strip */}
      <div className="bg-[var(--color-ink-dark)] text-white rounded-section px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <p className="text-button-upper text-white/60">Foundation · The Moat</p>
        </div>
        <p className="text-body-standard text-white/90 max-w-[640px]">
          Built on a <strong className="text-white">persistent · versioned · always-synced</strong>{" "}
          Wiki. One canonical source of truth across every repo in the workspace.
        </p>
        <div className="flex gap-2">
          <StatusPill tone="indexed" dot>
            Persistent
          </StatusPill>
          <StatusPill tone="info" dot>
            Versioned
          </StatusPill>
          <StatusPill tone="warn" dot>
            Synced
          </StatusPill>
        </div>
      </div>

      {/* Premium add-ons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PremiumCard
          href="/product/code-translation"
          title="Code Translation"
          tagline="Translate code across languages with semantic fidelity."
        />
        <PremiumCard
          href="/product/code-modernization"
          title="Code Modernization"
          tagline="Upgrade legacy stacks without big-bang rewrites."
        />
      </div>
    </div>
  );
}

const STEPS = [
  { id: "sources", title: "Sources", bg: "#eff6ff", fg: "#1d4ed8" },
  { id: "knowledge", title: "Knowledge", bg: "#ecfdf5", fg: "#047857" },
  { id: "chatbot", title: "Chatbot", bg: "#fffbeb", fg: "#b45309" },
  { id: "generate", title: "Generate", bg: "#f5f5f5", fg: "#525252" },
];

function GroupCard({
  step,
  accent,
  icon,
  title,
  kicker,
  body,
  items,
}: {
  step: string;
  accent: "info" | "indexed" | "warn" | "neutral";
  icon: React.ReactNode;
  title: string;
  kicker: string;
  body: string;
  items: Array<{ icon: React.ReactNode; label: string; sub: string }>;
}) {
  const accentFg = {
    info: "#1d4ed8",
    indexed: "#047857",
    warn: "#b45309",
    neutral: "#0a0a0a",
  }[accent];
  const accentBg = {
    info: "#eff6ff",
    indexed: "#ecfdf5",
    warn: "#fffbeb",
    neutral: "#f5f5f5",
  }[accent];

  return (
    <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-comfortable flex items-center justify-center"
          style={{ backgroundColor: accentBg, color: accentFg }}
        >
          {icon}
        </div>
        <span className="text-button-upper text-[#777169]">{step}</span>
      </div>
      <div className="space-y-1">
        <p className="text-button-upper text-[#777169]">{kicker}</p>
        <h3 className="text-card-heading text-black">{title}</h3>
        <p className="text-body-standard text-[#4e4e4e]">{body}</p>
      </div>
      <div className="pt-4 border-t border-[rgba(0,0,0,0.05)] space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-start gap-3">
            <span
              className="w-6 h-6 rounded-subtle flex items-center justify-center mt-[1px]"
              style={{ backgroundColor: accentBg, color: accentFg }}
            >
              {it.icon}
            </span>
            <div className="flex-1">
              <p className="text-body-medium text-black leading-tight">{it.label}</p>
              <p className="text-caption text-[#777169]">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PremiumCard({ href, title, tagline }: { href: string; title: string; tagline: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between bg-white rounded-large px-6 py-5 shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <StatusPill tone="neutral" dot>
            Premium
          </StatusPill>
          <span className="text-button-upper text-[#777169]">Add-on</span>
        </div>
        <h4 className="text-body-large text-black">{title}</h4>
        <p className="text-caption text-[#4e4e4e]">{tagline}</p>
      </div>
      <span aria-hidden className="text-black transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
