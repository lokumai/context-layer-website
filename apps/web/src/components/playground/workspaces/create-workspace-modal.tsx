"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";

const STEPS = ["Allocating workspace", "Wiring providers", "Ready"] as const;

const DESCRIPTION_MAX = 280;

export function CreateWorkspaceModal() {
  const open = useStore((s) => s.createWorkspaceModalOpen);
  const close = useStore((s) => s.setCreateWorkspaceModalOpen);
  const createWorkspace = useStore((s) => s.createWorkspace);
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setBusy(false);
      setProgress(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) close(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close, busy]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);

    const iter = simulateJob(
      [...STEPS],
      () => createWorkspace(trimmed, description.trim() || undefined),
      { totalMs: 1200, minStepMs: 250 },
    );
    let newId = "";
    while (true) {
      const next = await iter.next();
      if (next.done) {
        newId = next.value;
        break;
      }
      setProgress(next.value.step);
    }
    close(false);
    router.push(`/workspace/${newId}/sources`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-section shadow-[var(--shadow-card)] p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-button-upper text-[#777169]">New</p>
            <h2 className="text-card-heading text-black mt-1">Create Workspace</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => !busy && close(false)}
            className="text-[#777169] hover:text-black transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-caption text-[#4e4e4e] block">
              Name
            </label>
            <input
              id="workspace-name"
              name="name"
              type="text"
              autoComplete="off"
              required
              disabled={busy}
              placeholder="e.g. Customer Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-body-standard text-black bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] placeholder:text-[#aaa] focus:outline-none focus:shadow-[var(--shadow-outline-ring)] transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="workspace-description" className="text-caption text-[#4e4e4e]">
                Description <span className="text-[#9ca3af]">(optional)</span>
              </label>
              <span className="text-caption text-[#9ca3af]">
                {description.length}/{DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              id="workspace-description"
              name="description"
              rows={3}
              disabled={busy}
              maxLength={DESCRIPTION_MAX}
              placeholder="What's indexed here? Who's it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-body-standard text-black bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] placeholder:text-[#aaa] focus:outline-none focus:shadow-[var(--shadow-outline-ring)] transition-shadow resize-none"
              data-testid="workspace-description-input"
            />
            <p className="text-caption text-[#777169]">
              Shown on the workspace card. Sources are added after the workspace is created.
            </p>
          </div>

          {progress ? (
            <div className="flex items-center gap-2 text-caption text-[#4e4e4e] bg-[#eff6ff] rounded-card px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] animate-pulse" />
              {progress}…
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy || name.trim().length === 0}
            className="w-full bg-black text-white text-button rounded-pill py-3 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Creating…" : "Create workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
