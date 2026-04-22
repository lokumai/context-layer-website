"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Workflow,
} from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { CreateWorkspaceModal } from "@/components/workspaces/create-workspace-modal";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { Badge, Dot } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/meta-field";

const STAGE_LABEL: Record<string, string> = {
  empty: "No sources",
  "sources-only": "Sources only",
  "wiki-ready": "Wiki ready",
  graduated: "Graduated",
};

export default function WorkspacesPage() {
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const persona = usePlaygroundStore((s) => s.persona);
  const [modalOpen, setModalOpen] = useState(false);

  const isEmpty = workspaces.length === 0;

  return (
    <div className="relative mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-6 py-16 md:px-10 md:py-24">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 -z-10">
        <div className="absolute inset-0 mesh-warm opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-background)]" />
      </div>

      {/* Header */}
      <FadeIn>
        <div className="flex items-end justify-between gap-8">
          <div>
            <SectionLabel>Workspaces</SectionLabel>
            <h1 className="font-display mt-5 text-[56px] leading-[1.02] tracking-display md:text-[72px]">
              {isEmpty ? (
                <>Start with a <span className="font-editorial">new</span> workspace.</>
              ) : (
                <>{workspaces.length} living <span className="font-editorial">knowledge base{workspaces.length === 1 ? "" : "s"}</span>.</>
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] text-[var(--color-ink-muted)]">
              {isEmpty
                ? "A workspace is a collection of code and docs — one repo or nine, one team or a company. Create your first to see the Context Layer in motion."
                : "Each workspace carries its own sources, Wiki, Intelligence, and Library. Switch freely — or start a new one."}
            </p>
          </div>
          {!isEmpty && (
            <Button variant="warm" size="lg" onClick={() => setModalOpen(true)} uppercase>
              <Plus size={14} strokeWidth={1.8} />
              Create workspace
            </Button>
          )}
        </div>
      </FadeIn>

      {/* Content */}
      <div className="mt-16">
        {isEmpty ? (
          <EmptyState onCreate={() => setModalOpen(true)} persona={persona} />
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaggerChild className="lg:col-span-3">
              <CreateTile onClick={() => setModalOpen(true)} />
            </StaggerChild>
            {workspaces.map((ws) => (
              <StaggerChild key={ws.workspace.id}>
                <WorkspaceCard ws={ws} />
              </StaggerChild>
            ))}
          </Stagger>
        )}
      </div>

      {modalOpen && <CreateWorkspaceModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function EmptyState({ onCreate, persona }: { onCreate: () => void; persona: string | null }) {
  return (
    <FadeIn>
      <SpotlightCard intensity="medium">
        <Card
          variant="outline"
          radius="section"
          padding="spacious"
          className="relative flex flex-col items-center gap-8 overflow-hidden px-8 py-20 text-center"
        >
          <div className="pointer-events-none absolute inset-0 mesh-warm opacity-60" />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

          <IconTile icon={Sparkles} size="xl" tone="warm" className="relative" />
          <div className="relative">
            <h2 className="font-display text-[44px] leading-[1.05] tracking-display md:text-[56px]">
              Create your <span className="font-editorial">first</span> workspace.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
              Name it anything. Add a source next. Generate a Wiki. The playground unlocks as you go — and you can reset back to zero anytime.
            </p>
          </div>
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="xl" onClick={onCreate}>
              <Plus size={15} strokeWidth={1.8} />
              Create workspace
            </Button>
            <Button variant="outline" size="xl">
              Read the tour
            </Button>
          </div>
          {persona === "empty" && (
            <p className="relative max-w-md text-[12px] text-[var(--color-ink-whisper)]">
              Tip: once you've created a workspace, the Sources page will offer a one-click "Quick-populate" shortcut — only available for the empty demo persona.
            </p>
          )}
        </Card>
      </SpotlightCard>
    </FadeIn>
  );
}

function CreateTile({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 rounded-[20px] border border-dashed border-[var(--color-border-strong)] bg-white/40 px-8 py-6 text-left transition-all hover:border-[var(--color-ink)] hover:bg-white"
    >
      <div className="flex items-center gap-5">
        <IconTile icon={Plus} size="md" tone="warm" />
        <div>
          <div className="font-display text-[22px] leading-tight">Create a new workspace</div>
          <div className="text-[13.5px] text-[var(--color-ink-muted)]">A fresh canvas for any repo, team, or customer project.</div>
        </div>
      </div>
      <ArrowUpRight size={18} strokeWidth={1.6} className="text-[var(--color-ink-muted)] transition-all duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--color-ink)]" />
    </motion.button>
  );
}

function WorkspaceCard({ ws }: { ws: ReturnType<typeof usePlaygroundStore.getState>["workspaces"][number] }) {
  const { workspace, sources, wikiSummary, libraryItems, chatThreads } = ws;
  const href = `/play/${workspace.id}/${wikiSummary ? "knowledge/wiki" : "sources"}`;
  const stage = workspace.stage;

  return (
    <Link href={href} className="group block h-full">
      <SpotlightCard intensity="soft" className="h-full">
        <Card variant="inset" padding="spacious" radius="large" interactive className="flex h-full flex-col gap-6">
          <div className="flex items-start justify-between">
            <IconTile icon={Workflow} size="md" tone={stage === "graduated" ? "ink" : "neutral"} />
            <Badge tone={stage === "graduated" ? "success" : stage === "wiki-ready" ? "info" : "warn"}>
              {STAGE_LABEL[stage] ?? stage}
            </Badge>
          </div>

          <div>
            <h2 className="font-display text-[28px] leading-[1.08] text-[var(--color-ink)]">{workspace.name}</h2>
            {wikiSummary && (
              <div className="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--color-ink-muted)]">
                <Dot tone="success" />
                <span className="font-mono uppercase tracking-[0.14em]">Live · synced {wikiSummary.lastSyncedAt.slice(0, 10)}</span>
              </div>
            )}
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[var(--color-border-subtle)] pt-5">
            <MetaCell icon={Boxes} label="Sources" value={`${sources.length}`} />
            <MetaCell icon={CheckCircle2} label="Artifacts" value={`${libraryItems.length}`} />
            <MetaCell icon={Clock} label="Threads" value={`${chatThreads.length}`} />
          </div>

          <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4 text-[12.5px] text-[var(--color-ink-muted)]">
            <span className="font-mono uppercase tracking-[0.14em]">Open workspace</span>
            <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
          </div>
        </Card>
      </SpotlightCard>
    </Link>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
        <Icon size={10} strokeWidth={1.8} />
        {label}
      </span>
      <span className="font-display text-[22px] leading-none text-[var(--color-ink)]">{value}</span>
    </div>
  );
}
