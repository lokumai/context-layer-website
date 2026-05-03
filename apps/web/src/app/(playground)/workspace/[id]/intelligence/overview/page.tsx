import { IntelligencePageShell } from "@/components/playground/intelligence/page-shell";
import { IntelligenceOverview } from "@/components/playground/intelligence/overview/dashboard";
import { connection } from "next/server";

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return (
    <IntelligencePageShell workspaceId={id}>
      <IntelligenceOverview workspaceId={id} />
    </IntelligencePageShell>
  );
}
