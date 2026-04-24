import { redirect } from "next/navigation";

export default async function GeneratePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  redirect(`/workspace/${id}/generate/docsgen`);
}
