"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "inset" | "outline" | "float" | "quiet";
type Padding = "none" | "tight" | "comfortable" | "spacious";
type Radius = "card" | "large" | "section";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  radius?: Radius;
  interactive?: boolean;
}

const VARIANT: Record<Variant, string> = {
  inset: "bg-white shadow-inset",
  outline: "bg-white shadow-outline",
  float: "bg-white shadow-float",
  quiet: "bg-[var(--color-surface-elevated)] border border-[var(--color-border)]",
};

const HOVER_VARIANT: Record<Variant, string> = {
  inset: "hover:shadow-card hover:-translate-y-[2px]",
  outline: "hover:shadow-lift hover:-translate-y-[2px]",
  float: "hover:shadow-lift hover:-translate-y-[2px]",
  quiet: "hover:shadow-card hover:-translate-y-[1px] hover:bg-white",
};

const PADDING: Record<Padding, string> = {
  none: "",
  tight: "p-4",
  comfortable: "p-6",
  spacious: "p-8",
};

const RADIUS: Record<Radius, string> = {
  card: "rounded-[16px]",
  large: "rounded-[20px]",
  section: "rounded-[24px]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "inset",
    padding = "comfortable",
    radius = "card",
    interactive = false,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-all duration-500 ease-out will-change-transform",
        VARIANT[variant],
        PADDING[padding],
        RADIUS[radius],
        interactive && HOVER_VARIANT[variant],
        interactive && "cursor-pointer",
        className,
      )}
      {...rest}
    />
  );
});
