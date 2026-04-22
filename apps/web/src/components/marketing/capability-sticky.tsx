"use client";

import type { ReactNode } from "react";
import { ScrollSection, StickyScrollGroup, useStickyActive } from "@/components/motion/scroll-section";

export interface Capability {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tentative?: boolean;
  graphic: ReactNode;
}

export function CapabilityScroller({ items }: { items: Capability[] }) {
  return (
    <StickyScrollGroup>
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-32">
            {items.map((c) => (
              <ScrollSection
                key={c.id}
                id={c.id}
                className="space-y-4 min-h-[50vh] flex flex-col justify-center"
              >
                <div className="flex items-center gap-2">
                  <p className="text-button-upper text-[#777169]">{c.eyebrow}</p>
                  {c.tentative ? (
                    <span className="text-tiny px-2 py-[2px] rounded-pill bg-[#f5f2ef] text-[#777169]">
                      Tentative
                    </span>
                  ) : null}
                </div>
                <h3 className="text-section-heading text-black">{c.title}</h3>
                <p className="text-body text-[#4e4e4e] max-w-[500px]">{c.body}</p>
                <a
                  href="/login"
                  className="text-button text-black inline-flex items-center gap-1 pt-2 hover:gap-2 transition-[gap]"
                >
                  Explore in playground <span aria-hidden>→</span>
                </a>
              </ScrollSection>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <StickyGraphic items={items} />
            </div>
          </div>
        </div>
      </section>
    </StickyScrollGroup>
  );
}

function StickyGraphic({ items }: { items: Capability[] }) {
  const activeId = useStickyActive();
  const active = items.find((i) => i.id === activeId) ?? items[0];
  return (
    <div className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] p-8 min-h-[480px] flex items-center justify-center">
      <div key={active.id} className="animate-[fadeIn_0.35s_ease-out]">
        {active.graphic}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
