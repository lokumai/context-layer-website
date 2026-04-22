"use client";

import { motion } from "motion/react";
import {
  Cloud,
  FileUp,
  GitBranch,
  Hash,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { IconTile } from "@/components/ui/icon-tile";
import { Button } from "@/components/ui/button";

const INTEGRATIONS: Array<{ icon: LucideIcon; label: string; hint: string; group: string }> = [
  { icon: GitBranch, label: "GitHub", hint: "OAuth · auto-sync", group: "Code" },
  { icon: GitBranch, label: "GitLab", hint: "OAuth · auto-sync", group: "Code" },
  { icon: Cloud, label: "Google Drive", hint: "OAuth · folders", group: "Docs" },
  { icon: StickyNote, label: "Notion", hint: "OAuth · workspaces", group: "Docs" },
  { icon: Hash, label: "Slack", hint: "OAuth · channels", group: "Memory" },
  { icon: Hash, label: "Linear", hint: "OAuth · projects", group: "Memory" },
  { icon: FileUp, label: "Upload file", hint: "Manual · one-off", group: "Manual" },
  { icon: LinkIcon, label: "Paste URL", hint: "Manual · one-off", group: "Manual" },
];

export function AddSourceChooser({
  workspaceId,
  onClose,
}: {
  workspaceId: string;
  onClose: () => void;
}) {
  const addQuickPopulate = usePlaygroundStore((s) => s.addQuickPopulateSources);
  const persona = usePlaygroundStore((s) => s.persona);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[20px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.05)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(201,165,114,0.2)] to-transparent" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
          aria-label="Close"
        >
          <X size={15} strokeWidth={1.6} />
        </button>

        <div className="relative px-8 pt-10">
          <IconTile icon={Sparkles} size="md" tone="warm" />
          <h2 className="font-display mt-5 text-[30px] leading-[1.05] tracking-display">
            Connect a <span className="font-editorial">source.</span>
          </h2>
          <p className="mt-2 text-[13.5px] text-[var(--color-ink-muted)]">
            OAuth integrations are the happy path — they enable continuous sync. Manual uploads are always available as a fallback.
          </p>
        </div>

        {persona === "empty" && (
          <div className="relative mx-8 mt-6 overflow-hidden rounded-[16px] border border-[rgba(201,165,114,0.3)] bg-gradient-to-br from-[rgba(201,165,114,0.1)] to-[rgba(245,242,239,0.6)] p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
                <Zap size={16} strokeWidth={1.8} />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-[18px] leading-tight">Demo shortcut</h3>
                <p className="mt-1 text-[12.5px] text-[var(--color-ink-muted)]">
                  Populate all 9 microservice repositories in one click. Only shown for the <span className="font-mono">empty</span> persona.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  addQuickPopulate(workspaceId);
                  onClose();
                }}
              >
                Quick-populate
              </Button>
            </div>
          </div>
        )}

        <div className="relative px-8 pt-6 pb-8">
          <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-whisper)]">
            Integrations
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {INTEGRATIONS.map((i) => (
              <button
                key={i.label}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-[12px] border border-[var(--color-border)] bg-white p-3 text-left transition-all hover:border-[var(--color-ink)]/30 hover:shadow-inset"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)]">
                  <i.icon size={15} strokeWidth={1.6} />
                </span>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-[var(--color-ink)]">{i.label}</div>
                  <div className="text-[11px] text-[var(--color-ink-muted)]">{i.hint}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-5 text-[11.5px] text-[var(--color-ink-whisper)]">
            Integration buttons are placeholders in this mock. Use Quick-populate to seed the demo dataset.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
