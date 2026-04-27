// Shared motion primitives for the playground. Per AI Design Report §2.1
// ("Context Spring") — every interactive surface moves with the same
// physics so the UI feels coherent and "magnetic" rather than ad-hoc.
//
// Usage with motion/react:
//   <motion.div animate={{ scale: 1 }} transition={CONTEXT_SPRING} />
//   <motion.span layoutId="x" transition={LAYOUT_SPRING} />

import type { Transition } from "motion/react";

/** Page ingress, modal pop-ins, card hover scales — the canonical "snap with a settle". */
export const CONTEXT_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/** Faster, tighter spring for quick micro-interactions (hover lifts, button taps). */
export const MICRO_SPRING: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 1,
};

/** Default for `motion.layout` / `layoutId` shared-element warps. Same as CONTEXT_SPRING. */
export const LAYOUT_SPRING: Transition = CONTEXT_SPRING;

/** Stagger interval (ms) for list ingress; pairs naturally with CONTEXT_SPRING. */
export const STAGGER_MS = 30;

/** Convert STAGGER_MS to motion's seconds-based delay. */
export const staggerDelay = (index: number): number => (index * STAGGER_MS) / 1000;
