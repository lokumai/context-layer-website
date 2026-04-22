"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "warm" | "white" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  uppercase?: boolean;
  loading?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out " +
  "disabled:opacity-40 disabled:pointer-events-none will-change-transform relative overflow-hidden " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(138,90,43,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,rgba(0,0,0,0.3)_0_6px_16px] " +
    "hover:bg-[#2a2a2a] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,rgba(0,0,0,0.4)_0_10px_24px] hover:-translate-y-[1px] " +
    "active:translate-y-0",
  warm:
    "bg-[var(--color-warm-stone)] text-[var(--color-ink)] shadow-warm " +
    "hover:shadow-warm-lift hover:-translate-y-[2px] active:translate-y-0",
  white:
    "bg-white text-[var(--color-ink)] shadow-card hover:shadow-lift hover:-translate-y-[1px] active:translate-y-0",
  outline:
    "bg-transparent text-[var(--color-ink)] border border-[rgba(0,0,0,0.12)] hover:border-[var(--color-ink)] hover:bg-white/50",
  ghost: "bg-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04]",
  link:
    "!rounded-none !p-0 text-[var(--color-ink)] underline underline-offset-[6px] decoration-[rgba(0,0,0,0.2)] hover:decoration-[var(--color-ink)]",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-1.5 text-[13px]",
  md: "px-5 py-2 text-[14px]",
  lg: "px-7 py-3 text-[14px]",
  xl: "px-10 py-4 text-[15px]",
};

const UPPERCASE = "font-display-bold uppercase tracking-[0.7px]";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "lg", uppercase = false, loading = false, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(BASE, VARIANT[variant], SIZE[size], uppercase && UPPERCASE, className)}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent opacity-60" />
      )}
      {children}
    </button>
  );
});
