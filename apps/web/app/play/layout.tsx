import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import { PersonaHydrator } from "@/components/layout/persona-hydrator";
import { isValidPersona } from "@context-layer/mocks";

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const raw = (session.user as { persona?: string } | undefined)?.persona;
  const persona = isValidPersona(raw ?? "") ? (raw as "full" | "partial" | "empty") : null;
  if (!persona) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PersonaHydrator persona={persona} />
      <TopNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
