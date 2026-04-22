"use client";

import { motion, useReducedMotion } from "motion/react";

const CARDS = [
  { title: "Context Wiki", hint: "Living narrative", rotate: -4, offset: "top-2 left-0" },
  { title: "Intelligence", hint: "Metrics & graphs", rotate: 3, offset: "top-16 left-28" },
  { title: "DocsGen", hint: "Exportable artifacts", rotate: -2, offset: "top-36 left-8" },
];

export function FloatingCards() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-[340px] w-full" aria-hidden>
      {CARDS.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 16 }}
          animate={
            reduce
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: [0, -6, 0] }
          }
          transition={
            reduce
              ? { duration: 0.6 }
              : {
                  opacity: { duration: 0.6, delay: i * 0.15 },
                  y: {
                    duration: 5 + i * 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  },
                }
          }
          style={{ rotate: c.rotate }}
          className={`absolute ${c.offset} w-[260px] bg-white rounded-large p-5 shadow-[var(--shadow-outline-ring)]`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#f5f2ef] shadow-[var(--shadow-inset-border)]" />
            <span className="w-2 h-2 rounded-full bg-[#f5f2ef] shadow-[var(--shadow-inset-border)]" />
            <span className="w-2 h-2 rounded-full bg-[#f5f2ef] shadow-[var(--shadow-inset-border)]" />
          </div>
          <p className="text-micro text-[#777169] uppercase tracking-[0.08em]">{c.hint}</p>
          <h3 className="text-card-heading text-black mt-1">{c.title}</h3>
          <div className="mt-4 space-y-1.5">
            <span className="block h-1.5 w-[90%] rounded-full bg-[#f5f5f5]" />
            <span className="block h-1.5 w-[70%] rounded-full bg-[#f5f5f5]" />
            <span className="block h-1.5 w-[55%] rounded-full bg-[#f5f5f5]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
