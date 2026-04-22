"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  withViewport?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.9,
  once = true,
  withViewport = true,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(withViewport
        ? { whileInView: "visible", viewport: { once, amount: 0.2 } }
        : { animate: "visible" })}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
