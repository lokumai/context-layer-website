"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: "soft" | "medium" | "bold";
}

const INTENSITY = {
  soft: "rgba(201, 165, 114, 0.08)",
  medium: "rgba(201, 165, 114, 0.14)",
  bold: "rgba(201, 165, 114, 0.22)",
};

export function SpotlightCard({
  children,
  className,
  intensity = "medium",
  ...rest
}: PropsWithChildren<SpotlightCardProps>) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn("group relative overflow-hidden", className)}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), ${INTENSITY[intensity]}, transparent 45%)`,
        }}
      />
      {children}
    </div>
  );
}
