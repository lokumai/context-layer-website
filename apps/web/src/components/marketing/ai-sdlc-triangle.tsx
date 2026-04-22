// Static triangle diagram that complements the animated hero.
// Hero SHOWS the triangle forming; this section EXPLAINS it.

export function AISdlcTriangle() {
  const W = 520;
  const H = 280;
  const apex = { x: W / 2, y: 40 };
  const left = { x: 60, y: H - 40 };
  const right = { x: W - 60, y: H - 40 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px] h-auto" role="img" aria-label="AI-SDLC Triangle">
      <title>Human · Agent · Codebase — Context is the channel</title>

      {/* Edges (colored) */}
      <line x1={apex.x} y1={apex.y + 24} x2={left.x + 40} y2={left.y} stroke="#3b82f6" strokeWidth="2" />
      <line x1={apex.x} y1={apex.y + 24} x2={right.x - 40} y2={right.y} stroke="#10b981" strokeWidth="2" />
      <line x1={left.x + 40} y1={left.y} x2={right.x - 40} y2={right.y} stroke="#b45309" strokeWidth="2" />

      {/* Edge labels */}
      <text
        x={(apex.x + left.x) / 2 - 40}
        y={(apex.y + left.y) / 2}
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        letterSpacing="1"
        fill="#1d4ed8"
      >
        HUMAN ↔ CONTEXT
      </text>
      <text
        x={(apex.x + right.x) / 2 + 40}
        y={(apex.y + right.y) / 2}
        textAnchor="end"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        letterSpacing="1"
        fill="#047857"
      >
        AGENT ↔ CONTEXT
      </text>
      <text
        x={W / 2}
        y={H - 20}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        letterSpacing="1"
        fill="#b45309"
      >
        HUMAN ↔ AGENT
      </text>

      {/* Vertex nodes */}
      <Vertex pos={apex} label="Context" sub="the channel" fg="#047857" bg="#ecfdf5" />
      <Vertex pos={left} label="Human" sub="developer" fg="#1d4ed8" bg="#eff6ff" />
      <Vertex pos={right} label="Agent" sub="AI" fg="#b45309" bg="#fffbeb" />
    </svg>
  );
}

function Vertex({
  pos,
  label,
  sub,
  fg,
  bg,
}: {
  pos: { x: number; y: number };
  label: string;
  sub: string;
  fg: string;
  bg: string;
}) {
  return (
    <g>
      <rect x={pos.x - 60} y={pos.y} width="120" height="48" rx="10" fill="#ffffff" stroke="rgba(0,0,0,0.08)" />
      <rect x={pos.x - 54} y={pos.y + 6} width="30" height="36" rx="6" fill={bg} />
      <text
        x={pos.x - 19}
        y={pos.y + 22}
        fontSize="12"
        fontFamily="var(--font-display)"
        fontWeight="300"
        fill={fg}
      >
        {label}
      </text>
      <text
        x={pos.x - 19}
        y={pos.y + 36}
        fontSize="9"
        fontFamily="var(--font-sans)"
        fill="#777169"
      >
        {sub}
      </text>
    </g>
  );
}
