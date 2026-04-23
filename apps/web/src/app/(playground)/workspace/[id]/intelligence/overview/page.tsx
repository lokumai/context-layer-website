"use client";

import { useParams } from "next/navigation";
import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceOverview } from "@/components/playground/intelligence/overview/dashboard";

export default function OverviewPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceOverview workspaceId={id} />
    </IntelligencePageShell>
  );
}
