import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PlaygroundNavbar } from "@/components/playground/chrome/navbar";

export default async function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.personaId) {
    redirect("/login?callbackUrl=/workspaces");
  }
  return (
    <>
      <PlaygroundNavbar />
      <main className="pt-16 min-h-screen bg-[var(--color-bg-canvas)]">{children}</main>
    </>
  );
}
