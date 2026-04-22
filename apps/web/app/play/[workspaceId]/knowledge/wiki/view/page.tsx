"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, FileText, Sparkles } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/meta-field";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/markdown/renderer";

export default function WikiViewPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const pages = ws?.wikiPages ?? [];
  const [activeId, setActiveId] = useState<string>(pages[0]?.id ?? "");

  const active = useMemo(() => pages.find((p) => p.id === activeId) ?? pages[0], [pages, activeId]);

  // Group pages by layer
  const groups = useMemo(() => {
    const map: Record<string, typeof pages> = { workspace: [], repo: [], "llms-txt": [] };
    for (const p of pages) (map[p.layer] ??= []).push(p);
    return map;
  }, [pages]);

  if (pages.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center text-[var(--color-ink-muted)]">
        No Wiki yet. Configure and generate one first.
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Tree */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/40 px-5 py-8 lg:block">
        <div className="mb-6">
          <SectionLabel>Wiki tree</SectionLabel>
        </div>

        {Object.entries(groups).map(([layer, items]) =>
          items.length === 0 ? null : (
            <div key={layer} className="mb-8">
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                {layer === "workspace" ? "Workspace" : layer === "repo" ? "Repositories" : "llms.txt"}
                <span className="h-[1px] flex-1 bg-[var(--color-border-subtle)]" />
                <span>{items.length}</span>
              </div>
              <ul className="space-y-0.5">
                {items.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveId(p.id)}
                      className={cn(
                        "group relative flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors",
                        p.id === active?.id
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                      )}
                    >
                      {p.id === active?.id && (
                        <motion.span
                          layoutId="wiki-tree-active"
                          className="absolute inset-0 rounded-[8px] bg-white shadow-whisper"
                          transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        />
                      )}
                      <ChevronRight
                        size={10}
                        strokeWidth={2}
                        className={cn(
                          "relative z-[1] text-[var(--color-ink-whisper)] transition-transform",
                          p.id === active?.id && "rotate-90 text-[var(--color-ink)]",
                        )}
                      />
                      <span className="relative z-[1] truncate">{p.pathSegments.join(" / ")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </aside>

      {/* Article */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-[860px] px-8 py-16 md:px-14"
          >
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
              <FileText size={12} strokeWidth={1.6} />
              {active?.pathSegments.join(" / ")}
              <span className="mx-1 h-[1px] w-8 bg-[var(--color-border-subtle)]" />
              <Badge tone="warm">{active?.layer}</Badge>
              <span className="ml-auto flex items-center gap-1">
                <Sparkles size={11} strokeWidth={1.6} />
                Auto-generated · {new Date().toISOString().slice(0, 10)}
              </span>
            </div>

            <MarkdownRenderer source={active?.markdown ?? ""} className="mt-6" />

            <div className="mt-16 border-t border-[var(--color-border-subtle)] pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
              Context Layer · {active?.layer} layer · Stored as markdown in git · Every change is a commit
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
