"use client";

import { useStore } from "@/stores";
import { NavDestinations } from "./nav-destinations";
import { ProfileMenu } from "./profile-menu";
import { SyncHeartbeat } from "./sync-heartbeat";
import { WorkspacePill } from "./workspace-pill";

export function PlaygroundNavbar() {
  const workspaces = useStore((s) => s.workspaces);
  const activeId = useStore((s) => s.activeWorkspaceId);
  const active = workspaces.find((w) => w.id === activeId) ?? null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[rgba(0,0,0,0.05)]"
      data-testid="playground-navbar"
    >
      <nav className="mx-auto max-w-[1440px] px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left region: logo + workspace pill + sync heartbeat */}
        <div className="flex items-center gap-3 min-w-0">
          <a href="/workspaces" aria-label="Context Layer — All workspaces" className="flex items-center shrink-0">
            {/* biome-ignore lint/performance/noImgElement: logo doesn't need next/image optimization */}
            <img
              src="/logo-landscape.png"
              alt="Context Layer"
              className="h-6 w-auto"
              width={140}
              height={24}
            />
          </a>
          {active ? (
            <>
              <span aria-hidden className="h-5 w-px bg-[rgba(0,0,0,0.1)]" />
              <WorkspacePill workspace={active} allWorkspaces={workspaces} />
              <SyncHeartbeat status={active.syncStatus} />
            </>
          ) : null}
        </div>

        {/* Center region: destinations */}
        {active ? (
          <div className="hidden md:block">
            <NavDestinations workspaceId={active.id} hasWiki={active.hasWiki} />
          </div>
        ) : null}

        {/* Right region: profile */}
        <ProfileMenu />
      </nav>
    </header>
  );
}
