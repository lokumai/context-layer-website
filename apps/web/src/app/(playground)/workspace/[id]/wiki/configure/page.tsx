"use client";

import { useParams } from "next/navigation";
import { WikiConfigure } from "@/components/playground/wiki/configure/configure";

export default function WikiConfigurePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return <WikiConfigure workspaceId={id} />;
}
