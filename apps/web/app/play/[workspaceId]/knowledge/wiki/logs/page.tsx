"use client";

import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiLogsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const jobs = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId)?.wikiJobs ?? []);

  if (jobs.length === 0) {
    return <p className="text-neutral-500">No generation jobs yet.</p>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-waldenburg text-[36px] mb-8">Wiki Logs</h1>
      <ul className="space-y-4">
        {jobs.map((j) => (
          <li key={j.id} className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-waldenburg text-[18px] capitalize">{j.type} • {j.trigger}</h3>
                <p className="text-[13px] text-neutral-500">{j.startedAt} • {(j.durationMs / 1000).toFixed(0)}s</p>
              </div>
              <span className={`px-3 py-1 text-[11px] font-semibold rounded-full uppercase ${j.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {j.status}
              </span>
            </div>
            <div className="text-[13px] text-neutral-600 mb-3">
              +{j.diffSummary.filesAdded} files • {j.diffSummary.linesAdded} lines added • {j.diffSummary.linesRemoved} removed
            </div>
            <details>
              <summary className="text-[13px] cursor-pointer text-neutral-500 hover:text-black">Agent logs</summary>
              <ul className="mt-3 space-y-1 text-[12px] text-neutral-600 font-mono bg-neutral-50 p-3 rounded-lg">
                {j.agentLogs.map((log, i) => <li key={i}>› {log}</li>)}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
