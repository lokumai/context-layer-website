import { redirect } from "next/navigation";

export default async function DocsGenPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/workspace/${id}/generate/docsgen/structure-architecture`);
}
