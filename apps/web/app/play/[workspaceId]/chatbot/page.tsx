"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUp,
  BookOpen,
  Bot,
  Filter,
  MessageSquare,
  Plus,
  Sparkles,
  Terminal,
} from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { CitationChip } from "@/components/chat/citation-chip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

export default function ChatbotPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [activeThreadId, setActiveThreadId] = useState<string | null>(ws?.chatThreads[0]?.id ?? null);

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={MessageSquare} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[44px] leading-[1.05] tracking-display">
          Chatbot is <span className="font-editorial">locked.</span>
        </h1>
        <p className="mt-4 max-w-md text-[14.5px] text-[var(--color-ink-muted)]">
          Generate the Wiki first so the chatbot has grounded knowledge to cite from. Every answer comes with clickable citations.
        </p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="mt-10">
          <Button variant="primary" size="xl">
            <Sparkles size={14} strokeWidth={1.8} />
            Generate Wiki
          </Button>
        </Link>
      </div>
    );
  }

  const activeThread = ws.chatThreads.find((t) => t.id === activeThreadId) ?? ws.chatThreads[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Thread sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/50 md:flex">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-5">
          <SectionLabel>Threads</SectionLabel>
          <button
            title="New thread"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-white hover:text-[var(--color-ink)]"
          >
            <Plus size={14} strokeWidth={1.6} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {ws.chatThreads.length === 0 ? (
            <div className="px-3 py-6 text-[12.5px] text-[var(--color-ink-whisper)]">No threads yet. Start a conversation.</div>
          ) : (
            ws.chatThreads.map((t) => {
              const isActive = t.id === activeThread?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={cn(
                    "relative mb-1 block w-full rounded-[10px] px-3 py-2.5 text-left transition-colors",
                    isActive ? "bg-white text-[var(--color-ink)] shadow-whisper" : "text-[var(--color-ink-muted)] hover:bg-black/[0.03] hover:text-[var(--color-ink)]",
                  )}
                >
                  <div className="text-[13.5px] font-medium">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                    <span>{t.messages.length} messages</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-border-strong)]" />
                    <span>{t.createdAt.slice(0, 10)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat */}
      <div className="relative flex flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-8 py-4">
          <div>
            <SectionLabel>Thread</SectionLabel>
            <h1 className="font-display mt-1 text-[20px] leading-tight">
              {activeThread?.title ?? "New conversation"}
            </h1>
          </div>
          <div className="hidden items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-ink-muted)] md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
            Grounded · live
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-48 pt-10 md:px-16">
          <AnimatePresence mode="wait">
            <FadeIn key={activeThread?.id} className="mx-auto max-w-3xl space-y-8">
              {!activeThread && <EmptyState />}
              {activeThread?.messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[75%] rounded-[22px] rounded-tr-[8px] bg-[var(--color-ink)] px-5 py-3.5 text-[15px] leading-relaxed text-white shadow-card">
                      {m.content}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <Bot size={15} strokeWidth={1.7} className="text-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">Context Agent</div>
                      <p className="mt-2 text-airy text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)]">
                        {m.content}
                        {m.citations?.map((c) => (
                          <CitationChip key={c.label} citation={c} />
                        ))}
                      </p>

                      {m.citations && m.citations.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {m.citations.map((c) => (
                            <button
                              key={c.label}
                              title={c.target}
                              className="flex items-center gap-2 rounded-full border border-black/5 bg-[var(--color-warm-stone)] px-3 py-1.5 font-mono text-[11.5px] font-medium text-[var(--color-ink)] shadow-warm"
                            >
                              <Terminal size={11} strokeWidth={1.6} />
                              {c.target}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ),
              )}
            </FadeIn>
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
          <div className="pointer-events-auto mx-auto max-w-3xl">
            <FadeIn delay={0.2}>
              <div className="rounded-[28px] border border-[var(--color-border)] bg-white/95 p-2 pl-2 backdrop-blur-xl shadow-float">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-full border border-black/5 bg-[var(--color-warm-stone)] px-4 py-2 text-[12.5px] font-medium text-[var(--color-ink)] shadow-warm transition-all hover:shadow-[rgba(78,50,23,0.12)_0_4px_12px]">
                    <Filter size={13} strokeWidth={1.6} />
                    Grounding · All
                  </button>
                  <input
                    type="text"
                    placeholder="Ask about your context…"
                    className="flex-1 bg-transparent px-2 py-2.5 text-[15px] placeholder:text-[var(--color-ink-whisper)] focus:outline-none"
                  />
                  <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[#2a2a2a]">
                    <ArrowUp size={16} strokeWidth={1.8} className="transition-transform duration-200 group-hover:-translate-y-[2px]" />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const starters = [
    "Explain the saga orchestration pattern",
    "Which services depend on shared-lib?",
    "Summarize the TMForum TMF620 endpoints",
  ];
  return (
    <div className="py-20 text-center">
      <IconTile icon={MessageSquare} size="xl" tone="warm" className="mx-auto" />
      <h2 className="font-display mt-8 text-[40px] leading-[1.05] tracking-display">
        Ask about your <span className="font-editorial">system.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[14.5px] text-[var(--color-ink-muted)]">
        Every answer is grounded in your Wiki and codebase. Citations are clickable chips that open the exact line range.
      </p>
      <div className="mx-auto mt-10 flex max-w-xl flex-col gap-2">
        {starters.map((s) => (
          <button
            key={s}
            className="flex items-center justify-between rounded-[14px] border border-[var(--color-border)] bg-white px-5 py-3 text-left text-[14px] text-[var(--color-ink-muted)] transition-all hover:border-[var(--color-ink)]/30 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-ink)]"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={13} strokeWidth={1.6} className="text-[var(--color-ink-whisper)]" />
              {s}
            </span>
            <span className="text-[11.5px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">Try</span>
          </button>
        ))}
      </div>
    </div>
  );
}
