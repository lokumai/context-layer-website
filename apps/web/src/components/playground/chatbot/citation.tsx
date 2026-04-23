/** biome-ignore-all lint/suspicious/noCommentText: "// …" strings inside the code-preview block are displayed verbatim, not comments. */
"use client";

import type { Citation } from "@context-layer/mocks";
import { BookOpen, Code2, ExternalLink, File as FileIcon, X } from "lucide-react";
import Link from "next/link";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

// Citations are a first-class primitive (UI_UX §9.7): clicking any chip —
// whether rendered inside the full Chatbot page or the side-panel — opens
// the same right-side drawer with the referenced content. A React context
// lets the chip not know or care who owns the drawer.

interface CitationCtx {
  open: (citation: Citation, workspaceId: string) => void;
}

const Ctx = createContext<CitationCtx | null>(null);

export function CitationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<{ citation: Citation; workspaceId: string } | null>(null);

  const open = useCallback((citation: Citation, workspaceId: string) => {
    setActive({ citation, workspaceId });
  }, []);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {active ? (
        <CitationDrawer
          citation={active.citation}
          workspaceId={active.workspaceId}
          onClose={() => setActive(null)}
        />
      ) : null}
    </Ctx.Provider>
  );
}

export function useCitationDrawer(): CitationCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCitationDrawer must be used within CitationProvider");
  return ctx;
}

export function CitationChip({
  citation,
  workspaceId,
  index,
}: {
  citation: Citation;
  workspaceId: string;
  index: number;
}) {
  const { open } = useCitationDrawer();
  const tone =
    citation.kind === "wiki"
      ? "bg-[#fdf6ec] text-[#b45309] hover:bg-[#fbebcf]"
      : citation.kind === "code"
        ? "bg-[#eef6ff] text-[#1d4ed8] hover:bg-[#dbeafe]"
        : "bg-[#f0fdf4] text-[#15803d] hover:bg-[#dcfce7]";
  return (
    <button
      type="button"
      onClick={() => open(citation, workspaceId)}
      className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-caption font-medium transition-colors ${tone}`}
      data-testid="citation-chip"
    >
      <span>[{index}]</span>
      <span className="truncate max-w-[180px]">{citation.label}</span>
    </button>
  );
}

function CitationDrawer({
  citation,
  workspaceId,
  onClose,
}: {
  citation: Citation;
  workspaceId: string;
  onClose: () => void;
}) {
  const Icon = citation.kind === "wiki" ? BookOpen : citation.kind === "code" ? Code2 : FileIcon;
  const kindLabel =
    citation.kind === "wiki"
      ? "Wiki Page"
      : citation.kind === "code"
        ? "Code Reference"
        : "File Reference";
  const wikiHref = citation.kind === "wiki" ? wikiAnchorToPath(citation.anchor, workspaceId) : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/10 z-[60]" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed right-0 top-0 h-screen w-full max-w-[520px] bg-white shadow-[var(--shadow-card)] z-[70] flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Citation details"
        data-testid="citation-drawer"
      >
        <header className="px-6 py-4 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#f5f2ef] text-[#4e4e4e] flex items-center justify-center">
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">{kindLabel}</p>
              <h3 className="text-card-heading text-black">{citation.label}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f2ef] transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="rounded-card bg-[#f9f9f9] border border-[rgba(0,0,0,0.05)] px-4 py-3">
            <p className="text-caption text-[#777169] uppercase tracking-[0.08em] mb-1">Anchor</p>
            <code className="text-body-medium text-black font-mono break-all">
              {citation.anchor}
            </code>
          </div>

          {citation.kind === "code" && citation.path ? (
            <div className="rounded-card border border-[rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-4 py-2 bg-[#0f0f0f] text-white flex items-center justify-between">
                <span className="text-caption font-mono truncate">
                  {citation.repoId}/{citation.path}
                </span>
                {citation.lineRange ? (
                  <span className="text-caption text-[#bdbdbd] font-mono">
                    L{citation.lineRange[0]}–{citation.lineRange[1]}
                  </span>
                ) : null}
              </div>
              <div className="px-4 py-6 bg-[#1a1a1a] text-[#e4e4e4] font-mono text-caption">
                <p className="text-[#9ca3af]">// Code preview not bundled in the mock dataset.</p>
                <p className="text-[#9ca3af]">
                  // This drawer would render lines {citation.lineRange?.[0] ?? "?"}–
                  {citation.lineRange?.[1] ?? "?"} in production.
                </p>
              </div>
            </div>
          ) : null}

          {citation.kind === "wiki" && wikiHref ? (
            <Link
              href={wikiHref}
              className="inline-flex items-center gap-2 rounded-pill bg-black text-white px-4 py-2 text-button-upper hover:bg-[#1a1a1a] transition-colors"
            >
              Open in Wiki
              <ExternalLink size={14} strokeWidth={1.5} />
            </Link>
          ) : null}

          {citation.kind === "file" ? (
            <div className="rounded-card bg-[#f0fdf4] border border-[#86efac] px-4 py-3">
              <p className="text-body text-[#166534]">
                File reference — in production this would preview the uploaded file content at the
                cited location.
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}

// Convert `wiki://repoId/slug#hash` or `wiki://workspace/slug#hash` to the
// internal Wiki View route. Defensive — any malformed anchor returns null.
function wikiAnchorToPath(anchor: string, workspaceId: string): string | null {
  const m = /^wiki:\/\/([^/]+)\/([^#]+)(?:#(.+))?$/.exec(anchor);
  if (!m) return null;
  const [, scope, slug, hash] = m;
  const base = `/workspace/${workspaceId}/wiki/view`;
  const path = scope === "workspace" ? `${base}?page=${slug}` : `${base}/${scope}/${slug}`;
  return hash ? `${path}#${hash}` : path;
}
