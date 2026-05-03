import { SourcesSurface } from "@/components/playground/sources/sources-surface";
import { connection } from "next/server";

export default async function SourcesPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <SourcesSurface workspaceId={id} />;
}
