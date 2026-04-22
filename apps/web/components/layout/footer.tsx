import Link from "next/link";
import { Layers } from "lucide-react";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Context Layer", href: "/product/context-layer" },
      { label: "Code Translation", href: "/product/code-translation" },
      { label: "Code Modernization", href: "/product/code-modernization" },
      { label: "Playground", href: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
];

export function Footer({ variant = "full" }: { variant?: "full" | "slim" }) {
  const year = new Date().getFullYear();

  if (variant === "slim") {
    return (
      <footer className="border-t border-[var(--color-border-subtle)] py-6">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-3 px-6 md:flex-row md:px-10">
          <span className="text-[12px] text-[var(--color-ink-whisper)]">
            © {year} Context Layer. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-[12px]">
            {["Privacy", "Terms", "Security", "Status"].map((l) => (
              <a key={l} href="#" className="text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative mt-32 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]">
      <div className="mx-auto max-w-screen-2xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white">
                <Layers size={15} strokeWidth={1.8} />
              </span>
              <span className="font-display text-[20px] tracking-display">Context Layer</span>
            </Link>
            <p className="mt-6 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
              A persistent, versioned knowledge base for codebases — and the agents that need to read them. Designed for the way teams actually build in 2026.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              All systems operational
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-6 text-[12px] text-[var(--color-ink-muted)]">
            <span>© {year} Context Layer</span>
            {["Privacy", "Terms", "Security"].map((l) => (
              <a key={l} href="#" className="underline decoration-[var(--color-ink-whisper)] underline-offset-[6px] transition-colors hover:text-[var(--color-ink)] hover:decoration-[var(--color-ink)]">
                {l}
              </a>
            ))}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-whisper)]">
            Built with Context Layer
          </div>
        </div>
      </div>
    </footer>
  );
}
