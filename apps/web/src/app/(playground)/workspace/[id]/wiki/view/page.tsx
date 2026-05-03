"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/stores";
import { EmptyStateNeedsWiki } from "@/components/playground/wiki/empty-state-needs-wiki";
import { WikiViewer } from "@/components/playground/wiki/view/viewer";

export default function WikiViewPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const isHydrated = useStore((s) => s.isHydrated);
  const hasWiki = useStore((s) => s.workspaces.find((w) => w.id === id)?.hasWiki ?? false);
  if (!id) return null;
  if (!isHydrated) return null;
  if (!hasWiki) return <EmptyStateNeedsWiki workspaceId={id} tabLabel="View" />;
  return <WikiViewer workspaceId={id} />;
}
