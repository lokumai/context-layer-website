"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  BookOpen,
  Gauge,
  History,
  LayoutTemplate,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface WikiItem {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const ITEMS: WikiItem[] = [
  { href: "", label: "Status", hint: "Coverage & health", icon: Gauge },
  { href: "/view", label: "View", hint: "Read the pages", icon: BookOpen },
  { href: "/configure", label: "Configure", hint: "Sync strategy", icon: SlidersHorizontal },
  { href: "/logs", label: "Logs", hint: "Job timeline", icon: History },
];

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const base = `/play/${workspaceId}/knowledge/wiki`;

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <aside className="relative hidden w-72 shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 p-6 md:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white">
            <LayoutTemplate size={15} strokeWidth={1.8} />
          </span>
          <div>
            <div className="font-display text-[18px] leading-tight">Wiki</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
              Living knowledge
            </div>
          </div>
        </div>

        <div className="my-6 divider-fade" />

        <nav className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const href = `${base}${item.href}`;
            const active = pathname === href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 transition-colors",
                  active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="wiki-side-active"
                    className="absolute inset-0 rounded-[12px] bg-white shadow-whisper"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <Icon size={14} strokeWidth={1.7} className="relative z-[1]" />
                <div className="relative z-[1] flex flex-col">
                  <span className="text-[13.5px] font-medium leading-none">{item.label}</span>
                  <span className="mt-0.5 text-[10.5px] text-[var(--color-ink-whisper)]">{item.hint}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[12px] border border-[var(--color-border)] bg-white p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
            Tip
          </div>
          <p className="mt-1 text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
            Every Wiki sync is a git commit. Browse every change in <span className="font-medium text-[var(--color-ink)]">Logs</span>.
          </p>
        </div>
      </aside>

      <div className="relative flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
