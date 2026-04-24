"use client";
import type { ArtifactBundle } from "@context-layer/mocks";
import { DOCSGEN_BUNDLES, DOCSGEN_CATALOG } from "./catalog";

export function DocsGenTabsHeader({
  workspaceId,
  active,
}: {
  workspaceId: string;
  active: ArtifactBundle;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1" data-testid="docsgen-tabs-header">
      {DOCSGEN_BUNDLES.map((slug) => {
        const def = DOCSGEN_CATALOG[slug];
        const isActive = slug === active;
        return (
          <a
            key={slug}
            href={`/workspace/${workspaceId}/generate/docsgen/${slug}`}
            className={`shrink-0 px-4 py-2 rounded-pill text-nav transition-colors ${isActive ? "bg-[#f5f2ef] text-black shadow-[var(--shadow-inset-border)]" : "text-[#4e4e4e] hover:text-black hover:bg-[#f9f9f9]"}`}
            data-testid={`docsgen-tab-${slug}`}
          >
            {def.title}
          </a>
        );
      })}
    </div>
  );
}
