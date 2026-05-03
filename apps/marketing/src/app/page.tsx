import { PlaygroundButton } from "@context-layer/ui/components/marketing/chrome/playground-button";
import { AISdlcTriangle } from "@context-layer/ui/components/marketing/ai-sdlc-triangle";
import { BackwardEngineeringWedge } from "@context-layer/ui/components/marketing/backward-engineering-wedge";
import { ContextTriangleHero } from "@context-layer/ui/components/marketing/context-triangle-hero";
import { LandAndExpandStrip } from "@context-layer/ui/components/marketing/land-and-expand-strip";
import { PositioningMatrix } from "@context-layer/ui/components/marketing/positioning-matrix";
import { ProductBento } from "@context-layer/ui/components/marketing/product-bento";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { FadeUp } from "@context-layer/ui/components/motion/fade-up";

export default function HomePage() {
  return (
    <>
      {/* HERO — premium treatment */}
      <section className="relative overflow-hidden bg-white border-b border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-4 pb-16 lg:pt-6 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_620px] gap-12 items-center">
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
            <FadeUp delay={0.32} className="lg:pl-6">
              <ContextTriangleHero />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* BACKWARD ENGINEERING WEDGE */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
        <FadeUp>
          <div className="max-w-[720px] space-y-3 mb-10">
            <p className="text-button-upper text-[#777169]">The Missing Layer</p>
            <h2 className="text-section-heading text-black">
              Everyone else builds forward. We&apos;re the backward-engineering layer.
            </h2>
            <p className="text-body text-[#4e4e4e]">
              Cursor, Claude Code, and Copilot help <em>write</em> code. Context Layer
              reverse-engineers the code that&apos;s already there — so both humans and agents can
              trust what they&apos;re building on.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <BackwardEngineeringWedge />
        </FadeUp>
      </section>

      {/* AI-SDLC TRIANGLE — explainer */}
      <section className="bg-white border-y border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="space-y-4">
                <p className="text-button-upper text-[#777169]">The Communication Triangle</p>
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
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className="flex justify-center">
              <AISdlcTriangle />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PRODUCT MAP — 4-verb IA */}
      <section id="how-you-use-it" className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
        <FadeUp>
          <div className="max-w-[800px] space-y-3 mb-10">
            <p className="text-button-upper text-[#777169]">How You Use It</p>
            <h2 className="text-section-heading text-black">
              Input sources. Sync knowledge. Ask the chatbot. Generate artifacts.
            </h2>
            <p className="text-body text-[#4e4e4e]">
              Four verbs, one substrate. This is how the playground is organized — and how your team
              will think about the product from day one.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <ProductBento />
        </FadeUp>
      </section>

      {/* MARKET POSITIONING */}
      <section className="bg-white border-y border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
          <FadeUp>
            <div className="max-w-[720px] space-y-3 mb-10">
              <p className="text-button-upper text-[#777169]">Where We Sit</p>
              <h2 className="text-section-heading text-black">
                Vertical, not horizontal. Backward, not forward.
              </h2>
              <p className="text-body text-[#4e4e4e]">
                Agent-memory tools (Cognee, Mem0, Hindsight) are horizontal plumbing. Coding
                assistants are forward engineering. Context Layer is the codebase-domain-specific,
                backward-engineering layer that makes both more useful.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <PositioningMatrix />
          </FadeUp>
        </div>
      </section>

      {/* LAND AND EXPAND */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
        <FadeUp>
          <div className="max-w-[720px] space-y-3 mb-10">
            <p className="text-button-upper text-[#777169]">Sales Strategy</p>
            <h2 className="text-section-heading text-black">
              Start with context. Expand into transformation.
            </h2>
            <p className="text-body text-[#4e4e4e]">
              Land the base product first. Once your codebase is context-aware, the premium
              workflows — translation, modernization — sit on top with zero architectural surprise.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <LandAndExpandStrip />
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="mt-8 flex">
            <a
              href="mailto:hello@context-layer.dev"
              className="inline-flex items-center gap-2 text-button text-black border-b border-black/40 hover:border-black transition-colors pb-0.5"
            >
              Talk to us <span aria-hidden>→</span>
            </a>
          </div>
        </FadeUp>
      </section>

      {/* CLOSING CTA */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 pb-24">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">
              Knowledge is better when it&apos;s contextual.
            </h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              The playground ships pre-loaded with a 9-repo TMForum catalog. Pick a persona and
              explore the Wiki, Intelligence, Chatbot, and DocsGen end-to-end.
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
