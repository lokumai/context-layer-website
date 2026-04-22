"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground-store";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";

export function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const createWorkspace = usePlaygroundStore((s) => s.createWorkspace);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    const id = createWorkspace(name.trim());
    router.push(`/play/${id}/sources`);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-lg"
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-[20px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.05)]"
      >
        {/* Ambient halo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(201,165,114,0.18)] to-transparent" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/5 hover:text-[var(--color-ink)]"
          aria-label="Close"
        >
          <X size={15} strokeWidth={1.6} />
        </button>

        <div className="relative px-8 pt-10">
          <IconTile icon={Sparkles} size="md" tone="warm" />
          <h2 className="font-display mt-5 text-[28px] leading-[1.08] tracking-display">
            Create a new <span className="font-editorial">workspace.</span>
          </h2>
          <p className="mt-2 text-[13.5px] text-[var(--color-ink-muted)]">
            Give it a name you'll recognize. You can change it later.
          </p>
        </div>

        <div className="relative px-8 pt-6">
          <label className="block">
            <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Workspace name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. payments-platform"
              autoFocus
              className="w-full rounded-[12px] border border-[var(--color-border)] bg-white px-4 py-3 text-[15px] focus:border-[var(--color-ink)] focus:outline-none focus:shadow-[rgba(138,90,43,0.12)_0_0_0_4px]"
            />
          </label>
        </div>

        <div className="relative mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 px-8 py-5">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
            Routes to Sources
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={!name.trim()} loading={submitting}>
              Create
            </Button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}
