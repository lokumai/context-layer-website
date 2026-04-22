"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";
import { BUNDLES, BundleTabs } from "@/components/docsgen/bundle-tabs";
import { DocsGenCardView } from "@/components/docsgen/card";
import type { DocsGenBundle } from "@context-layer/mocks";

export default function DocsGenPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [activeBundle, setActiveBundle] = useState<DocsGenBundle>("structure");

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-12 mx-auto text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">DocsGen is locked</h2>
        <p className="text-neutral-500 mb-8">Generate the Wiki first — every artifact is built on top of it.</p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          Go to Wiki Configure
        </Link>
      </div>
    );
  }

  const cards = ws.docsGenCards.filter((c) => c.bundle === activeBundle);

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <header className="mb-12">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">DocsGen</h1>
        <p className="inter-airy text-[20px] text-neutral-600">Generate point-in-time exportable artifacts.</p>
      </header>

      <BundleTabs active={activeBundle} onChange={setActiveBundle} />

      {cards.length === 0 ? (
        <p className="text-neutral-500">No cards defined in this bundle yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => <DocsGenCardView key={c.id} card={c} workspaceId={workspaceId} />)}
        </div>
      )}
    </div>
  );
}
