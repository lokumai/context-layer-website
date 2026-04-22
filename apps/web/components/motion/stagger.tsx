"use client";

import { motion, type Variants } from "motion/react";
import type { PropsWithChildren, ReactNode } from "react";

interface StaggerProps {
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
  as?: "div" | "ul" | "section";
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { delayChildren: number; staggerChildren: number }) => ({
    transition: {
      delayChildren: custom.delayChildren,
      staggerChildren: custom.staggerChildren,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
  delayChildren = 0.1,
  staggerChildren = 0.08,
  once = true,
  as = "div",
}: PropsWithChildren<StaggerProps>) {
  const MotionEl = motion[as] as typeof motion.div;
  return (
    <MotionEl
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      custom={{ delayChildren, staggerChildren }}
    >
      {children}
    </MotionEl>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: PropsWithChildren<{ className?: string; as?: "div" | "li" }>) {
  const MotionEl = motion[as] as typeof motion.div;
  return (
    <MotionEl className={className} variants={itemVariants}>
      {children}
    </MotionEl>
  );
}

export function StaggerChild({
  children,
  className,
  as = "div",
}: PropsWithChildren<{ className?: string; as?: "div" | "li" }>) {
  return (
    <StaggerItem className={className} as={as}>
      {children}
    </StaggerItem>
  );
}
