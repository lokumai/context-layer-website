"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  type = "button",
  disabled = false,
  title,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, { stiffness: 280, damping: 18, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 280, damping: 18, mass: 0.6 });

  const tx = useTransform(springX, (v) => `${v * strength}px`);
  const ty = useTransform(springY, (v) => `${v * strength}px`);

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mx.set(x);
    my.set(y);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      title={title}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: tx, y: ty }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.button>
  );
}
