"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Files,
  GitCommit,
  Gauge,
  Layers,
  Radio,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerChild } from "@/components/motion/stagger";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { Badge, Dot } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/meta-field";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Waveform } from "@/components/ui/atmosphere";
import { KnowledgeGraph } from "@/components/wiki/knowledge-graph";

export default function WikiStatusPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return <NoWikiState workspaceId={workspaceId} />;
  }

  const s = ws.wikiSummary;

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-16 px-6 py-12 md:px-10 md:py-16">
      {/* Asymmetric header */}
      <FadeIn>
        <div className="grid gap-10 md:grid-cols-[2.2fr_1fr]">
          <div>
            <SectionLabel>Wiki · Status</SectionLabel>
            <h1 className="font-display mt-5 text-[52px] leading-[1.02] tracking-display text-[var(--color-ink)] md:text-[68px]">
              A <span className="font-editorial">living</span> knowledge base of {ws.sources.length}{" "}
              source{ws.sources.length === 1 ? "" : "s"}.
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-ink-muted)]">
              Auto-synced on every PR merge to main. Stored as markdown in git — every change is a commit, every commit is an audit entry.
            </p>
          </div>

          <aside className="flex flex-col justify-end gap-4 border-l border-[var(--color-border)] pl-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                Sync heartbeat
              </div>
              <div className="mt-2 flex items-center gap-2 font-display text-[24px] capitalize leading-none text-[var(--color-ink)]">
                <Dot tone={s.syncStatus === "live" ? "success" : s.syncStatus === "syncing" ? "warn" : "neutral"} />
                {s.syncStatus}
              </div>
            </div>
            <div className="text-[12px] text-[var(--color-ink-muted)]">
              Last synced <span className="font-medium text-[var(--color-ink)]">{s.lastSyncedAt.slice(0, 10)}</span>
            </div>
            <Link
              href={`/play/${workspaceId}/knowledge/wiki/configure`}
              className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink-whisper)] underline-offset-[6px] hover:decoration-[var(--color-ink)]"
            >
              Force sync now
              <ArrowUpRight size={11} strokeWidth={1.8} />
            </Link>
          </aside>
        </div>
      </FadeIn>

      {/* Stats bento */}
      <div className="grid gap-6 md:grid-cols-12">
        <Stagger className="grid grid-cols-2 gap-4 md:col-span-8">
          <StaggerChild>
            <StatCard
              icon={Gauge}
              label="Coverage Score"
              value={`${s.coverageScore}`}
              suffix="%"
              body="Percentage of the code + docs reachable in the Wiki."
            />
          </StaggerChild>
          <StaggerChild>
            <StatCard icon={Files} label="Total Tokens" value={s.totalTokens} body="Canonical knowledge base size." />
          </StaggerChild>
          <StaggerChild>
            <StatCard icon={Radio} label="Missing Context" value={`${s.missingContextCount}`} body="Files or folders not yet documented." />
          </StaggerChild>
          <StaggerChild>
            <StatCard icon={Layers} label="Active Repos" value={`${s.activeRepoIds.length}`} body="Currently feeding the Wiki." />
          </StaggerChild>
        </Stagger>

        {/* Activity timeline */}
        <div className="md:col-span-4">
          <Card variant="inset" padding="spacious" radius="large" className="h-full">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
                Recent activity
              </h3>
              <Link
                href={`/play/${workspaceId}/knowledge/wiki/logs`}
                className="text-[11.5px] font-medium text-[var(--color-ink-muted)] underline decoration-[var(--color-ink-whisper)] underline-offset-[5px] hover:text-[var(--color-ink)] hover:decoration-[var(--color-ink)]"
              >
                View all
              </Link>
            </div>

            <ul className="mt-6 space-y-6">
              {ws.wikiJobs.slice(0, 5).map((j, i) => (
                <li key={j.id} className="relative flex flex-col gap-1 border-l border-[var(--color-border)] pl-5">
                  <span
                    className={`absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full ${
                      i === 0 ? "bg-[var(--color-ink)]" : "bg-[var(--color-border-strong)]"
                    }`}
                  />
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink)]">
                    <GitCommit size={12} strokeWidth={1.8} className="text-[var(--color-ink-muted)]" />
                    <span className="capitalize font-medium">{j.type}</span>
                    <span className="text-[var(--color-ink-whisper)]">·</span>
                    <span className="text-[var(--color-ink-muted)]">{j.trigger}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11.5px] text-[var(--color-ink-whisper)]">
                    <span className="font-mono">{j.startedAt.slice(0, 10)}</span>
                    <span className="flex items-center gap-1">
                      <Timer size={10} strokeWidth={1.8} />
                      {(j.durationMs / 1000).toFixed(0)}s
                    </span>
                    <Badge tone={j.status === "success" ? "success" : j.status === "failed" ? "danger" : "warn"}>
                      {j.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Knowledge graph + repo chips */}
      <FadeIn>
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <KnowledgeGraph />
          </div>

          <Card variant="inset" padding="spacious" radius="large" className="md:col-span-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Active repos</SectionLabel>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                <AnimatedNumber value={s.activeRepoIds.length} /> of {ws.sources.length}
              </span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.activeRepoIds.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 font-mono text-[11.5px] text-[var(--color-ink)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
              <SectionLabel>Knowledge density</SectionLabel>
              <div className="mt-3 flex justify-center">
                <Waveform className="h-[60px]" bars={24} />
              </div>
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* Quick actions */}
      <FadeIn>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            icon={BookOpen}
            title="Read the Wiki"
            hint="3-layer narrative view"
            href={`/play/${workspaceId}/knowledge/wiki/view`}
          />
          <QuickAction
            icon={GitCommit}
            title="Change log"
            hint="Every sync is a commit"
            href={`/play/${workspaceId}/knowledge/wiki/logs`}
          />
          <QuickAction
            icon={Radio}
            title="Configure sync"
            hint="Strategy & sources"
            href={`/play/${workspaceId}/knowledge/wiki/configure`}
          />
        </div>
      </FadeIn>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  body,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  body: string;
}) {
  return (
    <Card variant="inset" padding="spacious" radius="large" className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <IconTile icon={Icon} size="sm" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">{label}</span>
      </div>
      <div className="font-display text-[56px] leading-[1] text-[var(--color-ink)]">
        {value}
        {suffix && <span className="text-[var(--color-ink-muted)]">{suffix}</span>}
      </div>
      <p className="text-[12.5px] text-[var(--color-ink-muted)]">{body}</p>
    </Card>
  );
}

function QuickAction({
  icon: Icon,
  title,
  hint,
  href,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card variant="inset" padding="comfortable" radius="card" interactive className="flex items-center gap-4">
        <IconTile icon={Icon} size="md" />
        <div className="flex-1">
          <div className="font-display text-[18px] leading-none">{title}</div>
          <div className="mt-1 text-[12px] text-[var(--color-ink-muted)]">{hint}</div>
        </div>
        <ArrowUpRight
          size={14}
          strokeWidth={1.6}
          className="text-[var(--color-ink-whisper)] transition-all duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--color-ink)]"
        />
      </Card>
    </Link>
  );
}

function NoWikiState({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <IconTile icon={BookOpen} size="xl" tone="warm" />
      <h2 className="font-display mt-8 text-[48px] leading-[1.05] tracking-display">
        No Wiki <span className="font-editorial">yet.</span>
      </h2>
      <p className="mt-5 text-[15px] text-[var(--color-ink-muted)]">
        Generate one from your sources to unlock Intelligence, Chatbot, Generate, and Library.
      </p>
      <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="mt-10">
        <Button variant="primary" size="xl">
          Configure & generate
        </Button>
      </Link>
    </div>
  );
}
