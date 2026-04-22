"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiStatusPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">No Wiki yet</h2>
        <p className="inter-airy text-[16px] text-neutral-500 mb-8">
          Generate a Wiki from your sources to unlock downstream capabilities.
        </p>
        <Link
          href={`/play/${workspaceId}/knowledge/wiki/configure`}
          className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]"
        >
          Configure & Generate
        </Link>
      </div>
    );
  }

  const s = ws.wikiSummary;
  return (
    <div className="max-w-4xl">
      <h1 className="font-waldenburg text-[36px] mb-8">Wiki Status</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatCard label="Coverage Score" value={`${s.coverageScore}%`} />
        <StatCard label="Total Tokens" value={s.totalTokens} />
        <StatCard label="Last Synced" value={s.lastSyncedAt.slice(0, 10)} />
        <StatCard label="Missing Context" value={`${s.missingContextCount}`} />
      </div>
      <section className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
        <h3 className="font-waldenburg text-[20px] mb-4">Active Repos</h3>
        <ul className="flex flex-wrap gap-2">
          {s.activeRepoIds.map((r) => (
            <li key={r} className="text-[13px] px-3 py-1 bg-neutral-100 rounded-full">{r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <h3 className="text-neutral-500 text-[12px] uppercase font-bold tracking-widest mb-2">{label}</h3>
      <p className="font-waldenburg text-[48px]">{value}</p>
    </div>
  );
}
