"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface GlowPulseProps {
  children: ReactNode;
  className?: string;
  tint?: "warm" | "cool";
}

export function GlowPulse({ children, className, tint = "warm" }: GlowPulseProps) {
  const reduceMotion = useReducedMotion();
  const glow =
    tint === "warm"
      ? "radial-gradient(circle at center, rgba(78,50,23,0.22), rgba(78,50,23,0) 70%)"
      : "radial-gradient(circle at center, rgba(147,197,253,0.25), rgba(147,197,253,0) 70%)";

  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      <motion.span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[inherit]"
        style={{ background: glow, filter: "blur(10px)" }}
        animate={reduceMotion ? {} : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {children}
    </span>
  );
}
