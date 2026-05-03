import { WikiViewer } from "@/components/playground/wiki/view/viewer";
import { connection } from "next/server";

export default async function WikiViewRepoPagePage({
  params,
}: {
  params: Promise<{ id: string; repoId: string; slug: string }>;
}) {
  await connection();
  const { id, repoId, slug } = await params;
  return <WikiViewer workspaceId={id} repoId={repoId} slug={slug} />;
}
