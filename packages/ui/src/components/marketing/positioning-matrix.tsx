// Two small quadrant charts side-by-side: Forward ↔ Backward and Horizontal ↔ Vertical.
// Each quadrant hosts tool/brand labels so devs can orient quickly.

interface MatrixProps {
  title: string;
  xAxis: [string, string];
  yAxis: [string, string];
  markers: Array<{ x: number; y: number; label: string; us?: boolean }>;
}

function Matrix({ title, xAxis, yAxis, markers }: MatrixProps) {
  const W = 280;
  const H = 220;
  const pad = 44;
  return (
    <div className="bg-white rounded-section p-6 shadow-[var(--shadow-outline-ring)]">
      <p className="text-button-upper text-[#777169] mb-4">{title}</p>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title}>
          <title>{title}</title>
          {/* Frame */}
          <rect
            x={pad}
            y={pad - 24}
            width={W - pad - 16}
            height={H - pad}
            fill="#f9f9f9"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
            rx="8"
          />
          {/* Axes */}
          <line
            x1={(W + pad - 16) / 2}
            y1={pad - 24}
            x2={(W + pad - 16) / 2}
            y2={H}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1={pad}
            y1={(H - 24 + pad) / 2}
            x2={W - 16}
            y2={(H - 24 + pad) / 2}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Axis labels */}
          <text x={pad + 4} y={H - 6} fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" fill="#777169">
            {xAxis[0]}
          </text>
          <text x={W - 16} y={H - 6} textAnchor="end" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" fill="#777169">
            {xAxis[1]}
          </text>
          <text x={pad - 6} y={pad - 10} textAnchor="end" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" fill="#777169">
            {yAxis[1]}
          </text>
          <text x={pad - 6} y={H - 12} textAnchor="end" fontSize="9" fontFamily="var(--font-sans)" fontWeight="600" fill="#777169">
            {yAxis[0]}
          </text>

          {/* Markers */}
          {markers.map((m) => {
            const chartW = W - pad - 16;
            const chartH = H - pad + 8;
            const cx = pad + m.x * chartW;
            const cy = pad - 24 + (1 - m.y) * chartH;
            if (m.us) {
              return (
                <g key={m.label}>
                  <rect x={cx - 44} y={cy - 10} width="88" height="20" rx="6" fill="#0a0a0a" />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="var(--font-sans)"
                    fontWeight="600"
                    fill="white"
                  >
                    {m.label}
                  </text>
                </g>
              );
            }
            return (
              <g key={m.label}>
                <circle cx={cx} cy={cy} r="3" fill="#777169" />
                <text
                  x={cx + 6}
                  y={cy + 3}
                  fontSize="9"
                  fontFamily="var(--font-sans)"
                  fill="#4e4e4e"
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function PositioningMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Matrix
        title="Forward vs. Backward Engineering"
        xAxis={["Forward", "Backward"]}
        yAxis={["General", "Code-specific"]}
        markers={[
          { x: 0.18, y: 0.68, label: "Cursor" },
          { x: 0.26, y: 0.76, label: "Claude Code" },
          { x: 0.14, y: 0.6, label: "Copilot" },
          { x: 0.8, y: 0.8, label: "Context Layer", us: true },
        ]}
      />
      <Matrix
        title="Horizontal Infra vs. Vertical Product"
        xAxis={["Horizontal", "Vertical"]}
        yAxis={["Generic", "Codebase"]}
        markers={[
          { x: 0.16, y: 0.2, label: "Mem0" },
          { x: 0.22, y: 0.3, label: "Cognee" },
          { x: 0.12, y: 0.16, label: "Hindsight" },
          { x: 0.82, y: 0.82, label: "Context Layer", us: true },
        ]}
      />
    </div>
  );
}
