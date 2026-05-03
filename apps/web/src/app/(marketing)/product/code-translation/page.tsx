import {
  ArrowRight,
  CheckCircle2,
  FileCode,
  GitBranch,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";
import { StatusPill } from "@/components/marketing/status-pill";
import {
  CapabilityScroller,
  type Capability,
} from "@/components/marketing/capability-sticky";
import { FadeUp } from "@/components/motion/fade-up";

const CAPABILITIES: Capability[] = [
  {
    id: "ingestion",
    eyebrow: "01 · Source-Language Ingestion",
    title: "Parse once, map everything.",
    body:
      "Ingest the source repo into an AST + semantics snapshot — control flow, types, dependency graph. The translation model reads the snapshot, not the text.",
    graphic: <IngestionGraphic />,
  },
  {
    id: "translation",
    eyebrow: "02 · Semantic Translation",
    title: "Emit target code that preserves behavior.",
    body:
      "The translator reasons over the snapshot and emits idiomatic target-language code. Not a syntactic mapping — a behavior-preserving rewrite.",
    graphic: <TranslationGraphic />,
  },
  {
    id: "validation",
    eyebrow: "03 · Validation & Tests",
    title: "Run the original tests against the new code.",
    body:
      "We cross-run the source suite on the translated codebase and report deltas. Behavior parity you can defend to auditors.",
    graphic: <ValidationGraphic />,
  },
];

export default function CodeTranslationPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-24 pb-16 lg:pt-28">
          <div className="max-w-[860px] space-y-5">
            <FadeUp>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.08em] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
                <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                Premium Add-on
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="text-display-hero text-black lg:text-[64px] lg:leading-[1.04] lg:tracking-[-1.1px]">
                Code Translation.
              </h1>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-body-large text-[#4e4e4e] max-w-[620px]">
                Translate code across languages with semantic fidelity. Keep behavior, not just syntax.
                Built on the same indexed substrate as the base Context Layer.
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
            <LayeredHeroGraphic />
          </FadeUp>
        </div>
      </section>

      {/* WIKI FOUNDATION PRELUDE */}
      <section id="foundation" className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16">
        <FadeUp>
          <div className="max-w-[640px] space-y-2 mb-8">
            <p className="text-button-upper text-[#777169]">Built on the Wiki</p>
            <h2 className="text-section-heading text-black">
              Translation grounded in context.
            </h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PromiseCard
              icon={<Zap size={24} strokeWidth={1.5} />}
              accentBg="#ecfdf5"
              accentFg="#047857"
              title="Semantic Intent"
              body="We don't just map tokens; we map intentions. Logic is preserved even when syntax diverges significantly."
            />
            <PromiseCard
              icon={<FileCode size={24} strokeWidth={1.5} />}
              accentBg="#eff6ff"
              accentFg="#1d4ed8"
              title="Language-Native"
              body="Output is idiomatic target code (Go, Rust, TS), not a literal transliteration. It looks like your team wrote it."
            />
            <PromiseCard
              icon={<CheckCircle2 size={24} strokeWidth={1.5} />}
              accentBg="#fffbeb"
              accentFg="#b45309"
              title="Test Parity"
              body="Every translation includes a cross-language test execution report to verify behavior remains identical."
            />
          </div>
        </FadeUp>
      </section>

      <CapabilityScroller items={CAPABILITIES} />

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 pb-24">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">Premium product · Early access</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              Code Translation is currently in private pilot. We're selecting teams with complex
              cross-language migration needs (e.g. Python to Go/Rust).
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

function LayeredHeroGraphic() {
  const layers = [
    { label: "Python source", sub: "Input · Legacy stack", top: 0, z: 3, opacity: 1, accent: "#047857", accentBg: "#ecfdf5" },
    { label: "AST snapshot", sub: "Mapping · Universal schema", top: 44, z: 2, opacity: 0.92, accent: "#1d4ed8", accentBg: "#eff6ff" },
    { label: "Go output", sub: "Emitted · Idiomatic code", top: 88, z: 1, opacity: 0.82, accent: "#b45309", accentBg: "#fffbeb" },
  ];
  return (
    <div className="relative mt-14 h-[220px]">
      {layers.map((l, i) => (
        <div
          key={l.label}
          className="absolute left-1/2 -translate-x-1/2 w-[700px] max-w-full bg-white rounded-large shadow-[var(--shadow-outline-ring)]"
          style={{
            top: `${l.top}px`,
            zIndex: l.z,
            opacity: l.opacity,
            transform: `translateX(-50%) rotate(${(i - 1) * 1}deg)`,
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-standard"
                style={{ backgroundColor: l.accentBg, color: l.accent }}
              >
                <Layers size={18} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-button-upper text-[#777169]">Layer {i + 1}</p>
                <p className="text-body-medium text-black">{l.label}</p>
              </div>
            </div>
            <p className="text-caption text-[#777169]">{l.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IngestionGraphic() {
  const items = [
    { kind: "Source", label: "main.py", accent: "#047857", bg: "#ecfdf5", icon: <FileCode size={14} strokeWidth={1.5} /> },
    { kind: "Graph", label: "control_flow.json", accent: "#1d4ed8", bg: "#eff6ff", icon: <GitBranch size={14} strokeWidth={1.5} /> },
    { kind: "Types", label: "symbols.db", accent: "#525252", bg: "#f5f5f5", icon: <Layers size={14} strokeWidth={1.5} /> },
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
          <StatusPill tone="indexed" dot>Parsed</StatusPill>
        </div>
      ))}
    </div>
  );
}

function TranslationGraphic() {
  return (
    <div className="w-full max-w-[420px] grid grid-cols-1 gap-3">
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
              <RefreshCw size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Translation Engine</p>
          </div>
          <StatusPill tone="info" dot>Processing</StatusPill>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-2 bg-[#f9f9f9] rounded-standard text-center">
            <p className="text-micro text-[#777169] uppercase">Python</p>
            <div className="h-1 w-full bg-[#e5e5e5] rounded-full mt-2" />
          </div>
          <ArrowRight size={14} className="text-[#777169]" />
          <div className="flex-1 p-2 bg-[#f9f9f9] rounded-standard text-center">
            <p className="text-micro text-[#777169] uppercase">Go</p>
            <div className="h-1 w-full bg-[#1d4ed8] rounded-full mt-2" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-card p-3 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)] flex items-center gap-3">
        <span className="w-8 h-8 rounded-standard bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
          <Zap size={16} strokeWidth={1.5} />
        </span>
        <div className="flex-1">
          <p className="text-caption text-black">Idiomatic mapping applied</p>
          <p className="text-micro text-[#777169]">Using context from @offering-service</p>
        </div>
      </div>
    </div>
  );
}

function ValidationGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-3">
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-standard bg-[#fffbeb] text-[#b45309] flex items-center justify-center">
              <ShieldCheck size={16} strokeWidth={1.5} />
            </span>
            <p className="text-body-medium text-black">Validation Report</p>
          </div>
          <StatusPill tone="indexed" dot>Verified</StatusPill>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Pass" value="142" tone="indexed" />
          <Stat label="Fail" value="0" tone="neutral" />
          <Stat label="Flaky" value="3" tone="warn" />
        </div>
      </div>
      <div className="bg-[#f5f2ef] rounded-card px-4 py-3 flex items-center justify-between">
        <p className="text-caption text-black">Behavioral Parity</p>
        <span aria-hidden className="text-[#047857]">
          <Sparkles size={16} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "indexed" | "warn" | "error" | "neutral" }) {
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
