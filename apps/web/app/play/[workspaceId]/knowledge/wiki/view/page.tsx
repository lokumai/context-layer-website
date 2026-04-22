"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight, FileText } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionLabel } from "@/components/ui/meta-field";
import { Badge } from "@/components/ui/badge";

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
                        "group flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors",
                        p.id === active?.id
                          ? "bg-white font-medium text-[var(--color-ink)] shadow-whisper"
                          : "text-[var(--color-ink-muted)] hover:bg-black/[0.03] hover:text-[var(--color-ink)]",
                      )}
                    >
                      <ChevronRight
                        size={10}
                        strokeWidth={2}
                        className={cn(
                          "text-[var(--color-ink-whisper)] transition-transform",
                          p.id === active?.id && "text-[var(--color-ink)]",
                        )}
                      />
                      <span className="truncate">{p.pathSegments.join(" / ")}</span>
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
        <FadeIn key={active?.id} className="mx-auto max-w-[780px] px-8 py-16 md:px-12">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
            <FileText size={12} strokeWidth={1.6} />
            {active?.pathSegments.join(" / ")}
            <span className="mx-1 h-[1px] w-8 bg-[var(--color-border-subtle)]" />
            <Badge tone="warm">{active?.layer}</Badge>
          </div>

          <motion.h1
            key={active?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-5 text-[44px] leading-[1.08] tracking-display text-[var(--color-ink)]"
          >
            {active?.title}
          </motion.h1>

          <motion.article
            key={`${active?.id}-body`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-10"
          >
            <pre className="whitespace-pre-wrap text-airy font-sans text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)]">
              {active?.markdown ?? ""}
            </pre>
          </motion.article>

          <div className="mt-16 border-t border-[var(--color-border-subtle)] pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
            Context Layer · {active?.layer} layer · {active?.pathSegments.length} nodes deep
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
