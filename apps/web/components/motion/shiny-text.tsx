"use client";

import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

export function ShinyText({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  return (
    <motion.span
      initial={{ backgroundPosition: "200% center" }}
      animate={{ backgroundPosition: "-200% center" }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #1a1a1a 0%, #1a1a1a 35%, #8a5a2b 50%, #c9a572 55%, #1a1a1a 65%, #1a1a1a 100%)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.span>
  );
}
