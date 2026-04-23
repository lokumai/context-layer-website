import { WikiSidebar } from "@/components/playground/wiki/wiki-sidebar";

export default async function WikiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full flex min-h-[calc(100vh-64px)]" data-testid="wiki-layout">
      <WikiSidebar workspaceId={id} />
      <section className="flex-1 min-w-0">{children}</section>
    </div>
  );
}
