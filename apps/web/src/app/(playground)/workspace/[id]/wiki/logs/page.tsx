import { WikiLogsView } from "@/components/playground/wiki/logs/view";
import { connection } from "next/server";

export default async function WikiLogsPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <WikiLogsView workspaceId={id} />;
}
