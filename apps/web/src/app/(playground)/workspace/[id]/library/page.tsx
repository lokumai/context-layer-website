import { LibrarySurface } from "@/components/playground/library/library-surface";
import { connection } from "next/server";

export default async function LibraryPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <LibrarySurface workspaceId={id} />;
}
