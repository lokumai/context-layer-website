"use client";

import { Wand2, ArrowRight, Code2, Languages, FileCheck } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { ProductHero } from "@/components/marketing/product-hero";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

export default function CodeTranslationPage() {
  return (
    <>
      <MarketingNav />
      <main className="relative">
        <ProductHero
          eyebrow="Premium · Built on Context Layer"
          icon={Wand2}
          title="Re-implement,"
          accent="don't rewrite."
          description="Semantic translation between programming languages, grounded in the Wiki. Not pattern matching — structural understanding. Python → TypeScript → Rust, with tests that compile and intent that survives."
        />

        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-16 max-w-2xl">
              <SectionLabel>How translation works</SectionLabel>
              <h2 className="font-display mt-5 text-[42px] leading-[1.05] tracking-display md:text-[52px]">
                Three passes. One <span className="font-editorial">faithful</span> port.
              </h2>
            </div>

            <Stagger className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Understand",
                  body: "The Context Wiki gives the translator the system, not the files. It knows what every module does, what invariants it enforces, and what the test suite is really checking.",
                  icon: Code2,
                },
                {
                  step: "02",
                  title: "Translate",
                  body: "Idiomatic code in the target language — not a line-by-line port. Async semantics adapted. Error models re-expressed. Types that fit the new host.",
                  icon: Languages,
                },
                {
                  step: "03",
                  title: "Verify",
                  body: "Property tests. Differential runs. Spec conformance. You get a diff between original and translated semantics, not a hopeful pull request.",
                  icon: FileCheck,
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
                        <h4 className="font-display text-[28px] leading-[1.08] text-[var(--color-ink)]">{s.title}</h4>
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
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <Card variant="outline" padding="spacious" radius="section" className="overflow-hidden">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                    Case pattern
                  </span>
                  <h3 className="font-display mt-4 text-[36px] leading-[1.05] tracking-display md:text-[44px]">
                    FastAPI (Python) → Actix (Rust)
                  </h3>
                  <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
                    Migration of a TMForum catalog service. Transactional outbox behavior preserved. Async semantics adapted to Tokio. 94% of the test suite passed on first run; the remaining 6% surfaced real semantic drift the Wiki had already flagged as risky.
                  </p>
                </div>
                <div className="rounded-[16px] bg-[var(--color-ink)] p-8 text-[13px] font-mono leading-relaxed text-white/80 shadow-lift">
                  <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    <ArrowRight size={11} /> Preserved invariants
                  </div>
                  <div>• transactional-outbox</div>
                  <div>• event ordering (kafka-keyed)</div>
                  <div>• tmf620 payload schema</div>
                  <div>• saga compensations</div>
                  <div className="mt-5 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Surfaced divergences
                  </div>
                  <div>• timezone handling (datetime naive → chrono::DateTime)</div>
                  <div>• floating point rounding (Python banker's → f64)</div>
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
