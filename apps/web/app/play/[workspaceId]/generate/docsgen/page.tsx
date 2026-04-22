"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { BUNDLES, BundleTabs } from "@/components/docsgen/bundle-tabs";
import { DocsGenCardView } from "@/components/docsgen/card";
import type { DocsGenBundle } from "@context-layer/mocks";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionLabel } from "@/components/ui/meta-field";

export default function DocsGenPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [activeBundle, setActiveBundle] = useState<DocsGenBundle>("structure");

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <IconTile icon={Sparkles} size="xl" tone="warm" />
        <h1 className="font-display mt-8 text-[44px] leading-[1.05] tracking-display">
          DocsGen is <span className="font-editorial">locked.</span>
        </h1>
        <p className="mt-4 max-w-md text-[14.5px] text-[var(--color-ink-muted)]">
          Every artifact here is built on top of the Wiki. Generate one first.
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

  const cards = ws.docsGenCards.filter((c) => c.bundle === activeBundle);
  const activeBundleDef = BUNDLES.find((b) => b.id === activeBundle);

  const totalCards = ws.docsGenCards.length;
  const doneCards = ws.docsGenCards.filter((c) => c.state === "done").length;

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 py-12 md:px-10 md:py-16">
      <FadeIn>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
          <div>
            <SectionLabel>Generate · DocsGen</SectionLabel>
            <h1 className="font-display mt-5 text-[56px] leading-[1.02] tracking-display md:text-[72px]">
              Point-in-time <span className="font-editorial">artifacts.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
              Every bundle produces a frozen, exportable artifact. Drop them in a PR, email them to a stakeholder, attach them to a compliance review.
            </p>
          </div>

          <Card variant="outline" padding="spacious" radius="large" className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(201,165,114,0.1)] to-transparent" />
            <div className="relative flex h-full flex-col">
              <SectionLabel>Completion</SectionLabel>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-[48px] leading-none text-[var(--color-ink)]">{doneCards}</span>
                <span className="text-[var(--color-ink-muted)]">/ {totalCards}</span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--color-ink)] transition-all duration-500"
                  style={{ width: `${(doneCards / Math.max(totalCards, 1)) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-[12.5px] text-[var(--color-ink-muted)]">
                {doneCards === 0 ? "Nothing generated yet." : doneCards === totalCards ? "Every bundle complete. Regenerate to refresh." : "Keep going — the Library fills in as you generate."}
              </p>
            </div>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <BundleTabs active={activeBundle} onChange={setActiveBundle} />
      </FadeIn>

      <div>
        <FadeIn key={activeBundle} className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-[36px] leading-[1.05] tracking-display">
                {activeBundleDef?.label}
              </h2>
              <p className="mt-2 text-[13.5px] text-[var(--color-ink-muted)]">
                {activeBundleDef?.tagline}
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
              {cards.length} card{cards.length === 1 ? "" : "s"}
            </span>
          </div>
        </FadeIn>

        {cards.length === 0 ? (
          <Card variant="quiet" radius="section" padding="spacious" className="text-center">
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              No cards defined in this bundle yet. More coming.
            </p>
          </Card>
        ) : (
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <StaggerChild key={c.id}>
                <DocsGenCardView card={c} workspaceId={workspaceId} />
              </StaggerChild>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
