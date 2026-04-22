import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/app-nav";
import { CommandPaletteMount } from "@/components/layout/command-palette-mount";
import { PersonaHydrator } from "@/components/layout/persona-hydrator";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Footer } from "@/components/layout/footer";
import { isValidPersona } from "@context-layer/mocks";

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const raw = (session.user as { persona?: string } | undefined)?.persona;
  const persona = isValidPersona(raw ?? "") ? (raw as "full" | "partial" | "empty") : null;
  if (!persona) redirect("/login");

  return (
    <div className="relative flex min-h-screen flex-col">
      <ScrollProgress />
      <PersonaHydrator persona={persona} />
      <CommandPaletteMount />
      <AppNav />
      <main className="relative flex flex-1 flex-col">{children}</main>
      <Footer variant="slim" />
    </div>
  );
}
