"use client";

import { useParams } from "next/navigation";
import { OmniBoardSurface } from "@/components/playground/generate/omniboard/surface";

export default function OmniBoardPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return <OmniBoardSurface workspaceId={id} />;
}
