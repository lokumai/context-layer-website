"use client";

import { motion } from "motion/react";
import type { DocsGenBundle } from "@context-layer/mocks";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FlaskConical,
  History,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface BundleDef {
  id: DocsGenBundle;
  label: string;
  tagline: string;
  icon: LucideIcon;
}

export const BUNDLES: BundleDef[] = [
  { id: "structure", label: "Structure", tagline: "System bones", icon: Layers },
  { id: "spec", label: "Specification", tagline: "The specs nobody wrote", icon: BookOpen },
  { id: "health", label: "Health", tagline: "Debt, security, tests", icon: ShieldCheck },
  { id: "agentify", label: "Agentify", tagline: "Agent-ready context", icon: Sparkles },
  { id: "memory", label: "Memory", tagline: "Changelog & RFCs", icon: History },
  { id: "research", label: "Research", tagline: "Papers ↔ production", icon: FlaskConical },
];

export function BundleTabs({
  active,
  onChange,
}: {
  active: DocsGenBundle;
  onChange: (b: DocsGenBundle) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-full border border-[var(--color-border)] bg-white/60 p-1.5 shadow-inset">
      {BUNDLES.map((b) => {
        const isActive = active === b.id;
        const Icon = b.icon;
        return (
          <button
            key={b.id}
            onClick={() => onChange(b.id)}
            className={cn(
              "group relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors whitespace-nowrap",
              isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="docsgen-active-tab"
                className="absolute inset-0 rounded-full bg-[var(--color-warm-stone)] shadow-warm"
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              />
            )}
            <Icon size={13} strokeWidth={1.6} className="relative z-[1]" />
            <span className="relative z-[1]">{b.label}</span>
          </button>
        );
      })}
    </div>
  );
}
