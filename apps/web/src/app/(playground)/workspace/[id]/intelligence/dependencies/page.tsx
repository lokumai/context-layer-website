"use client";

import { useParams } from "next/navigation";
import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceDependencies } from "@/components/playground/intelligence/dependencies/dashboard";

export default function DependenciesPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceDependencies workspaceId={id} />
    </IntelligencePageShell>
  );
}
