"use client";

import { BookOpen, FileText, Gauge, Lock, Settings, ScrollText } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useStore } from "@/stores";

interface TabDef {
  id: "status" | "view" | "configure" | "logs";
  label: string;
  href: (base: string) => string;
  icon: ReactNode;
  description: string;
  /** True when this tab renders an empty-state "Generate Wiki first" CTA rather than being disabled. */
  needsWiki: boolean;
}

const TABS: TabDef[] = [
  {
    id: "status",
    label: "Status",
    href: (b) => `${b}/status`,
    icon: <Gauge size={16} strokeWidth={1.5} />,
    description: "Coverage · freshness · graph",
    needsWiki: true,
  },
  {
    id: "view",
    label: "View",
    href: (b) => `${b}/view`,
    icon: <BookOpen size={16} strokeWidth={1.5} />,
    description: "Workspace · repos · llms.txt",
    needsWiki: true,
  },
  {
    id: "configure",
    label: "Configure",
    href: (b) => `${b}/configure`,
    icon: <Settings size={16} strokeWidth={1.5} />,
    description: "Generate · sync · instructions",
    needsWiki: false,
  },
  {
    id: "logs",
    label: "Logs",
    href: (b) => `${b}/logs`,
    icon: <ScrollText size={16} strokeWidth={1.5} />,
    description: "Audit trail · diffs",
    needsWiki: true,
  },
];

export function WikiSidebar({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/workspace/${workspaceId}/wiki`;
  const hasWiki = useStore(
    (s) => s.workspaces.find((w) => w.id === workspaceId)?.hasWiki ?? false,
  );

  return (
    <aside
      className="hidden lg:flex lg:w-[260px] shrink-0 flex-col border-r border-[rgba(0,0,0,0.05)] bg-white"
      data-testid="wiki-sidebar"
    >
      <div className="px-5 py-5 border-b border-[rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-standard bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
            <FileText size={16} strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-button-upper text-[#777169]">Knowledge</p>
            <h2 className="text-body-large text-black leading-none mt-0.5">Wiki</h2>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {TABS.map((tab) => {
          const href = tab.href(base);
          const locked = tab.needsWiki && !hasWiki;
          const active = pathname.startsWith(href);
          return (
            <SidebarItem
              key={tab.id}
              label={tab.label}
              description={tab.description}
              href={href}
              icon={tab.icon}
              active={active}
              locked={locked}
            />
          );
        })}
      </nav>
      <footer className="px-5 py-4 border-t border-[rgba(0,0,0,0.05)]">
        <p className="text-micro text-[#777169]">
          The Wiki is always-fresh and versioned — updates after every sync.
        </p>
      </footer>
    </aside>
  );
}

function SidebarItem({
  label,
  description,
  href,
  icon,
  active,
  locked,
}: {
  label: string;
  description: string;
  href: string;
  icon: ReactNode;
  active: boolean;
  locked: boolean;
}) {
  const base = "flex items-start gap-3 px-3 py-2.5 rounded-card text-left transition-colors";
  const tone = locked
    ? "text-[#9ca3af] cursor-not-allowed"
    : active
      ? "bg-[#f5f2ef] text-black"
      : "text-[#4e4e4e] hover:bg-[#f9f9f9] hover:text-black";
  const content = (
    <>
      <span className="mt-[3px] shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="text-body-medium leading-tight">{label}</span>
          {locked ? <Lock size={12} strokeWidth={1.5} /> : null}
        </span>
        <span className="block text-caption text-[#777169] leading-snug mt-0.5">
          {description}
        </span>
      </span>
    </>
  );

  if (locked) {
    return (
      <span
        className={`${base} ${tone}`}
        title="Generate the Wiki first to unlock"
        data-testid={`wiki-tab-${label.toLowerCase()}`}
        data-locked="true"
      >
        {content}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`${base} ${tone}`}
      data-testid={`wiki-tab-${label.toLowerCase()}`}
    >
      {content}
    </a>
  );
}
