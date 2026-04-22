"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  BookOpen,
  Gauge,
  GitBranch,
  ShieldCheck,
  Sparkles,
  TestTube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePlaygroundStore } from "@/store/playground-store";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  health: Gauge,
  security: ShieldCheck,
  tests: TestTube,
  dependencies: GitBranch,
};

export default function IntelligencePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateIntelligence = usePlaygroundStore((s) => s.generateIntelligence);
  const [generating, setGenerating] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return <GateState workspaceId={workspaceId} message="Generate the Wiki first" hint="Intelligence depends on an indexed Wiki." />;
  }

  if (ws.intelligenceDashboards.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={Sparkles} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[48px] leading-[1.05] tracking-display md:text-[56px]">
          Generate <span className="font-editorial">Intelligence.</span>
        </h1>
        <p className="mt-5 max-w-lg text-[15px] text-[var(--color-ink-muted)]">
          Health, security, tests, and dependency dashboards arrive after the first analysis run. Chains automatically after every Wiki sync going forward.
        </p>
        <Button
          variant="primary"
          size="xl"
          className="mt-10"
          onClick={async () => {
            setGenerating(true);
            await new Promise((r) => setTimeout(r, 1500));
            generateIntelligence(workspaceId);
            setGenerating(false);
          }}
          loading={generating}
          disabled={generating}
        >
          {generating ? "Analyzing…" : (
            <>
              <Sparkles size={14} strokeWidth={1.8} />
              Generate Intelligence
            </>
          )}
        </Button>
      </div>
    );
  }

  const activeDash = active ? ws.intelligenceDashboards.find((d) => d.id === active) : ws.intelligenceDashboards[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/40 p-6 md:flex">
        <SectionLabel>Intelligence</SectionLabel>
        <h2 className="font-display mt-3 text-[24px] leading-tight">Code Intelligence</h2>
        <div className="my-6 divider-fade" />
        <nav className="flex flex-col gap-1">
          {ws.intelligenceDashboards.map((d) => {
            const Icon = CATEGORY_ICON[d.category] ?? Gauge;
            const isActive = activeDash?.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left transition-colors",
                  isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="intel-active"
                    className="absolute inset-0 rounded-[12px] bg-white shadow-whisper"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <Icon size={14} strokeWidth={1.6} className="relative z-[1]" />
                <span className="relative z-[1] text-[13.5px] font-medium">{d.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[12px] border border-[var(--color-border)] bg-white p-4">
          <SectionLabel>Auto-refresh</SectionLabel>
          <p className="mt-2 text-[11.5px] text-[var(--color-ink-muted)] leading-relaxed">
            Regenerates automatically after every Wiki sync. Manual refresh is available anytime.
          </p>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-12 md:px-12 md:py-16">
        <FadeIn key={activeDash?.id}>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <SectionLabel>{activeDash?.category}</SectionLabel>
              <h1 className="font-display mt-5 text-[48px] leading-[1.02] tracking-display md:text-[60px]">
                {activeDash?.title}
              </h1>
            </div>
            <div className="hidden items-center gap-2 text-[11.5px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-whisper)] md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
              Fresh
            </div>
          </div>

          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activeDash?.widgets.map((w) => (
              <StaggerChild key={w.id}>
                <SpotlightCard intensity="soft" className="h-full">
                  <Card variant="inset" padding="spacious" radius="large" className="flex h-full flex-col gap-4">
                    <SectionLabel>{w.title}</SectionLabel>
                    <div className="font-display text-[44px] leading-[1] text-[var(--color-ink)]">
                      {w.value}
                    </div>
                    {w.detail && (
                      <div className="mt-auto border-t border-[var(--color-border-subtle)] pt-3 text-[12.5px] text-[var(--color-ink-muted)]">
                        {w.detail}
                      </div>
                    )}
                  </Card>
                </SpotlightCard>
              </StaggerChild>
            ))}
          </Stagger>

          <div className="mt-16 flex flex-col items-start gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-8 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
                Exportable snapshot
              </div>
              <div className="mt-1 text-[14px] text-[var(--color-ink)]">
                Need a PDF for the quarterly security review? DocsGen's Health &amp; Risk bundle produces it.
              </div>
            </div>
            <Link href={`/play/${workspaceId}/generate/docsgen`}>
              <Button variant="outline" size="md">Open DocsGen</Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function GateState({ workspaceId, message, hint }: { workspaceId: string; message: string; hint: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <IconTile icon={BookOpen} size="xl" tone="warm" />
      <h1 className="font-display mt-8 text-[44px] leading-[1.05] tracking-display">{message}</h1>
      <p className="mt-4 text-[15px] text-[var(--color-ink-muted)]">{hint}</p>
      <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="mt-10">
        <Button variant="primary" size="xl">
          <Sparkles size={14} strokeWidth={1.8} />
          Generate Wiki
        </Button>
      </Link>
    </div>
  );
}
