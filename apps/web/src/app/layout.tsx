import type { Metadata } from "next";
import { Inter, Raleway, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { SessionProvider } from "@/providers/session-provider";
import { HydrationProvider } from "@/providers/hydration-provider";
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
  title: "Context Layer",
  description: "Turn your codebase into living knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        <SessionProvider>
          <Suspense>
            <HydrationProvider>{children}</HydrationProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
