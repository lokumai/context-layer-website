import { redirect } from "next/navigation";

export default async function DocsGenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/workspace/${id}/generate/docsgen/structure-architecture`);
}
