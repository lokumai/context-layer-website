"use client";

import { Plus } from "lucide-react";
import { useStore } from "@/stores";

export function CreateWorkspaceCard() {
  const open = useStore((s) => s.setCreateWorkspaceModalOpen);
  return (
    <button
      type="button"
      onClick={() => open(true)}
      className="group flex flex-col items-center justify-center gap-3 rounded-large p-10 min-h-[200px] bg-white/60 border border-dashed border-[rgba(0,0,0,0.15)] text-[#4e4e4e] hover:border-[#000] hover:text-black hover:bg-white transition-all"
      data-testid="create-workspace-card"
    >
      <span className="w-10 h-10 rounded-pill bg-white shadow-[var(--shadow-outline-ring)] flex items-center justify-center group-hover:bg-[#f5f2ef]">
        <Plus size={20} strokeWidth={1.5} />
      </span>
      <span className="text-button-upper">Create Workspace</span>
    </button>
  );
}
