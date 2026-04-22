"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { AnimatedNumber } from "@/components/motion/animated-number";

const STATS = [
  { label: "Repos indexed", value: 9, suffix: "", decimals: 0 },
  { label: "Lines understood", value: 14220, suffix: "", decimals: 0 },
  { label: "Wiki layers", value: 3, suffix: "", decimals: 0 },
  { label: "Tokens cached", value: 1.2, suffix: "M", decimals: 1 },
];

export function StatsStrip() {
  return (
    <section className="relative border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60">
      <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-px bg-[var(--color-border-subtle)] md:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeIn
            key={s.label}
            delay={0.1 * i}
            className="flex flex-col gap-3 bg-[var(--color-surface-elevated)] px-6 py-10 md:px-10"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
              {s.label}
            </span>
            <span className="font-display text-[46px] tracking-display text-[var(--color-ink)]">
              <AnimatedNumber
                value={s.value}
                format={(v) => v.toFixed(s.decimals)}
              />
              <span className="text-[var(--color-ink-muted)]">{s.suffix}</span>
            </span>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
