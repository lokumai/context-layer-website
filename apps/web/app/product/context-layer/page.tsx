"use client";

import { BookOpen, Boxes, GitBranch, Layers, MessageSquare, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { ProductHero } from "@/components/marketing/product-hero";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";
import { Waveform } from "@/components/ui/atmosphere";

export default function ContextLayerProductPage() {
  return (
    <>
      <MarketingNav />
      <main className="relative">
        <ProductHero
          eyebrow="Base product · Included in every workspace"
          icon={Layers}
          title="Context Layer."
          accent="A living knowledge base."
          description="A persistent, versioned, multi-repository knowledge base that reverse-engineers the documentation nobody wrote. Query it as a human. Cite it as an agent. Audit it as a team."
        />

        {/* Feature bento */}
        <section className="relative border-t border-[var(--color-border-subtle)] py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-16 grid gap-8 md:grid-cols-[2fr_3fr] md:gap-16">
              <div>
                <SectionLabel>What's inside</SectionLabel>
                <h2 className="font-display mt-5 text-[42px] leading-[1.05] tracking-display md:text-[56px]">
                  Five pipelines, <span className="font-editorial">one</span> source of truth.
                </h2>
              </div>
              <p className="flex items-end text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
                The Context Layer is not a single artifact. It's a pipeline network that fans out from one indexed truth — your sources — into every surface your team, your agents, and your auditors ever ask for.
              </p>
            </div>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-6">
              <StaggerChild className="md:col-span-4">
                <FeatureCard
                  icon={BookOpen}
                  title="Living Wiki"
                  body="A three-layer narrative: workspace summary, per-repo deep pages, and llms.txt. Auto-synced on every commit or PR merge. Every change is a git commit — audit-ready by design."
                  featured
                />
              </StaggerChild>
              <StaggerChild className="md:col-span-2">
                <FeatureCard icon={Boxes} title="Sources" body="GitHub, Drive, Notion, Slack. OAuth or manual." />
              </StaggerChild>
              <StaggerChild className="md:col-span-2">
                <FeatureCard icon={MessageSquare} title="Grounded chat" body="Answers with citations. Clickable." />
              </StaggerChild>
              <StaggerChild className="md:col-span-4">
                <FeatureCard
                  icon={Radio}
                  title="OmniBoard"
                  body="Multimodal onboarding. Plan with a chatbot, approve the outline, and receive slides, a podcast, or a two-host video walkthrough. NotebookLM, but for your system."
                  featured
                />
              </StaggerChild>
              <StaggerChild className="md:col-span-3">
                <FeatureCard icon={Sparkles} title="DocsGen" body="Six artifact bundles. Static, signable, shareable — drop them in a PR, email them to stakeholders." />
              </StaggerChild>
              <StaggerChild className="md:col-span-3">
                <FeatureCard icon={GitBranch} title="Version history" body="Wiki stored as markdown in git. Every sync is a commit with agent rationale logs. An auditor's dream." />
              </StaggerChild>
            </Stagger>
          </div>
        </section>

        {/* Editorial waveform block */}
        <section className="relative overflow-hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="grid items-center gap-16 md:grid-cols-[1.1fr_1fr]">
              <FadeIn>
                <Waveform className="h-[200px]" bars={60} />
              </FadeIn>
              <div>
                <SectionLabel>Multi-repo native</SectionLabel>
                <h3 className="font-display mt-5 text-[40px] leading-[1.05] tracking-display md:text-[52px]">
                  See the <span className="font-editorial">bones</span> of your system.
                </h3>
                <p className="mt-6 text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
                  Cross-repo saga flows. End-to-end data paths that span four services. Dependency maps that go from framework down to the shared library. Things single-repo tools can't show you — because they can't see across boundaries.
                </p>

                <div className="mt-8 flex items-center gap-6 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                    Live sync
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-warm-amber)]" />
                    9 repos connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security strip */}
        <section className="relative py-28 md:py-32">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <Card variant="outline" padding="spacious" radius="section" className="overflow-hidden">
              <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
                <IconTile icon={ShieldCheck} size="xl" tone="warm" />
                <div>
                  <SectionLabel>Deployment</SectionLabel>
                  <h3 className="font-display mt-4 text-[36px] leading-[1.05] tracking-display md:text-[44px]">
                    On your infrastructure — or ours.
                  </h3>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
                    Cloud for speed. On-premise for compliance. Air-gapped for the most sensitive codebases. The hierarchy of integrations flips to match the environment — OAuth connectors become the primary path in cloud, manual imports become the primary path on-prem.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  featured = false,
}: {
  icon: typeof Layers;
  title: string;
  body: string;
  featured?: boolean;
}) {
  return (
    <SpotlightCard intensity={featured ? "medium" : "soft"} className="h-full">
      <Card variant="inset" padding="spacious" radius="large" interactive className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between">
          <IconTile icon={Icon} size="md" tone={featured ? "ink" : "neutral"} />
          {featured && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">Signature</span>
          )}
        </div>
        <div>
          <h4 className="font-display text-[28px] leading-[1.08] text-[var(--color-ink)]">{title}</h4>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
        </div>
      </Card>
    </SpotlightCard>
  );
}
