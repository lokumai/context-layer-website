/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + slide-over overlay use div-with-click for backdrop-close; inner buttons handle real interactions. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: same — backdrops, not primary controls. */
"use client";

import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatbotSideDock } from "@/components/playground/chatbot/slide-over";
import { TriangleLoader } from "@/components/playground/loaders/triangle-loader";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores";
import { WikiMarkdown } from "./markdown";

// Phase 15: per-repo wiki pages now load real content from the mocks
// loader through /api/mocks/wiki-page. Cache by `${repoId}/${slug}` key
// so navigating around the tree never re-fetches a viewed page.
type PageCache = Map<string, { title: string; markdown: string }>;

export function WikiViewer({
  workspaceId,
  repoId,
  slug,
}: {
  workspaceId: string;
  repoId?: string;
  slug?: string;
}) {
  const { sources, wikiTrees, narrative, sagaFlows, llms } = useStore();
  const searchParams = useSearchParams();
  const llmsId = searchParams.get("llms");
  const pageParam = searchParams.get("page");

  const [expandedRepos, setExpandedRepos] = useState<Record<string, boolean>>({
    [repoId || ""]: true,
  });
  const [exportOpen, setExportOpen] = useState(false);

  const cacheRef = useRef<PageCache>(new Map());
  const [pageBody, setPageBody] = useState<{
    key: string;
    title: string;
    markdown: string;
  } | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoId || !slug) {
      setPageBody(null);
      setPageError(null);
      return;
    }
    const key = `${repoId}/${slug}`;
    const hit = cacheRef.current.get(key);
    if (hit) {
      setPageBody({ key, title: hit.title, markdown: hit.markdown });
      setPageError(null);
      return;
    }
    let cancelled = false;
    setPageLoading(true);
    setPageError(null);
    fetch(
      `/api/mocks/wiki-page?repoId=${encodeURIComponent(repoId)}&slug=${encodeURIComponent(slug)}`,
      {
        credentials: "same-origin",
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `Failed to load wiki page (${res.status})`);
        }
        return (await res.json()) as { title: string; markdown: string };
      })
      .then((payload) => {
        if (cancelled) return;
        cacheRef.current.set(key, payload);
        setPageBody({ key, title: payload.title, markdown: payload.markdown });
      })
      .catch((err: Error) => {
        if (!cancelled) setPageError(err.message);
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repoId, slug]);

  const toggleRepo = (id: string) => {
    setExpandedRepos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = (type: string) => {
    window.alert(`Export queued — stub for ${type}.`);
    setExportOpen(false);
  };

  // Selection Logic
  let content = "";
  let title = "Wiki";

  if (llmsId) {
    const key = llmsId === "_workspace" ? "null" : llmsId;
    content = llms[key]?.markdown || "LLMS index not found.";
    title =
      llmsId === "_workspace"
        ? "Workspace Index (llms.txt)"
        : `${sources.find((s) => s.id === llmsId)?.name || llmsId} · llms.txt`;
  } else if (pageParam === "saga-flows") {
    content = sagaFlows?.markdown || "Saga flows documentation not found.";
    title = "Saga Flows";
  } else if (repoId && slug) {
    const tree = wikiTrees[repoId];
    const node = tree?.nodes.find((n) => n.slug === slug);
    title = pageBody?.title ?? node?.title ?? slug;
    content = pageBody?.markdown ?? "";
  } else if (repoId) {
    content = llms[repoId]?.markdown || "Repository summary not found.";
    title = sources.find((s) => s.id === repoId)?.name || repoId;
  } else {
    content = narrative?.markdown || "Workspace narrative not found.";
    title = "Workspace Narrative";
  }

  const isActive = (path: string, params?: Record<string, string>) => {
    const currentPath = repoId ? (slug ? `${repoId}/${slug}` : repoId) : "";
    if (params) {
      return Object.entries(params).every(([k, v]) => searchParams.get(k) === v);
    }
    return currentPath === path && !searchParams.toString();
  };

  return (
    <div className="flex w-full h-full min-h-0 bg-[#f9f9f9]">
      {/* Left Tree */}
      <aside className="w-[300px] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-[rgba(0,0,0,0.05)] px-4 py-6 bg-white">
        <div className="space-y-8">
          {/* WORKSPACE */}
          <div>
            <h3 className="text-button-upper text-[#777169] mb-2 px-2">WORKSPACE</h3>
            <div className="space-y-0.5">
              <Link
                href={`/workspace/${workspaceId}/wiki/view`}
                className={cn(
                  "block px-2 py-1.5 rounded-standard text-body-standard transition-colors",
                  isActive("") ? "bg-[#f5f2ef] text-black" : "text-[#4e4e4e] hover:bg-[#f5f2ef]/50",
                )}
              >
                Narrative
              </Link>
              <Link
                href={`/workspace/${workspaceId}/wiki/view?page=saga-flows`}
                className={cn(
                  "block px-2 py-1.5 rounded-standard text-body-standard transition-colors",
                  isActive("", { page: "saga-flows" })
                    ? "bg-[#f5f2ef] text-black"
                    : "text-[#4e4e4e] hover:bg-[#f5f2ef]/50",
                )}
              >
                Saga Flows
              </Link>
            </div>
          </div>

          {/* REPOS */}
          <div>
            <h3 className="text-button-upper text-[#777169] mb-2 px-2">REPOS</h3>
            <div className="space-y-1">
              {sources.map((source) => (
                <div key={source.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => toggleRepo(source.id)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-standard text-body-standard text-[#4e4e4e] hover:bg-[#f5f2ef]/50 transition-colors"
                  >
                    <span className="truncate">{source.name}</span>
                    {expandedRepos[source.id] ? (
                      <ChevronDown size={14} strokeWidth={1.5} />
                    ) : (
                      <ChevronRight size={14} strokeWidth={1.5} />
                    )}
                  </button>
                  {expandedRepos[source.id] && (
                    <div className="pl-4 space-y-0.5">
                      {wikiTrees[source.id]?.nodes.map((node) => (
                        <Link
                          key={node.slug}
                          href={`/workspace/${workspaceId}/wiki/view/${source.id}/${node.slug}`}
                          className={cn(
                            "block px-2 py-1 rounded-standard text-caption transition-colors",
                            isActive(`${source.id}/${node.slug}`)
                              ? "bg-[#f5f2ef] text-black"
                              : "text-[#777169] hover:bg-[#f5f2ef]/50",
                          )}
                        >
                          {node.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* LLMS.TXT */}
          <div>
            <h3 className="text-button-upper text-[#777169] mb-2 px-2">LLMS.TXT</h3>
            <div className="space-y-0.5">
              <Link
                href={`/workspace/${workspaceId}/wiki/view?llms=_workspace`}
                className={cn(
                  "block px-2 py-1.5 rounded-standard text-body-standard transition-colors",
                  isActive("", { llms: "_workspace" })
                    ? "bg-[#f5f2ef] text-black"
                    : "text-[#4e4e4e] hover:bg-[#f5f2ef]/50",
                )}
              >
                Workspace index
              </Link>
              {sources.map((source) => (
                <Link
                  key={source.id}
                  href={`/workspace/${workspaceId}/wiki/view?llms=${source.id}`}
                  className={cn(
                    "block px-2 py-1.5 rounded-standard text-body-standard transition-colors",
                    isActive("", { llms: source.id })
                      ? "bg-[#f5f2ef] text-black"
                      : "text-[#4e4e4e] hover:bg-[#f5f2ef]/50",
                  )}
                >
                  {source.name} · llms.txt
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 min-w-0 bg-white">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-8 relative min-h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-nav text-[#777169]">
              <span>Wiki</span>
              <ChevronRight size={14} strokeWidth={1.5} />
              <span className="text-black font-medium">{title}</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen(!exportOpen)}
                className="rounded-pill bg-white shadow-[var(--shadow-inset-border)] px-4 py-2 text-button flex items-center gap-2 hover:bg-[#f9f9f9] transition-colors"
              >
                Export
                <ChevronDown size={14} strokeWidth={1.5} />
              </button>
              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-[var(--shadow-card)] z-20 py-2 border border-[rgba(0,0,0,0.05)]">
                    <button
                      type="button"
                      onClick={() => handleExport("markdown")}
                      className="w-full text-left px-4 py-2 text-body-standard text-[#4e4e4e] hover:bg-[#f5f2ef]"
                    >
                      Export markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport("pdf")}
                      className="w-full text-left px-4 py-2 text-body-standard text-[#4e4e4e] hover:bg-[#f5f2ef]"
                    >
                      Export PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {pageLoading && repoId && slug ? (
              <div className="flex flex-col items-center justify-center py-20">
                <TriangleLoader size={64} label="Loading wiki page…" />
              </div>
            ) : pageError && repoId && slug ? (
              <div
                className="rounded-card bg-[#fef2f2] text-[#b91c1c] px-4 py-3 my-4"
                data-testid="wiki-page-error"
              >
                {pageError}
              </div>
            ) : content ? (
              <WikiMarkdown markdown={content} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-[#777169]">
                <FileText size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-body-large">No content selected</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatbotSideDock workspaceId={workspaceId} contextLabel="Ask about this page…" />
    </div>
  );
}
