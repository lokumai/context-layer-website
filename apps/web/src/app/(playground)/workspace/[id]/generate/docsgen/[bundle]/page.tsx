"use client";

import { notFound, useParams } from "next/navigation";
import { DocsGenBundleView } from "@/components/playground/generate/docsgen/bundle-view";
import { isValidBundleSlug } from "@/components/playground/generate/docsgen/catalog";

export default function DocsGenBundlePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const bundleRaw = Array.isArray(params?.bundle)
    ? params.bundle[0]
    : (params?.bundle as string | undefined);

  if (!id || !bundleRaw) return null;
  if (!isValidBundleSlug(bundleRaw)) notFound();

  return <DocsGenBundleView workspaceId={id} bundle={bundleRaw} />;
}
