import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";

export default async function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login"); // Fallback to auth
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}