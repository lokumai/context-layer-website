import {
  FileText,
  GitBranch,
  History,
  Layers,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PlaygroundButton } from "@context-layer/ui/components/marketing/chrome/playground-button";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import {
  CapabilityScroller,
  type Capability,
} from "@context-layer/ui/components/marketing/capability-sticky";
import { FadeUp } from "@context-layer/ui/components/motion/fade-up";
import { LayeredStepGraphic } from "@context-layer/ui/components/marketing/layered-step-graphic";

const CAPABILITIES: Capability[] = [
  {
    id: "assessment",
    eyebrow: "01 · Assessment",
    title: "Catalog hotspots, blockers, dead code.",
    body: "Full-codebase scan producing a ranked list of risk areas, abandoned modules, and upgrade blockers. The baseline every migration plan should reference.",
    graphic: <AssessmentGraphic />,
  },
  {
    id: "planning",
    eyebrow: "02 · Migration Planning",
    title: "A phased plan grounded in the code, not guesses.",
    body: "Produce a phased migration plan whose steps reference real files and dependencies. No hand-waving timelines — every phase ties to actual diff scope.",
    graphic: <PlanningGraphic />,
  },
  {
    id: "continuous",
    eyebrow: "03 · Continuous Modernization",
    title: "Short iterations, full audit trail.",
    body: "Apply changes in small verified steps. Every commit has agent rationale. Auditors can reconstruct the migration retrospectively from the Wiki logs.",
    graphic: <ContinuousGraphic />,
  },
];

export default function CodeModernizationPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-24 pb-16 lg:pt-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:items-start">
            <div className="max-w-[860px] space-y-5">
              <FadeUp>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.08em] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
                  <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                  Premium Add-on
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="text-display-hero text-black lg:text-[64px] lg:leading-[1.04] lg:tracking-[-1.1px]">
                  Code Modernization.
                </h1>
              </FadeUp>
              <FadeUp delay={0.18}>
                <p className="text-body-large text-[#4e4e4e] max-w-[620px]">
                  Upgrade legacy stacks without big-bang rewrites. Ground every change in the actual
                  codebase. Built on the same indexed substrate as the base Context Layer.
                </p>
              </FadeUp>
              <FadeUp delay={0.24}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <PlaygroundButton href="mailto:early-access@context-layer.dev">
                    Request early access
                  </PlaygroundButton>
                  <a
                    href="#foundation"
                    className="text-button text-[#4e4e4e] hover:text-black transition-colors inline-flex items-center gap-1.5"
                  >
                    Core capabilities <span aria-hidden>↓</span>
                  </a>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.3}>
              <div className="lg:justify-self-end lg:pt-4">
                <LayeredStepGraphic
                  layers={[
                    {
                      label: "Legacy stack",
                      sub: "Monolithic · EOL runtimes",
                      accent: "#047857",
                      accentBg: "#ecfdf5",
                      tag: "Before",
                    },
                    {
                      label: "Migration plan",
                      sub: "Phased · Dependency-aware",
                      accent: "#1d4ed8",
                      accentBg: "#eff6ff",
                      tag: "Plan",
                    },
                    {
                      label: "Modernized runtime",
                      sub: "Cloud-native · Verified",
                      accent: "#b45309",
                      accentBg: "#fffbeb",
                      tag: "After",
                    },
                  ]}
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* WIKI FOUNDATION PRELUDE */}
      <section id="foundation" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <FadeUp>
          <div className="max-w-[640px] space-y-2 mb-8">
            <p className="text-button-upper text-[#777169]">Built on the Wiki</p>
            <h2 className="text-section-heading text-black">Modernization grounded in facts.</h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PromiseCard
              icon={<ShieldCheck size={24} strokeWidth={1.5} />}
              accentBg="#ecfdf5"
              accentFg="#047857"
              title="Grounded Audit"
              body="No heuristic guesses. Every risk hotspot identified is tied to specific @file:line-range locations and historical commit patterns."
            />
            <PromiseCard
              icon={<Layers size={24} strokeWidth={1.5} />}
              accentBg="#eff6ff"
              accentFg="#1d4ed8"
              title="Phased Plan"
              body="Migration steps are generated as interactive checklists where each item references the real dependency graph of your repo."
            />
            <PromiseCard
              icon={<History size={24} strokeWidth={1.5} />}
              accentBg="#fffbeb"
              accentFg="#b45309"
              title="Audit Trail"
              body="Every agent-led refactor is logged in the Wiki with rationale, before/after snapshots, and behavioral verification results."
            />
          </div>
        </FadeUp>
      </section>

      <CapabilityScroller items={CAPABILITIES} />

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 pb-24">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">Premium product · Early access</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              Code Modernization is a high-touch premium engagement. We're selecting teams with
              significant legacy debt that needs systematic, verifiable upgrading.
            </p>
            <div className="pt-2">
              <PlaygroundButton variant="hero" href="mailto:early-access@context-layer.dev">
                Request early access
              </PlaygroundButton>
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


