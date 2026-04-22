"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Boxes,
  CheckCircle2,
  FileText,
  GitBranch,
  Loader2,
  MessageSquare,
  Radio,
  Sparkles,
} from "lucide-react";

type Scene = "sources" | "wiki" | "chat" | "library";

const SCENES: Scene[] = ["sources", "wiki", "chat", "library"];

export function LiveDemo() {
  const [scene, setScene] = useState<Scene>("sources");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setScene((s) => SCENES[(SCENES.indexOf(s) + 1) % SCENES.length]);
    }, 4400);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      className="relative mx-auto w-full max-w-[860px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient halo */}
      <div className="pointer-events-none absolute -inset-4 -z-10 scale-110 rounded-[40px] bg-gradient-to-br from-[rgba(201,165,114,0.22)] via-transparent to-[rgba(232,211,176,0.22)] blur-3xl" />

      <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.04)]">
        {/* Chrome */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-mono text-[var(--color-ink-muted)] shadow-whisper">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
            context-layer.io / microservices-product-catalog
          </div>
          <div className="flex items-center gap-1 text-[10.5px] text-[var(--color-ink-whisper)] font-mono">
            <SceneTabs scene={scene} onSelect={setScene} />
          </div>
        </div>

        {/* Body */}
        <div className="relative h-[360px] bg-white">
          <AnimatePresence mode="wait">
            {scene === "sources" && (
              <motion.div
                key="sources"
                {...sceneMotion}
                className="absolute inset-0 flex flex-col gap-4 overflow-hidden p-6"
              >
                <SceneLabel icon={Boxes} label="Sources · indexing" />
                <div className="grid flex-1 grid-cols-3 gap-3">
                  {SOURCES.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col justify-between rounded-[14px] border border-[var(--color-border)] bg-white p-3 shadow-inset"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                          <GitBranch size={11} strokeWidth={1.6} />
                        </span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                          className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-emerald-700"
                        >
                          {s.status}
                        </motion.span>
                      </div>
                      <div>
                        <div className="truncate font-display text-[11.5px] leading-tight">{s.name}</div>
                        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-whisper)]">
                          {s.provider}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {scene === "wiki" && (
              <motion.div key="wiki" {...sceneMotion} className="absolute inset-0 flex flex-col gap-4 overflow-hidden p-6">
                <SceneLabel icon={BookOpen} label="Wiki · generating" />
                <div className="grid flex-1 grid-cols-[120px_1fr] gap-3">
                  <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">Tree</div>
                    <ul className="mt-2 space-y-1 text-[10.5px] text-[var(--color-ink-muted)]">
                      {["Overview", "catalog-service", "order-service", "pricing-service", "shared-lib"].map((t, i) => (
                        <motion.li
                          key={t}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className={i === 0 ? "font-medium text-[var(--color-ink)]" : ""}
                        >
                          {i === 0 ? "› " : "  "}{t}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-4 shadow-whisper">
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                      <Loader2 size={10} strokeWidth={1.8} className="animate-spin" />
                      Generating workspace/overview …
                    </div>
                    <div className="mt-3 space-y-2">
                      {GEN_LINES.map((l, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: l.o, width: "100%" }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="h-[6px] overflow-hidden rounded-full bg-[var(--color-surface-elevated)]"
                        >
                          <div
                            className="h-full rounded-full bg-[var(--color-ink)]"
                            style={{ width: `${l.w}%` }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-1.5 font-mono text-[10px] text-[var(--color-ink-muted)]">
                      {AGENT_LOGS.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.35 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 size={10} strokeWidth={1.8} className="text-emerald-600" />
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {scene === "chat" && (
              <motion.div key="chat" {...sceneMotion} className="absolute inset-0 flex flex-col gap-3 overflow-hidden p-6">
                <SceneLabel icon={MessageSquare} label="Chatbot · citing code" />
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="self-end rounded-[16px] rounded-tr-[6px] bg-[var(--color-ink)] px-3.5 py-2 text-[11.5px] text-white shadow-card max-w-[72%]"
                  >
                    How is authentication enforced across services?
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)]">
                      <Sparkles size={11} strokeWidth={1.6} className="text-white" />
                    </span>
                    <div className="max-w-[85%] text-[11.5px] leading-[1.6] text-[var(--color-ink-soft)]">
                      Auth is centralized in <InlinePill delay={1.3}>shared-lib.middleware</InlinePill>. Every service mounts{" "}
                      <InlinePill delay={1.5}>TelemetryMiddleware</InlinePill> which validates JWT via the internal identity provider.{" "}
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.9, duration: 0.3 }}
                        className="inline-block rounded-[4px] bg-[var(--color-warm-stone)] px-1.5 py-0 font-mono text-[10px] font-medium text-[var(--color-ink)] border border-black/5"
                      >
                        [1]
                      </motion.span>{" "}
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.1, duration: 0.3 }}
                        className="inline-block rounded-[4px] bg-[var(--color-warm-stone)] px-1.5 py-0 font-mono text-[10px] font-medium text-[var(--color-ink)] border border-black/5"
                      >
                        [2]
                      </motion.span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                    className="mt-auto flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white p-1 pl-3 shadow-float"
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-warm-stone)] px-2 py-1 font-mono text-[9.5px] font-medium border border-black/5">
                      <Radio size={9} strokeWidth={1.8} />
                      Grounded
                    </span>
                    <input
                      disabled
                      placeholder="Ask anything about your context…"
                      className="flex-1 bg-transparent px-1 py-1 text-[11px] placeholder:text-[var(--color-ink-whisper)] focus:outline-none"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {scene === "library" && (
              <motion.div key="library" {...sceneMotion} className="absolute inset-0 flex flex-col gap-4 overflow-hidden p-6">
                <SceneLabel icon={FileText} label="Library · shipping artifacts" />
                <div className="grid flex-1 grid-cols-4 gap-3">
                  {ARTIFACTS.map((a, i) => (
                    <motion.div
                      key={a.title}
                      initial={{ opacity: 0, y: 16, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col gap-2 rounded-[12px] border border-[var(--color-border)] bg-white p-3 shadow-inset"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${
                          a.tone === "warm" ? "bg-[var(--color-warm-stone)]" : "bg-[var(--color-surface-elevated)]"
                        } border border-[var(--color-border)]`}
                      >
                        <a.icon size={13} strokeWidth={1.6} />
                      </span>
                      <div className="font-display text-[11px] leading-tight">{a.title}</div>
                      <div className="mt-auto font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                        {a.type}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 px-4 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
          <span>⌘K · command palette</span>
          <span>auto-cycling · hover to pause</span>
        </div>
      </div>
    </div>
  );
}

const sceneMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

function SceneLabel({ icon: Icon, label }: { icon: typeof BookOpen; label: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
      <Icon size={11} strokeWidth={1.8} />
      {label}
    </div>
  );
}

function SceneTabs({ scene, onSelect }: { scene: Scene; onSelect: (s: Scene) => void }) {
  return (
    <>
      {SCENES.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`rounded-full px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
            scene === s ? "bg-[var(--color-ink)] text-white" : "hover:text-[var(--color-ink)]"
          }`}
        >
          {s}
        </button>
      ))}
    </>
  );
}

function InlinePill({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="inline-block rounded-[4px] bg-[var(--color-surface-elevated)] px-1 font-mono text-[10px] text-[var(--color-ink)]"
    >
      {children}
    </motion.span>
  );
}

const SOURCES = [
  { name: "catalog-service", provider: "github · main", status: "indexed" },
  { name: "order-service", provider: "github · main", status: "indexed" },
  { name: "pricing-service", provider: "github · main", status: "indexed" },
  { name: "inventory-service", provider: "github · main", status: "indexed" },
  { name: "shared-lib", provider: "github · main", status: "indexed" },
  { name: "TMF620_Spec.pdf", provider: "gdrive", status: "indexed" },
];

const GEN_LINES = [
  { o: 1, w: 90 },
  { o: 1, w: 70 },
  { o: 1, w: 85 },
  { o: 1, w: 60 },
];

const AGENT_LOGS = [
  "Indexed 9 repositories (14,220 LOC)",
  "Generated workspace-level summary",
  "Generated 9 repo-level wikis",
];

const ARTIFACTS = [
  { title: "Semantic Repo Map.pdf", type: "DocsGen", icon: FileText, tone: "neutral" as const },
  { title: "Tech Debt Audit.pdf", type: "DocsGen", icon: FileText, tone: "neutral" as const },
  { title: "Architecture Podcast.mp3", type: "OmniBoard", icon: Radio, tone: "warm" as const },
  { title: "Walkthrough.mp4", type: "OmniBoard", icon: FileText, tone: "neutral" as const },
];
