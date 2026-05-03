"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  FileCode,
  FileText,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// Hybrid Carousel-Switcher
// Pill segmented control on top + 3D coverflow stage below.
// Each panel is a stylized mockup of the corresponding playground page.

type TabId = "sources" | "knowledge" | "chatbot" | "generate";

interface Tab {
  id: TabId;
  step: string;
  label: string;
  kicker: string;
  body: string;
  bullets: string[];
  fg: string;
  bg: string;
  Icon: typeof Inbox;
}

const TABS: Tab[] = [
  {
    id: "sources",
    step: "01",
    label: "Sources",
    kicker: "Connect",
    body: "Plug GitHub, Drive, Notion, Slack — anything your team already uses. We index it once and keep it fresh.",
    bullets: ["13+ connectors", "Multi-repo workspaces", "On-premise option"],
    fg: "#1d4ed8",
    bg: "#eff6ff",
    Icon: Inbox,
  },
  {
    id: "knowledge",
    step: "02",
    label: "Knowledge",
    kicker: "Sync",
    body: "Three-layer Wiki + live Intelligence dashboards. Always fresh, always versioned, always multi-repo.",
    bullets: ["Workspace · repo · llms.txt", "Live Intelligence dashboards", "Git-diff version history"],
    fg: "#047857",
    bg: "#ecfdf5",
    Icon: BookOpen,
  },
  {
    id: "chatbot",
    step: "03",
    label: "Chatbot",
    kicker: "Ask",
    body: "Conversational surface over every source. Every answer cites a wiki anchor and an `@file:line` location.",
    bullets: ["Wiki + code citations", "Grounding filter chips", "Side-panel on every page"],
    fg: "#b45309",
    bg: "#fffbeb",
    Icon: MessageSquare,
  },
  {
    id: "generate",
    step: "04",
    label: "Generate",
    kicker: "Export",
    body: "Frozen, shareable artifacts. DocsGen bundles, OmniBoard onboarding, MCP descriptors — all saved to Library.",
    bullets: ["6 DocsGen bundles", "OmniBoard text · audio · video", "Versioned Library"],
    fg: "#0a0a0a",
    bg: "#f5f5f4",
    Icon: Sparkles,
  },
];

