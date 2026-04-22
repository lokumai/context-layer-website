"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiConfigurePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateWiki = usePlaygroundStore((s) => s.generateWiki);
  const [generating, setGenerating] = useState(false);

  if (!ws) return null;

  const hasSources = ws.sources.length > 0;
  const hasWiki = ws.wikiSummary != null;

  async function handleGenerate() {
    if (!hasSources || generating) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    generateWiki(workspaceId);
    setGenerating(false);
    router.push(`/play/${workspaceId}/knowledge/wiki`);
  }

  if (!hasSources) {
    return (
      <div className="max-w-xl">
        <h1 className="font-waldenburg text-[36px] mb-4">Add sources first</h1>
        <p className="text-neutral-500 mb-6">The Wiki needs at least one source to generate from.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-waldenburg text-[36px] mb-4">{hasWiki ? "Reconfigure Wiki" : "Generate Wiki"}</h1>
        <p className="text-neutral-500">
          Select which sources feed the Wiki. Auto-sync keeps it fresh. This demo skips source selection and uses all indexed sources.
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
        <h3 className="font-waldenburg text-[20px] mb-2">Sync strategy</h3>
        <p className="text-[13px] text-neutral-500 mb-4">Per PR merge to main (balanced default)</p>
      </div>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
      >
        {generating ? "Generating…" : hasWiki ? "Force Rebuild" : "Generate Wiki"}
      </button>
    </div>
  );
}
