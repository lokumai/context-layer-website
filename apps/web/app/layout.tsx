import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Context Layer — Persistent knowledge for codebases and the agents that read them",
  description:
    "A versioned, multi-repository knowledge base that bridges human developers, AI agents, and your codebase. Built for the agentic era.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