export function CapabilityCarousel() {
  const [active, setActive] = useState<TabId>("sources");
  const activeIdx = TABS.findIndex((t) => t.id === active);
  const activeTab = TABS[activeIdx];

  const goRel = useCallback((delta: number) => {
    setActive((cur) => {
      const i = TABS.findIndex((t) => t.id === cur);
      const next = (i + delta + TABS.length) % TABS.length;
      return TABS[next].id;
    });
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRel(1);
      else if (e.key === "ArrowLeft") goRel(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goRel]);

  return (
    <div className="space-y-10">
      {/* Pill switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {TABS.map((t) => {
          const isActive = t.id === active;
          const Icon = t.Icon;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-pill text-button transition-colors duration-200"
              style={{
                backgroundColor: isActive ? t.bg : "rgba(255,255,255,0.85)",
                color: isActive ? t.fg : "#4e4e4e",
                boxShadow: isActive
                  ? `0 1px 2px rgba(0,0,0,0.04), 0 6px 16px ${rgba(t.fg, 0.14)}, inset 0 0 0 1px ${rgba(t.fg, 0.22)}`
                  : "0 1px 2px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.07)",
              }}
            >
              <span
                aria-hidden
                className="text-[10px] font-semibold tracking-[1.4px] opacity-65"
              >
                {t.step}
              </span>
              <Icon size={14} strokeWidth={1.75} />
              <span>{t.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Coverflow stage */}
      <div
        className="relative mx-auto w-full select-none"
        style={{ perspective: "1500px", height: "min(540px, 64vw)" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {TABS.map((t, idx) => {
            const rel = (((idx - activeIdx) % TABS.length) + TABS.length) % TABS.length;
            const position: PanelPosition =
              rel === 0
                ? "active"
                : rel === 1
                  ? "right"
                  : rel === TABS.length - 1
                    ? "left"
                    : "hidden";
            return (
              <CoverPanel
                key={t.id}
                tab={t}
                position={position}
                onSelect={() => setActive(t.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Narrative footer for the active tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto max-w-[940px] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-end"
        >
          <div className="space-y-2">
            <p
              className="text-button-upper"
              style={{ color: activeTab.fg === "#0a0a0a" ? "#525252" : activeTab.fg }}
            >
              {activeTab.step} · {activeTab.kicker}
            </p>
            <h3 className="text-card-heading text-black">{activeTab.label}</h3>
            <p className="text-body-standard text-[#4e4e4e] max-w-[600px]">{activeTab.body}</p>
          </div>
          <ul className="flex flex-col gap-2 md:items-end">
            {activeTab.bullets.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-2 text-caption text-[#4e4e4e]"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeTab.bg, color: activeTab.fg }}
                >
                  <Check size={9} strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Coverflow panel

type PanelPosition = "active" | "left" | "right" | "hidden";

const POSITION_STYLES: Record<
  PanelPosition,
  {
    x: string;
    rotateY: number;
    scale: number;
    opacity: number;
    zIndex: number;
    filter: string;
    pointerEvents: "auto" | "none";
  }
> = {
  active: {
    x: "0%",
    rotateY: 0,
    scale: 1,
    opacity: 1,
    zIndex: 4,
    filter: "blur(0px)",
    pointerEvents: "auto",
  },
  left: {
    x: "-44%",
    rotateY: 24,
    scale: 0.78,
    opacity: 0.55,
    zIndex: 2,
    filter: "blur(1.5px)",
    pointerEvents: "auto",
  },
  right: {
    x: "44%",
    rotateY: -24,
    scale: 0.78,
    opacity: 0.55,
    zIndex: 2,
    filter: "blur(1.5px)",
    pointerEvents: "auto",
  },
  hidden: {
    x: "0%",
    rotateY: 0,
    scale: 0.55,
    opacity: 0,
    zIndex: 0,
    filter: "blur(8px)",
    pointerEvents: "none",
  },
};

function CoverPanel({
  tab,
  position,
  onSelect,
}: {
  tab: Tab;
  position: PanelPosition;
  onSelect: () => void;
}) {
  const s = POSITION_STYLES[position];
  return (
    <motion.div
      role="button"
      onClick={onSelect}
      aria-label={`View ${tab.label} preview`}
      tabIndex={position === "active" ? -1 : 0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      animate={{
        x: s.x,
        rotateY: s.rotateY,
        scale: s.scale,
        opacity: s.opacity,
        filter: s.filter,
      }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0.24, 1.0] }}
      className="absolute will-change-transform group"
      style={{
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        transformStyle: "preserve-3d",
        width: "min(820px, 88vw)",
        aspectRatio: "16 / 10",
      }}
    >
      <div
        className="w-full h-full rounded-section bg-white overflow-hidden text-left"
        style={{
          boxShadow:
            "0 28px 60px -22px rgba(0,0,0,0.22), 0 6px 18px -6px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <BrowserChrome label={`playground / ${tab.id}`} accent={tab.fg} accentBg={tab.bg} />
        <div className="relative w-full" style={{ height: "calc(100% - 36px)", backgroundColor: "#fafaf9" }}>
          {tab.id === "sources" && <SourcesMockup />}
          {tab.id === "knowledge" && <KnowledgeMockup />}
          {tab.id === "chatbot" && <ChatbotMockup />}
          {tab.id === "generate" && <GenerateMockup />}
        </div>
      </div>
    </motion.div>
  );
}

function BrowserChrome({
  label,
  accent,
  accentBg,
}: {
  label: string;
  accent: string;
  accentBg: string;
}) {
  const path = label.split(" / ")[1] ?? "";
  return (
    <div className="flex items-center gap-3 px-4 h-9 border-b border-black/5 bg-[#f5f5f4]">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
      </div>
      <div
        className="flex-1 max-w-[360px] mx-auto h-5 rounded-full px-2.5 flex items-center text-[10px] font-mono"
        style={{
          backgroundColor: "#ffffff",
          color: "#777169",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <span className="opacity-50 mr-1.5">▢</span>
        playground.context-layer.dev
        <span style={{ color: accent }}>/{path}</span>
      </div>
      <div
        className="text-[9px] tracking-[0.5px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
        style={{ backgroundColor: accentBg, color: accent }}
      >
        <motion.span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: accent }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        LIVE
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-tab mockups

function SourcesMockup() {
  const sources = [
    { brand: "GitHub", repo: "amirkiarafiei/api-gateway", status: "synced", time: "2m" },
    { brand: "GitHub", repo: "amirkiarafiei/orders-svc", status: "synced", time: "2m" },
    { brand: "GitHub", repo: "amirkiarafiei/payments-svc", status: "syncing", time: "now" },
    { brand: "Drive", repo: "RFCs / architecture.pdf", status: "synced", time: "1h" },
    { brand: "Notion", repo: "Engineering Wiki", status: "synced", time: "12m" },
    { brand: "Jira", repo: "PROD board · 24 issues", status: "synced", time: "5m" },
  ];
  return (
    <div className="absolute inset-0 p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">SOURCES · 6 INDEXED</div>
          <h4 className="text-[14px] font-display font-light text-black">Connected workspace</h4>
        </div>
        <button
          type="button"
          className="text-[9px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
          style={{ backgroundColor: "#1d4ed8", color: "white" }}
        >
          + Add Source
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {sources.map((s, i) => (
          <motion.div
            key={s.repo}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i, ease: "easeOut" }}
            className="bg-white rounded-comfortable p-2.5 flex flex-col gap-1.5"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold text-[#777169] tracking-[0.5px]">
                {s.brand.toUpperCase()}
              </span>
              <SyncDot status={s.status} />
            </div>
            <div className="text-[10px] text-black font-medium leading-tight truncate">
              {s.repo}
            </div>
            <div className="text-[8px] text-[#9ca3af]">Last sync · {s.time} ago</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SyncDot({ status }: { status: string }) {
  const isLive = status === "syncing";
  const fg = isLive ? "#b45309" : "#047857";
  return (
    <span
      className="inline-flex items-center gap-1 text-[8px] font-semibold tracking-[0.4px]"
      style={{ color: fg }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isLive ? "#b45309" : "#10b981" }}
        animate={isLive ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
        transition={
          isLive
            ? { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
      {status.toUpperCase()}
    </span>
  );
}

function KnowledgeMockup() {
  return (
    <div className="absolute inset-0 grid grid-cols-[176px_1fr_140px] overflow-hidden">
      {/* Sidebar tree */}
      <div className="border-r border-black/5 bg-white p-3 space-y-1">
        <div className="text-[9px] font-semibold tracking-[0.6px] text-[#777169] mb-2">WORKSPACE</div>
        {[
          { label: "api-gateway", active: true },
          { label: "orders-service" },
          { label: "payments-service" },
          { label: "offering-service" },
          { label: "web-ui" },
        ].map((r) => (
          <div
            key={r.label}
            className="text-[10px] px-2 py-1 rounded leading-tight"
            style={{
              backgroundColor: r.active ? "#ecfdf5" : "transparent",
              color: r.active ? "#047857" : "#4e4e4e",
              fontWeight: r.active ? 500 : 400,
            }}
          >
            {r.label}
          </div>
        ))}
        <div className="border-t border-black/5 my-2" />
        <div className="text-[9px] font-semibold tracking-[0.6px] text-[#777169] mb-1">PAGES</div>
        {[
          { label: "Overview" },
          { label: "Architecture", active: true },
          { label: "Endpoints" },
          { label: "Failure modes" },
        ].map((p) => (
          <div
            key={p.label}
            className="text-[10px] px-2 py-1 rounded leading-tight"
            style={{
              backgroundColor: p.active ? "#ecfdf5" : "transparent",
              color: p.active ? "#047857" : "#4e4e4e",
              fontWeight: p.active ? 500 : 400,
            }}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* Content pane */}
      <div className="p-5 overflow-hidden">
        <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px] mb-1.5">
          api-gateway / architecture
        </div>
        <h4 className="text-[18px] font-display font-light text-black leading-tight mb-2">
          Service-to-service flow
        </h4>
        <p className="text-[10px] text-[#4e4e4e] leading-snug mb-3">
          The <span className="font-mono bg-[#f5f5f4] px-1 py-0.5 rounded">api-gateway</span> fans
          out to four downstream services. Critical paths (orders → payments) use the transactional
          outbox pattern.
        </p>
        <div className="rounded-comfortable border border-black/5 bg-white p-3 mb-3">
          <MiniDiagram />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "CITATIONS", value: "214" },
            { label: "REVISIONS", value: "38" },
            { label: "LAST SYNC", value: "2m" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-comfortable bg-white border border-black/5 px-2 py-1.5"
            >
              <div className="text-[8px] text-[#777169] tracking-[0.5px]">{s.label}</div>
              <div className="text-[13px] font-display font-light text-black">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Outline */}
      <div className="border-l border-black/5 bg-white p-3 space-y-2">
        <div className="text-[9px] font-semibold tracking-[0.6px] text-[#777169]">ON THIS PAGE</div>
        <ul className="space-y-1.5 text-[10px]">
          <li
            className="text-black font-medium border-l-2 pl-2"
            style={{ borderColor: "#10b981" }}
          >
            Service flow
          </li>
          <li className="text-[#4e4e4e] pl-2 border-l-2 border-transparent">Outbox pattern</li>
          <li className="text-[#4e4e4e] pl-2 border-l-2 border-transparent">Saga · order placement</li>
          <li className="text-[#4e4e4e] pl-2 border-l-2 border-transparent">Failure modes</li>
        </ul>
      </div>
    </div>
  );
}

function MiniDiagram() {
  const W = 480;
  const H = 110;
  const downstream = [
    { x: 30, label: "orders" },
    { x: 110, label: "payments" },
    { x: 310, label: "offering" },
    { x: 390, label: "web-ui" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <title>Service-to-service flow</title>
      {/* upstream client */}
      <rect x="200" y="6" width="80" height="20" rx="4" fill="#ffffff" stroke="rgba(0,0,0,0.08)" />
      <text
        x="240"
        y="20"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="#4e4e4e"
        textAnchor="middle"
      >
        client
      </text>
      <line x1="240" y1="26" x2="240" y2="42" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />

      {/* center node */}
      <rect x="200" y="42" width="80" height="26" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
      <text
        x="240"
        y="59"
        fontSize="9"
        fontFamily="var(--font-mono)"
        fill="#047857"
        textAnchor="middle"
      >
        api-gateway
      </text>

      {/* downstream */}
      {downstream.map((d) => (
        <g key={d.label}>
          <line
            x1="240"
            y1="68"
            x2={d.x + 30}
            y2="84"
            stroke="#9ca3af"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <rect
            x={d.x}
            y="84"
            width="60"
            height="18"
            rx="4"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.08)"
          />
          <text
            x={d.x + 30}
            y="96"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fill="#4e4e4e"
            textAnchor="middle"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ChatbotMockup() {
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_300px]">
      {/* Wiki content (background) */}
      <div className="p-5 bg-white overflow-hidden">
        <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px] mb-1.5">
          orders-service / saga
        </div>
        <h4 className="text-[14px] font-display font-light text-black mb-2">
          Order placement saga
        </h4>
        <p className="text-[10px] text-[#4e4e4e] leading-snug mb-2">
          The order placement saga coordinates four services using compensating transactions. On
          payment failure, inventory and reservations roll back automatically.
        </p>
        <div className="rounded-comfortable bg-[#fafaf9] border border-black/5 p-3 font-mono text-[9px] text-[#4e4e4e] space-y-0.5">
          <div>
            <span style={{ color: "#1d4ed8" }}>def</span>{" "}
            <span style={{ color: "#047857" }}>place_order</span>(payload):
          </div>
          <div className="pl-3">reservation = inventory.reserve(...)</div>
          <div className="pl-3">payment = payments.charge(...)</div>
          <div className="pl-3 text-[#9ca3af]"># on fail → compensate</div>
          <div className="pl-3">orders.commit(reservation, payment)</div>
        </div>
      </div>

      {/* Chat side panel */}
      <div className="border-l border-black/5 bg-[#fafaf9] flex flex-col">
        <div className="px-3 h-9 flex items-center gap-2 border-b border-black/5 bg-white">
          <Sparkles size={12} strokeWidth={1.75} style={{ color: "#b45309" }} />
          <span className="text-[10px] font-semibold text-black">Ask AI</span>
          <span className="ml-auto text-[8px] text-[#9ca3af]">grounded · wiki + code</span>
        </div>

        <div className="flex-1 overflow-hidden p-3 space-y-2.5">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto max-w-[85%] rounded-comfortable px-2.5 py-1.5 text-[10px] leading-snug"
            style={{ backgroundColor: "#fffbeb", color: "#0a0a0a" }}
          >
            What happens if payments fails after inventory is reserved?
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="max-w-[90%] rounded-comfortable px-2.5 py-1.5 text-[10px] leading-snug bg-white border border-black/5"
          >
            <p className="text-black mb-1.5">
              Inventory rolls back via the compensating{" "}
              <span className="font-mono">release_reservation</span> action defined in the saga
              orchestrator.
            </p>
            <div className="flex flex-wrap gap-1">
              <CitationChip kind="wiki">orders / saga</CitationChip>
              <CitationChip kind="code">orders/saga.py:42</CitationChip>
              <CitationChip kind="code">inventory/repo.py:118</CitationChip>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="flex items-center gap-1 text-[#9ca3af]"
          >
            <Bot size={10} strokeWidth={1.5} />
            <span className="text-[8px]">AI is typing</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              ...
            </motion.span>
          </motion.div>
        </div>

        <div className="p-3 border-t border-black/5 bg-white space-y-1.5">
          <div className="flex flex-wrap gap-1">
            <FilterChip>Wiki</FilterChip>
            <FilterChip>Code</FilterChip>
            <FilterChip muted>+ Files</FilterChip>
          </div>
          <div className="rounded-comfortable border border-black/10 px-2.5 py-1.5 bg-white text-[9px] text-[#9ca3af]">
            Ask anything grounded in your codebase…
          </div>
        </div>
      </div>
    </div>
  );
}

function CitationChip({ kind, children }: { kind: "wiki" | "code"; children: React.ReactNode }) {
  const palette =
    kind === "wiki" ? { bg: "#ecfdf5", fg: "#047857" } : { bg: "#eff6ff", fg: "#1d4ed8" };
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono"
      style={{ backgroundColor: palette.bg, color: palette.fg }}
    >
      {kind === "wiki" ? (
        <BookOpen size={8} strokeWidth={2} />
      ) : (
        <FileCode size={8} strokeWidth={2} />
      )}
      {children}
    </span>
  );
}

function FilterChip({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium"
      style={{
        backgroundColor: muted ? "#fafaf9" : "#fffbeb",
        color: muted ? "#9ca3af" : "#b45309",
        border: `1px solid ${muted ? "rgba(0,0,0,0.06)" : "rgba(180,83,9,0.22)"}`,
      }}
    >
      {muted ? null : <Check size={7} strokeWidth={3} />}
      {children}
    </span>
  );
}

function GenerateMockup() {
  const bundles = [
    { name: "Structure & Architecture", Icon: Layers, status: "ready", tone: "blue" as const },
    { name: "Spec & Knowledge", Icon: BookOpen, status: "ready", tone: "green" as const },
    { name: "Health & Risk", Icon: LayoutDashboard, status: "generating", tone: "amber" as const },
    { name: "Agentify", Icon: Bot, status: "ready", tone: "blue" as const },
    { name: "Institutional Memory", Icon: FileText, status: "ready", tone: "neutral" as const },
    { name: "Research Docs", Icon: Sparkles, status: "ready", tone: "neutral" as const },
  ];

  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_240px]">
      <div className="p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">
              DOCSGEN · 6 BUNDLES
            </div>
            <h4 className="text-[14px] font-display font-light text-black">Generate exportable docs</h4>
          </div>
          <button
            type="button"
            className="text-[9px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
            style={{ backgroundColor: "#0a0a0a", color: "white" }}
          >
            Generate all <ChevronRight size={10} strokeWidth={2} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {bundles.map((b) => {
            const Icon = b.Icon;
            const palette = TONES[b.tone];
            const isGenerating = b.status === "generating";
            return (
              <div
                key={b.name}
                className="bg-white rounded-comfortable p-2.5 flex items-center gap-2.5"
                style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: palette.bg, color: palette.fg }}
                >
                  <Icon size={13} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-black font-medium leading-tight truncate">
                    {b.name}
                  </div>
                  {isGenerating ? (
                    <div className="mt-1.5 h-1 rounded-full bg-[#fafaf9] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: palette.fg }}
                        animate={{ width: ["18%", "62%", "88%"] }}
                        transition={{
                          duration: 2.4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-[8px] text-[#9ca3af] mt-0.5">PDF · MD · ready</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-l border-black/5 bg-white p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">LIBRARY</div>
          <ChevronRight size={11} className="text-[#9ca3af]" />
        </div>
        <div className="space-y-1.5">
          <LibraryItem title="API Catalog · v3" type="MD" date="2m ago" tone="green" />
          <LibraryItem title="Architecture Map" type="PDF" date="1h ago" tone="blue" />
          <LibraryItem title="Onboarding · Audio" type="MP3" date="3h ago" tone="amber" />
          <LibraryItem title="MCP Descriptors" type="JSON" date="1d ago" tone="neutral" />
        </div>
      </div>
    </div>
  );
}

const TONES = {
  blue: { fg: "#1d4ed8", bg: "#eff6ff" },
  green: { fg: "#047857", bg: "#ecfdf5" },
  amber: { fg: "#b45309", bg: "#fffbeb" },
  neutral: { fg: "#525252", bg: "#f5f5f4" },
} as const;

function LibraryItem({
  title,
  type,
  date,
  tone,
}: {
  title: string;
  type: string;
  date: string;
  tone: keyof typeof TONES;
}) {
  const palette = TONES[tone];
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-comfortable hover:bg-[#fafaf9] cursor-pointer">
      <div
        className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold flex-shrink-0"
        style={{ backgroundColor: palette.bg, color: palette.fg }}
      >
        {type}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-black font-medium leading-tight truncate">{title}</div>
        <div className="text-[8px] text-[#9ca3af]">{date}</div>
      </div>
    </div>
  );
}

function rgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
