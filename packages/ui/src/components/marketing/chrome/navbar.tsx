"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Github, ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { GlowPulse } from "../../motion/glow-pulse";
import { PlaygroundButton } from "./playground-button";

const BASE_PATH = "/context-layer-website";
const PRODUCTS = [
  {
    href: "/product/context-layer",
    label: "Context Layer",
    description: "Wiki, Intelligence, Chatbot.",
  },
  {
    href: "/product/code-translation",
    label: "Code Translation",
    description: "Semantic rewrites across languages.",
  },
  {
    href: "/product/code-modernization",
    label: "Code Modernization",
    description: "Phased upgrades with audit trails.",
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header
      className="sticky top-0 z-50 border-b border-border-subtle bg-[rgba(245,245,245,0.92)] backdrop-blur-md"
      data-testid="marketing-navbar"
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center px-6 lg:px-10">
        <div className="flex items-center gap-10 lg:gap-16">
          <Link href="/" aria-label="Context Layer home" className="flex items-center">
            {/* biome-ignore lint/performance/noImgElement: logo doesn't need next/image optimization */}
            <img
              src={`${BASE_PATH}/logo-landscape.svg`}
              alt="Context Layer"
              className="h-20 w-auto lg:h-26"
              width={320}
              height={80}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1.5">
            <NavPillLink href="/">Home</NavPillLink>
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onFocus={() => setProductsOpen(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setProductsOpen(false);
                }
              }}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-nav transition-all duration-200 ease-out ${
                  productsOpen
                    ? "border-border-subtle bg-white text-black shadow-[var(--shadow-outline-ring)] -translate-y-[1px]"
                    : "border-transparent bg-transparent text-black shadow-none hover:border-border-subtle hover:bg-white hover:shadow-[var(--shadow-outline-ring)] hover:-translate-y-[1px]"
                }`}
                aria-expanded={productsOpen}
                aria-haspopup="menu"
              >
                <span>Ecosystem</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {productsOpen ? (
                  <motion.div
                    role="menu"
                    data-testid="marketing-products-menu"
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-full mt-3 w-[520px] overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
                  >
                    <div className="px-5 py-4">
                      <p className="text-micro uppercase tracking-[0.08em] text-[#777169]">
                        Products
                      </p>
                    </div>

                    <div className="p-3 pt-0">
                      {PRODUCTS.map((product) => (
                        <Link
                          key={product.href}
                          href={product.href}
                          className="group flex items-start justify-between rounded-[20px] px-4 py-3 transition-colors hover:bg-[#f5f5f5]"
                          onClick={() => setProductsOpen(false)}
                        >
                          <div className="space-y-1">
                            <p className="text-body-medium text-black">{product.label}</p>
                            <p className="text-caption text-[#777169]">{product.description}</p>
                          </div>
                          <ArrowRight
                            size={15}
                            className="mt-1 text-[#9a9a9a] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                          />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <NavPillLink href="/about">About</NavPillLink>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5 lg:gap-3">
          <ExternalPillLink
            href="https://github.com/lokumai/context-layer-website"
            icon={<Github size={15} />}
          >
            GitHub
          </ExternalPillLink>
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
        <div className="lg:hidden border-b border-border-subtle bg-white">
          <div className="flex flex-col gap-4 px-6 py-4">
            <NavPillLink href="/" onClick={() => setMobileOpen(false)}>
              Home
            </NavPillLink>
            <div className="space-y-2">
              <p className="text-micro uppercase tracking-[0.08em] text-[#777169]">Products</p>
              <div className="space-y-2">
                {PRODUCTS.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="block rounded-[18px] border border-border-subtle bg-[#f9f9f9] px-4 py-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    <p className="text-body-medium text-black">{product.label}</p>
                    <p className="text-caption text-[#777169]">{product.description}</p>
                  </Link>
                ))}
              </div>
            </div>
            <NavPillLink href="/about" onClick={() => setMobileOpen(false)}>
              About
            </NavPillLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavPillLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-pill border border-transparent bg-transparent px-4 py-2 text-nav text-black shadow-none transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-border-subtle hover:bg-white hover:shadow-[var(--shadow-outline-ring)]"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function ExternalPillLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-white px-4 py-2 text-nav text-black shadow-[var(--shadow-inset-border)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[var(--shadow-outline-ring)]"
      aria-label={children}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
