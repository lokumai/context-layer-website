"use client";

import { ChevronDown, Inbox, Lock, MessageSquare, BookOpen, Sparkles, Library } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  workspaceId: string;
  hasWiki: boolean;
}

export function NavDestinations({ workspaceId, hasWiki }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/workspace/${workspaceId}`;

  const items: Array<{
    label: string;
    href?: string;
    icon: ReactNode;
    dropdown?: Array<{ label: string; href: string }>;
  }> = [
    { label: "Sources", href: `${base}/sources`, icon: <Inbox size={14} strokeWidth={1.5} /> },
    {
      label: "Knowledge",
      icon: <BookOpen size={14} strokeWidth={1.5} />,
      dropdown: [
        { label: "Wiki", href: `${base}/knowledge` },
        { label: "Intelligence", href: `${base}/knowledge` },
      ],
    },
    { label: "Chatbot", href: `${base}/chatbot`, icon: <MessageSquare size={14} strokeWidth={1.5} /> },
    {
      label: "Generate",
      icon: <Sparkles size={14} strokeWidth={1.5} />,
      dropdown: [
        { label: "DocsGen", href: `${base}/generate` },
        { label: "OmniBoard", href: `${base}/generate` },
        { label: "MCPGen", href: `${base}/generate` },
      ],
    },
    { label: "Library", href: `${base}/library`, icon: <Library size={14} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex items-center gap-1" data-testid="nav-destinations">
      {items.map((item) => {
        const locked = !hasWiki && item.label !== "Sources";
        const isActive = item.href ? pathname.startsWith(item.href) : false;
        return (
          <NavItem
            key={item.label}
            label={item.label}
            href={item.href}
            icon={item.icon}
            dropdown={item.dropdown}
            locked={locked}
            active={isActive}
          />
        );
      })}
    </div>
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
  dropdown?: Array<{ label: string; href: string }>;
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

  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-nav transition-colors";
  const tone = locked
    ? "text-[#9ca3af] cursor-not-allowed"
    : active
      ? "bg-[#f5f2ef] text-black"
      : "text-[#4e4e4e] hover:text-black hover:bg-[#f5f5f5]";

  if (locked) {
    return (
      <span
        className={`${base} ${tone}`}
        title="Generate the first Wiki to unlock"
        data-testid={`nav-${label.toLowerCase()}`}
        data-locked="true"
      >
        {icon}
        <span>{label}</span>
        <Lock size={12} strokeWidth={1.5} />
      </span>
    );
  }

  if (dropdown) {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          className={`${base} ${tone}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          data-testid={`nav-${label.toLowerCase()}`}
        >
          {icon}
          <span>{label}</span>
          <ChevronDown size={12} strokeWidth={1.5} />
        </button>
        {open ? (
          <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white rounded-card shadow-[var(--shadow-card)] border border-[rgba(0,0,0,0.05)] overflow-hidden">
            {dropdown.map((d) => (
              <a
                key={d.label}
                href={d.href}
                className="block px-3 py-2 text-nav text-black hover:bg-[#f9f9f9]"
                onClick={() => setOpen(false)}
              >
                {d.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`${base} ${tone}`}
      data-testid={`nav-${label.toLowerCase()}`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
