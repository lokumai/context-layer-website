"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUp,
  BookOpen,
  Clapperboard,
  Film,
  Music,
  Presentation,
  Radio,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/meta-field";
import { Waveform } from "@/components/ui/atmosphere";

type Modality = "slides" | "podcast" | "video" | "deep-dive";

const MODALITIES: Array<{ id: Modality; label: string; hint: string; icon: LucideIcon }> = [
  { id: "slides", label: "Slides", hint: "Decks · markdown", icon: Presentation },
  { id: "podcast", label: "Podcast", hint: "Two-host audio", icon: Music },
  { id: "video", label: "Video", hint: "Narrated walkthrough", icon: Film },
  { id: "deep-dive", label: "Deep dive", hint: "Editorial narrative", icon: BookOpen },
];

export default function OmniBoardPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [modality, setModality] = useState<Modality>("slides");

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={Radio} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[44px] leading-[1.05] tracking-display">
          OmniBoard is <span className="font-editorial">locked.</span>
        </h1>
        <p className="mt-4 max-w-md text-[14.5px] text-[var(--color-ink-muted)]">
          Generate the Wiki first so multimodal artifacts have a grounded knowledge base to draw from.
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

  const artifacts = ws.omniBoardArtifacts;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main planning stage */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-warm opacity-40" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-15" />

        <div className="relative flex-1 overflow-y-auto px-8 py-12 md:px-16 md:py-20">
          <FadeIn>
            <SectionLabel>Generate · OmniBoard</SectionLabel>
            <h1 className="font-display mt-5 max-w-3xl text-[52px] leading-[1.02] tracking-display md:text-[72px]">
              Plan. Approve. <span className="font-editorial">Ship.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
              A specialized chatbot environment for multimodal onboarding. Describe your audience, iterate on the outline, approve — and receive a shareable deck, podcast, or video.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-12">
            <div className="mx-auto max-w-3xl rounded-[24px] bg-white shadow-float">
              <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-6 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
                  <Clapperboard size={14} strokeWidth={1.6} />
                </span>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-ink)]">OmniBoard Planner</div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                    Grounded in {ws.sources.length} sources · {ws.wikiSummary.totalTokens} tokens
                  </div>
                </div>
              </div>

              <div className="px-6 py-8">
                <p className="text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                  I can help you generate onboarding artifacts. What would you like to create today?
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {MODALITIES.map((m) => {
                    const isActive = modality === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setModality(m.id)}
                        className={cn(
                          "group relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all",
                          isActive
                            ? "border-transparent bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.15)]"
                            : "border-[var(--color-border)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-ink)]/30 hover:text-[var(--color-ink)]",
                        )}
                      >
                        <Icon size={13} strokeWidth={1.6} />
                        <span>{m.label}</span>
                        <span className={cn("hidden font-mono text-[10px] uppercase tracking-[0.14em] opacity-60 md:inline", isActive && "text-white/60")}>
                          {m.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2">
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Audience, depth, tone, segments to skip…"
                      className="flex-1 bg-transparent px-3 py-2 text-[14.5px] placeholder:text-[var(--color-ink-whisper)] focus:outline-none"
                    />
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
                      <ArrowUp size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/50 px-6 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
                Step 1 · Plan → Step 2 · Approve outline → Step 3 · Long job → Step 4 · Library
              </div>
            </div>
          </FadeIn>

          {/* Decorative waveform */}
          <div className="relative mx-auto mt-16 flex max-w-3xl items-center justify-center">
            <Waveform className="h-[80px]" bars={40} />
          </div>
        </div>
      </div>

      {/* Artifact panel */}
      <aside className="hidden w-[380px] shrink-0 flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/50 xl:flex">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-5">
          <SectionLabel>Recent artifacts</SectionLabel>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {artifacts.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {artifacts.length === 0 ? (
            <div className="mt-10 text-center">
              <IconTile icon={Radio} size="lg" tone="warm" className="mx-auto" />
              <p className="mt-6 text-[13.5px] text-[var(--color-ink-muted)]">
                No artifacts yet. Plan one with the chatbot.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {artifacts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="mb-3"
                >
                  <Card variant="inset" padding="comfortable" radius="card" interactive className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <IconTile
                        icon={a.modality === "audio" ? Music : a.modality === "video" ? Film : Presentation}
                        size="sm"
                        tone={a.modality === "audio" ? "warm" : "neutral"}
                      />
                      <Badge tone="neutral">{a.modality}</Badge>
                    </div>
                    <h4 className="font-display text-[16px] leading-tight">{a.title}</h4>
                    <div className="text-[11.5px] text-[var(--color-ink-muted)] capitalize">
                      {a.variant}
                      {a.durationSec ? ` · ${Math.round(a.durationSec / 60)} min` : ""}
                    </div>
                    <button className="mt-2 rounded-full bg-[var(--color-warm-stone)] py-2 text-[12.5px] font-medium text-[var(--color-ink)] shadow-warm">
                      {a.modality === "audio" ? "Play audio" : a.modality === "video" ? "Play video" : "View"}
                    </button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </aside>
    </div>
  );
}
