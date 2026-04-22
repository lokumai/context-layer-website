import { cn } from "@/lib/cn";

type Tone = "success" | "warn" | "danger" | "info" | "neutral" | "ink" | "warm";

const TONE: Record<Tone, string> = {
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warn: "bg-[var(--color-warn-bg)] text-[var(--color-warn-fg)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info-fg)]",
  neutral: "bg-black/5 text-[var(--color-ink-muted)]",
  ink: "bg-[var(--color-ink)] text-white",
  warm: "bg-[var(--color-warm-stone)] text-[var(--color-ink)] border border-black/5",
};

export function Badge({
  tone = "neutral",
  uppercase = true,
  children,
  className,
}: {
  tone?: Tone;
  uppercase?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.08em]",
        uppercase && "uppercase",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "success", className }: { tone?: "success" | "warn" | "danger" | "neutral"; className?: string }) {
  const bg =
    tone === "success" ? "bg-emerald-500"
    : tone === "warn" ? "bg-amber-500"
    : tone === "danger" ? "bg-red-500"
    : "bg-neutral-400";
  return <span className={cn("relative inline-block h-2 w-2 rounded-full", bg, "pulse-dot", className)} />;
}
