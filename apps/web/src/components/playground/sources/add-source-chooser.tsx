"use client";

import { useEffect, useState } from "react";
import { X, GitBranch, FileText, MessageSquare } from "lucide-react";
import { useStore } from "@/stores";
import { simulateJob } from "@/lib/simulate-latency";
import type { Source, SourceKind, SourceCategory } from "@context-layer/mocks";

const ROWS = [
  {
    eyebrow: "Code",
    kind: "code" as SourceKind,
    accent: "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)]",
    icon: GitBranch,
    integrations: [
      { name: "GitHub", category: "github" as SourceCategory, label: "Connect" },
      { name: "GitLab", category: "gitlab" as SourceCategory, label: "Connect" },
      { name: "Bitbucket", category: "bitbucket" as SourceCategory, label: "Connect" },
      { name: "Gitea", category: "gitea" as SourceCategory, label: "Connect" },
      { name: "Paste URL", category: "url" as SourceCategory, label: "Paste" },
      { name: "Upload zip", category: "upload" as SourceCategory, label: "Upload" },
    ],
  },
  {
    eyebrow: "Docs and Wikis",
    kind: "file" as SourceKind,
    accent: "bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]",
    icon: FileText,
    integrations: [
      { name: "Notion", category: "notion" as SourceCategory, label: "Connect" },
      { name: "Confluence", category: "confluence" as SourceCategory, label: "Connect" },
      { name: "Google Drive", category: "drive" as SourceCategory, label: "Connect" },
      { name: "SharePoint", category: "sharepoint" as SourceCategory, label: "Connect" },
      { name: "Upload file", category: "upload" as SourceCategory, label: "Upload" },
    ],
  },
  {
    eyebrow: "Discussion and Memory",
    kind: "discussion" as SourceKind,
    accent: "bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)]",
    icon: MessageSquare,
    integrations: [
      { name: "Slack", category: "slack" as SourceCategory, label: "Connect" },
      { name: "Discord", category: "discord" as SourceCategory, label: "Connect" },
      { name: "Linear", category: "linear" as SourceCategory, label: "Connect" },
      { name: "Jira", category: "jira" as SourceCategory, label: "Connect" },
      { name: "GitHub Discussions", category: "github" as SourceCategory, label: "Connect" },
    ],
  },
] as const;

export function AddSourceChooser() {
  const isOpen = useStore((s) => s.addSourceChooserOpen);
  const setOpen = useStore((s) => s.setAddSourceChooserOpen);
  const addSource = useStore((s) => s.addSource);

  const [busy, setBusy] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [busy, setOpen]);

  if (!isOpen) return null;

  const handleConnect = async (
    kind: SourceKind,
    integration: { name: string; category: SourceCategory; label: string }
  ) => {
    if (busy) return;
    setBusy(true);

    const steps = [
      "Contacting provider",
      "Authorizing",
      "Cloning repository",
      "Analyzing AST",
      "Building index",
      "Committing to wiki",
    ];

    try {
      const finalize = () => {
        const slug = integration.name.toLowerCase().replace(/\s+/g, "-");
        const source: Source = {
          id: globalThis.crypto.randomUUID(),
          name: `${integration.name} new source`,
          kind,
          category: integration.category,
          url: `https://${slug}.example/new`,
          path: "new",
          status: "indexed",
          autoSync:
            integration.category !== "upload" && integration.category !== "url",
          lastIndexed: new Date().toISOString(),
          lineCount: 0,
          tokenCount: 0,
          primaryLanguage: "Unknown",
          description: "",
        };
        addSource(source);
      };

      const job = simulateJob(steps, finalize, { totalMs: 4500, minStepMs: 400 });
      for await (const event of job) {
        setCurrentStep(event.step);
      }
      setOpen(false);
    } finally {
      setBusy(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-section p-8 max-w-3xl w-full shadow-[var(--shadow-card)] relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-card-heading">Add Source</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            disabled={busy}
            className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-8">
          {ROWS.map((row) => (
            <div key={row.eyebrow} className="space-y-4">
              <p className="text-button-upper text-[#777169]">{row.eyebrow}</p>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {row.integrations.map((int) => (
                  <button
                    key={int.name}
                    type="button"
                    onClick={() => handleConnect(row.kind, int)}
                    disabled={busy}
                    className="flex-shrink-0 flex items-center gap-4 bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow group text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-[6px] flex items-center justify-center ${row.accent}`}
                    >
                      <row.icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-body-medium text-black whitespace-nowrap">
                      {int.name}
                    </span>
                    <span className="ml-auto text-[11px] uppercase tracking-[0.08em] px-3 py-1 bg-black text-white rounded-pill">
                      {int.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {busy && (
          <div className="mt-8 bg-[#eff6ff] text-[#1d4ed8] rounded-card px-3 py-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <p className="text-caption font-medium">
              {currentStep}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
