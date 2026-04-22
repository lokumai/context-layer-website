import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";
import { FadeUp } from "@/components/motion/fade-up";
import { FloatingCards } from "@/components/marketing/floating-cards";
import { Pipeline } from "@/components/marketing/pipeline";
import { ProductCard } from "@/components/marketing/product-card";
import { TerminalType } from "@/components/motion/terminal-type";

const TERMINAL_SCRIPT = [
  "$ context-layer ask 'How does offering publication work?'",
  "Searching 9 sources…",
  "Grounding in Wiki · Codebase · Files",
  "",
  "The Offering Service orchestrates a Camunda saga",
  "across pricing, specification, and store-query [1].",
  "",
  "[1] wiki://offering-service/saga-orchestration",
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-[900px] mx-auto text-center space-y-6">
            <FadeUp>
              <p className="text-button-upper text-[#777169]">Context Layer Ecosystem</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-display-hero text-black text-balance md:text-[72px] md:leading-[1.04] md:tracking-[-1.2px]">
                Turn your codebase into living knowledge.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-body-large text-[#4e4e4e] max-w-[640px] mx-auto">
                A workspace-aware ecosystem for multi-repo teams. Always-synced wikis, grounded chatbots, and frozen artifacts — all from a single source of truth.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <PlaygroundButton variant="hero">Try the playground</PlaygroundButton>
                <a
                  href="#pipeline"
                  className="text-button text-[#4e4e4e] hover:text-black transition-colors inline-flex items-center gap-1.5"
                >
                  See how it works
                  <span aria-hidden>↓</span>
                </a>
              </div>
            </FadeUp>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <FadeUp delay={0.3}>
              <TerminalType lines={TERMINAL_SCRIPT} className="shadow-[var(--shadow-outline-ring)]" />
            </FadeUp>
            <FadeUp delay={0.4}>
              <FloatingCards />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <div id="pipeline" className="bg-[#f5f5f5]">
        <Pipeline />
      </div>

      {/* Products */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 py-32">
        <FadeUp>
          <div className="max-w-[720px] space-y-4">
            <p className="text-button-upper text-[#777169]">Three products, one ecosystem</p>
            <h2 className="text-section-heading text-black">
              Understand, translate, modernize.
            </h2>
            <p className="text-body text-[#4e4e4e]">
              Context Layer is the foundation. Code Translation and Code Modernization build on the same knowledge substrate for specialized workloads.
            </p>
          </div>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeUp delay={0.1}>
            <ProductCard
              href="/product/context-layer"
              eyebrow="Base product"
              title="Context Layer"
              description="Living wikis, intelligence dashboards, and grounded chatbots over your multi-repo workspace."
              available
            />
          </FadeUp>
          <FadeUp delay={0.18}>
            <ProductCard
              href="/product/code-translation"
              eyebrow="Premium"
              title="Code Translation"
              description="Translate code across languages with semantic fidelity — no rewriting from scratch."
              available={false}
            />
          </FadeUp>
          <FadeUp delay={0.26}>
            <ProductCard
              href="/product/code-modernization"
              eyebrow="Premium"
              title="Code Modernization"
              description="Upgrade legacy stacks to modern runtimes without big-bang rewrites."
              available={false}
            />
          </FadeUp>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 pb-32">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-20 text-center space-y-6">
            <h2 className="text-section-heading text-black">Ready to see it in motion?</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              The playground ships pre-loaded with a multi-repo TMForum product catalog. Pick a persona and explore.
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
