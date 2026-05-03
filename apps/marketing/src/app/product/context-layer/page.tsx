import {
  BookOpen,
  FileCode,
  FileText,
  GitBranch,
  Headphones,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Plug,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PlaygroundButton } from "@context-layer/ui/components/marketing/chrome/playground-button";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { AISdlcTriangle } from "@context-layer/ui/components/marketing/ai-sdlc-triangle";
import {
  CapabilityScroller,
  type Capability,
} from "@context-layer/ui/components/marketing/capability-sticky";
import { FadeUp } from "@context-layer/ui/components/motion/fade-up";

const CAPABILITIES: Capability[] = [
  {
    id: "sources",
    eyebrow: "01 · Sources",
    title: "Everything your codebase leaks into, indexed and searchable.",
    body: "Connect code, docs, and discussion through OAuth integrations — or upload zips and URLs when you can't. Every file becomes markdown, every commit becomes context.",
    graphic: <SourcesGraphic />,
  },
  {
    id: "knowledge",
    eyebrow: "02 · Knowledge",
    title: "Wiki and Intelligence — always-synced, always grounded.",
    body: "A living narrative Wiki (workspace → per-repo → llms.txt) sits next to live Intelligence dashboards — health, security, coverage, dependencies. Updated on every commit.",
    graphic: <KnowledgeGraphic />,
  },
  {
    id: "chatbot",
    eyebrow: "03 · Chatbot",
    title: "Ask anything. Every answer carries citations.",
    body: "Grounded Q&A over sources and knowledge. Answers cite both wiki sections AND @file:line-range code locations — the only way to make AI answers defensible.",
    graphic: <ChatbotGraphic />,
  },
  {
    id: "generate",
    eyebrow: "04 · Generate",
    title: "One-shot artifacts your stakeholders can read.",
    body: "DocsGen (6 bundles), OmniBoard (text · audio · video onboarding), and MCPGen (tentative — MCP descriptors for external agents). Outputs land in the Library.",
    graphic: <GenerateGraphic />,
  },
];

