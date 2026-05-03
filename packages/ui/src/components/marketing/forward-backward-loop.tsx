"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, Database, User } from "lucide-react";

const BASE_PATH = "/context-layer-website";

// Forward / Backward engineering loop.
// Clockwise cycle of 4 nodes:
//   Developer (12)  →  AI Agents (3)  →  Codebase / Legacy (6)  →  Context Layer (9)  →  Developer
//   ↑ FORWARD half (writing)                  ↓ BACKWARD half (understanding) ↑
// A glow particle traces the full loop continuously.

const VIEW = 800;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R = 230; // slightly larger loop radius

// Node positions on the loop (compass points)
const POS = {
  developer: { x: CX, y: CY - R },
  ide: { x: CX + R, y: CY },
  codebase: { x: CX, y: CY + R },
  context: { x: CX - R, y: CY },
} as const;

// Color tokens — match the rest of the marketing palette.
const C = {
  amber: "#b45309",
  blue: "#1d4ed8",
  green: "#10b981",
  greenDark: "#047857",
  slate: "#0a0a0a",
  text: "#777169",
};

// Pre-compute keyframes around the circle for the traveling particle (clockwise).
const STEPS = 64;
const ANGLES = Array.from({ length: STEPS + 1 }, (_, i) => (i / STEPS) * Math.PI * 2);
const PARTICLE_X = ANGLES.map((a) => CX + R * Math.sin(a));
const PARTICLE_Y = ANGLES.map((a) => CY - R * Math.cos(a));
const PARTICLE_COLOR = ANGLES.map((a) => {
  const norm = a / (Math.PI * 2); // 0..1
  if (norm < 0.5) return blendHex(C.amber, C.blue, norm * 2);
  return C.green;
});

