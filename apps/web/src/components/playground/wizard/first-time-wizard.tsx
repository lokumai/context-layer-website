"use client";

import { CheckCircle2, Circle, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/stores";
import { StatusPill } from "@/components/marketing/status-pill";

type SyncStrategy =
  | "per-commit"
  | "per-pr-merge"
  | "hourly"
  | "daily"
  | "weekly"
  | "manual";

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

  const currentStep = useMemo(() => {
    if (!step1Done) return 1;
    if (!step2Done) return 2;
    return 3;
  }, [step1Done, step2Done]);

  if (!active || active.graduated) return null;
  if (dismissed.includes(active.id)) return null;

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
          Five steps to a living Wiki. Complete them in order — you can always come back.
        </p>
      </header>

      <ol className="space-y-2">
        <WizardRow
          step={1}
          state={step1Done ? "done" : currentStep === 1 ? "active" : "pending"}
          title="Add a source"
          hint="Connect an integration or upload manually."
          cta={!step1Done ? { label: "Add source", onClick: () => openChooser(true) } : undefined}
        />
        <WizardRow
          step={2}
          state={step2Done ? "done" : currentStep === 2 ? "active" : "pending"}
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
        <WizardRow step={3} state="phase7" title="Configure the Wiki" hint="Pick which sources feed the Wiki and any instructions." />
        <WizardRow step={4} state="phase7" title="Generate the first Wiki" hint="The only inherently manual generation step." />
        <WizardRow step={5} state="phase7" title="(Optional) Generate Intelligence" hint="Light up the live dashboards." />
      </ol>

      <p className="mt-4 text-caption text-[#4e4e4e]">
        <button
          type="button"
          onClick={() => dismiss(active.id)}
          className="underline underline-offset-2 hover:text-black"
        >
          Continue exploring Sources
        </button>
      </p>
    </section>
  );
}

type RowState = "active" | "done" | "pending" | "phase7";

function WizardRow({
  step,
  state,
  title,
  hint,
  cta,
  interactive,
}: {
  step: number;
  state: RowState;
  title: string;
  hint: string;
  cta?: { label: string; onClick: () => void };
  interactive?: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)]">
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
          <span className="text-caption text-[#777169] font-semibold">0{step}</span>
          <span className="text-body-medium text-black">{title}</span>
          {state === "phase7" ? <StatusPill tone="neutral">Phase 7+</StatusPill> : null}
          {state === "done" ? <StatusPill tone="indexed">Done</StatusPill> : null}
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
      </div>
    </li>
  );
}
