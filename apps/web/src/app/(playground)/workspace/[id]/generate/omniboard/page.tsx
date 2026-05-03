import { OmniBoardSurface } from "@/components/playground/generate/omniboard/surface";

export default async function OmniBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OmniBoardSurface workspaceId={id} />;
}
