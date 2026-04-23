"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/stores";
import { EmptyStateNeedsWiki } from "@/components/playground/wiki/empty-state-needs-wiki";
import { WikiLogsView } from "@/components/playground/wiki/logs/view";

export default function WikiLogsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const hasWiki = useStore(
    (s) => s.workspaces.find((w) => w.id === id)?.hasWiki ?? false,
  );
  if (!id) return null;
  if (!hasWiki) return <EmptyStateNeedsWiki workspaceId={id} tabLabel="Logs" />;
  return <WikiLogsView workspaceId={id} />;
}
