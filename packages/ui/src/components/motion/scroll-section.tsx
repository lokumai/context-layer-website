"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useInView } from "motion/react";

// A pair of components for side-by-side sticky scrolling: each `<ScrollSection>`
// registers itself with the nearest `<StickyGraphicContext>`; when a section
// enters the viewport, the context publishes its id so the sticky graphic can
// react.

interface StickyCtx {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const Ctx = createContext<StickyCtx | null>(null);

export function StickyScrollGroup({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const value = useMemo(() => ({ activeId, setActiveId }), [activeId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStickyActive(): string | null {
  const ctx = useContext(Ctx);
  return ctx?.activeId ?? null;
}

interface ScrollSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function ScrollSection({ id, children, className }: ScrollSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const ctx = useContext(Ctx);

  useEffect(() => {
    if (ctx && inView) ctx.setActiveId(id);
  }, [ctx, inView, id]);

  return (
    <section ref={ref} id={id} className={className} data-active={inView}>
      {children}
    </section>
  );
}
