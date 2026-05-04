"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export interface StepLayer {
  label: string;
  sub: string;
  accent: string;
  accentBg: string;
  tag?: string;
}

export function LayeredStepGraphic({ layers }: { layers: StepLayer[] }) {
  return (
    <div className="w-full max-w-[460px] select-none">
      {layers.map((layer, i) => (
        <div key={layer.label}>
          <motion.div
            className="relative w-full bg-white rounded-[14px] border border-[rgba(0,0,0,0.07)] overflow-hidden cursor-default"
            style={{
              boxShadow: "0 2px 10px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3.8 + i * 0.7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
            whileHover={{
              y: -8,
              scale: 1.018,
              boxShadow: "0 12px 36px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
              transition: { duration: 0.22, ease: "easeOut" },
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: layer.accent, opacity: 0.7 }}
            />

            <div className="px-5 py-4 flex items-center gap-4">
              {/* Step badge */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold tracking-[0.05em]"
                style={{ backgroundColor: layer.accentBg, color: layer.accent }}
              >
                0{i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[15px] font-semibold leading-snug text-[#0a0a0a]"
                >
                  {layer.label}
                </p>
                <p className="text-[12px] text-[#777169] mt-0.5 leading-snug">{layer.sub}</p>
              </div>

              {/* Right status indicator */}
              {layer.tag ? (
                <span
                  className="flex-shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: layer.accentBg, color: layer.accent }}
                >
                  {layer.tag}
                </span>
              ) : (
                <div
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: layer.accent, opacity: 0.6 }}
                />
              )}
            </div>
          </motion.div>

          {/* Connector between cards */}
          {i < layers.length - 1 && (
            <div className="flex flex-col items-center py-1 gap-0.5">
              <motion.div
                className="w-[1.5px] h-3 rounded-full"
                style={{ backgroundColor: layers[i].accent, opacity: 0.35 }}
                animate={{ scaleY: [1, 1.3, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.5 }}
              />
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                <ArrowDown
                  size={13}
                  style={{ color: layers[i + 1].accent, opacity: 0.7 }}
                  strokeWidth={2.5}
                />
              </motion.div>
              <motion.div
                className="w-[1.5px] h-3 rounded-full"
                style={{ backgroundColor: layers[i + 1].accent, opacity: 0.35 }}
                animate={{ scaleY: [1, 1.3, 1], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.5 + 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
