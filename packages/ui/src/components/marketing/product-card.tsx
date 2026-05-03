"use client";

import { type MouseEvent, useRef } from "react";

interface ProductCardProps {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  available: boolean;
}

export function ProductCard({ href, eyebrow, title, description, available }: ProductCardProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      className="group relative block bg-white rounded-large p-7 shadow-[var(--shadow-outline-ring)] transition-shadow hover:shadow-[var(--shadow-card)] overflow-hidden"
      style={{ "--x": "50%", "--y": "50%" } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(350px circle at var(--x) var(--y), rgba(78,50,23,0.06), transparent 60%)",
        }}
      />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-button-upper text-[#777169]">{eyebrow}</p>
          {available ? (
            <span className="text-tiny px-2 py-[2px] rounded-pill bg-black text-white">
              Playground
            </span>
          ) : (
            <span className="text-tiny px-2 py-[2px] rounded-pill bg-[#f5f2ef] text-[#4e4e4e]">
              Premium
            </span>
          )}
        </div>
        <h3 className="text-card-heading text-black">{title}</h3>
        <p className="text-body-standard text-[#4e4e4e]">{description}</p>
        <p className="text-button text-black inline-flex items-center gap-1 pt-2">
          Learn more{" "}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </a>
  );
}
