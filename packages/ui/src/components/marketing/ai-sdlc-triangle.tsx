"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, Boxes, User } from "lucide-react";

// Communication Triangle.
// Three vertices — Codebase (top), Human (bottom-left), Agent (bottom-right) —
// can only communicate cleanly through Context Layer at the center.
// The dashed triangle edges represent the *intended* communication; the solid
// spokes show that Context Layer is the channel each one actually flows through.

const W = 620;
const H = 520;

// Triangle vertices
const POS = {
  codebase: { x: W / 2, y: 110 },
  human: { x: 110, y: H - 80 },
  agent: { x: W - 110, y: H - 80 },
} as const;

// Centroid of the triangle = position of Context Layer
const CENTER = {
  x: (POS.codebase.x + POS.human.x + POS.agent.x) / 3,
  y: (POS.codebase.y + POS.human.y + POS.agent.y) / 3,
};

const COLORS = {
  codebase: "#0a0a0a",
  codebaseBg: "#f5f5f4",
  human: "#b45309",
  humanBg: "#fff7ed",
  agent: "#1d4ed8",
  agentBg: "#eff6ff",
  context: "#10b981",
  contextDark: "#047857",
  contextBg: "#ecfdf5",
  text: "#777169",
};

export function AISdlcTriangle() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Communication Triangle: Codebase, Human, and Agent vertices all route through Context Layer at the center."
      >
        <title>Human · Agent · Codebase — Context is the channel</title>

        <defs>
          {/* Spoke gradients — from each vertex's color into the green center */}
          <linearGradient
            id="ct-spoke-codebase"
            x1={POS.codebase.x}
            y1={POS.codebase.y}
            x2={CENTER.x}
            y2={CENTER.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={COLORS.codebase} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.context} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="ct-spoke-human" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.human} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.context} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="ct-spoke-agent" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.agent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.context} stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="ct-context-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.context} stopOpacity="0.32" />
            <stop offset="70%" stopColor={COLORS.context} stopOpacity="0" />
          </radialGradient>

          <pattern id="ct-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width={W} height={H} fill="url(#ct-grid)" />

        {/* Large Title */}
        <text
          x={W / 2}
          y={50}
          textAnchor="middle"
          fontSize="18"
          fontFamily="var(--font-sans)"
          fontWeight="700"
          letterSpacing="0.1em"
          fill="#777169"
        >
          THE COMMUNICATION TRIANGLE
        </text>

        {/* Center ambient glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r="220" fill="url(#ct-context-glow)" />

        {/* Outer triangle edges — dashed, subtle. The "intended" comm channels. */}
        <TriangleOutline />

        {/* Solid spokes from each vertex to Context Layer — the actual channels */}
        <Spoke
          from={POS.codebase}
          to={CENTER}
          gradientId="ct-spoke-codebase"
          color={COLORS.codebase}
          delay={0}
          reduce={reduce}
        />
        <Spoke
          from={POS.human}
          to={CENTER}
          gradientId="ct-spoke-human"
          color={COLORS.human}
          delay={1.4}
          reduce={reduce}
        />
        <Spoke
          from={POS.agent}
          to={CENTER}
          gradientId="ct-spoke-agent"
          color={COLORS.agent}
          delay={2.8}
          reduce={reduce}
        />

        {/* Edge labels — sit ON the dashed outer edges */}
        <EdgeLabel from={POS.human} to={POS.agent} text="HUMAN ↔ AGENT" color={COLORS.text} />
        <EdgeLabel from={POS.codebase} to={POS.human} text="HUMAN ↔ CODEBASE" color={COLORS.text} side="left" />
        <EdgeLabel
          from={POS.codebase}
          to={POS.agent}
          text="AGENT ↔ CODEBASE"
          color={COLORS.text}
          side="right"
        />

        {/* Context Layer at center — the channel itself */}
        <ContextNode reduce={reduce} />

        {/* Vertex cards */}
        <VertexCard
          pos={POS.codebase}
          icon={<Boxes size={20} strokeWidth={1.5} />}
          kicker="LEGACY"
          title="Codebase"
          fg={COLORS.codebase}
          bg={COLORS.codebaseBg}
        />
        <VertexCard
          pos={POS.human}
          icon={<User size={20} strokeWidth={1.5} />}
          kicker="DEVELOPER"
          title="Human"
          fg={COLORS.human}
          bg={COLORS.humanBg}
        />
        <VertexCard
          pos={POS.agent}
          icon={<Bot size={20} strokeWidth={1.5} />}
          kicker="AI"
          title="Agent"
          fg={COLORS.agent}
          bg={COLORS.agentBg}
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function TriangleOutline() {
  // Dashed triangle perimeter — represents the "intended" comm channels.
  // Lines stop short of each vertex so they don't visually crash into the cards.
  const inset = 70;
  const a = inset_(POS.codebase, POS.human, inset);
  const b = inset_(POS.human, POS.codebase, inset);
  const c = inset_(POS.human, POS.agent, inset);
  const d = inset_(POS.agent, POS.human, inset);
  const e = inset_(POS.agent, POS.codebase, inset);
  const f = inset_(POS.codebase, POS.agent, inset);
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.16)" strokeWidth="1" strokeDasharray="4 5" />
      <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="rgba(0,0,0,0.16)" strokeWidth="1" strokeDasharray="4 5" />
      <line x1={e.x} y1={e.y} x2={f.x} y2={f.y} stroke="rgba(0,0,0,0.16)" strokeWidth="1" strokeDasharray="4 5" />
    </g>
  );
}

