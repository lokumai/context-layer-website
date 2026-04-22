"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, GitBranch, RotateCw, Sparkles, Trash2 } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

type StrategyId = "per-commit" | "pr-merge" | "hourly" | "daily" | "weekly" | "manual";
const STRATEGIES: Array<{ id: StrategyId; title: string; hint: string; recommended?: boolean }> = [
  { id: "per-commit", title: "Per commit", hint: "Every push to tracked branches" },
  { id: "pr-merge", title: "Per PR merge", hint: "Balanced · captures stable state", recommended: true },
  { id: "hourly", title: "Hourly", hint: "Even cadence, time-based" },
  { id: "daily", title: "Daily", hint: "Overnight refresh" },
  { id: "weekly", title: "Weekly", hint: "Slow-moving repos" },
  { id: "manual", title: "Manual only", hint: "User-triggered" },
];

export default function WikiConfigurePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateWiki = usePlaygroundStore((s) => s.generateWiki);
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState<StrategyId>("pr-merge");
  const [instructions, setInstructions] = useState("");

  if (!ws) return null;

  const hasSources = ws.sources.length > 0;
  const hasWiki = ws.wikiSummary != null;

  async function handleGenerate() {
    if (!hasSources || generating) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    generateWiki(workspaceId);
    setGenerating(false);
    router.push(`/play/${workspaceId}/knowledge/wiki`);
  }

  if (!hasSources) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={GitBranch} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[40px] leading-[1.05] tracking-display">
          Add sources <span className="font-editorial">first.</span>
        </h1>
        <p className="mt-4 text-[14.5px] text-[var(--color-ink-muted)]">
          The Wiki needs at least one indexed source to generate from.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 py-12 md:px-10 md:py-16">
      <FadeIn>
        <SectionLabel>Wiki · Configure</SectionLabel>
        <h1 className="font-display mt-5 text-[52px] leading-[1.02] tracking-display">
          {hasWiki ? (
            <>Tune the <span className="font-editorial">sync.</span></>
          ) : (
            <>Generate the <span className="font-editorial">Wiki.</span></>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
          The Wiki auto-syncs on the strategy you choose. The first generation is the only manual step — after that, it maintains itself.
        </p>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Strategy */}
          <Card variant="inset" padding="spacious" radius="large">
            <div className="flex items-center justify-between">
              <SectionLabel>Sync strategy</SectionLabel>
              {strategy === "pr-merge" && (
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-warn-fg)]">
                  Recommended
                </span>
              )}
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {STRATEGIES.map((s) => {
                const active = strategy === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStrategy(s.id)}
                    className={cn(
                      "relative flex items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-all",
                      active
                        ? "border-[var(--color-ink)] bg-[var(--color-surface-elevated)] shadow-inset"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-ink)]/30",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-[var(--color-ink)] bg-[var(--color-ink)]" : "border-[var(--color-border-strong)]",
                      )}
                    >
                      {active && <Check size={10} strokeWidth={2.4} className="text-white" />}
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-ink)]">{s.title}</div>
                      <div className="text-[11.5px] text-[var(--color-ink-muted)]">{s.hint}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Instructions */}
          <Card variant="inset" padding="spacious" radius="large">
            <SectionLabel>Custom instructions</SectionLabel>
            <p className="mt-3 text-[13.5px] text-[var(--color-ink-muted)]">
              Optional. Tell the agent what to emphasize, what tone to use, what to exclude. Up to ~5K tokens.
            </p>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              placeholder="e.g. 'Focus on the saga orchestration. Don't document legacy endpoints marked deprecated.'"
              className="mt-5 w-full resize-none rounded-[12px] border border-[var(--color-border)] bg-white p-4 text-[14px] leading-relaxed text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none focus:shadow-[rgba(138,90,43,0.12)_0_0_0_3px]"
            />
          </Card>
        </div>

        {/* Summary / action column */}
        <Card variant="outline" padding="spacious" radius="large" className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(201,165,114,0.15)] to-transparent" />
          <div className="relative flex h-full flex-col gap-6">
            <div>
              <SectionLabel>Summary</SectionLabel>
              <h3 className="font-display mt-3 text-[28px] leading-[1.1]">
                {ws.sources.length} source{ws.sources.length === 1 ? "" : "s"} · <span className="font-editorial">{STRATEGIES.find((s) => s.id === strategy)?.title.toLowerCase()}</span>
              </h3>
            </div>

            <ul className="space-y-2 text-[12.5px] text-[var(--color-ink-muted)]">
              <li className="flex items-center gap-2">
                <Check size={12} strokeWidth={1.8} className="text-emerald-600" />
                Workspace-level summary
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} strokeWidth={1.8} className="text-emerald-600" />
                Per-repo deep pages
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} strokeWidth={1.8} className="text-emerald-600" />
                llms.txt index
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} strokeWidth={1.8} className="text-emerald-600" />
                Auto-chains Intelligence refresh
              </li>
            </ul>

            <motion.div layout className="mt-auto space-y-2">
              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={handleGenerate}
                loading={generating}
                disabled={generating}
              >
                {generating ? "Generating…" : hasWiki ? (
                  <>
                    <RotateCw size={14} strokeWidth={1.8} />
                    Force rebuild
                  </>
                ) : (
                  <>
                    <Sparkles size={14} strokeWidth={1.8} />
                    Generate Wiki
                  </>
                )}
              </Button>
              {hasWiki && (
                <Button variant="ghost" size="md" className="w-full">
                  <Trash2 size={13} strokeWidth={1.6} />
                  Delete wiki
                </Button>
              )}
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  );
}
