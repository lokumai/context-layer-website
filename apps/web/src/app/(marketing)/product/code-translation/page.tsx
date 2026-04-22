import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";
import { FadeUp } from "@/components/motion/fade-up";
import {
  CapabilityScroller,
  type Capability,
} from "@/components/marketing/capability-sticky";

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
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-24 pb-20 lg:pt-32">
          <div className="max-w-[860px] space-y-6">
            <FadeUp>
              <p className="text-button-upper text-[#777169]">PREMIUM · CODE TRANSLATION</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-display-hero text-black md:text-[72px] md:leading-[1.04] md:tracking-[-1.2px]">
                Code Translation.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-body-large text-[#4e4e4e] max-w-[640px]">
                Translate code across languages with semantic fidelity. Keep behavior, not just syntax.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PlaygroundButton href="mailto:early-access@context-layer.dev">
                  Request early access
                </PlaygroundButton>
                <a
                  href="#ingestion"
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
              Code Translation is not in the public playground. Email us to get on the list.
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
    { label: "Python source", top: 0, z: 3, opacity: 1 },
    { label: "AST snapshot", top: 38, z: 2, opacity: 0.85 },
    { label: "Go output", top: 76, z: 1, opacity: 0.7 },
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

function IngestionGraphic() {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-6">
      <div className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-4 w-48">
        <div className="h-2 w-12 bg-[#f5f2ef] rounded-pill mb-2" />
        <div className="h-3 w-24 bg-[#0a0a0a] rounded-pill" />
      </div>
      <div className="flex flex-col gap-2 pl-4 border-l border-[#f5f2ef]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3" style={{ paddingLeft: `${i * 12}px` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#777169]" />
            <div className="h-2 w-20 bg-[#f5f2ef] rounded-pill" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TranslationGraphic() {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-4 p-6">
      <div className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-4 overflow-hidden">
        <p className="text-micro text-[#777169] mb-3">before.py</p>
        <div className="space-y-2">
          {[0.8, 0.6, 0.9, 0.4].map((w) => (
            <div key={`py-${w}`} className="h-1.5 bg-[#f5f2ef] rounded-pill" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-4 overflow-hidden border border-[#f5f2ef]">
        <p className="text-micro text-[#777169] mb-3">after.go</p>
        <div className="space-y-2">
          {[0.7, 0.9, 0.5, 0.8].map((w) => (
            <div key={`go-${w}`} className="h-1.5 bg-[#0a0a0a] opacity-20 rounded-pill" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ValidationGraphic() {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="bg-white rounded-card shadow-[var(--shadow-outline-ring)] p-6 w-full max-w-[280px] space-y-4">
        <p className="text-button-upper text-[#777169]">Test Summary</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-micro text-[#4e4e4e]">142 passing</p>
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-micro text-[#4e4e4e]">0 failing</p>
            <div className="w-2 h-2 rounded-full bg-[#f5f2ef]" />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-micro text-[#4e4e4e]">3 flaky</p>
            <div className="w-2 h-2 rounded-full bg-[#d97706]" />
          </div>
        </div>
      </div>
    </div>
  );
}