export default function ContextLayerProductPage() {
  return (
    <>
      {/* HERO — Triangle integration */}
      <section className="relative overflow-hidden bg-white border-b border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-4 pb-16 lg:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="space-y-5">
                <h1 className="text-display-hero text-black lg:text-[64px] lg:leading-[1.04] lg:tracking-[-1.1px]">
                  Context Layer.
                </h1>

                <h2 className="text-section-heading text-black">
                  Human. Agent. Codebase. Context is the channel.
                </h2>
                <p className="text-body text-[#4e4e4e]">
                  High-fidelity software development needs three reliable channels — and each one
                  breaks without shared context. Context Layer is the medium they all read from.
                </p>
                <dl className="grid gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#3b82f6" }}
                    />
                    <div>
                      <dt className="text-body-medium text-black">Human ↔ Context</dt>
                      <dd className="text-caption text-[#4e4e4e]">
                        Read grounded docs. Run grounded queries. Onboard faster.
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#10b981" }}
                    />
                    <div>
                      <dt className="text-body-medium text-black">Agent ↔ Context</dt>
                      <dd className="text-caption text-[#4e4e4e]">
                        Agents get structured context — not stale READMEs scraped from a directory.
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#b45309" }}
                    />
                    <div>
                      <dt className="text-body-medium text-black">Human ↔ Agent</dt>
                      <dd className="text-caption text-[#4e4e4e]">
                        Both sides share one canonical source of truth. No two interpretations.
                      </dd>
                    </div>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <PlaygroundButton>Open in playground</PlaygroundButton>
                  <a
                    href="#foundation"
                    className="text-button text-[#4e4e4e] hover:text-black transition-colors inline-flex items-center gap-1.5"
                  >
                    Four verbs <span aria-hidden>↓</span>
                  </a>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1} className="flex justify-center lg:translate-y-24">
              <AISdlcTriangle />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* WIKI FOUNDATION PRELUDE */}
      <section id="foundation" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <FadeUp>

        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PromiseCard
              icon={<ShieldCheck size={24} strokeWidth={1.5} />}
              accentBg="#ecfdf5"
              accentFg="#047857"
              title="Persistent"
              body="Versioned knowledge that lives as long as your codebase. Survives restarts, retries, and re-indexes."
            />
            <PromiseCard
              icon={<RefreshCw size={24} strokeWidth={1.5} />}
              accentBg="#fffbeb"
              accentFg="#b45309"
              title="Always Synced"
              body="Updates on every commit, PR merge, or chosen cadence. One canonical source of truth."
            />
            <PromiseCard
              icon={<Sparkles size={24} strokeWidth={1.5} />}
              accentBg="#eff6ff"
              accentFg="#1d4ed8"
              title="Agent-Ready"
              body="Workspace narrative → per-repo wikis → llms.txt for agents. Read at the level that fits the job."
            />
          </div>
        </FadeUp>
      </section>

      {/* 4-VERB CAPABILITY SCROLLER */}
      <CapabilityScroller items={CAPABILITIES} />

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 pb-24">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">Stop reading stale docs.</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              The playground ships with a 9-repo TMForum catalog. Every capability above is real
              inside it — Wiki, Intelligence, Chatbot, DocsGen.
            </p>
            <div className="pt-2">
              <PlaygroundButton variant="hero">Open the playground</PlaygroundButton>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function PromiseCard({
  icon,
  accentBg,
  accentFg,
  title,
  body,
}: {
  icon: React.ReactNode;
  accentBg: string;
  accentFg: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex gap-4">
      <div
        className="w-12 h-12 flex-shrink-0 rounded-comfortable flex items-center justify-center"
        style={{ backgroundColor: accentBg, color: accentFg }}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-body-large text-black">{title}</h3>
        <p className="text-caption text-[#4e4e4e]">{body}</p>
      </div>
    </div>
  );
}



// ────────────────────────── Capability graphics ──────────────────────────

function SourcesGraphic() {
  const items = [
    {
      kind: "Code",
      label: "offering-service",
      accent: "#1d4ed8",
      bg: "#eff6ff",
      icon: <GitBranch size={14} strokeWidth={1.5} />,
    },
    {
      kind: "File",
      label: "architecture.pdf",
      accent: "#525252",
      bg: "#f5f5f5",
      icon: <FileText size={14} strokeWidth={1.5} />,
    },
    {
      kind: "Code",
      label: "web-ui",
      accent: "#1d4ed8",
      bg: "#eff6ff",
      icon: <GitBranch size={14} strokeWidth={1.5} />,
    },
    {
      kind: "Discussion",
      label: "#eng-platform",
      accent: "#b45309",
      bg: "#fffbeb",
      icon: <MessageSquare size={14} strokeWidth={1.5} />,
    },
  ];
  return (
    <div className="w-full max-w-[420px] space-y-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center gap-3 bg-white rounded-card px-3 py-2.5 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]"
        >
          <span
            className="w-8 h-8 rounded-standard flex items-center justify-center"
            style={{ backgroundColor: it.bg, color: it.accent }}
          >
            {it.icon}
          </span>
          <div className="flex-1">
            <p className="text-caption text-black font-mono">{it.label}</p>
            <p className="text-micro text-[#777169] uppercase tracking-[0.08em]">{it.kind}</p>
          </div>
          <StatusPill tone="indexed" dot>
            Indexed
          </StatusPill>
        </div>
      ))}
    </div>
  );
}

