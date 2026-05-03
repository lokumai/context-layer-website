import { Footer } from "@context-layer/ui/components/marketing/chrome/footer";
import { Navbar } from "@context-layer/ui/components/marketing/chrome/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
