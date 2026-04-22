"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";
import { SourceCard } from "@/components/sources/source-card";
import { AddSourceChooser } from "@/components/sources/add-source-chooser";

export default function SourcesPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [chooserOpen, setChooserOpen] = useState(false);

  if (!workspace) return null;
  const { sources } = workspace;

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Sources</h1>
          <p className="inter-airy text-[20px] text-neutral-600">The single source of truth for this workspace.</p>
        </div>
        <button
          onClick={() => setChooserOpen(true)}
          className="bg-warm-stone px-8 py-3 rounded-[30px] shadow-[rgba(78,50,23,0.04)_0px_6px_16px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
        >
          + Add Source
        </button>
      </header>

      {sources.length === 0 ? (
        <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
          <h2 className="font-waldenburg text-[32px] mb-4">Add your first source</h2>
          <p className="inter-airy text-[16px] text-neutral-500 mb-8 max-w-lg mx-auto">
            Connect GitHub, Google Drive, or upload files. Everything you add becomes searchable by every agent in the product.
          </p>
          <button
            onClick={() => setChooserOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
          >
            + Add Source
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sources.map((s) => <SourceCard key={s.id} source={s} />)}
        </div>
      )}

      {chooserOpen && <AddSourceChooser workspaceId={workspaceId} onClose={() => setChooserOpen(false)} />}
    </div>
  );
}
