import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Context Layer",
  description: "Reverse-engineer the knowledge your codebase never had.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Public+Sans:wght@300;400;700&display=swap" rel="stylesheet"/>
        <style>{`
          @font-face {
              font-family: 'Waldenburg';
              src: local('Public Sans Light'), local('Helvetica Neue Light'), sans-serif;
              font-weight: 300;
          }
          @font-face {
              font-family: 'WaldenburgFH';
              src: local('Public Sans Bold'), local('Helvetica Neue Bold'), sans-serif;
              font-weight: 700;
          }
          .font-waldenburg { font-family: 'Waldenburg', sans-serif; font-weight: 300; }
          .font-waldenburg-bold { font-family: 'WaldenburgFH', sans-serif; font-weight: 700; }
          .inter-airy { letter-spacing: 0.18px; font-family: 'Inter', sans-serif; }
          body { font-family: 'Inter', sans-serif; letter-spacing: 0.16px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
