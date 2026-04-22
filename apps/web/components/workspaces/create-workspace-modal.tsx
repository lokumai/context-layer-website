// apps/web/components/workspaces/create-workspace-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const createWorkspace = usePlaygroundStore((s) => s.createWorkspace);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    const id = createWorkspace(name.trim());
    router.push(`/play/${id}/sources`);
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
        <h2 className="font-waldenburg text-[28px] mb-6">Create Workspace</h2>
        <label className="block">
          <span className="text-[13px] font-medium text-neutral-600 uppercase tracking-[0.7px] mb-2 block">Workspace name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="workspace name"
            autoFocus
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-black"
          />
        </label>
        <div className="flex gap-3 mt-8 justify-end">
          <button onClick={onClose} className="px-6 py-2 text-neutral-500 hover:text-black text-[14px] font-medium">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim() || submitting}
            className="bg-black text-white px-8 py-2 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[13px] disabled:opacity-40"
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
