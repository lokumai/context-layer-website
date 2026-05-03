import type { ReactNode } from "react";

export type StatusTone = "indexed" | "info" | "warn" | "error" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  indexed: "bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]",
  info: "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)]",
  warn: "bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)]",
  error: "bg-[var(--color-accent-red-bg)] text-[var(--color-accent-red-fg)]",
  neutral: "bg-[var(--color-accent-neutral-bg)] text-[var(--color-accent-neutral-fg)]",
};

export function StatusPill({
  tone = "neutral",
  children,
  dot = false,
  className = "",
}: {
  tone?: StatusTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-[2px] rounded-pill text-[10px] uppercase tracking-[0.08em] font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot ? <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" /> : null}
      {children}
    </span>
  );
}

export function AccentDot({
  tone = "neutral",
  className = "",
}: {
  tone?: StatusTone;
  className?: string;
}) {
  const color: Record<StatusTone, string> = {
    indexed: "#10b981",
    info: "#3b82f6",
    warn: "#b45309",
    error: "#b91c1c",
    neutral: "#9ca3af",
  };
  return (
    <span
      aria-hidden
      className={`inline-block w-2 h-2 rounded-full ${className}`}
      style={{ backgroundColor: color[tone] }}
    />
  );
}
