"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Layers } from "lucide-react";

const LINKS = [
  { href: "/product/context-layer", label: "Context Layer" },
  { href: "/product/code-translation", label: "Translation" },
  { href: "/product/code-modernization", label: "Modernization" },
];

export function MarketingNav() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[rgba(247,245,242,0.72)] backdrop-blur-xl backdrop-saturate-150"
    >
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Layers size={15} strokeWidth={1.8} />
          </span>
          <span className="font-display text-[20px] tracking-display text-[var(--color-ink)]">
            Context Layer
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors",
                  active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="marketing-nav-active"
                    className="absolute inset-0 rounded-full bg-black/5"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-[13.5px] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Sign in
          </Link>
          <Link href="/login">
            <Button variant="primary" size="md" className="group">
              Enter Playground
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </Button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
