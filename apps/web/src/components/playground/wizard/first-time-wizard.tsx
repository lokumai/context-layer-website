"use client";

import { CheckCircle2, ChevronRight, Circle, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { useStore } from "@/stores";

type SyncStrategy = "per-commit" | "per-pr-merge" | "hourly" | "daily" | "weekly" | "manual";

const STRATEGIES: Array<{ id: SyncStrategy; label: string }> = [
  { id: "per-pr-merge", label: "Per PR merge (balanced default)" },
  { id: "per-commit", label: "Per commit" },
  { id: "hourly", label: "Hourly" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "manual", label: "Manual only" },
];

export function FirstTimeWizard() {
  const active = useStore((s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId));
  const sources = useStore((s) => s.sources);
  const dismissed = useStore((s) => s.firstTimeWizardDismissedFor);
  const dismiss = useStore((s) => s.dismissFirstTimeWizard);
  const openChooser = useStore((s) => s.setAddSourceChooserOpen);
  const [strategy, setStrategy] = useState<SyncStrategy | "">("");

  const step1Done = sources.length > 0;
  const step2Done = strategy !== "";
  const step3Done = active?.hasWiki === true;
  const step4Done = sources.length > 0 && sources.every((s) => s.knowledgeSync === "synced");
  const step5Done = active?.hasIntelligence === true;
  const allDone = step1Done && step2Done && step3Done && step4Done && step5Done;

  const currentStep = useMemo(() => {
    if (!step1Done) return 1;
    if (!step2Done) return 2;
    if (!step3Done) return 3;
    if (!step4Done) return 4;
    if (!step5Done) return 5;
    return 6;
  }, [step1Done, step2Done, step3Done, step4Done, step5Done]);

  if (!active) return null;
  if (dismissed.includes(active.id)) return null;
  // Auto-hide once the workspace is fully bootstrapped (full persona is born
  // with `graduated: true` + `hasIntelligence: true` — no wizard).
  if (active.graduated && active.hasIntelligence) return null;

  const wikiConfigureHref = `/workspace/${active.id}/wiki/configure`;
  const intelligenceHref = `/workspace/${active.id}/intelligence/overview`;

  return (
    <section
      className="mb-8 rounded-section p-6 lg:p-7 bg-[#eff6ff] border border-[rgba(29,78,216,0.12)] relative"
      data-testid="first-time-wizard"
    >
      <button
        type="button"
        aria-label="Dismiss wizard"
        onClick={() => dismiss(active.id)}
        className="absolute top-4 right-4 text-[#1d4ed8]/60 hover:text-[#1d4ed8]"
      >
        <X size={16} strokeWidth={1.5} />
      </button>

      <header className="space-y-1 mb-5">
        <p className="text-button-upper text-[#1d4ed8]">Getting Started</p>
        <h2 className="text-card-heading text-black">First-time workspace setup</h2>
        <p className="text-caption text-[#4e4e4e]">
          Five steps to a fully-grounded workspace. Complete them in order — you can always come
          back.
        </p>
      </header>

      <ol className="space-y-2">
        <WizardRow
          step={1}
          state={rowState(step1Done, currentStep === 1)}
          title="Add a source"
          hint="Connect an integration or upload manually."
          cta={!step1Done ? { label: "Add source", onClick: () => openChooser(true) } : undefined}
        />
        <WizardRow
          step={2}
          state={rowState(step2Done, currentStep === 2)}
          title="Choose a sync strategy"
          hint="How often the Wiki should refresh."
          interactive={
            currentStep === 2 ? (
              <div className="mt-2">
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as SyncStrategy)}
                  className="text-caption bg-white rounded-card px-3 py-1.5 shadow-[var(--shadow-inset-border)] focus:outline-none"
                >
                  <option value="">Select a strategy…</option>
                  {STRATEGIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null
          }
        />
        <WizardRow
          step={3}
          state={rowState(step3Done, currentStep === 3)}
          title="Configure & generate the first Wiki"
          hint="Pick which sources feed the Wiki and any custom instructions."
          link={!step3Done ? { label: "Open Wiki Configure", href: wikiConfigureHref } : undefined}
        />
        <WizardRow
          step={4}
          state={rowState(step4Done, currentStep === 4)}
          title="Sync sources with the Wiki"
          hint={
            step4Done
              ? "Every source is in lock-step with the Wiki."
              : "Some sources are still outdated — run Force Sync from Wiki Configure."
          }
          link={!step4Done ? { label: "Sync now", href: wikiConfigureHref } : undefined}
        />
        <WizardRow
          step={5}
          state={rowState(step5Done, currentStep === 5)}
          title="Generate Intelligence"
          hint="Light up the live health, security, coverage, and dependency dashboards."
          link={!step5Done ? { label: "Open Intelligence", href: intelligenceHref } : undefined}
        />
      </ol>

      {allDone ? (
        <p className="mt-4 text-caption text-[#4e4e4e]">
          <button
            type="button"
            onClick={() => dismiss(active.id)}
            className="underline underline-offset-2 hover:text-black"
            data-testid="wizard-hide"
          >
            All set — hide this wizard
          </button>
        </p>
      ) : (
        <p className="mt-4 text-caption text-[#4e4e4e]">
          <button
            type="button"
            onClick={() => dismiss(active.id)}
            className="underline underline-offset-2 hover:text-black"
          >
            Hide for now (you can re-open from settings)
          </button>
        </p>
      )}
    </section>
  );
}

type RowState = "active" | "done" | "pending";

function rowState(done: boolean, isActive: boolean): RowState {
  if (done) return "done";
  if (isActive) return "active";
  return "pending";
}

function WizardRow({
  step,
  state,
  title,
  hint,
  cta,
  link,
  interactive,
}: {
  step: number;
  state: RowState;
  title: string;
  hint: string;
  cta?: { label: string; onClick: () => void };
  link?: { label: string; href: string };
  interactive?: React.ReactNode;
}) {
  return (
    <li
      className="flex items-start gap-3 bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)]"
      data-testid={`wizard-step-${step}`}
      data-state={state}
    >
      <span className="mt-0.5 shrink-0">
        {state === "done" ? (
          <CheckCircle2 size={20} strokeWidth={1.5} className="text-[#047857]" />
        ) : state === "active" ? (
          <ChevronRight size={20} strokeWidth={1.5} className="text-[#1d4ed8]" />
        ) : (
          <Circle size={20} strokeWidth={1.5} className="text-[#9ca3af]" />
        )}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-caption text-[#777169] font-semibold">
            {step.toString().padStart(2, "0")}
          </span>
          <span className="text-body-medium text-black">{title}</span>
          {state === "done" ? <StatusPill tone="indexed">Done</StatusPill> : null}
          {state === "active" ? <StatusPill tone="info">In progress</StatusPill> : null}
        </div>
        <p className="text-caption text-[#4e4e4e] mt-0.5">{hint}</p>
        {interactive}
        {cta ? (
          <button
            type="button"
            onClick={cta.onClick}
            className="mt-2 inline-flex items-center gap-1 text-caption text-[#1d4ed8] hover:text-[#1e40af] underline underline-offset-2"
          >
            {cta.label} →
          </button>
        ) : null}
        {link ? (
          <Link
            href={link.href}
            className="mt-2 inline-flex items-center gap-1 text-caption text-[#1d4ed8] hover:text-[#1e40af] underline underline-offset-2"
            data-testid={`wizard-step-${step}-link`}
          >
            {link.label} →
          </Link>
        ) : null}
      </div>
    </li>
  );
}
