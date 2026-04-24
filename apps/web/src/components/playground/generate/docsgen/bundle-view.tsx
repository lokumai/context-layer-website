"use client";
import type { ArtifactBundle } from "@context-layer/mocks";
import Link from "next/link";
import { useStore } from "@/stores";
import { ArtifactCard } from "./artifact-card";
import { DOCSGEN_CATALOG } from "./catalog";
import { DocsGenTabsHeader } from "./tabs-header";

export function DocsGenBundleView({
  workspaceId,
  bundle,
}: {
  workspaceId: string;
  bundle: ArtifactBundle;
}) {
  const workspace = useStore((s) => s.workspaces.find((w) => w.id === workspaceId));
  const def = DOCSGEN_CATALOG[bundle];
  if (!workspace) return null;

  return (
    <div className="w-full px-6 lg:px-10 py-8 space-y-6" data-testid="docsgen-bundle-view">
      <DocsGenTabsHeader workspaceId={workspaceId} active={bundle} />
      <div>
        <h1 className="text-section-heading text-black">{def.title}</h1>
        <p className="text-body text-[#4e4e4e] mt-1">{def.tagline}</p>
      </div>
      {!workspace.hasWiki ? (
        <div className="max-w-xl mx-auto py-16 text-center" data-testid="docsgen-needs-wiki">
          <h2 className="text-card-heading text-black mb-3">Generate the Wiki first</h2>
          <p className="text-body text-[#4e4e4e] mb-6">
            DocsGen artifacts are produced from your Wiki's indexed knowledge.
          </p>
          <Link
            href={`/workspace/${workspaceId}/wiki/configure`}
            className="inline-flex items-center gap-2 bg-black text-white rounded-pill px-5 py-2 text-button hover:bg-[#1a1a1a] transition-colors"
          >
            Go to Wiki Configure
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {def.cards.map((card) => (
            <ArtifactCard
              key={card.cardSlug}
              bundle={bundle}
              card={card}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
