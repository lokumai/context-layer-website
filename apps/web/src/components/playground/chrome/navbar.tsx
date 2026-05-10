"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/stores";
import { NavDestinations } from "./nav-destinations";
import { ProfileMenu } from "./profile-menu";
import { WorkspacePill } from "./workspace-pill";

export function PlaygroundNavbar() {
  const workspaces = useStore((s) => s.workspaces);
  const activeId = useStore((s) => s.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? null;
  const pathname = usePathname() ?? "";
  const sourceCount = useStore((s) => s.sources.length);
  const workspaceIdFromPath = pathname.match(/^\/workspace\/([^/]+)/)?.[1] ?? null;
  const routeWorkspace = workspaceIdFromPath
    ? (workspaces.find((w) => w.id === workspaceIdFromPath) ?? null)
    : null;
  const workspace = routeWorkspace ?? activeWorkspace;
  const workspaceId = workspace?.id ?? workspaceIdFromPath;

  // On /workspaces (outside any workspace) the center destinations + workspace
  // pill are meaningless. Show only logo (left) + profile (right).
  const inWorkspace = pathname.startsWith("/workspace/") && workspaceId !== null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-[12px] shadow-[var(--shadow-inset-border)] border-b border-[rgba(0,0,0,0.04)]"
      data-testid="playground-navbar"
    >
      <nav className="w-full px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left region: logo (+ workspace pill only when inside a workspace) */}
        <div className="flex items-center gap-3 min-w-0 h-full">
          <a
            href="/workspaces"
            aria-label="Context Layer — All workspaces"
            className="flex items-center shrink-0 h-full"
          >
            {/* biome-ignore lint/performance/noImgElement: logo doesn't need next/image optimization */}
            <img
              src="/logo-landscape.svg"
              alt="Context Layer"
              className="h-24 w-auto"
              width={360}
              height={72}
            />
          </a>
          {inWorkspace && workspace ? (
            <>
              <span aria-hidden className="h-5 w-px bg-[rgba(0,0,0,0.1)]" />
              <WorkspacePill workspace={workspace} allWorkspaces={workspaces} />
            </>
          ) : null}
        </div>

        {/* Center region: destinations — hidden on /workspaces */}
        {inWorkspace && workspaceId ? (
          <div className="hidden md:block">
            <NavDestinations
              workspaceId={workspaceId}
              hasWiki={workspace?.hasWiki ?? false}
              sourceCount={sourceCount}
            />
          </div>
        ) : null}

        {/* Right region: profile */}
        <ProfileMenu />
      </nav>
    </header>
  );
}
