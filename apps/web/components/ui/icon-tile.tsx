import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg" | "xl";
type Tone = "neutral" | "ink" | "warm" | "ghost";

const SIZE: Record<Size, { box: string; icon: number }> = {
  sm: { box: "h-9 w-9 rounded-[10px]", icon: 16 },
  md: { box: "h-11 w-11 rounded-[12px]", icon: 20 },
  lg: { box: "h-14 w-14 rounded-[14px]", icon: 24 },
  xl: { box: "h-16 w-16 rounded-[16px]", icon: 28 },
};

const TONE: Record<Tone, string> = {
  neutral: "bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  warm: "bg-[var(--color-warm-stone)] text-[var(--color-ink)] shadow-warm",
  ghost: "bg-transparent text-[var(--color-ink-muted)]",
};

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  const s = SIZE[size];
  return (
    <div className={cn("flex items-center justify-center", s.box, TONE[tone], className)}>
      <Icon size={s.icon} strokeWidth={1.5} />
    </div>
  );
}
