"use client";

import { useParams } from "next/navigation";
import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceSecurity } from "@/components/playground/intelligence/security/dashboard";

export default function SecurityPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceSecurity workspaceId={id} />
    </IntelligencePageShell>
  );
}