function KnowledgeGraphic() {
  return (
    <div className="w-full max-w-[420px] grid grid-cols-1 gap-3">
      {/* Wiki card */}
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
              <BookOpen size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Wiki</p>
          </div>
          <StatusPill tone="indexed" dot>
            Live
          </StatusPill>
        </div>
        <div className="space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-[#f5f5f5]" />
          <span className="block h-1.5 w-[82%] rounded-full bg-[#f5f5f5]" />
          <span className="block h-1.5 w-[68%] rounded-full bg-[#f5f5f5]" />
        </div>
      </div>

      {/* Intelligence card */}
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
              <LayoutDashboard size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Intelligence</p>
          </div>
          <StatusPill tone="info" dot>
            Refreshed
          </StatusPill>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Stat label="Health" value="84" tone="indexed" />
          <Stat label="Sec" value="19" tone="error" />
          <Stat label="Cov" value="81%" tone="warn" />
          <Stat label="Deps" value="30" tone="neutral" />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "indexed" | "warn" | "error" | "neutral";
}) {
  const color = {
    indexed: "#047857",
    warn: "#b45309",
    error: "#b91c1c",
    neutral: "#525252",
  }[tone];
  return (
    <div className="rounded-standard bg-[#f9f9f9] p-2 text-center">
      <p className="text-[10px] uppercase text-[#777169] tracking-[0.08em]">{label}</p>
      <p className="text-[18px] font-display leading-none mt-1" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ChatbotGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-2">
      <div className="bg-[#f5f2ef] rounded-card px-4 py-3 max-w-[88%]">
        <p className="text-caption text-black">
          How does the offering publication saga work across services?
        </p>
      </div>
      <div className="bg-white rounded-card px-4 py-3 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] ml-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
            <MessageSquare size={12} strokeWidth={1.5} />
          </span>
          <p className="text-micro text-[#777169] uppercase tracking-[0.08em]">Grounded answer</p>
        </div>
        <p className="text-caption text-[#4e4e4e]">
          The Offering Service starts a Camunda process that locks prices, validates specs, and
          pre-creates the store entry
          <span className="inline-flex items-center px-1.5 py-[1px] mx-1 rounded-subtle bg-[#eff6ff] text-[#1d4ed8] text-tiny font-mono">
            wiki://offering
          </span>
          <span className="inline-flex items-center px-1.5 py-[1px] mx-1 rounded-subtle bg-[#ecfdf5] text-[#047857] text-tiny font-mono">
            @main.py:204
          </span>
          .
        </p>
      </div>
      <div className="flex gap-1.5 ml-6">
        <StatusPill tone="indexed">✓ Wiki</StatusPill>
        <StatusPill tone="info">✓ Codebase</StatusPill>
        <StatusPill tone="warn">✓ Files</StatusPill>
      </div>
    </div>
  );
}

function GenerateGraphic() {
  const tools = [
    {
      name: "DocsGen",
      sub: "6 bundles · 21 cards",
      icon: <FileCode size={16} strokeWidth={1.5} />,
      bg: "#eff6ff",
      fg: "#1d4ed8",
    },
    {
      name: "OmniBoard",
      sub: "Text · Audio · Video",
      icon: <Headphones size={16} strokeWidth={1.5} />,
      bg: "#ecfdf5",
      fg: "#047857",
    },
    {
      name: "MCPGen",
      sub: "MCP descriptors",
      icon: <Plug size={16} strokeWidth={1.5} />,
      bg: "#fffbeb",
      fg: "#b45309",
      tentative: true,
    },
  ];
  return (
    <div className="w-full max-w-[420px] space-y-3">
      {tools.map((t) => (
        <div
          key={t.name}
          className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex items-center gap-4"
        >
          <span
            className="w-10 h-10 rounded-standard flex items-center justify-center"
            style={{ backgroundColor: t.bg, color: t.fg }}
          >
            {t.icon}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-body-medium text-black">{t.name}</p>
              {t.tentative ? <StatusPill tone="neutral">Tentative</StatusPill> : null}
            </div>
            <p className="text-caption text-[#777169]">{t.sub}</p>
          </div>
          <span aria-hidden className="text-[#777169]">
            <Sparkles size={16} strokeWidth={1.5} />
          </span>
        </div>
      ))}
    </div>
  );
}
