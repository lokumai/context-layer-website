"use client";

import { useEffect, useState } from "react";
import { GlowPulse } from "../../motion/glow-pulse";
import { PlaygroundButton } from "./playground-button";

const LINKS = [
  { href: "/product/context-layer", label: "Context Layer" },
  { href: "/product/code-translation", label: "Code Translation" },
  { href: "/product/code-modernization", label: "Code Modernization" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-border-subtle" : "bg-transparent"
      }`}
      data-testid="marketing-navbar"
    >
      <nav className="mx-auto max-w-[1280px] px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="/" aria-label="Context Layer home" className="flex items-center">
          {/* biome-ignore lint/performance/noImgElement: logo doesn't need next/image optimization */}
          <img
            src="/logo-landscape.svg"
            alt="Context Layer"
            className="h-9 w-auto"
            width={180}
            height={36}
          />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-nav text-[#4e4e4e] hover:text-black transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <GlowPulse>
              <PlaygroundButton />
            </GlowPulse>
          </div>
          <div className="lg:hidden flex items-center gap-3">
            <PlaygroundButton variant="compact" />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`block w-5 h-[1.5px] bg-black transition-transform ${
                  mobileOpen ? "rotate-45 translate-y-[3px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-black transition-transform ${
                  mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="lg:hidden bg-white border-b border-border-subtle">
          <div className="px-6 py-4 flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-nav text-black"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
