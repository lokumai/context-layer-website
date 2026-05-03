import type { Metadata } from "next";
import { Inter, Raleway, Geist_Mono } from "next/font/google";
import { Footer } from "@context-layer/ui/components/marketing/chrome/footer";
import { Navbar } from "@context-layer/ui/components/marketing/chrome/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Context Layer | Codebase Knowledge Infrastructure",
  description: "Build the context your codebase never had. Context Layer automatically builds, syncs, and evolves codebase context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
