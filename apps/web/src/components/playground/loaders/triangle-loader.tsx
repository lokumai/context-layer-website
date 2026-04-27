"use client";

import { motion } from "motion/react";

// Brand-grounded loading state per AI Design Report §4.2: replace generic
// spinners with a Geometric Morph that reuses the workspace's Context
// Triangle. Continuous rotation + per-vertex scale pulse so the surface
// feels alive without being distracting.

interface Props {
  size?: number;
  label?: string;
  paused?: boolean;
}

const VERTEX_TONES = ["#b45309", "#1d4ed8", "#059669"]; // warm-stone / info / success

export function TriangleLoader({ size = 56, label, paused = false }: Props) {
  // Equilateral coords inside a 100×100 viewBox.
  const v = [
    { x: 50, y: 12 },
    { x: 12, y: 82 },
    { x: 88, y: 82 },
  ];

  return (
    <div
      className="inline-flex flex-col items-center justify-center gap-2"
      data-testid="triangle-loader"
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={paused ? { rotate: 0 } : { rotate: 360 }}
        transition={paused ? undefined : { duration: 4.5, repeat: Infinity, ease: "linear" }}
      >
        <title>Loading</title>
        <polygon
          points={v.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        {v.map((p, i) => (
          <motion.circle
            // biome-ignore lint/suspicious/noArrayIndexKey: 3 fixed vertices
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={VERTEX_TONES[i]}
            animate={
              paused
                ? { scale: 1, opacity: 1 }
                : { scale: [0.85, 1.25, 0.85], opacity: [0.7, 1, 0.7] }
            }
            transition={
              paused
                ? undefined
                : {
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.18,
                  }
            }
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </motion.svg>
      {label ? <p className="text-caption text-[#777169] text-center">{label}</p> : null}
    </div>
  );
}
