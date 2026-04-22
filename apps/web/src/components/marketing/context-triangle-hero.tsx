"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, FileCode, FileText, GitBranch, User } from "lucide-react";

// Signature hero animation.
// Tells the full product story in one visual:
//   Sources (bottom)  ──►  Context scan (middle)  ──►  Knowledge (top)
//   then Context feeds Human Dev (top-left) and AI Agent (top-right),
//   completing the AI-SDLC Triangle.

const VIEW_W = 600;
const VIEW_H = 640;

interface Source {
  id: string;
  label: string;
  kind: "repo" | "file" | "pdf";
  y: number;
  offsetX: number;
}

// Fixed source deck — declared at module scope so it doesn't reallocate per render.
const SOURCES: Source[] = [
  { id: "s1", label: "offering-service/src/main.py", kind: "repo", y: 468, offsetX: -4 },
  { id: "s2", label: "web-ui/src/api-client.ts", kind: "repo", y: 436, offsetX: 12 },
  { id: "s3", label: "libs/common-python/outbox.py", kind: "repo", y: 404, offsetX: -10 },
  { id: "s4", label: "RFCs/architecture.pdf", kind: "pdf", y: 372, offsetX: 10 },
  { id: "s5", label: "onboarding.md", kind: "file", y: 340, offsetX: -2 },
];

const CONTEXT_POS = { x: VIEW_W / 2, y: 228 };
const HUMAN_POS = { x: 94, y: 80 };
const AGENT_POS = { x: 506, y: 80 };

export function ContextTriangleHero() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Context Layer turns sources into shared knowledge for Human Dev and AI Agent — the AI-SDLC Triangle"
      >
        <title>AI-SDLC Triangle</title>

        <defs>
          {/* Blue→green gradient for source→context tendrils */}
          <linearGradient id="tendril-src" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
          </linearGradient>
          {/* Radial glow for context center */}
          <radialGradient id="glow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-amber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
          {/* Blueprint grid pattern */}
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Blueprint background */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#grid)" />

        {/* Ambient corner glows */}
        <circle cx={HUMAN_POS.x} cy={HUMAN_POS.y} r="150" fill="url(#glow-blue)" />
        <circle cx={AGENT_POS.x} cy={AGENT_POS.y} r="150" fill="url(#glow-green)" />
        <circle cx={CONTEXT_POS.x} cy={CONTEXT_POS.y} r="170" fill="url(#glow-green)" />

        {/* Top-center label */}
        <g>
          <text
            x={VIEW_W / 2}
            y={32}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-sans)"
            fontWeight="600"
            letterSpacing="1.4"
            fill="#777169"
          >
            AI-SDLC TRIANGLE
          </text>
        </g>

        {/* Triangle EDGES (drawn first, behind the vertex cards) */}
        <TriangleEdges reduce={reduce} />

        {/* Context → Human tendril (blue, pulsing) */}
        <AnimatedLine
          from={CONTEXT_POS}
          to={{ x: HUMAN_POS.x + 40, y: HUMAN_POS.y + 14 }}
          color="#3b82f6"
          reduce={reduce}
          delay={0.4}
        />
        {/* Context → Agent tendril (green, pulsing) */}
        <AnimatedLine
          from={CONTEXT_POS}
          to={{ x: AGENT_POS.x - 40, y: AGENT_POS.y + 14 }}
          color="#10b981"
          reduce={reduce}
          delay={1.0}
        />

        {/* Source → Context tendrils */}
        {SOURCES.map((s, i) => (
          <SourceTendril
            key={s.id}
            source={s}
            index={i}
            reduce={reduce}
          />
        ))}

        {/* Sources (bottom stack) */}
        {SOURCES.map((s, i) => (
          <SourceCard key={s.id} source={s} index={i} reduce={reduce} />
        ))}

        {/* Scan line + particles */}
        {!reduce ? <ScanLine /> : null}

        {/* Context central node */}
        <ContextNode reduce={reduce} />

        {/* Triangle vertices */}
        <VertexCard pos={HUMAN_POS} tone="info" label="HUMAN · DEV" icon="user" />
        <VertexCard pos={AGENT_POS} tone="indexed" label="AI · AGENT" icon="bot" />

        {/* Side labels */}
        <SideLabels />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function SourceCard({
  source,
  index,
  reduce,
}: {
  source: Source;
  index: number;
  reduce: boolean | null;
}) {
  const cx = VIEW_W / 2 + source.offsetX;
  const cardW = 280;
  const cardH = 28;

  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -2, 0] }}
      transition={
        reduce
          ? { duration: 0.6, delay: 0.1 + index * 0.1 }
          : {
              opacity: { duration: 0.6, delay: 0.1 + index * 0.1 },
              y: { duration: 4 + index * 0.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }
      }
    >
      <rect
        x={cx - cardW / 2}
        y={source.y}
        width={cardW}
        height={cardH}
        rx="6"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="1"
        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.04))"
      />
      {/* Icon area */}
      <rect
        x={cx - cardW / 2 + 8}
        y={source.y + 6}
        width="16"
        height="16"
        rx="3"
        fill={iconBg(source.kind)}
      />
      <IconInSVG kind={source.kind} x={cx - cardW / 2 + 10} y={source.y + 8} />
      {/* Filename */}
      <text
        x={cx - cardW / 2 + 32}
        y={source.y + 18}
        fontSize="10"
        fontFamily="var(--font-mono)"
        fill="#4e4e4e"
      >
        {truncate(source.label, 32)}
      </text>
      {/* Status dot */}
      <circle
        cx={cx + cardW / 2 - 12}
        cy={source.y + cardH / 2}
        r="3"
        fill="#10b981"
      />
    </motion.g>
  );
}

