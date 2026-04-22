"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString();

export function AnimatedNumber({
  value,
  format = defaultFormat,
  duration: _duration = 1.2,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20, mass: 1 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    return unsub;
  }, [spring, format]);

  return (
    <motion.span ref={ref} className={className}>
      {format(0)}
    </motion.span>
  );
}
