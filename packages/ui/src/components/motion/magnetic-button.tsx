"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  href?: string;
}

export function MagneticButton({ children, strength = 18, className, href }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18 });

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rawX.set(dx * strength);
    rawY.set(dy * strength);
  }
  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        style={{ x, y }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
