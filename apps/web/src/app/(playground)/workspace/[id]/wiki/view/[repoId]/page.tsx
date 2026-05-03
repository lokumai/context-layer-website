import { WikiViewer } from "@/components/playground/wiki/view/viewer";
import { connection } from "next/server";

export default async function WikiViewRepoPage({
  params,
}: { params: Promise<{ id: string; repoId: string }> }) {
  await connection();
  const { id, repoId } = await params;
  return <WikiViewer workspaceId={id} repoId={repoId} />;
}
