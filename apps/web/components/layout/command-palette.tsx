"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Boxes,
  CornerDownLeft,
  FileText,
  Gauge,
  Library,
  MessageSquare,
  Radio,
  Search,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePlaygroundStore } from "@/store/playground-store";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group: string;
  href: string;
  icon: LucideIcon;
  kbd?: string[];
}

export function CommandPalette({ workspaceId }: { workspaceId?: string | null }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const setActiveWorkspace = usePlaygroundStore((s) => s.setActiveWorkspace);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const items: CommandItem[] = useMemo(() => {
    const wsScoped: CommandItem[] = workspaceId
      ? [
          { id: "sources", group: "Navigate", label: "Sources", hint: "Manage inputs", href: `/play/${workspaceId}/sources`, icon: Boxes },
          { id: "wiki", group: "Navigate", label: "Wiki", hint: "Living knowledge", href: `/play/${workspaceId}/knowledge/wiki`, icon: BookOpen },
          { id: "intel", group: "Navigate", label: "Intelligence", hint: "Metrics & health", href: `/play/${workspaceId}/knowledge/intelligence`, icon: Gauge },
          { id: "chat", group: "Navigate", label: "Chatbot", hint: "Conversational Q&A", href: `/play/${workspaceId}/chatbot`, icon: MessageSquare },
          { id: "docsgen", group: "Navigate", label: "DocsGen", hint: "Artifact bundles", href: `/play/${workspaceId}/generate/docsgen`, icon: FileText },
          { id: "omni", group: "Navigate", label: "OmniBoard", hint: "Multimodal onboarding", href: `/play/${workspaceId}/generate/omniboard`, icon: Radio },
          { id: "library", group: "Navigate", label: "Library", hint: "All artifacts", href: `/play/${workspaceId}/library`, icon: Library },
        ]
      : [];

    const workspaceItems: CommandItem[] = workspaces.map((w) => ({
      id: `ws-${w.workspace.id}`,
      group: "Switch Workspace",
      label: w.workspace.name,
      hint: `${w.sources.length} source${w.sources.length === 1 ? "" : "s"} · ${w.workspace.stage}`,
      href: `/play/${w.workspace.id}/${w.wikiSummary ? "knowledge/wiki" : "sources"}`,
      icon: Workflow,
    }));

    const actions: CommandItem[] = [
      { id: "home", group: "Actions", label: "Go to Workspaces", href: "/play/workspaces", icon: SlidersHorizontal },
      { id: "docs", group: "Actions", label: "Documentation", hint: "Coming soon", href: "#", icon: Sparkles },
    ];

    return [...wsScoped, ...workspaceItems, ...actions];
  }, [workspaceId, workspaces]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      (i.label + " " + (i.hint ?? "") + " " + i.group).toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [filtered, active]);

  function runItem(item: CommandItem) {
    if (item.group === "Switch Workspace") {
      const wsId = item.id.replace(/^ws-/, "");
      setActiveWorkspace(wsId);
    }
    router.push(item.href);
    setOpen(false);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) runItem(item);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/35 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-[14vh] w-full max-w-[620px] overflow-hidden rounded-[18px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.05)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-5 py-4">
              <Search size={18} strokeWidth={1.5} className="text-[var(--color-ink-whisper)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search pages, workspaces, actions…"
                className="flex-1 bg-transparent text-[15px] placeholder:text-[var(--color-ink-whisper)] focus:outline-none"
              />
              <kbd className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--color-ink-muted)]">
                esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <div className="px-6 py-10 text-center text-[13px] text-[var(--color-ink-whisper)]">
                  No matches for "{query}"
                </div>
              )}
              {grouped.map(([group, groupItems]) => (
                <div key={group} className="mb-2">
                  <div className="px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                    {group}
                  </div>
                  <ul>
                    {groupItems.map((item) => {
                      const idx = filtered.indexOf(item);
                      const isActive = idx === active;
                      const Icon = item.icon;
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => runItem(item)}
                          className={cn(
                            "mx-2 flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] transition-colors",
                            isActive && "bg-black/[0.04]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-white",
                              isActive && "bg-[var(--color-warm-stone-solid)]",
                            )}
                          >
                            <Icon size={15} strokeWidth={1.6} />
                          </span>
                          <div className="flex min-w-0 flex-1 items-baseline gap-3">
                            <span className="truncate font-medium text-[var(--color-ink)]">{item.label}</span>
                            {item.hint && (
                              <span className="truncate text-[12px] text-[var(--color-ink-whisper)]">
                                {item.hint}
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <CornerDownLeft size={13} strokeWidth={1.6} className="text-[var(--color-ink-muted)]" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-[11px] text-[var(--color-ink-whisper)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>↵</Kbd>
                  open
                </span>
              </div>
              <span className="font-mono uppercase tracking-[0.14em]">Context Layer · Command</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-[var(--color-border)] bg-white px-1 font-mono text-[10.5px] text-[var(--color-ink-muted)]">
      {children}
    </kbd>
  );
}
