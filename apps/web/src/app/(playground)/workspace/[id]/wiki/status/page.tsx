import { WikiStatusDashboard } from "@/components/playground/wiki/status/dashboard";
import { connection } from "next/server";

export default async function WikiStatusPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <WikiStatusDashboard workspaceId={id} />;
}