function ContextNode({ reduce }: { reduce: boolean | null }) {
  const w = 220;
  const h = 120;
  const x = CONTEXT_POS.x - w / 2;
  const y = CONTEXT_POS.y - h / 2;

  return (
    <g>
      {/* pulsing halo */}
      {!reduce ? (
        <motion.circle
          cx={CONTEXT_POS.x}
          cy={CONTEXT_POS.y}
          r="70"
          fill="url(#glow-green)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ transformOrigin: `${CONTEXT_POS.x}px ${CONTEXT_POS.y}px` }}
        />
      ) : null}

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill="#ffffff"
        stroke="#d1fae5"
        strokeWidth="1.5"
        filter="drop-shadow(0px 4px 12px rgba(16,185,129,0.12))"
      />

      {/* Header row */}
      <text
        x={x + 14}
        y={y + 20}
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1"
        fill="#777169"
      >
        CONTEXT LAYER
      </text>
      <text
        x={x + w - 14}
        y={y + 20}
        textAnchor="end"
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        fill="#047857"
      >
        ● LIVE
      </text>
      <text
        x={x + 14}
        y={y + 42}
        fontSize="15"
        fontFamily="var(--font-display)"
        fontWeight="300"
        fill="#0a0a0a"
      >
        Context
      </text>

      {/* 3 layer pills */}
      {["Workspace narrative", "Repo wikis", "llms.txt"].map((label, i) => (
        <g key={label}>
          <rect
            x={x + 14}
            y={y + 55 + i * 18}
            width={w - 28}
            height="14"
            rx="7"
            fill="#ecfdf5"
          />
          <circle cx={x + 24} cy={y + 62 + i * 18} r="3" fill="#10b981" />
          <text
            x={x + 34}
            y={y + 65 + i * 18}
            fontSize="9"
            fontFamily="var(--font-sans)"
            fill="#047857"
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

function VertexCard({
  pos,
  tone,
  label,
  icon,
}: {
  pos: { x: number; y: number };
  tone: "info" | "indexed";
  label: string;
  icon: "user" | "bot";
}) {
  const w = 140;
  const h = 58;
  const x = pos.x - w / 2;
  const y = pos.y - h / 2;
  const color = tone === "info" ? "#1d4ed8" : "#047857";
  const bg = tone === "info" ? "#eff6ff" : "#ecfdf5";
  return (
    <motion.g
      initial={{ opacity: 0.35 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 3 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.05))"
      />
      <rect x={x + 10} y={y + 10} width="28" height="28" rx="6" fill={bg} />
      <foreignObject x={x + 13} y={y + 13} width="22" height="22">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            width: "100%",
            height: "100%",
          }}
        >
          {icon === "user" ? (
            <User size={18} strokeWidth={1.5} />
          ) : (
            <Bot size={18} strokeWidth={1.5} />
          )}
        </div>
      </foreignObject>
      <text
        x={x + 46}
        y={y + 24}
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#777169"
      >
        {label}
      </text>
      <text
        x={x + 46}
        y={y + 40}
        fontSize="12"
        fontFamily="var(--font-sans)"
        fontWeight="500"
        fill="#0a0a0a"
      >
        {icon === "user" ? "Developer" : "AI Agent"}
      </text>
    </motion.g>
  );
}

function TriangleEdges({ reduce }: { reduce: boolean | null }) {
  // Three edges of the AI-SDLC triangle.
  // Human ↔ Context (blue), Context ↔ Agent (green), Human ↔ Agent (amber base).
  const edges = [
    { from: HUMAN_POS, to: CONTEXT_POS, color: "#3b82f6", delay: 0 },
    { from: CONTEXT_POS, to: AGENT_POS, color: "#10b981", delay: 1.8 },
    { from: HUMAN_POS, to: AGENT_POS, color: "#b45309", delay: 3.6 },
  ];

  return (
    <g>
      {edges.map((e) => (
        <g key={`${e.from.x}-${e.to.x}`}>
          <line
            x1={e.from.x}
            y1={e.from.y + 28}
            x2={e.to.x}
            y2={e.to.y + 28}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {!reduce ? (
            <motion.circle
              r="3.5"
              fill={e.color}
              initial={{ cx: e.from.x, cy: e.from.y + 28, opacity: 0 }}
              animate={{
                cx: [e.from.x, e.to.x],
                cy: [e.from.y + 28, e.to.y + 28],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.6,
                delay: e.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </g>
      ))}
    </g>
  );
}

function SourceTendril({
  source,
  index,
  reduce,
}: {
  source: Source;
  index: number;
  reduce: boolean | null;
}) {
  const cx = VIEW_W / 2 + source.offsetX;
  const fromY = source.y + 14;
  const toX = CONTEXT_POS.x + (index - 2) * 14;
  const toY = CONTEXT_POS.y + 60;
  const d = `M ${cx} ${fromY} C ${cx} ${fromY - 60}, ${toX} ${toY + 60}, ${toX} ${toY}`;

  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      {!reduce ? (
        <motion.path
          d={d}
          fill="none"
          stroke="url(#tendril-src)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: 2.4,
            delay: index * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      ) : null}
    </g>
  );
}

function AnimatedLine({
  from,
  to,
  color,
  reduce,
  delay,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  reduce: boolean | null;
  delay: number;
}) {
  if (reduce) {
    return (
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    );
  }
  return (
    <motion.circle
      r="3"
      fill={color}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2.6,
        ease: "easeInOut",
      }}
    />
  );
}

function ScanLine() {
  return (
    <g>
      <motion.line
        x1={VIEW_W / 2 - 160}
        x2={VIEW_W / 2 + 160}
        stroke="#b45309"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        initial={{ y1: 500, y2: 500 }}
        animate={{ y1: [500, 320], y2: [500, 320], opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {/* Amber particles drifting up */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          r="1.6"
          fill="#b45309"
          initial={{ cx: VIEW_W / 2 + (i - 2.5) * 22, cy: 430 + i * 8, opacity: 0 }}
          animate={{
            cy: [430 + i * 8, 250 + i * 6],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}
    </g>
  );
}

function SideLabels() {
  return (
    <g fontFamily="var(--font-sans)" fontSize="9" fontWeight="600" letterSpacing="1" fill="#777169">
      <g>
        <circle cx="22" cy="224" r="3" fill="#10b981" />
        <text x="30" y="227">KNOWLEDGE · 3 LAYERS</text>
      </g>
      <g>
        <circle cx="22" cy="356" r="3" fill="#b45309" />
        <text x="30" y="359">CONTEXT LAYER · PROCESSING</text>
      </g>
      <g>
        <circle cx="22" cy="488" r="3" fill="#3b82f6" />
        <text x="30" y="491">SOURCES · 5 INDEXED</text>
      </g>
    </g>
  );
}

function IconInSVG({ kind, x, y }: { kind: Source["kind"]; x: number; y: number }) {
  return (
    <foreignObject x={x} y={y} width="14" height="14">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: iconFg(kind),
        }}
      >
        {kind === "repo" ? (
          <GitBranch size={12} strokeWidth={1.5} />
        ) : kind === "pdf" ? (
          <FileText size={12} strokeWidth={1.5} />
        ) : (
          <FileCode size={12} strokeWidth={1.5} />
        )}
      </div>
    </foreignObject>
  );
}

function iconBg(k: Source["kind"]) {
  if (k === "pdf") return "#fef2f2";
  if (k === "file") return "#f5f2ef";
  return "#eff6ff";
}
function iconFg(k: Source["kind"]) {
  if (k === "pdf") return "#b91c1c";
  if (k === "file") return "#525252";
  return "#1d4ed8";
}
function truncate(s: string, n: number) {
  return s.length <= n ? s : `…${s.slice(-n + 1)}`;
}
