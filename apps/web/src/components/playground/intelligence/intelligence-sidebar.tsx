"use client";

import { Boxes, Gauge, HeartPulse, LayoutDashboard, Lock, ShieldCheck, Target } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useStore } from "@/stores";

interface TabDef {
  id: string;
  label: string;
  href: (base: string) => string;
  icon: ReactNode;
  description: string;
}

const TABS: TabDef[] = [
  {
    id: "overview",
    label: "Overview",
    href: (b) => `${b}/overview`,
    icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
    description: "Top-level scores and trends",
  },
  {
    id: "health",
    label: "Health",
    href: (b) => `${b}/health`,
    icon: <HeartPulse size={16} strokeWidth={1.5} />,
    description: "Tech debt and fragility",
  },
  {
    id: "security",
    label: "Security",
    href: (b) => `${b}/security`,
    icon: <ShieldCheck size={16} strokeWidth={1.5} />,
    description: "Vulnerabilities and exposure",
  },
  {
    id: "coverage",
    label: "Coverage",
    href: (b) => `${b}/coverage`,
    icon: <Target size={16} strokeWidth={1.5} />,
    description: "Test coverage landscape",
  },
  {
    id: "dependencies",
    label: "Dependencies",
    href: (b) => `${b}/dependencies`,
    icon: <Boxes size={16} strokeWidth={1.5} />,
    description: "Cross-repo and risk",
  },
];

export function IntelligenceSidebar({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/workspace/${workspaceId}/intelligence`;
  const hasWiki = useStore((s) => s.workspaces.find((w) => w.id === workspaceId)?.hasWiki ?? false);

  return (
    <aside
      className="hidden lg:flex lg:w-[260px] shrink-0 flex-col border-r border-[rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-[12px] shadow-[var(--shadow-inset-border)]"
      data-testid="intelligence-sidebar"
    >
      <div className="px-5 py-5 border-b border-[rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-standard bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
            <Gauge size={16} strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-button-upper text-[#777169]">Knowledge</p>
            <h2 className="text-body-large text-black leading-none mt-0.5">Intelligence</h2>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {TABS.map((tab) => {
          const href = tab.href(base);
          const locked = !hasWiki;
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
          Intelligence regenerates after every Wiki sync. Use Refresh for an on-demand pass.
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
        <span className="block text-caption text-[#777169] leading-snug mt-0.5">{description}</span>
      </span>
    </>
  );

  if (locked) {
    return (
      <span
        className={`${base} ${tone}`}
        title="Generate the Wiki first to unlock"
        data-testid={`intel-tab-${label.toLowerCase()}`}
        data-locked="true"
      >
        {content}
      </span>
    );
  }
  return (
    <a href={href} className={`${base} ${tone}`} data-testid={`intel-tab-${label.toLowerCase()}`}>
      {content}
    </a>
  );
}
