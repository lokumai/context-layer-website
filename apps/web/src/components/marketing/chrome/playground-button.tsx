import type { ReactNode } from "react";

type Variant = "default" | "hero" | "compact";

interface PlaygroundButtonProps {
  children?: ReactNode;
  variant?: Variant;
  className?: string;
  href?: string;
}

const variantClass: Record<Variant, string> = {
  default:
    "inline-flex items-center gap-2 bg-black text-white text-button rounded-pill px-6 py-2.5 transition-opacity hover:opacity-90",
  hero:
    "inline-flex items-center gap-2 text-button rounded-warm-btn px-7 py-3 transition-transform hover:scale-[1.02] bg-[rgba(245,242,239,0.8)] text-black shadow-[var(--shadow-warm)]",
  compact:
    "inline-flex items-center gap-2 bg-black text-white text-small rounded-pill px-4 py-1.5 transition-opacity hover:opacity-90",
};

export function PlaygroundButton({
  children = "Playground",
  variant = "default",
  className = "",
  href = "/login",
}: PlaygroundButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();
  return (
    <a href={href} className={classes} data-testid="playground-button">
      <span>{children}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
