"use client";

import { Workflow, GitMerge, Scissors, Zap } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { ProductHero } from "@/components/marketing/product-hero";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

export default function CodeModernizationPage() {
  return (
    <>
      <MarketingNav />
      <main className="relative">
        <ProductHero
          eyebrow="Premium · Built on Context Layer"
          icon={Workflow}
          title="Modernize,"
          accent="the slow, safe way."
          description="Monolith to microservices. Framework jumps. Major version migrations. The Context Layer keeps agents honest about what your system actually does — so modernization becomes an incremental, verifiable journey instead of a leap of faith."
        />

        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-16 grid gap-8 md:grid-cols-[2fr_3fr] md:gap-16">
              <div>
                <SectionLabel>Modernization stages</SectionLabel>
                <h2 className="font-display mt-5 text-[42px] leading-[1.05] tracking-display md:text-[52px]">
                  Incremental by <span className="font-editorial">design.</span>
                </h2>
              </div>
              <p className="flex items-end text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
                Every modernization is a long campaign. The Wiki is the map, the Intelligence dashboards are the compass, and the agents are the engineers doing the work — always leaving the system in a runnable state.
              </p>
            </div>

            <Stagger className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "Map",
                  title: "Bounded-context discovery",
                  body: "The Context Wiki surfaces logical boundaries the code didn't announce. Domain events, aggregates, transaction boundaries — all cross-referenced with the live codebase.",
                  icon: GitMerge,
                },
                {
                  step: "Cut",
                  title: "Extraction plan",
                  body: "The agents propose seam-by-seam decomposition plans. Each is reviewable, versioned, and produces a strangler-fig path that keeps the monolith usable throughout.",
                  icon: Scissors,
                },
                {
                  step: "Ship",
                  title: "Progressive migration",
                  body: "One service at a time. Traffic mirroring to validate parity. Contract tests generated from the Wiki's API catalog. Rollback-safe at every step.",
                  icon: Zap,
                },
              ].map((s) => (
                <StaggerChild key={s.step}>
                  <SpotlightCard intensity="soft" className="h-full">
                    <Card variant="inset" padding="spacious" radius="large" interactive className="flex h-full flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <IconTile icon={s.icon} size="md" />
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                          {s.step}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display text-[26px] leading-[1.1] text-[var(--color-ink)]">{s.title}</h4>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-ink-muted)]">{s.body}</p>
                      </div>
                    </Card>
                  </SpotlightCard>
                </StaggerChild>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="relative border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 py-24 md:py-32">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10 text-center">
            <SectionLabel className="mx-auto justify-center">A long campaign, always runnable</SectionLabel>
            <h3 className="font-display mx-auto mt-6 max-w-3xl text-[40px] leading-[1.05] tracking-display md:text-[56px]">
              Leave the system <span className="font-editorial">working</span> at every commit.
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
              Modernization that holds production stable is not a feature — it is the feature. The Context Layer makes that possible because the agents never lose the thread of what "working" means in your system.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
