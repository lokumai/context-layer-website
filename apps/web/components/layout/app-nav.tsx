"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Boxes,
  Command,
  Gauge,
  Layers,
  Library,
  LogOut,
  MessageSquare,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { usePlaygroundStore } from "@/store/playground-store";
import { Dot } from "@/components/ui/badge";

interface NavItem {
  href: (id: string) => string;
  match: (id: string, pathname: string) => boolean;
  label: string;
  icon: LucideIcon;
  lock: "always" | "wiki";
}

const NAV_ITEMS: NavItem[] = [
  {
    href: (id) => `/play/${id}/sources`,
    match: (id, p) => p?.includes(`/play/${id}/sources`) ?? false,
    label: "Sources",
    icon: Boxes,
    lock: "always",
  },
  {
    href: (id) => `/play/${id}/knowledge/wiki`,
    match: (id, p) => p?.includes(`/play/${id}/knowledge/wiki`) ?? false,
    label: "Wiki",
    icon: BookOpen,
    lock: "wiki",
  },
  {
    href: (id) => `/play/${id}/knowledge/intelligence`,
    match: (id, p) => p?.includes(`/play/${id}/knowledge/intelligence`) ?? false,
    label: "Intelligence",
    icon: Gauge,
    lock: "wiki",
  },
  {
    href: (id) => `/play/${id}/chatbot`,
    match: (id, p) => p?.includes(`/play/${id}/chatbot`) ?? false,
    label: "Chatbot",
    icon: MessageSquare,
    lock: "wiki",
  },
  {
    href: (id) => `/play/${id}/generate/docsgen`,
    match: (id, p) => p?.includes(`/play/${id}/generate`) ?? false,
    label: "Generate",
    icon: Sparkles,
    lock: "wiki",
  },
  {
    href: (id) => `/play/${id}/library`,
    match: (id, p) => p?.includes(`/play/${id}/library`) ?? false,
    label: "Library",
    icon: Library,
    lock: "wiki",
  },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const activeWorkspaceId = usePlaygroundStore((s) => s.activeWorkspaceId);
  const syncStatus = usePlaygroundStore((s) => s.syncStatus);
  const persona = usePlaygroundStore((s) => s.persona);
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const resetActiveWorkspace = usePlaygroundStore((s) => s.resetActiveWorkspace);
  const resetAll = usePlaygroundStore((s) => s.__resetAll);

  const active = workspaces.find((w) => w.workspace.id === activeWorkspaceId);
  const hasWiki = !!active?.wikiSummary;

  async function handleSignOut() {
    localStorage.removeItem("playground");
    resetAll();
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[rgba(247,245,242,0.72)] backdrop-blur-xl backdrop-saturate-150"
    >
      <nav className="mx-auto flex max-w-screen-2xl items-center gap-4 px-6 py-3 md:px-10">
        {/* Left: Logo + workspace pill */}
        <div className="flex items-center gap-5">
          <Link href="/play/workspaces" className="flex items-center gap-2.5" title="Workspaces home">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Layers size={15} strokeWidth={1.8} />
            </span>
            <span className="hidden font-display text-[18px] tracking-display sm:block">Context Layer</span>
          </Link>

          {active && (
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1.5 shadow-whisper">
              <Dot tone={syncStatus === "live" ? "success" : syncStatus === "syncing" ? "warn" : "neutral"} />
              <span className="font-mono text-[12px] font-medium text-[var(--color-ink)]">{active.workspace.name}</span>
              <span className="h-3 w-[1px] bg-[var(--color-border)]" />
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                {syncStatus}
              </span>
            </div>
          )}
        </div>

        {/* Center: nav pills with animated active indicator */}
        {activeWorkspaceId && (
          <div className="mx-auto hidden items-center gap-0.5 rounded-full bg-white/60 p-1 shadow-inset md:flex">
            {NAV_ITEMS.map((item) => {
              const locked = item.lock === "wiki" && !hasWiki;
              const isActive = !locked && item.match(activeWorkspaceId, pathname ?? "");
              const Icon = item.icon;
              const href = item.href(activeWorkspaceId);
              return (
                <Link
                  key={item.label}
                  href={locked ? "#" : href}
                  onClick={(e) => {
                    if (locked) e.preventDefault();
                  }}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                    locked
                      ? "cursor-not-allowed text-[var(--color-ink-whisper)]"
                      : isActive
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                  )}
                  title={locked ? "Generate Wiki first to unlock" : item.label}
                >
                  {isActive && (
                    <motion.span
                      layoutId="app-nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--color-warm-stone)] shadow-whisper"
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                  <Icon size={13.5} strokeWidth={1.6} className="relative" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right: cmd + reset + persona + sign out */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => {
              // focus via keystroke: dispatch ctrl+k
              const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
              window.dispatchEvent(e);
            }}
            className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1.5 text-[12.5px] text-[var(--color-ink-muted)] transition-colors hover:bg-white hover:text-[var(--color-ink)] md:flex"
            title="Command palette"
          >
            <Command size={12} strokeWidth={1.6} />
            <span className="font-mono text-[11px]">⌘K</span>
          </button>

          {activeWorkspaceId && (
            <button
              onClick={() => {
                if (confirm("Reset the active workspace to its persona seed?")) {
                  resetActiveWorkspace();
                  router.refresh();
                }
              }}
              title="Reset active workspace"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-[var(--color-ink-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
            >
              <RotateCcw size={13} strokeWidth={1.6} />
              <span className="hidden lg:inline">Reset</span>
            </button>
          )}

          {persona && (
            <span
              className="rounded-full border border-[var(--color-border)] bg-white/70 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]"
              title="Demo persona"
            >
              {persona}
            </span>
          )}

          <button
            onClick={handleSignOut}
            title="Sign out"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-[var(--color-ink-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
          >
            <LogOut size={13} strokeWidth={1.6} />
            <span className="hidden lg:inline">Sign out</span>
          </button>

          <div
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] font-display-bold text-[11px] uppercase text-white"
            title={persona ?? "Profile"}
          >
            {persona?.[0] ?? "?"}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
