"use client";

import { usePlaygroundStore } from "@/store/playground-store";

export function AddSourceChooser({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const addQuickPopulate = usePlaygroundStore((s) => s.addQuickPopulateSources);
  const persona = usePlaygroundStore((s) => s.persona);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px]">
        <h2 className="font-waldenburg text-[28px] mb-2">Add Source</h2>
        <p className="text-neutral-500 text-[14px] mb-8">Pick an integration or a manual option.</p>

        {persona === "empty" && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-waldenburg text-[18px] mb-2">Demo shortcut</h3>
            <p className="text-[13px] text-amber-900 mb-4">
              Populate all 9 microservice repositories in one click. This is only shown in the empty demo persona.
            </p>
            <button
              onClick={() => {
                addQuickPopulate(workspaceId);
                onClose();
              }}
              className="bg-black text-white px-6 py-2 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[13px]"
            >
              Quick-populate demo sources
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {["GitHub", "GitLab", "Google Drive", "Notion", "Upload file", "Paste URL"].map((label) => (
            <button
              key={label}
              onClick={onClose}
              className="text-left px-4 py-3 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all text-[14px] font-medium"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-neutral-400 mt-6">
          In this mock, integration buttons are placeholders. Use Quick-populate for the demo dataset.
        </p>
      </div>
    </div>
  );
}
