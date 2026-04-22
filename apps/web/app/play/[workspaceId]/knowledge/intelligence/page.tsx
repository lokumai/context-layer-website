"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function IntelligencePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const generateIntelligence = usePlaygroundStore((s) => s.generateIntelligence);
  const [generating, setGenerating] = useState(false);

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-8">
        <h2 className="font-waldenburg text-[28px] mb-4">Generate the Wiki first</h2>
        <p className="text-neutral-500">Intelligence analyses depend on an indexed Wiki.</p>
      </div>
    );
  }

  if (ws.intelligenceDashboards.length === 0) {
    return (
      <div className="max-w-xl p-8">
        <h2 className="font-waldenburg text-[28px] mb-4">Generate Intelligence</h2>
        <p className="text-neutral-500 mb-6">Dashboards appear after the first analysis run.</p>
        <button
          onClick={async () => {
            setGenerating(true);
            await new Promise((r) => setTimeout(r, 1500));
            generateIntelligence(workspaceId);
            setGenerating(false);
          }}
          disabled={generating}
          className="bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
        >
          {generating ? "Analyzing…" : "Generate Intelligence"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6">
        <h2 className="font-waldenburg text-[24px] mb-6">Intelligence</h2>
        <ul className="flex flex-col gap-1">
          {ws.intelligenceDashboards.map((d) => (
            <li key={d.id} className="px-3 py-2 rounded-lg text-[14px] text-neutral-600 hover:bg-neutral-200 font-medium">
              {d.title}
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {ws.intelligenceDashboards.map((d) => (
          <section key={d.id}>
            <h3 className="font-waldenburg text-[24px] mb-4">{d.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {d.widgets.map((w) => (
                <div key={w.id} className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
                  <h4 className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold mb-2">{w.title}</h4>
                  <p className="font-waldenburg text-[28px]">{w.value}</p>
                  {w.detail && <p className="text-[12px] text-neutral-500 mt-2">{w.detail}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