// Brand SVGs for the AI Agents card (24x24 viewBox each)
const AI_BRANDS = [
  {
    name: "Claude",
    color: "#D97757",
    path: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    name: "Cursor",
    color: "#000000",
    path: "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23",
  },
  {
    name: "Copilot",
    color: "#000000",
    path: "M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z",
  },
  {
    name: "Gemini",
    color: "#8E75B2",
    path: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
] as const;

export function ForwardBackwardLoop() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full max-w-[760px] mx-auto">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full h-auto"
        role="img"
        aria-label="Forward and backward engineering loop — Developer writes code with AI agents, Context Layer reverse-engineers the codebase back into shared knowledge."
      >
        <title>Forward / Backward engineering loop</title>

        <defs>
          <linearGradient id="fb-arc-forward" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0.65" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="fb-arc-backward" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.55" />
            <stop offset="50%" stopColor={C.green} stopOpacity="0.85" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0.55" />
          </linearGradient>

          <radialGradient id="fb-glow-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.32" />
            <stop offset="70%" stopColor={C.green} stopOpacity="0" />
          </radialGradient>

          <pattern id="fb-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width={VIEW} height={VIEW} fill="url(#fb-grid)" />

        {/* Center ambient glow */}
        <circle cx={CX} cy={CY} r="240" fill="url(#fb-glow-green)" />

        {/* Loop track halves */}
        <ArcHalf half="top" />
        <ArcHalf half="bottom" />

        {/* Direction labels — placed on diagonal arc segments BETWEEN cards
            so they no longer collide with the Developer / Codebase boxes. */}
        <ArcLabel
          id="fb-label-forward"
          startAngleDeg={40}
          endAngleDeg={70}
          text="FORWARD"
          color={C.text}
          radiusDelta={6}
        />
        <ArcLabel
          id="fb-label-backward"
          startAngleDeg={220}
          endAngleDeg={250}
          text="BACKWARD"
          color={C.greenDark}
          radiusDelta={6}
        />

        {/* Center label — what closes the loop */}
        <CenterLabel reduce={reduce} />

        {/* Traveling particle */}
        {!reduce ? <TravelingParticle /> : null}

        {/* Cards (rendered after track + label so they sit above) */}
        <NodeCard
          pos={POS.developer}
          tone="amber"
          icon={<User size={22} strokeWidth={1.5} />}
          kicker="HUMAN"
          title="Developer"
        />
        <NodeCard
          pos={POS.ide}
          tone="blue"
          icon={<AIAgentsIconCluster />}
          kicker="FORWARD TOOL"
          title="AI Agents"
        />
        <NodeCard
          pos={POS.codebase}
          tone="slate"
          icon={<Database size={22} strokeWidth={1.5} />}
          kicker="LEGACY"
          title="Codebase"
        />
        <NodeCard
          pos={POS.context}
          tone="green"
          kicker="BACKWARD TOOL"
          logoOnly
          emphasized
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ArcHalf({ half }: { half: "top" | "bottom" }) {
  const start = half === "top" ? { x: CX - R, y: CY } : { x: CX + R, y: CY };
  const end = half === "top" ? { x: CX + R, y: CY } : { x: CX - R, y: CY };
  const sweep = 1;
  const d = `M ${start.x} ${start.y} A ${R} ${R} 0 0 ${sweep} ${end.x} ${end.y}`;
  const stroke = half === "top" ? "url(#fb-arc-forward)" : "url(#fb-arc-backward)";
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="3 5" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function ArcLabel({
  id,
  startAngleDeg,
  endAngleDeg,
  text,
  color,
  radiusDelta = 0,
}: {
  id: string;
  startAngleDeg: number;
  endAngleDeg: number;
  text: string;
  color: string;
  radiusDelta?: number;
}) {
  const r = R + radiusDelta;
  const startA = (startAngleDeg * Math.PI) / 180;
  const endA = (endAngleDeg * Math.PI) / 180;
  const sx = CX + r * Math.sin(startA);
  const sy = CY - r * Math.cos(startA);
  const ex = CX + r * Math.sin(endA);
  const ey = CY - r * Math.cos(endA);
  const sweep = 1; // clockwise
  const largeArc = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0;
  const d = `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
  return (
    <g>
      <path id={id} d={d} fill="none" />
      <text
        fontSize="14"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="2.5"
        fill={color}
        opacity={0.9}
      >
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </g>
  );
}

function CenterLabel({ reduce }: { reduce: boolean | null }) {
  return (
    <g>
      {!reduce
        ? [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={CX}
              cy={CY}
              r={36 + i * 8}
              fill="none"
              stroke={C.green}
              strokeOpacity={0.14 - i * 0.03}
              strokeWidth="1"
              animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.85, 0.45] }}
              transition={{
                duration: 3.6,
                delay: i * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />
          ))
        : null}

      <circle
        cx={CX}
        cy={CY}
        r="32"
        fill="#ffffff"
        stroke={C.green}
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <text
        x={CX}
        y={CY - 2}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1.2"
        fill={C.text}
      >
        AI-SDLC
      </text>
      <text
        x={CX}
        y={CY + 14}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        letterSpacing="1.6"
        fill={C.greenDark}
      >
        LOOP
      </text>
    </g>
  );
}

function TravelingParticle() {
  const times = ANGLES.map((_, i) => i / STEPS);
  return (
    <g>
      <motion.circle
        r="13"
        fill={C.green}
        fillOpacity={0.18}
        animate={{ cx: PARTICLE_X, cy: PARTICLE_Y }}
        transition={{ duration: 12, times, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.circle
        r="6"
        animate={{ cx: PARTICLE_X, cy: PARTICLE_Y, fill: PARTICLE_COLOR }}
        transition={{ duration: 12, times, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface NodeCardProps {
  pos: { x: number; y: number };
  tone: "amber" | "blue" | "slate" | "green";
  icon?: React.ReactNode;
  kicker?: string;
  title?: string;
  emphasized?: boolean;
  logoOnly?: boolean;
}

const TONE_PALETTE = {
  amber: { fg: "#b45309", bg: "#fff7ed", ring: "rgba(180,83,9,0.18)" },
  blue: { fg: "#1d4ed8", bg: "#eff6ff", ring: "rgba(29,78,216,0.18)" },
  slate: { fg: "#0a0a0a", bg: "#f5f5f4", ring: "rgba(10,10,10,0.14)" },
  green: { fg: "#047857", bg: "#ecfdf5", ring: "rgba(4,120,87,0.24)" },
};

function NodeCard({ pos, tone, icon, kicker, title, emphasized, logoOnly }: NodeCardProps) {
  const w = 210;
  const h = 96;
  const x = pos.x - w / 2;
  const y = pos.y - h / 2;
  const palette = TONE_PALETTE[tone];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="14"
        fill="#ffffff"
        stroke={emphasized ? palette.fg : "rgba(0,0,0,0.08)"}
        strokeWidth={emphasized ? "1.6" : "1"}
        filter={
          emphasized
            ? `drop-shadow(0px 8px 18px ${palette.ring})`
            : "drop-shadow(0px 3px 8px rgba(0,0,0,0.06))"
        }
      />

      {logoOnly ? (
        <>
          {kicker && (
            <text
              x={x + w / 2}
              y={y + 24}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-sans)"
              fontWeight="700"
              letterSpacing="1.4"
              fill="#777169"
            >
              {kicker}
            </text>
          )}
          <image
            href={`${BASE_PATH}/logo_square.svg`}
            x={x + w / 2 - 90}
            y={y + 36}
            width="180"
            height="45"
            preserveAspectRatio="xMidYMid meet"
          />
        </>
      ) : (
        <>
          {/* Icon chip */}
          <rect x={x + 14} y={y + h / 2 - 24} width="48" height="48" rx="10" fill={palette.bg} />
          <foreignObject x={x + 14} y={y + h / 2 - 24} width="48" height="48">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.fg,
                width: "100%",
                height: "100%",
              }}
            >
              {icon}
            </div>
          </foreignObject>

          {/* Text */}
          <text
            x={x + 72}
            y={y + 38}
            fontSize="11"
            fontFamily="var(--font-sans)"
            fontWeight="700"
            letterSpacing="1.4"
            fill="#777169"
          >
            {kicker}
          </text>
          <text
            x={x + 72}
            y={y + 64}
            fontSize="18"
            fontFamily="var(--font-sans)"
            fontWeight="500"
            fill="#0a0a0a"
          >
            {title}
          </text>
        </>
      )}
    </motion.g>
  );
}

// 2×2 cluster of brand marks for the AI Agents card.
function AIAgentsIconCluster() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 4,
        width: 40,
        height: 40,
      }}
    >
      {AI_BRANDS.map((b) => (
        <span
          key={b.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-label={b.name}>
            <title>{b.name}</title>
            <path d={b.path} fill={b.color} />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function blendHex(a: string, b: string, t: number): string {
  const ar = Number.parseInt(a.slice(1, 3), 16);
  const ag = Number.parseInt(a.slice(3, 5), 16);
  const ab = Number.parseInt(a.slice(5, 7), 16);
  const br = Number.parseInt(b.slice(1, 3), 16);
  const bg = Number.parseInt(b.slice(3, 5), 16);
  const bb = Number.parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bch = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bch.toString(16).padStart(2, "0")}`;
}
