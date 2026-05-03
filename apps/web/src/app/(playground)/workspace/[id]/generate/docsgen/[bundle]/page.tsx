import { notFound } from "next/navigation";
import { DocsGenBundleView } from "@/components/playground/generate/docsgen/bundle-view";
import { isValidBundleSlug } from "@/components/playground/generate/docsgen/catalog";

export default async function DocsGenBundlePage({
  params,
}: { params: Promise<{ id: string; bundle: string }> }) {
  const { id, bundle } = await params;

  if (!id || !bundle) return null;
  if (!isValidBundleSlug(bundle)) notFound();

  return <DocsGenBundleView workspaceId={id} bundle={bundle} />;
}
