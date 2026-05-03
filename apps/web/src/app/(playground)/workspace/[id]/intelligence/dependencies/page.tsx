import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceDependencies } from "@/components/playground/intelligence/dependencies/dashboard";

export default async function DependenciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceDependencies workspaceId={id} />
    </IntelligencePageShell>
  );
}
