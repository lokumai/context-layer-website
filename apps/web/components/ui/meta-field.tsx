import { cn } from "@/lib/cn";

export function MetaField({
  label,
  value,
  align = "left",
  className,
}: {
  label: string;
  value: string | React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", align === "right" && "items-end text-right", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
        {label}
      </span>
      <span className="text-[13.5px] font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

export function MetaStrip({
  fields,
  trailing,
  className,
}: {
  fields: Array<{ label: string; value: string | React.ReactNode }>;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-6 border-t border-[var(--color-border-subtle)] pt-5",
        className,
      )}
    >
      <div className="flex flex-wrap gap-8">
        {fields.map((f) => (
          <MetaField key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
      {trailing}
    </div>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-[1px] w-8 bg-[var(--color-ink)]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        {children}
      </span>
    </div>
  );
}
