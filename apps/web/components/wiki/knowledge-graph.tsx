"use client";

import { motion } from "motion/react";

// Pre-computed node layout for the microservices-product-catalog workspace.
// Uses normalized coordinates in a 560×260 viewbox. Hand-tuned so the key
// relationships (order → inventory/pricing/notification, shared-lib center)
// read clearly at a glance.

interface Node {
  id: string;
  x: number;
  y: number;
  tone: "ink" | "warm" | "quiet";
  size?: number;
}

interface Edge {
  from: string;
  to: string;
  dashed?: boolean;
}

const NODES: Node[] = [
  { id: "catalog-ui", x: 40, y: 40, tone: "quiet" },
  { id: "gateway", x: 140, y: 130, tone: "ink", size: 18 },
  { id: "catalog", x: 260, y: 40, tone: "warm" },
  { id: "pricing", x: 360, y: 40, tone: "quiet" },
  { id: "inventory", x: 460, y: 40, tone: "quiet" },
  { id: "order", x: 320, y: 130, tone: "ink", size: 16 },
  { id: "customer", x: 260, y: 220, tone: "quiet" },
  { id: "notification", x: 400, y: 220, tone: "quiet" },
  { id: "search", x: 500, y: 150, tone: "quiet" },
  { id: "shared", x: 140, y: 230, tone: "warm", size: 14 },
  { id: "kafka", x: 460, y: 130, tone: "quiet", size: 12 },
];

const EDGES: Edge[] = [
  { from: "catalog-ui", to: "gateway" },
  { from: "gateway", to: "catalog" },
  { from: "gateway", to: "pricing" },
  { from: "gateway", to: "inventory" },
  { from: "gateway", to: "order" },
  { from: "gateway", to: "customer" },
  { from: "gateway", to: "search" },
  { from: "order", to: "inventory" },
  { from: "order", to: "pricing" },
  { from: "order", to: "kafka", dashed: true },
  { from: "catalog", to: "kafka", dashed: true },
  { from: "kafka", to: "notification", dashed: true },
  { from: "kafka", to: "search", dashed: true },
  { from: "shared", to: "catalog", dashed: true },
  { from: "shared", to: "pricing", dashed: true },
  { from: "shared", to: "inventory", dashed: true },
  { from: "shared", to: "order", dashed: true },
  { from: "shared", to: "customer", dashed: true },
  { from: "shared", to: "notification", dashed: true },
];

const TONE: Record<Node["tone"], { fill: string; stroke: string; label: string }> = {
  ink: { fill: "#0a0a0a", stroke: "#000", label: "white" },
  warm: { fill: "#f5f2ef", stroke: "#c9a572", label: "#0a0a0a" },
  quiet: { fill: "#ffffff", stroke: "#e8e3dd", label: "#0a0a0a" },
};

export function KnowledgeGraph() {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white">
      <div className="absolute inset-0 dots-pattern opacity-50" aria-hidden />

      <div className="relative px-6 pt-5">
        <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
          <span>Knowledge graph</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
            sync
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[var(--color-warm-amber)]" />
            async
          </span>
        </div>
      </div>

      <svg viewBox="0 0 560 300" className="relative block h-[260px] w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#777169" />
          </marker>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => {
          const from = byId[e.from];
          const to = byId[e.to];
          if (!from || !to) return null;
          return (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={e.dashed ? "#c9a572" : "#777169"}
              strokeOpacity={e.dashed ? 0.6 : 0.45}
              strokeWidth={1.25}
              strokeDasharray={e.dashed ? "4 4" : undefined}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const t = TONE[n.tone];
          const r = n.size ?? 10;
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={t.fill}
                stroke={t.stroke}
                strokeWidth={1.2}
              />
              <text
                x={n.x}
                y={n.y + r + 12}
                textAnchor="middle"
                fill="#4e4e4e"
                fontSize="10"
                fontFamily="ui-sans-serif"
                fontWeight="500"
              >
                {n.id}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
