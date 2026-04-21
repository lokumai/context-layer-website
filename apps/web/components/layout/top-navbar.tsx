"use client";

import Link from "next/link";
import { usePlaygroundStore } from "@/store/playground-store";

export function TopNavbar() {
  const activeWorkspaceId = usePlaygroundStore((s) => s.activeWorkspaceId);
  const syncStatus = usePlaygroundStore((s) => s.syncStatus);
  const persona = usePlaygroundStore((s) => s.persona);
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const resetActiveWorkspace = usePlaygroundStore((s) => s.resetActiveWorkspace);

  const active = workspaces.find((w) => w.workspace.id === activeWorkspaceId);
  const hasSources = (active?.sources.length ?? 0) > 0;
  const hasWiki = active?.wikiSummary != null;

  const linkClass =
    "text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-black/[0.05] sticky top-0 z-50 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-screen-2xl mx-auto">
        {/* Left Region */}
        <div className="flex items-center gap-8">
          <Link
            href="/play/workspaces"
            className="font-waldenburg text-2xl tracking-tighter text-black"
          >
            Context Layer
          </Link>
          {activeWorkspaceId && (
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium px-3 py-1 bg-neutral-100 rounded-full">
                {activeWorkspaceId}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${
                  syncStatus === "live" ? "bg-green-500" : "bg-yellow-500"
                }`}
                title={`Sync Status: ${syncStatus}`}
              />
            </div>
          )}
        </div>

        {/* Center Region */}
        {activeWorkspaceId && (
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/play/${activeWorkspaceId}/sources`} className={linkClass}>
              Sources
            </Link>
            {hasWiki ? (
              <>
                <Link
                  href={`/play/${activeWorkspaceId}/knowledge/wiki`}
                  className={linkClass}
                >
                  Wiki
                </Link>
                <Link
                  href={`/play/${activeWorkspaceId}/knowledge/intelligence`}
                  className={linkClass}
                >
                  Intelligence
                </Link>
                <Link
                  href={`/play/${activeWorkspaceId}/chatbot`}
                  className={linkClass}
                >
                  Chatbot
                </Link>
                <Link
                  href={`/play/${activeWorkspaceId}/generate/docsgen`}
                  className={linkClass}
                >
                  Generate
                </Link>
                <Link
                  href={`/play/${activeWorkspaceId}/library`}
                  className={linkClass}
                >
                  Library
                </Link>
              </>
            ) : hasSources ? (
              <span
                className="text-neutral-300 text-[15px] cursor-not-allowed"
                title="Generate Wiki first"
              >
                Knowledge Locked
              </span>
            ) : (
              <span
                className="text-neutral-300 text-[15px] cursor-not-allowed"
                title="Add a source first"
              >
                Locked
              </span>
            )}
          </div>
        )}

        {/* Right Region */}
        <div className="flex items-center gap-3">
          {persona && (
            <span
              className="text-[11px] font-waldenburg-bold uppercase tracking-[0.7px] px-3 py-1 rounded-full bg-neutral-100 text-neutral-600"
              title="Demo persona"
            >
              {persona}
            </span>
          )}
          {activeWorkspaceId && (
            <button
              onClick={() => {
                if (confirm("Reset the active workspace to its persona seed?")) {
                  resetActiveWorkspace();
                }
              }}
              className="text-[13px] font-medium text-neutral-500 hover:text-black px-3 py-1 rounded-full hover:bg-neutral-100"
              title="Reset active workspace"
            >
              Reset
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-neutral-200" title="Profile" />
        </div>
      </div>
    </nav>
  );
}
