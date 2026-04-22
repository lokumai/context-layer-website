"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { DocsGenCard } from "@context-layer/mocks";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";

const BUNDLE_ICON: Record<string, typeof Sparkles> = {};

export function DocsGenCardView({
  card,
  workspaceId,
}: {
  card: DocsGenCard;
  workspaceId: string;
}) {
  const runCard = usePlaygroundStore((s) => s.runDocsGenCard);
  const [running, setRunning] = useState(false);

  async function handleClick() {
    if (card.state === "done" || running) return;
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    runCard(workspaceId, card.id);
    setRunning(false);
  }

  const isDone = card.state === "done";

  return (
    <SpotlightCard intensity={isDone ? "soft" : "medium"} className="h-full">
      <Card
        variant="inset"
        padding="spacious"
        radius="large"
        interactive
        className="flex h-full flex-col gap-6"
      >
        <div className="flex items-start justify-between">
          <IconTile icon={Sparkles} size="md" tone={isDone ? "neutral" : "warm"} />
          <AnimatePresence mode="wait">
            {isDone && (
              <motion.div
                key="done"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Badge tone="success">
                  <CheckCircle2 size={10} strokeWidth={2} />
                  Done
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h3 className="font-display text-[24px] leading-[1.1] text-[var(--color-ink)]">
            {card.title}
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            {card.description}
          </p>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleClick}
            disabled={running || isDone}
            className={cn(
              "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-3 text-[13.5px] font-medium transition-all",
              running
                ? "bg-[var(--color-warm-stone)] text-[var(--color-ink)] shadow-warm"
                : isDone
                ? "bg-white text-[var(--color-ink-muted)] shadow-inset"
                : "bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] hover:bg-[#2a2a2a]",
            )}
          >
            {running && (
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {running ? (
                <>
                  <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
                  Generating…
                </>
              ) : isDone ? (
                <>
                  <ArrowUpRight size={13} strokeWidth={1.8} />
                  Regenerate
                </>
              ) : (
                <>
                  <Sparkles size={13} strokeWidth={1.8} />
                  Generate
                </>
              )}
            </span>
          </button>
        </div>
      </Card>
    </SpotlightCard>
  );
}
