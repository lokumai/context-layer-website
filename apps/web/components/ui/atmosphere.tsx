"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * HeroBackdrop — ambient atmospheric layer for landing hero sections.
 * Combines a gradient mesh, floating conic orbs, grain, and a radial vignette.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Base warm mesh */}
      <div className="absolute inset-0 mesh-warm" />

      {/* Orb A — warm amber */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-32 top-10 h-[520px] w-[520px] rounded-full blur-[100px] drift-a"
        style={{
          background:
            "radial-gradient(circle, rgba(201,165,114,0.55) 0%, rgba(201,165,114,0) 60%)",
        }}
      />

      {/* Orb B — pale stone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-20 top-40 h-[640px] w-[640px] rounded-full blur-[120px] drift-b"
        style={{
          background:
            "radial-gradient(circle, rgba(232,211,176,0.5) 0%, rgba(232,211,176,0) 65%)",
        }}
      />

      {/* Orb C — deep shadow bloom (bottom) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[-10%] left-[30%] h-[400px] w-[500px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(138,90,43,0.16) 0%, rgba(138,90,43,0) 65%)",
        }}
      />

      {/* Fine grid pattern (subtle technical feel) */}
      <div className="absolute inset-0 opacity-[0.35] grid-pattern" />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top fade to blend with navbar */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-background)] to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
    </div>
  );
}

/**
 * Waveform — editorial audio-style vertical bars, used for visual accent.
 */
export function Waveform({ className, bars = 40 }: { className?: string; bars?: number }) {
  return (
    <div className={cn("flex items-end gap-[3px]", className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 18 + Math.abs(Math.sin(i * 0.6) * 46) + (i % 5 === 0 ? 24 : 0);
        const tone = i % 3 === 0 ? "bg-[var(--color-ink)]" : i % 3 === 1 ? "bg-[var(--color-ink)]/35" : "bg-[var(--color-warm-amber)]/70";
        return (
          <motion.span
            key={i}
            initial={{ height: 4, opacity: 0 }}
            whileInView={{ height: h, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.9,
              delay: i * 0.015,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("w-[3px] rounded-full", tone)}
            style={{ height: 4 }}
          />
        );
      })}
    </div>
  );
}

/**
 * GrainLayer — standalone grain overlay you can drop onto any section.
 */
export function GrainLayer({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/**
 * DottedCanvas — a panel with the technical dots backdrop. For data-viz containers.
 */
export function DottedCanvas({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]",
        className,
      )}
    >
      <div className="absolute inset-0 dots-pattern opacity-60" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
