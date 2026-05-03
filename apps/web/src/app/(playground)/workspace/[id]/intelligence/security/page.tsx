import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceSecurity } from "@/components/playground/intelligence/security/dashboard";

export default async function SecurityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceSecurity workspaceId={id} />
    </IntelligencePageShell>
  );
}
