"use client";

import { useParams } from "next/navigation";
import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceHealth } from "@/components/playground/intelligence/health/dashboard";

export default function HealthPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceHealth workspaceId={id} />
    </IntelligencePageShell>
  );
}
