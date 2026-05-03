import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceHealth } from "@/components/playground/intelligence/health/dashboard";

export default async function HealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceHealth workspaceId={id} />
    </IntelligencePageShell>
  );
}
