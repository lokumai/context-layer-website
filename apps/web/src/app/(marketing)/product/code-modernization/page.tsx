import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";
import { FadeUp } from "@/components/motion/fade-up";
import {
  CapabilityScroller,
  type Capability,
} from "@/components/marketing/capability-sticky";

const CAPABILITIES: Capability[] = [
  {
    id: "assessment",
    eyebrow: "01 · Assessment",
    title: "Catalog hotspots, blockers, dead code.",
    body:
      "Full-codebase scan producing a ranked list of risk areas, abandoned modules, and upgrade blockers. The baseline every migration plan should reference.",
    graphic: <AssessmentGraphic />,
  },
  {
    id: "planning",
    eyebrow: "02 · Migration Planning",
    title: "A phased plan grounded in the code, not guesses.",
    body:
      "Produce a phased migration plan whose steps reference real files and dependencies. No hand-waving timelines — every phase ties to actual diff scope.",
    graphic: <PlanningGraphic />,
  },
  {
    id: "continuous",
    eyebrow: "03 · Continuous Modernization",
    title: "Short iterations, full audit trail.",
    body:
      "Apply changes in small verified steps. Every commit has agent rationale. Auditors can reconstruct the migration retrospectively from the Wiki logs.",
    graphic: <ContinuousGraphic />,
  },
];

export default function CodeModernizationPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-24 pb-20 lg:pt-32">
          <div className="max-w-[860px] space-y-6">
            <FadeUp>
              <p className="text-button-upper text-[#777169]">PREMIUM · CODE MODERNIZATION</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-display-hero text-black md:text-[72px] md:leading-[1.04] md:tracking-[-1.2px]">
                Code Modernization.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-body-large text-[#4e4e4e] max-w-[640px]">
                Upgrade legacy stacks without big-bang rewrites. Ground every change in the actual codebase.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PlaygroundButton href="mailto:early-access@context-layer.dev">
                  Request early access
                </PlaygroundButton>
                <a
                  href="#assessment"
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

      <CapabilityScroller items={CAPABILITIES} />

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 pb-32">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">Premium product · Early access</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              Code Modernization is a premium engagement. Email us to scope a pilot.
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

function LayeredHeroGraphic() {
  const layers = [
    { label: "Legacy stack", top: 0, z: 3, opacity: 1 },
    { label: "Migration plan", top: 38, z: 2, opacity: 0.85 },
    { label: "Modernized runtime", top: 76, z: 1, opacity: 0.7 },
  ];
  return (
    <div className="relative mt-16 h-[220px]">
      {layers.map((l, i) => (
        <div
          key={l.label}
          className="absolute left-1/2 -translate-x-1/2 w-[680px] max-w-full bg-white rounded-large shadow-[var(--shadow-outline-ring)] backdrop-blur"
          style={{
            top: `${l.top}px`,
            zIndex: l.z,
            opacity: l.opacity,
            transform: `translateX(-50%) rotate(${(i - 1) * 1.2}deg)`,
          }}
        >
          <div className="px-6 py-5">
            <p className="text-button-upper text-[#777169]">Layer {i + 1}</p>
            <p className="text-card-heading text-black mt-1">{l.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssessmentGraphic() {
  const risks = [
    { label: "Circular Deps", color: "#b91c1c" },
    { label: "Deprecated APIs", color: "#d97706" },
    { label: "Dead Modules", color: "#b91c1c" },
    { label: "Safe Path", color: "#22c55e" },
  ];
  return (
    <div className="w-full h-full p-6">
      <div className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#f5f2ef] bg-[#f5f2ef]/30">
          <p className="text-micro text-[#777169]">RISK ASSESSMENT</p>
        </div>
        <div className="divide-y divide-[#f5f2ef]">
          {risks.map((r) => (
            <div key={r.label} className="px-4 py-3 flex items-center justify-between">
              <p className="text-caption text-[#4e4e4e]">{r.label}</p>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanningGraphic() {
  return (
    <div className="w-full h-full p-6 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={`phase-${i}`} className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-4 flex items-center gap-4">
          <p className="text-button-upper text-[#777169] opacity-50">0{i}</p>
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-32 bg-[#0a0a0a] rounded-pill" />
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-[#f5f2ef] rounded-pill border border-[#777169]/10" />
              <div className="h-4 w-16 bg-[#f5f2ef] rounded-pill border border-[#777169]/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContinuousGraphic() {
  return (
    <div className="w-full h-full p-6 relative">
      {[0, 1, 2].map((i) => (
        <div
          key={`commit-${i}`}
          className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-4 absolute left-10 right-10"
          style={{ top: `${24 + i * 40}px`, zIndex: 3 - i, opacity: 1 - i * 0.15 }}
        >
          <div className="flex items-center gap-3">
            <p className="text-micro font-mono text-[#777169]">ae42{i}f</p>
            <div className="h-2 w-32 bg-[#4e4e4e] rounded-pill" />
          </div>
          <p className="text-micro text-[#777169] mt-2 italic">Agent rationale attached</p>
        </div>
      ))}
    </div>
  );
}
