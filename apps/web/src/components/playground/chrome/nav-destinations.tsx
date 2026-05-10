"use client";

import { BookOpen, ChevronDown, Inbox, Library, Lock, MessageSquare, Sparkles, FileText, BrainCircuit, LayoutDashboard, Terminal } from "lucide-react";
import { LayoutGroup, motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { LAYOUT_SPRING } from "@/lib/motion/spring";
import { useStore } from "@/stores";

interface Props {
  workspaceId: string;
  hasWiki: boolean;
  sourceCount: number;
}

export function NavDestinations({ workspaceId, hasWiki, sourceCount }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/workspace/${workspaceId}`;

  // Per UI_UX §9.9:
  //   Sources always unlocked.
  //   Knowledge (Wiki + Intelligence) — Wiki Configure is reachable after ≥1 source; Status/View/Logs after first Wiki. Surface the dropdown as unlocked whenever sources>0 so the user can reach Configure.
  //   Chatbot / Generate / Library — all require hasWiki.
  const knowledgeLocked = sourceCount === 0;
  const downstreamLocked = !hasWiki;

  const items: Array<{
    label: string;
    href?: string;
    icon: ReactNode;
    dropdown?: Array<{ label: string; href: string; icon: ReactNode }>;
    locked: boolean;
  }> = [
    {
      label: "Sources",
      href: `${base}/sources`,
      icon: <Inbox size={14} strokeWidth={1.5} />,
      locked: false,
    },
    {
      label: "Knowledge",
      icon: <BookOpen size={14} strokeWidth={1.5} />,
      dropdown: [
        { label: "Wiki", href: `${base}/wiki/status`, icon: <FileText size={14} strokeWidth={1.5} /> },
        { label: "Intelligence", href: `${base}/intelligence`, icon: <BrainCircuit size={14} strokeWidth={1.5} /> },
      ],
      locked: knowledgeLocked,
    },
    {
      label: "Chatbot",
      href: `${base}/chatbot`,
      icon: <MessageSquare size={14} strokeWidth={1.5} />,
      locked: downstreamLocked,
    },
    {
      label: "Generate",
      icon: <Sparkles size={14} strokeWidth={1.5} />,
      dropdown: [
        { label: "DocsGen", href: `${base}/generate/docsgen`, icon: <FileText size={14} strokeWidth={1.5} /> },
        { label: "OmniBoard", href: `${base}/generate/omniboard`, icon: <LayoutDashboard size={14} strokeWidth={1.5} /> },
        { label: "MCPGen", href: `${base}/generate/mcpgen`, icon: <Terminal size={14} strokeWidth={1.5} /> },
      ],
      locked: downstreamLocked,
    },
    {
      label: "Library",
      href: `${base}/library`,
      icon: <Library size={14} strokeWidth={1.5} />,
      locked: downstreamLocked,
    },
  ];

  return (
    // LayoutGroup scopes the shared layoutId so the active-bg pill warps
    // between items within this nav cluster only.
    <LayoutGroup id="playground-nav">
      <div className="flex items-center gap-1" data-testid="nav-destinations">
        {items.map((item) => {
          const isActive = item.href
            ? pathname.startsWith(item.href)
            : (item.dropdown?.some((d) => pathname.startsWith(d.href)) ?? false);
          return (
            <NavItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              dropdown={item.dropdown}
              locked={item.locked}
              active={isActive}
            />
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function NavItem({
  label,
  href,
  icon,
  dropdown,
  locked,
  active,
}: {
  label: string;
  href?: string;
  icon: ReactNode;
  dropdown?: Array<{ label: string; href: string; icon: ReactNode }>;
  locked: boolean;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  // Each pill is a relatively-positioned inline-flex shell. The active
  // background lives in a sibling motion.span with a shared layoutId so
  // it warps between items as the route changes (Warp Effect).
  const baseShell =
    "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-nav transition-colors";
  const tone = locked
    ? "text-[#9ca3af] cursor-not-allowed"
    : active
      ? "text-black"
      : "text-[#4e4e4e] hover:text-black";

  const activeHighlight = active ? (
    <motion.span
      layoutId="nav-active-bg"
      transition={LAYOUT_SPRING}
      className="absolute inset-0 rounded-pill bg-[#f5f2ef]"
      aria-hidden
    />
  ) : null;

  // Hover layer on inactive items — only animates color (not background)
  // so it can't fight the Warp Effect.
  const hoverHighlight =
    !active && !locked ? (
      <span
        aria-hidden
        className="absolute inset-0 rounded-pill bg-[#f5f5f5] opacity-0 hover:opacity-100 transition-opacity duration-150"
      />
    ) : null;

  if (locked) {
    return (
      <span
        className={`${baseShell} ${tone}`}
        title="Generate the first Wiki to unlock"
        data-testid={`nav-${label.toLowerCase()}`}
        data-locked="true"
      >
        <span className="relative z-[1] inline-flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
          <Lock size={12} strokeWidth={1.5} />
        </span>
      </span>
    );
  }

  if (dropdown) {
    return (
      <div ref={ref} className="relative z-50">
        <button
          type="button"
          className={`${baseShell} ${tone} group`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-testid={`nav-${label.toLowerCase()}`}
        >
          {activeHighlight}
          {hoverHighlight}
          <span className="relative z-[1] inline-flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
            <ChevronDown size={12} strokeWidth={1.5} />
          </span>
        </button>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 min-w-[180px] bg-white rounded-card shadow-[var(--shadow-card)] border border-[rgba(0,0,0,0.05)] overflow-hidden"
            >
              {dropdown.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  className="flex items-center gap-2 px-3 py-2 text-nav text-black hover:bg-[#f9f9f9]"
                  onClick={() => setOpen(false)}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </a>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`${baseShell} ${tone} group`}
      data-testid={`nav-${label.toLowerCase()}`}
    >
      {activeHighlight}
      {hoverHighlight}
      <span className="relative z-[1] inline-flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </span>
    </a>
  );
}
