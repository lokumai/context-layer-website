"use client";

import { Layers, Sparkles } from "lucide-react";
import { useStore } from "@/stores";

export function WorkspacesEmptyState() {
  const open = useStore((s) => s.setCreateWorkspaceModalOpen);
  return (
    <div className="mx-auto max-w-[760px] mt-8 bg-white rounded-section shadow-[var(--shadow-outline-ring)] px-10 py-16 text-center space-y-6">
      <div className="mx-auto w-14 h-14 rounded-comfortable bg-[#ecfdf5] text-[#047857] flex items-center justify-center">
        <Layers size={28} strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        <h2 className="text-section-heading text-black">Create your first workspace</h2>
        <p className="text-body text-[#4e4e4e] max-w-[480px] mx-auto">
          A workspace is your multi-repo knowledge container. Bring any repos, docs, and discussion
          tools you want indexed together.
        </p>
      </div>
      <button
        type="button"
        onClick={() => open(true)}
        className="inline-flex items-center gap-2 bg-[rgba(245,242,239,0.8)] text-black text-button rounded-warm-btn px-7 py-3 transition-transform hover:scale-[1.02] shadow-[var(--shadow-warm)]"
      >
        <Sparkles size={16} strokeWidth={1.5} />
        Create Workspace
      </button>
    </div>
  );
}
