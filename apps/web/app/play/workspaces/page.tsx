// apps/web/app/play/workspaces/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { CreateWorkspaceModal } from "@/components/workspaces/create-workspace-modal";

export default function WorkspacesPage() {
  const workspaces = usePlaygroundStore((s) => s.workspaces);
  const [modalOpen, setModalOpen] = useState(false);

  const isEmpty = workspaces.length === 0;

  return (
    <div className="max-w-screen-xl mx-auto w-full px-8 py-16">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-12">Workspaces</h1>

      {isEmpty ? (
        <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
          <h2 className="font-waldenburg text-[32px] mb-4">Create your first workspace</h2>
          <p className="inter-airy text-[16px] text-neutral-500 mb-8 max-w-lg mx-auto">
            A workspace is a collection of code and documents you want to understand, document, or generate from.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
          >
            + Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setModalOpen(true)}
            className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-neutral-500 hover:border-black hover:text-black transition-all min-h-[200px]"
          >
            <span className="text-[32px] mb-2">+</span>
            <span className="font-inter font-medium">Create Workspace</span>
          </button>

          {workspaces.map(({ workspace, sources, wikiSummary }) => (
            <Link
              key={workspace.id}
              href={`/play/${workspace.id}/${wikiSummary ? "knowledge/wiki" : "sources"}`}
              className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all min-h-[200px] flex flex-col"
            >
              <h2 className="font-waldenburg text-[24px] mb-2">{workspace.name}</h2>
              <span className="inline-block text-[11px] font-waldenburg-bold uppercase tracking-[0.7px] text-neutral-500 mb-auto">
                {workspace.stage}
              </span>
              <p className="text-neutral-500 text-[14px] mt-auto">
                {sources.length} source{sources.length === 1 ? "" : "s"}
                {wikiSummary ? ` • Synced ${wikiSummary.lastSyncedAt.slice(0, 10)}` : " • No Wiki yet"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && <CreateWorkspaceModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
