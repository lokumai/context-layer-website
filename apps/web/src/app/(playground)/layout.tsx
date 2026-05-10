import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PlaygroundNavbar } from "@/components/playground/chrome/navbar";
import { HydrationProvider } from "@/providers/hydration-provider";
import { SessionProvider } from "@/providers/session-provider";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PlaygroundShell>{children}</PlaygroundShell>
    </Suspense>
  );
}

async function PlaygroundShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.personaId) {
    redirect("/login?callbackUrl=/workspaces");
  }
  return (
    <SessionProvider session={session}>
      <HydrationProvider>
        <PlaygroundNavbar />
        <main className="pt-16 min-h-screen bg-[var(--color-bg-canvas)]">{children}</main>
      </HydrationProvider>
    </SessionProvider>
  );
}