function inset_(from: { x: number; y: number }, to: { x: number; y: number }, by: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: from.x + (dx / len) * by, y: from.y + (dy / len) * by };
}

function Spoke({
  from,
  to,
  gradientId,
  color,
  delay,
  reduce,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  gradientId: string;
  color: string;
  delay: number;
  reduce: boolean | null;
}) {
  // Trim 60px from the vertex side so the spoke lands on the card edge,
  // and 36px from the center side so it lands on the Context Layer puck.
  const start = inset_(from, to, 64);
  const end = inset_(to, from, 68);

  return (
    <g>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Bidirectional particles: vertex → Context, then Context → vertex */}
      {!reduce ? (
        <>
          <motion.circle
            r="4"
            fill={color}
            initial={{ cx: start.x, cy: start.y, opacity: 0 }}
            animate={{
              cx: [start.x, end.x],
              cy: [start.y, end.y],
              opacity: [0, 1, 1, 0],
              fill: [color, COLORS.context],
            }}
            transition={{
              duration: 1.6,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            r="4"
            fill={COLORS.context}
            initial={{ cx: end.x, cy: end.y, opacity: 0 }}
            animate={{
              cx: [end.x, start.x],
              cy: [end.y, start.y],
              opacity: [0, 1, 1, 0],
              fill: [COLORS.context, color],
            }}
            transition={{
              duration: 1.6,
              delay: delay + 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        </>
      ) : null}
    </g>
  );
}

function EdgeLabel({
  from,
  to,
  text,
  color,
  side,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  text: string;
  color: string;
  side?: "left" | "right";
}) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // Push the label slightly outside the triangle along the edge normal.
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular pointing OUTSIDE the triangle (away from centroid).
  let nx = -dy / len;
  let ny = dx / len;
  // Flip normal if it points toward the centroid.
  const towardCenter = (CENTER.x - mx) * nx + (CENTER.y - my) * ny;
  if (towardCenter > 0) {
    nx = -nx;
    ny = -ny;
  }
  const offset = 24;
  const x = mx + nx * offset;
  const y = my + ny * offset;

  // Rotate text to follow the edge direction so the label rides along the edge.
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle > 90 || angle < -90) angle += 180; // keep text upright

  const anchor = side === "left" ? "middle" : side === "right" ? "middle" : "middle";

  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <text
        textAnchor={anchor}
        fontSize="11"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="2"
        fill={color}
        opacity="0.9"
        dy="0.35em"
      >
        {text}
      </text>
    </g>
  );
}

function ContextNode({ reduce }: { reduce: boolean | null }) {
  const rOuter = 64;
  const rInner = 50;

  return (
    <g>
      {/* Concentric pulse rings */}
      {!reduce
        ? [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={CENTER.x}
              cy={CENTER.y}
              r={rOuter + i * 10}
              fill="none"
              stroke={COLORS.context}
              strokeOpacity={0.18 - i * 0.04}
              strokeWidth="1"
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                duration: 3.8,
                delay: i * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
            />
          ))
        : null}

      {/* Outer green halo */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={rOuter}
        fill={COLORS.contextBg}
        stroke={COLORS.context}
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Inner white puck */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={rInner}
        fill="#ffffff"
        stroke={COLORS.context}
        strokeWidth="1.6"
        filter={`drop-shadow(0px 6px 16px rgba(16,185,129,0.22))`}
      />

      {/* Label */}
      <text
        x={CENTER.x}
        y={CENTER.y - 5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1.4"
        fill={COLORS.text}
      >
        THE CHANNEL
      </text>
      <text
        x={CENTER.x}
        y={CENTER.y + 13}
        textAnchor="middle"
        fontSize="14"
        fontFamily="var(--font-display)"
        fontWeight="300"
        fill={COLORS.contextDark}
      >
        Context Layer
      </text>
    </g>
  );
}

function VertexCard({
  pos,
  icon,
  kicker,
  title,
  fg,
  bg,
}: {
  pos: { x: number; y: number };
  icon: React.ReactNode;
  kicker: string;
  title: string;
  fg: string;
  bg: string;
}) {
  const w = 156;
  const h = 64;
  const x = pos.x - w / 2;
  const y = pos.y - h / 2;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.06))"
      />
      <rect x={x + 12} y={y + h / 2 - 18} width="36" height="36" rx="9" fill={bg} />
      <foreignObject x={x + 12} y={y + h / 2 - 18} width="36" height="36">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: fg,
            width: "100%",
            height: "100%",
          }}
        >
          {icon}
        </div>
      </foreignObject>
      <text
        x={x + 56}
        y={y + 26}
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1.4"
        fill={COLORS.text}
      >
        {kicker}
      </text>
      <text
        x={x + 56}
        y={y + 46}
        fontSize="15"
        fontFamily="var(--font-sans)"
        fontWeight="500"
        fill="#0a0a0a"
      >
        {title}
      </text>
    </motion.g>
  );
}
