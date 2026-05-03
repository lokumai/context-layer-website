import Link from "next/link";
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
    "inline-flex items-center gap-2 bg-black text-white text-nav rounded-pill px-4 py-2 transition-opacity hover:opacity-90",
  hero:
    "inline-flex items-center gap-2 bg-black text-white text-nav rounded-pill px-5 py-2.5 transition-opacity hover:opacity-90",
  compact:
    "inline-flex items-center gap-2 bg-black text-white text-small rounded-pill px-4 py-1.5 transition-opacity hover:opacity-90",
};

export function PlaygroundButton({
  children = "Playground",
  variant = "default",
  className = "",
  href = process.env.NEXT_PUBLIC_PLAYGROUND_URL || "/workspaces",
}: PlaygroundButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  // External links (mailto, http) use a plain <a>; internal paths use Next.js Link for basePath support
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} data-testid="playground-button">
        <span>{children}</span>
        <span aria-hidden>→</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} data-testid="playground-button">
      <span>{children}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}
