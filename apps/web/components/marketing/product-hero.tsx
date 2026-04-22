"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { HeroBackdrop } from "@/components/ui/atmosphere";
import { IconTile } from "@/components/ui/icon-tile";

interface ProductHeroProps {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  accent?: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function ProductHero({
  eyebrow,
  icon: Icon,
  title,
  accent,
  description,
  primaryLabel = "Try the Playground",
  primaryHref = "/login",
  secondaryLabel = "Back to overview",
  secondaryHref = "/",
}: ProductHeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      <HeroBackdrop />
      <div className="relative mx-auto max-w-screen-xl px-6 md:px-10">
        <FadeIn delay={0.1} className="flex flex-col items-start gap-8">
          <div className="flex items-center gap-4">
            <IconTile icon={Icon} size="lg" tone="ink" />
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-whisper)]">
                {eyebrow}
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25} duration={1.1}>
          <h1 className="font-display mt-10 max-w-[18ch] text-[56px] leading-[1.02] tracking-display text-[var(--color-ink)] md:text-[96px]">
            {title}{" "}
            {accent && <span className="font-editorial">{accent}</span>}
          </h1>
        </FadeIn>

        <FadeIn delay={0.45} className="mt-8 max-w-2xl">
          <p className="text-[18px] leading-relaxed text-[var(--color-ink-muted)] md:text-[20px]">
            {description}
          </p>
        </FadeIn>

        <FadeIn delay={0.6} className="mt-10 flex flex-wrap items-center gap-3">
          <Link href={primaryHref}>
            <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_28px_rgba(0,0,0,0.18)] hover:bg-[#2a2a2a]">
              {primaryLabel}
              <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
            </MagneticButton>
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-7 py-3.5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:bg-white"
          >
            {secondaryLabel}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
