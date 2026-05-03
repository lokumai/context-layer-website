import { WikiViewer } from "@/components/playground/wiki/view/viewer";
import { connection } from "next/server";

export default async function WikiViewPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <WikiViewer workspaceId={id} />;
}
