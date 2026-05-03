import { WikiConfigure } from "@/components/playground/wiki/configure/configure";
import { connection } from "next/server";

export default async function WikiConfigurePage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <WikiConfigure workspaceId={id} />;
}
