import { PlaygroundButton } from "@context-layer/ui/components/marketing/chrome/playground-button";
import { CapabilityCarousel } from "@context-layer/ui/components/marketing/capability-carousel";
import { ContextTriangleHero } from "@context-layer/ui/components/marketing/context-triangle-hero";
import { FadeUp } from "@context-layer/ui/components/motion/fade-up";

export default function HomePage() {
  return (
    <>
      {/* HERO — premium treatment */}
      <section className="relative overflow-hidden bg-white border-b border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-4 pb-16 lg:pt-6 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_620px] gap-8 items-center">
            {/* LEFT — taglines + CTAs */}
            <div className="space-y-6">
              <FadeUp delay={0.1}>
                <h1 className="text-display-hero text-black text-balance lg:text-[48px] lg:leading-[1.1] lg:tracking-[-0.8px]">
                  Codebase Knowledge
                  <br />
                  &amp; Intelligence
                  <br />
                </h1>
              </FadeUp>
              <FadeUp delay={0.18}>
                <p className="text-body-large text-[#4e4e4e] max-w-[540px]">
                  AI-native codebase knowledge and intelligence infrastructure — automatically
                  built, synced, and evolved.
                </p>
              </FadeUp>
              <FadeUp delay={0.24}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <PlaygroundButton variant="hero">Open the playground</PlaygroundButton>
                  <a
                    href="#how-you-use-it"
                    className="text-button text-[#4e4e4e] hover:text-black transition-colors inline-flex items-center gap-1.5"
                  >
                    See how you use it <span aria-hidden>↓</span>
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* RIGHT — signature animation */}
            <FadeUp delay={0.32}>
              <ContextTriangleHero />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PRODUCT MAP — 4-verb IA, hybrid carousel-switcher */}
      <section
        id="how-you-use-it"
        className="relative overflow-hidden bg-white border-y border-[rgba(0,0,0,0.04)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-20">
          <FadeUp>
            <div className="max-w-[860px] mx-auto text-center space-y-3 mb-10">
              <p className="text-button-upper text-[#777169]">How You Use It</p>
              <h2 className="text-section-heading text-black">
                Input Sources. Get Knowledge. Ask Chatbot. Generate Artifacts.
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <CapabilityCarousel />
          </FadeUp>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[1440px] px-6 lg:px-10 pb-12">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">
              Knowledge is better when it&apos;s contextual.
            </h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
            Try the playground and experience the full loop: understand the code, surface the signals, ask the questions, and export the results.
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
