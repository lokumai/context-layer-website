"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Command,
  Gauge,
  GitBranch,
  Layers,
  MessageSquare,
  Radio,
  Sparkles,
  Wand2,
  Workflow,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroBackdrop, Waveform } from "@/components/ui/atmosphere";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ShinyText } from "@/components/motion/shiny-text";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";
import { Dot } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <MarketingNav />

      <main className="relative">
        {/* ─────────────────────────── HERO ─────────────────────────── */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
          <HeroBackdrop />

          <div className="relative mx-auto max-w-screen-xl px-6 md:px-10">
            <FadeIn delay={0.1} duration={0.8} className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-1.5 shadow-whisper backdrop-blur-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
                  <Sparkles size={10} strokeWidth={2} />
                </span>
                <span className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  Context Layer · Ecosystem 2026
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.25} duration={1} className="mt-10 text-center">
              <h1 className="font-display mx-auto max-w-[20ch] text-[56px] leading-[1.02] tracking-display text-[var(--color-ink)] md:text-[84px] lg:text-[96px]">
                Persistent context for the{" "}
                <span className="font-editorial">agentic</span>{" "}
                <ShinyText>codebase.</ShinyText>
              </h1>
            </FadeIn>

            <FadeIn delay={0.45} duration={1} className="mt-8 text-center">
              <p className="mx-auto max-w-2xl text-[18px] leading-relaxed text-[var(--color-ink-muted)] md:text-[20px]">
                A versioned, multi-repository knowledge base that reverse-engineers
                the documentation nobody wrote — so your developers and agents can
                reason about the system, not just the files.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} duration={0.9} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/login">
                <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-4 text-[14.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#2a2a2a]">
                  Try the Playground
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                  />
                </MagneticButton>
              </Link>
              <Link href="/product/context-layer">
                <Button variant="white" size="xl">
                  <Layers size={15} strokeWidth={1.6} />
                  Explore Products
                </Button>
              </Link>
            </FadeIn>

            <FadeIn delay={0.8} duration={0.9} className="mt-16 flex flex-wrap items-center justify-center gap-6 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              <span className="flex items-center gap-2"><Dot tone="success" /> Living knowledge</span>
              <span className="h-[1px] w-6 bg-[var(--color-border-strong)]" />
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[var(--color-warm-amber)]" /> Multi-repo native</span>
              <span className="h-[1px] w-6 bg-[var(--color-border-strong)]" />
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[var(--color-ink)]" /> Agent-ready</span>
            </FadeIn>
          </div>
        </section>

        {/* ─────────────── Trust strip: workspace stats ─────────────── */}
        <StatsStrip />

        {/* ─────────────── Product pillars ─────────────── */}
        <section className="relative py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <SectionLabel>Products</SectionLabel>
                <h2 className="font-display mt-5 text-[44px] leading-[1.05] tracking-display text-[var(--color-ink)] md:text-[60px]">
                  One <span className="font-editorial">base</span>. Two premium extensions.
                </h2>
              </div>
              <p className="max-w-md text-[16px] text-[var(--color-ink-muted)]">
                The Context Layer is the foundation — a living, queryable knowledge base. Translation and Modernization are premium add-ons that stand on its shoulders.
              </p>
            </div>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <StaggerChild className="md:col-span-8">
                <ProductCard
                  eyebrow="Base product · Included"
                  title="Context Layer"
                  description="Living, versioned knowledge for single- and multi-repo codebases. Auto-synced with git. Queryable by humans, cited by agents."
                  href="/product/context-layer"
                  icon={Layers}
                  featured
                />
              </StaggerChild>
              <StaggerChild className="md:col-span-4">
                <ProductCard
                  eyebrow="Premium"
                  title="Code Translation"
                  description="Re-implement projects in new languages, grounded in semantic understanding — not pattern matching."
                  href="/product/code-translation"
                  icon={Wand2}
                />
              </StaggerChild>
              <StaggerChild className="md:col-span-12">
                <ProductCard
                  eyebrow="Premium"
                  title="Code Modernization"
                  description="Transform legacy monoliths into modern microservices. The Context Layer keeps the agents honest about what your system actually does."
                  href="/product/code-modernization"
                  icon={Workflow}
                  horizontal
                />
              </StaggerChild>
            </Stagger>
          </div>
        </section>

        {/* ─────────────── Capabilities bento ─────────────── */}
        <section className="relative border-t border-[var(--color-border-subtle)] py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-16 grid gap-8 md:grid-cols-[2fr_3fr] md:gap-16">
              <div>
                <SectionLabel>Inside the playground</SectionLabel>
                <h2 className="font-display mt-5 text-[44px] leading-[1.05] tracking-display text-[var(--color-ink)] md:text-[60px]">
                  A complete instrument for <span className="font-editorial">understanding</span> and <span className="font-editorial">producing</span>.
                </h2>
              </div>
              <div className="flex items-end">
                <p className="text-[17px] leading-relaxed text-[var(--color-ink-muted)]">
                  Two jobs. Always-fresh reference — or frozen, shareable artifacts. The Context Layer splits the mental model cleanly and gives each its own surface.
                </p>
              </div>
            </div>

            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Capability icon={BookOpen} title="Living Wiki" body="Workspace-level summary, per-repo pages, and llms.txt — all auto-synced on commit or PR merge." />
              <Capability icon={Gauge} title="Code Intelligence" body="Health, security, test coverage, dependency dashboards. The data view of your codebase, refreshed after every Wiki sync." />
              <Capability icon={MessageSquare} title="Grounded Chatbot" body="Conversational Q&A over Wiki and source. Every answer cited — pill chips that open the exact line range." />
              <Capability icon={Boxes} title="Sources as truth" body="OAuth integrations for GitHub, Drive, Notion, Slack. Or manual uploads. Markdown conversion under the hood." />
              <Capability icon={Radio} title="OmniBoard" body="Multimodal onboarding. Plan in chat, approve, and let a long job produce a deck, a podcast, or a video." />
              <Capability icon={GitBranch} title="Diff-based audit trail" body="Every Wiki sync is a commit. Every job has git-native change logs. Auditor-friendly versioning by design." />
            </Stagger>
          </div>
        </section>

        {/* ─────────────── Command palette showcase ─────────────── */}
        <section className="relative py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="grid items-center gap-16 md:grid-cols-[1fr_1.1fr]">
              <div>
                <SectionLabel>Always one ⌘K away</SectionLabel>
                <h2 className="font-display mt-5 text-[44px] leading-[1.05] tracking-display md:text-[56px]">
                  Every workspace at the <span className="font-editorial">speed of thought.</span>
                </h2>
                <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
                  Navigate the whole playground with the keyboard. Switch workspaces, jump to the Wiki, run a generation — without reaching for the mouse.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 text-[12px] text-[var(--color-ink-muted)]">
                  <kbd className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 font-mono text-[12px] shadow-whisper">
                    <Command size={11} strokeWidth={1.8} />
                    K
                  </kbd>
                  <span>to open, anywhere</span>
                </div>
              </div>

              <FadeIn delay={0.15}>
                <div className="relative">
                  <div className="absolute inset-0 -z-10 scale-105 rounded-[24px] bg-gradient-to-br from-[rgba(201,165,114,0.22)] to-transparent blur-3xl" />
                  <div className="overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-black/5">
                    <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-5 py-4">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-whisper)]">
                        <span className="h-[1.5px] w-[1.5px] rounded-full bg-current" />
                      </div>
                      <span className="text-[14px] text-[var(--color-ink-whisper)]">Jump to Wiki, switch workspace, run saga…</span>
                      <kbd className="ml-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-ink-muted)]">⌘K</kbd>
                    </div>
                    <div className="p-2">
                      <PaletteItem icon={BookOpen} label="Wiki · Status" hint="microservices-product-catalog" active />
                      <PaletteItem icon={Gauge} label="Intelligence · Health" hint="coverage, tech debt, security" />
                      <PaletteItem icon={MessageSquare} label="Chatbot" hint="3 threads · grounded in all sources" />
                      <PaletteItem icon={Layers} label="Switch · order-service workspace" hint="graduated · synced 2h ago" />
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-5 py-2 text-[11px] text-[var(--color-ink-whisper)]">
                      <span className="flex items-center gap-4">
                        <span className="font-mono">↑↓ navigate</span>
                        <span className="font-mono">↵ open</span>
                      </span>
                      <span className="font-mono uppercase tracking-[0.14em]">Context · Command</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─────────────── Workflow visualization ─────────────── */}
        <section className="relative border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/70 py-28 md:py-40">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <div className="mb-20 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>How it flows</SectionLabel>
                <h2 className="font-display mt-5 text-[44px] leading-[1.05] tracking-display md:text-[56px]">
                  From <span className="font-editorial">source</span> to <span className="font-editorial">artifact.</span>
                </h2>
              </div>
              <p className="max-w-sm text-[15px] text-[var(--color-ink-muted)]">
                Nine repositories become one understanding. One understanding becomes every doc your team, agents, and auditors ever asked for.
              </p>
            </div>

            <div className="relative">
              <Waveform className="mb-12 h-[140px] justify-center" bars={48} />

              <div className="grid gap-10 md:grid-cols-4">
                {[
                  { label: "Sources", body: "OAuth or manual. Markdown conversion under the hood." },
                  { label: "Wiki", body: "Workspace-level · Repo-level · llms.txt — auto-synced." },
                  { label: "Intelligence", body: "Metrics dashboards, refreshed after every sync." },
                  { label: "Artifacts", body: "DocsGen, OmniBoard, MCP — all stored in the Library." },
                ].map((step, i) => (
                  <FadeIn key={step.label} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] font-mono text-[12px] text-white">
                        0{i + 1}
                      </span>
                      <div>
                        <h4 className="font-display text-[22px] leading-tight text-[var(--color-ink)]">{step.label}</h4>
                        <p className="mt-2 text-[14px] text-[var(--color-ink-muted)]">{step.body}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── Final CTA ─────────────── */}
        <section className="relative overflow-hidden py-32 md:py-48">
          <div className="pointer-events-none absolute inset-0 mesh-warm opacity-80" />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
          <div className="relative mx-auto max-w-screen-md px-6 text-center md:px-10">
            <FadeIn>
              <h2 className="font-display text-[44px] leading-[1.05] tracking-display md:text-[64px]">
                Let your codebase <span className="font-editorial">remember.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--color-ink-muted)]">
                Three personas. One mock playground. Zero setup. Explore what a persistent, versioned knowledge base actually feels like.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/login">
                  <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-10 py-4 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.22)] hover:bg-[#2a2a2a]">
                    Enter the Playground
                    <ArrowUpRight size={16} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                  </MagneticButton>
                </Link>
                <Link href="/product/context-layer">
                  <Button variant="outline" size="xl">
                    Learn more
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function ProductCard({
  eyebrow,
  title,
  description,
  href,
  icon: Icon,
  featured = false,
  horizontal = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  featured?: boolean;
  horizontal?: boolean;
}) {
  return (
    <Link href={href} className="group block h-full">
      <SpotlightCard intensity={featured ? "bold" : "medium"} className="relative h-full">
        <Card
          variant={featured ? "outline" : "inset"}
          padding="spacious"
          radius="large"
          interactive
          className={`flex h-full ${horizontal ? "flex-col gap-8 md:flex-row md:items-center md:justify-between" : "flex-col gap-10"}`}
        >
          <div className={`flex ${horizontal ? "md:max-w-xl" : ""} flex-col gap-5`}>
            <div className="flex items-center gap-3">
              <IconTile icon={Icon} size="md" tone={featured ? "ink" : "neutral"} />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                {eyebrow}
              </span>
            </div>
            <h3 className={`font-display tracking-display ${featured ? "text-[42px] md:text-[56px]" : "text-[30px] md:text-[36px]"} leading-[1.05] text-[var(--color-ink)]`}>
              {title}
            </h3>
            <p className={`text-[15px] leading-relaxed text-[var(--color-ink-muted)] ${featured ? "max-w-md" : ""}`}>
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-ink)]">
            <span>Explore</span>
            <ArrowUpRight size={15} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
          </div>
        </Card>
      </SpotlightCard>
    </Link>
  );
}

function Capability({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <StaggerChild>
      <SpotlightCard intensity="soft" className="h-full">
        <Card variant="inset" padding="spacious" radius="large" interactive className="flex h-full flex-col gap-5">
          <IconTile icon={Icon} size="md" />
          <h4 className="font-display text-[24px] leading-[1.1] text-[var(--color-ink)]">{title}</h4>
          <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
        </Card>
      </SpotlightCard>
    </StaggerChild>
  );
}

function PaletteItem({
  icon: Icon,
  label,
  hint,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  active?: boolean;
}) {
  return (
    <div
      className={`mx-2 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] ${
        active ? "bg-black/[0.04]" : ""
      }`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] ${active ? "bg-[var(--color-warm-stone-solid)]" : "bg-white"}`}>
        <Icon size={14} strokeWidth={1.6} />
      </span>
      <span className="font-medium text-[var(--color-ink)]">{label}</span>
      <span className="ml-auto truncate text-[12px] text-[var(--color-ink-whisper)]">{hint}</span>
    </div>
  );
}