function AssessmentGraphic() {
  const risks = [
    { label: "Circular Deps", value: "8", tone: "error" },
    { label: "Deprecated", value: "24", tone: "warn" },
    { label: "Dead Code", value: "12%", tone: "indexed" },
  ];
  return (
    <div className="w-full max-w-[420px] space-y-3">
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
              <LayoutDashboard size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Risk Catalog</p>
          </div>
          <StatusPill tone="warn" dot>
            Scan Complete
          </StatusPill>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {risks.map((r) => (
            <Stat
              key={r.label}
              label={r.label}
              value={r.value}
              tone={r.tone as "indexed" | "warn" | "error" | "neutral"}
            />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-card p-3 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex items-center gap-3">
        <span className="w-8 h-8 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
          <FileText size={16} strokeWidth={1.5} />
        </span>
        <div className="flex-1">
          <p className="text-caption text-black">Top Priority: Auth Wrapper</p>
          <p className="text-micro text-[#777169]">Blocked by 4 downstream services</p>
        </div>
      </div>
    </div>
  );
}

function PlanningGraphic() {
  const phases = [
    { id: "01", label: "Decouple Identity", status: "Ready", accent: "#047857", bg: "#ecfdf5" },
    { id: "02", label: "Migrate DB Schema", status: "Blocked", accent: "#525252", bg: "#f5f5f5" },
  ];
  return (
    <div className="w-full max-w-[420px] space-y-3">
      {phases.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex items-center gap-4"
        >
          <span
            className="w-10 h-10 rounded-standard flex items-center justify-center"
            style={{ backgroundColor: p.bg, color: p.accent }}
          >
            <Layers size={16} strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <p className="text-button-upper text-[#777169] text-[10px]">Phase {p.id}</p>
            <p className="text-body-medium text-black">{p.label}</p>
          </div>
          <StatusPill tone={p.status === "Ready" ? "indexed" : "neutral"}>{p.status}</StatusPill>
        </div>
      ))}
      <div className="bg-[#f5f2ef] rounded-card px-4 py-3 flex items-center gap-3">
        <GitBranch size={14} className="text-[#777169]" />
        <p className="text-micro text-[#4e4e4e]">Every step generates a verifiable diff</p>
      </div>
    </div>
  );
}

function ContinuousGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-2">
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
              <RefreshCw size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Wiki Logs</p>
          </div>
          <StatusPill tone="indexed" dot>
            Synced
          </StatusPill>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#047857]" />
            <div>
              <p className="text-caption text-black font-mono">refactor: identity-provider</p>
              <p className="text-micro text-[#777169]">
                Grounded rationale attached via @context-layer
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-60">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#525252]" />
            <div>
              <p className="text-caption text-black font-mono">fix: circular-dep in offering</p>
              <p className="text-micro text-[#777169]">Behavioral parity verified: 100%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <StatusPill tone="info">✓ Audit Trail</StatusPill>
        <StatusPill tone="indexed">✓ Verified</StatusPill>
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
