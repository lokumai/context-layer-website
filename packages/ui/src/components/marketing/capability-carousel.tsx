"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Boxes,
  ChevronRight,
  FileCode,
  FileText,
  HeartPulse,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { type BrandKey, BRAND_ICONS } from "./brand-icons";

// Hybrid Carousel-Switcher
// Pill segmented control on top → animated descriptor row → 3D coverflow stage.
// Each panel is a stylized mockup of the corresponding playground page.

type TabId = "sources" | "knowledge" | "chatbot" | "generate";

interface Tab {
  id: TabId;
  step: string;
  label: string;
  description: string;
  fg: string;
  bg: string;
  Icon: typeof Inbox;
}

const TABS: Tab[] = [
  {
    id: "sources",
    step: "01",
    label: "Sources",
    description: "Connect every repo, doc, and discussion your team uses. Indexed once, kept in sync.",
    fg: "#1d4ed8",
    bg: "#eff6ff",
    Icon: Inbox,
  },
  {
    id: "knowledge",
    step: "02",
    label: "Knowledge",
    description:
      "The Wiki stays auto-synced with your codebase, and Code Intelligence turns that context into live dashboards for health and risk.",
    fg: "#047857",
    bg: "#ecfdf5",
    Icon: BookOpen,
  },
  {
    id: "chatbot",
    step: "03",
    label: "Chatbot",
    description:
      "Use the chatbot to ask your codebase directly, with responses grounded in the sources it was built from.",
    fg: "#b45309",
    bg: "#fffbeb",
    Icon: MessageSquare,
  },
  {
    id: "generate",
    step: "04",
    label: "Generate",
    description:
      "Generate exportable artifacts, reports, and documentation from the same persistent context layer.",
    fg: "#0a0a0a",
    bg: "#f5f5f4",
    Icon: Sparkles,
  },
];

export function CapabilityCarousel() {
  const [active, setActive] = useState<TabId>("sources");
  // Knowledge sub-view is hoisted up here so a second click on the Knowledge pill
  // (when Knowledge is already active) flips between Wiki and Intelligence.
  const [knowledgeView, setKnowledgeView] = useState<KnowledgeView>("wiki");
  const [knowledgeHintTick, setKnowledgeHintTick] = useState(0);
  const [showKnowledgeHint, setShowKnowledgeHint] = useState(false);
  const knowledgeHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdx = TABS.findIndex((t) => t.id === active);
  const activeTab = TABS[activeIdx];

  const onPillClick = useCallback(
    (id: TabId) => {
      // Same pill clicked again on Knowledge → flip the sub-view.
      if (active === id && id === "knowledge") {
        setKnowledgeView((v) => (v === "wiki" ? "intelligence" : "wiki"));
        setKnowledgeHintTick((v) => v + 1);
        setShowKnowledgeHint(true);
        return;
      }
      if (id === "knowledge") {
        setShowKnowledgeHint(true);
        setKnowledgeHintTick((v) => v + 1);
      } else {
        setShowKnowledgeHint(false);
      }
      setActive(id);
    },
    [active],
  );

  useEffect(() => {
    if (!showKnowledgeHint) {
      return undefined;
    }

    if (knowledgeHintTimer.current) {
      clearTimeout(knowledgeHintTimer.current);
    }

    knowledgeHintTimer.current = setTimeout(() => {
      setShowKnowledgeHint(false);
    }, 3000);

    return () => {
      if (knowledgeHintTimer.current) {
        clearTimeout(knowledgeHintTimer.current);
      }
    };
  }, [knowledgeHintTick, showKnowledgeHint]);

  const goRel = useCallback((delta: number) => {
    setActive((cur) => {
      const i = TABS.findIndex((t) => t.id === cur);
      const next = (i + delta + TABS.length) % TABS.length;
      return TABS[next].id;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRel(1);
      else if (e.key === "ArrowLeft") goRel(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goRel]);

  return (
    <div className="space-y-6">
      {/* Pill switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {TABS.map((t) => {
          const isActive = t.id === active;
          const Icon = t.Icon;
          const showHint = t.id === "knowledge" && showKnowledgeHint;
          return (
            <div key={t.id} className={`relative overflow-visible ${showHint ? "z-30" : "z-0"}`}>
              <motion.button
                type="button"
                onClick={() => onPillClick(t.id)}
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
                <span aria-hidden className="text-[10px] font-semibold tracking-[1.4px] opacity-65">
                  {t.step}
                </span>
                <Icon size={14} strokeWidth={1.75} />
                <span>{t.label}</span>
              </motion.button>

              {/* Knowledge toggle hint — appears briefly after clicking Knowledge */}
              <AnimatePresence>
                {showHint ? (
                  <motion.span
                    key="knowledge-hint"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 pointer-events-none z-30"
                    style={{
                      willChange: "transform, opacity",
                    }}
                  >
                    <span
                      className="relative inline-flex items-center rounded-[999px] bg-[#f5f5f4] px-3 py-1.5 text-[9px] font-semibold whitespace-nowrap text-[#6b7280] border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      aria-hidden
                    >
                      Click to Toggle
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-full -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-b border-r border-black/10 bg-[#f5f5f4]"
                      />
                    </span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Animated descriptor — changes per tab, sits between pills and stage */}
      <div className="relative h-[56px] sm:h-[44px] mt-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTab.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-center px-4"
          >
            <span className="text-body-large text-[#4e4e4e] max-w-[720px] leading-snug">
              {activeTab.description}
            </span>
          </motion.p>
        </AnimatePresence>
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
                isActive={t.id === active}
                onSelect={() => onPillClick(t.id)}
                knowledgeView={knowledgeView}
                setKnowledgeView={setKnowledgeView}
              />
            );
          })}
        </div>
      </div>
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
    pointerEvents: "auto" | "none";
  }
> = {
  active: { x: "0%", rotateY: 0, scale: 1, opacity: 1, zIndex: 4, pointerEvents: "auto" },
  left: {
    x: "-58%",
    rotateY: 26,
    scale: 0.74,
    opacity: 0.5,
    zIndex: 2,
    pointerEvents: "auto",
  },
  right: {
    x: "58%",
    rotateY: -26,
    scale: 0.74,
    opacity: 0.5,
    zIndex: 2,
    pointerEvents: "auto",
  },
  hidden: {
    x: "0%",
    rotateY: 0,
    scale: 0.55,
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
};

// Mask gradient that fades the inner edge of side panels so they no longer
// visually cover the active panel — only the outer portion peeks through.
const SIDE_MASK_LEFT =
  "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 92%)";
const SIDE_MASK_RIGHT =
  "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 92%)";

function CoverPanel({
  tab,
  position,
  isActive,
  onSelect,
  knowledgeView,
  setKnowledgeView,
}: {
  tab: Tab;
  position: PanelPosition;
  isActive: boolean;
  onSelect: () => void;
  knowledgeView: KnowledgeView;
  setKnowledgeView: (v: KnowledgeView) => void;
}) {
  const s = POSITION_STYLES[position];
  const mask =
    position === "left" ? SIDE_MASK_LEFT : position === "right" ? SIDE_MASK_RIGHT : undefined;

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
        filter: position === "active" ? "blur(0px)" : "blur(1.2px)",
      }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0.24, 1.0] }}
      className="absolute will-change-transform"
      style={{
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        transformStyle: "preserve-3d",
        width: "min(820px, 88vw)",
        aspectRatio: "16 / 10",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <div
        className="w-full h-full rounded-section bg-white overflow-hidden text-left"
        style={{
          boxShadow: position === "active"
            ? "0 28px 60px -22px rgba(0,0,0,0.22), 0 6px 18px -6px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)"
            : "0 12px 28px -10px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <BrowserChrome label={`playground / ${tab.id}`} accent={tab.fg} accentBg={tab.bg} />
        <div
          className="relative w-full"
          style={{ height: "calc(100% - 36px)", backgroundColor: "#fafaf9" }}
        >
          {tab.id === "sources" && <SourcesMockup live={isActive} />}
          {tab.id === "knowledge" && (
            <KnowledgeMockup
              live={isActive}
              view={knowledgeView}
              setView={setKnowledgeView}
            />
          )}
          {tab.id === "chatbot" && <ChatbotMockup live={isActive} />}
          {tab.id === "generate" && <GenerateMockup live={isActive} />}
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
// Reusable bits

function BrandIconChip({ brand, size = 28 }: { brand: BrandKey; size?: number }) {
  const b = BRAND_ICONS[brand];
  const inner = size * 0.55;
  return (
    <span
      className="rounded-standard inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: b.bg }}
    >
      <svg width={inner} height={inner} viewBox="0 0 24 24" role="img" aria-label={brand}>
        <title>{brand}</title>
        {b.paths
          ? b.paths.map((p) => <path key={p.fill + p.d.slice(0, 12)} d={p.d} fill={p.fill} />)
          : <path d={b.path} fill={b.color} />}
      </svg>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCES mockup

interface SourceRow {
  brand: BrandKey;
  name: string;
  path: string;
  status: "synced" | "syncing" | "outdated";
  time: string;
}

const SOURCE_ROWS: SourceRow[] = [
  { brand: "github", name: "api-gateway", path: "amirkiarafiei/api-gateway", status: "synced", time: "2m" },
  { brand: "github", name: "orders-svc", path: "amirkiarafiei/orders-svc", status: "synced", time: "2m" },
  { brand: "github", name: "payments-svc", path: "amirkiarafiei/payments-svc", status: "syncing", time: "now" },
  { brand: "gdrive", name: "Engineering Drive", path: "drive / shared / eng", status: "synced", time: "1h" },
  { brand: "notion", name: "Engineering Wiki", path: "notion.so / eng-wiki", status: "synced", time: "12m" },
  { brand: "jira", name: "PROD board", path: "jira / PROD · 24 issues", status: "outdated", time: "2d" },
  { brand: "pdf", name: "Architecture RFC", path: "RFCs / architecture.pdf", status: "synced", time: "3h" },
  { brand: "md", name: "Onboarding notes", path: "docs / onboarding.md", status: "synced", time: "20m" },
];

function SourcesMockup({ live }: { live: boolean }) {
  return (
    <div className="absolute inset-0 p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">
            SOURCES · 8 INDEXED
          </div>
          <h4 className="text-[14px] font-display font-light text-black">Connected workspace</h4>
        </div>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-[9px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
          style={{ backgroundColor: "#1d4ed8", color: "white" }}
        >
          + Add source
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SOURCE_ROWS.map((s, i) => (
          <motion.div
            key={s.path}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 * i, ease: "easeOut" }}
            className="bg-white rounded-comfortable p-2.5 flex flex-col gap-2 relative overflow-hidden"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-2">
              <BrandIconChip brand={s.brand} size={24} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-black font-semibold leading-tight truncate">
                  {s.name}
                </div>
                <div className="text-[8px] text-[#9ca3af] font-mono truncate mt-0.5">{s.path}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <SyncBadge status={s.status} live={live} />
              <span className="text-[8px] text-[#9ca3af]">{s.time} ago</span>
            </div>

            {/* Active sync progress on the syncing card */}
            {s.status === "syncing" ? (
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#fafaf9] overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: "#b45309" }}
                  animate={live ? { x: ["-30%", "120%"] } : { x: "-30%" }}
                  transition={
                    live
                      ? { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                      : { duration: 0 }
                  }
                  initial={{ width: "30%" }}
                />
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SyncBadge({ status, live }: { status: SourceRow["status"]; live: boolean }) {
  const map = {
    synced: { fg: "#047857", dot: "#10b981", label: "SYNCED" },
    syncing: { fg: "#b45309", dot: "#b45309", label: "SYNCING" },
    outdated: { fg: "#9ca3af", dot: "#9ca3af", label: "OUTDATED" },
  } as const;
  const p = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[8px] font-semibold tracking-[0.5px]"
      style={{ color: p.fg }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: p.dot }}
        animate={status === "syncing" && live ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
        transition={
          status === "syncing" && live
            ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : { duration: 0 }
        }
      />
      {p.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE mockup (Wiki / Intelligence sub-toggle)

type KnowledgeView = "wiki" | "intelligence";

function KnowledgeMockup({
  live,
  view,
  setView,
}: {
  live: boolean;
  view: KnowledgeView;
  setView: (v: KnowledgeView) => void;
}) {

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Sub-toggle row */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-black/5 bg-white">
        <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">
          KNOWLEDGE · SYNCED 2M AGO
        </div>
        <div className="inline-flex items-center bg-[#fafaf9] rounded-pill p-0.5 gap-0.5">
          {(["wiki", "intelligence"] as const).map((v) => {
            const isOn = view === v;
            return (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setView(v);
                }}
                className="relative px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.5px] rounded-pill"
                style={{
                  color: isOn ? "#047857" : "#777169",
                  backgroundColor: isOn ? "#ecfdf5" : "transparent",
                  boxShadow: isOn ? "inset 0 0 0 1px rgba(4,120,87,0.18)" : "none",
                }}
              >
                {v.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {view === "wiki" ? (
            <motion.div
              key="wiki"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <KnowledgeWikiView live={live} />
            </motion.div>
          ) : (
            <motion.div
              key="intel"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <KnowledgeIntelligenceView live={live} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function KnowledgeWikiView({ live }: { live: boolean }) {
  return (
    <div className="absolute inset-0 grid grid-cols-[170px_1fr_130px]">
      {/* Sidebar tree */}
      <div className="border-r border-black/5 bg-white p-3 space-y-1">
        <div className="text-[9px] font-semibold tracking-[0.6px] text-[#777169] mb-2">
          WORKSPACE
        </div>
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
          out to four downstream services. Critical paths (orders → payments) use the
          transactional outbox pattern.
        </p>
        <div className="rounded-comfortable border border-black/5 bg-white p-3 mb-3">
          <MiniDiagram live={live} />
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

function MiniDiagram({ live }: { live: boolean }) {
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

      {downstream.map((d, dIdx) => (
        <g key={d.label} data-step={dIdx}>
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
          {/* Animated flow dot */}
          {live ? (
            <motion.circle
              r="2"
              fill="#10b981"
              initial={{ cx: 240, cy: 68, opacity: 0 }}
              animate={{
                cx: [240, d.x + 30],
                cy: [68, 84],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + dIdx * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2.6,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function KnowledgeIntelligenceView({ live }: { live: boolean }) {
  return (
    <div className="absolute inset-0 p-4 overflow-hidden bg-[#fafaf9]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">
            INTELLIGENCE · OVERVIEW
          </div>
          <h4 className="text-[14px] font-display font-light text-black">Intelligence at a glance</h4>
        </div>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-[9px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1"
          style={{ backgroundColor: "#ecfdf5", color: "#047857" }}
        >
          <motion.span
            className="w-1 h-1 rounded-full bg-current"
            animate={live ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={
              live
                ? { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
          Refresh
        </button>
      </div>

      {/* 4 metric tiles */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <MetricTile
          icon={<HeartPulse size={11} strokeWidth={1.75} />}
          label="HEALTH"
          value="84"
          unit="/100"
          fg="#047857"
          bg="#ecfdf5"
          extra={<Sparkline color="#10b981" live={live} />}
        />
        <MetricTile
          icon={<ShieldCheck size={11} strokeWidth={1.75} />}
          label="SECURITY"
          value="19"
          unit="findings"
          fg="#525252"
          bg="#f5f5f4"
          extra={
            <div className="flex gap-1 mt-2">
              <SeverityPill tone="error">3 c</SeverityPill>
              <SeverityPill tone="warn">5 h</SeverityPill>
              <SeverityPill tone="info">11 m</SeverityPill>
            </div>
          }
        />
        <MetricTile
          icon={<Target size={11} strokeWidth={1.75} />}
          label="COVERAGE"
          value="81"
          unit="%"
          fg="#1d4ed8"
          bg="#eff6ff"
          extra={<CoverageBar value={81} live={live} />}
        />
        <MetricTile
          icon={<Boxes size={11} strokeWidth={1.75} />}
          label="DEPS"
          value="30"
          unit="nodes"
          fg="#b45309"
          bg="#fffbeb"
          extra={<DependencyDots live={live} />}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-[1fr_180px] gap-2">
        <div className="bg-white rounded-comfortable p-3 border border-black/5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] font-semibold text-[#777169] tracking-[0.5px]">
              FRAGILE AREAS
            </div>
            <AlertTriangle size={10} strokeWidth={1.75} className="text-[#b45309]" />
          </div>
          <div className="space-y-1.5">
            {[
              { repo: "payments-svc", area: "saga.py · circular import risk", sev: "high" },
              { repo: "orders-svc", area: "outbox.py · race condition", sev: "med" },
              { repo: "api-gateway", area: "auth.py · missing tests", sev: "med" },
            ].map((row, i) => (
              <motion.div
                key={row.area}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 * i }}
                className="flex items-center gap-2"
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      row.sev === "high" ? "#ef4444" : row.sev === "med" ? "#f59e0b" : "#3b82f6",
                  }}
                />
                <span className="text-[9px] font-mono text-black truncate flex-1">{row.area}</span>
                <span className="text-[8px] text-[#9ca3af]">{row.repo}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-comfortable p-3 border border-black/5">
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.5px] mb-1.5">
            KNOWLEDGE GRAPH
          </div>
          <KnowledgeGraphMini live={live} />
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  unit,
  fg,
  bg,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  fg: string;
  bg: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-comfortable p-2.5 border border-black/5 flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[8px] font-bold text-[#777169] tracking-[0.5px]">{label}</span>
        <span
          className="w-5 h-5 rounded-standard flex items-center justify-center"
          style={{ backgroundColor: bg, color: fg }}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-[22px] font-bold text-black leading-none tracking-tight">
          {value}
        </span>
        <span className="text-[9px] text-[#777169]">{unit}</span>
      </div>
      {extra}
    </div>
  );
}

function Sparkline({ color, live }: { color: string; live: boolean }) {
  // Loop through three preset polylines for an animated sparkline.
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 1400);
    return () => clearInterval(t);
  }, [live]);
  const series = [
    [40, 55, 32, 60, 48, 70, 64, 80, 72, 84],
    [50, 38, 60, 52, 70, 58, 78, 70, 84, 82],
    [42, 60, 48, 70, 56, 78, 66, 82, 76, 84],
  ][phase];
  const points = series.map((y, i) => `${(i / 9) * 100},${100 - y}`).join(" ");
  return (
    <div className="mt-2 h-5">
      <svg width="100%" height="20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <title>Health trend</title>
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={false}
          animate={{ points }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function SeverityPill({
  tone,
  children,
}: {
  tone: "error" | "warn" | "info";
  children: React.ReactNode;
}) {
  const map = {
    error: { fg: "#b91c1c", bg: "#fef2f2" },
    warn: { fg: "#b45309", bg: "#fffbeb" },
    info: { fg: "#1d4ed8", bg: "#eff6ff" },
  } as const;
  const p = map[tone];
  return (
    <span
      className="text-[7px] font-bold px-1 py-0.5 rounded"
      style={{ backgroundColor: p.bg, color: p.fg }}
    >
      {children}
    </span>
  );
}

function CoverageBar({ value, live }: { value: number; live: boolean }) {
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-[#fafaf9] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: "#3b82f6" }}
        initial={{ width: 0 }}
        animate={live ? { width: [`${value - 6}%`, `${value}%`, `${value - 3}%`] } : { width: `${value}%` }}
        transition={
          live
            ? { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : { duration: 0.6, ease: "easeOut" }
        }
      />
    </div>
  );
}

const DEPENDENCY_DOT_KEYS = Array.from({ length: 18 }, (_, i) => `dep-${i}`);

function DependencyDots({ live }: { live: boolean }) {
  return (
    <div className="mt-2 grid grid-cols-6 gap-0.5">
      {DEPENDENCY_DOT_KEYS.map((key, i) => (
        <motion.span
          key={key}
          className="w-1 h-1 rounded-full bg-[#fed7aa]"
          animate={
            live
              ? { backgroundColor: ["#fed7aa", "#b45309", "#fed7aa"], scale: [1, 1.4, 1] }
              : { backgroundColor: "#fed7aa" }
          }
          transition={
            live
              ? {
                  duration: 2.4,
                  delay: (i % 6) * 0.12,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}

function KnowledgeGraphMini({ live }: { live: boolean }) {
  // Tiny ambient knowledge-graph-ish constellation
  const nodes = [
    { x: 20, y: 30, r: 5, c: "#10b981" },
    { x: 60, y: 18, r: 4, c: "#3b82f6" },
    { x: 100, y: 38, r: 5, c: "#b45309" },
    { x: 140, y: 22, r: 3, c: "#10b981" },
    { x: 40, y: 60, r: 4, c: "#3b82f6" },
    { x: 80, y: 70, r: 5, c: "#10b981" },
    { x: 120, y: 62, r: 4, c: "#b45309" },
    { x: 150, y: 52, r: 3, c: "#3b82f6" },
  ];
  const edges = [
    [0, 1],
    [0, 4],
    [1, 2],
    [2, 3],
    [4, 5],
    [5, 6],
    [6, 7],
    [2, 6],
    [3, 7],
    [1, 5],
  ];
  return (
    <svg viewBox="0 0 170 90" className="w-full h-[60px]">
      <title>Knowledge graph</title>
      {edges.map(([a, b]) => (
        <line
          key={`edge-${a}-${b}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="0.6"
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={`node-${n.x}-${n.y}`}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.c}
          fillOpacity={0.7}
          animate={live ? { fillOpacity: [0.45, 0.95, 0.45] } : { fillOpacity: 0.7 }}
          transition={
            live
              ? {
                  duration: 2 + (i % 4) * 0.3,
                  delay: (i % 4) * 0.18,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHATBOT mockup

function ChatbotMockup({ live }: { live: boolean }) {
  // Layout mirrors the playground full-chatbot: main chat takes the
  // primary surface; a "now grounding" panel on the right shows the
  // wiki + code that backs the latest answer.
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_240px]">
      {/* MAIN — chat */}
      <div className="flex flex-col bg-white overflow-hidden">
        <div className="px-4 h-10 flex items-center justify-between border-b border-black/5">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-standard flex items-center justify-center"
              style={{ backgroundColor: "#fffbeb", color: "#b45309" }}
            >
              <MessageSquare size={11} strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-[10px] text-black font-semibold leading-tight">
                Order placement saga
              </div>
              <div className="text-[8px] text-[#777169]">
                Grounded in microservices-product-catalog
              </div>
            </div>
          </div>
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-[0.4px]"
            style={{ backgroundColor: "#fffbeb", color: "#b45309" }}
          >
            ASK AI
          </span>
        </div>

        <div className="flex-1 overflow-hidden p-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-end"
          >
            <div
              className="max-w-[78%] rounded-comfortable px-3 py-2 text-[10px] leading-snug"
              style={{ backgroundColor: "#fffbeb", color: "#0a0a0a" }}
            >
              What happens if payments fails after inventory is reserved?
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex justify-start"
          >
            <div className="max-w-[88%] rounded-comfortable px-3 py-2 text-[10px] leading-snug bg-[#fafaf9] border border-black/5">
              <div className="flex items-center gap-1 text-[#777169] mb-1">
                <Bot size={10} strokeWidth={1.5} />
                <span className="text-[8px] font-semibold tracking-[0.4px]">CONTEXT LAYER</span>
              </div>
              <p className="text-black mb-1.5">
                Inventory rolls back via the compensating{" "}
                <span className="font-mono bg-white px-1 py-0.5 rounded text-[#b91c1c]">
                  release_reservation
                </span>{" "}
                action defined in the saga orchestrator. The transactional outbox guarantees
                exactly-once compensation even if the payment service crashes mid-flight.
                {live ? (
                  <motion.span
                    className="inline-block w-[5px] h-[10px] ml-0.5 align-middle"
                    style={{ backgroundColor: "#0a0a0a" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ) : null}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <CitationChip kind="wiki">orders / saga</CitationChip>
                <CitationChip kind="code">orders/saga.py:42</CitationChip>
                <CitationChip kind="code">inventory/repo.py:118</CitationChip>
              </div>
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
              animate={live ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
              transition={
                live
                  ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                  : { duration: 0 }
              }
            >
              ...
            </motion.span>
          </motion.div>
        </div>

        <div className="p-3 border-t border-black/5 space-y-1.5 bg-white">
          <div className="flex flex-wrap gap-1">
            <FilterChip>Wiki</FilterChip>
            <FilterChip>Code</FilterChip>
            <FilterChip muted>+ Files</FilterChip>
          </div>
          <div className="rounded-pill border border-black/10 px-3 py-1.5 bg-white text-[9px] text-[#9ca3af] flex items-center justify-between">
            <span>Ask anything grounded in your codebase…</span>
            <span
              className="text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#0a0a0a", color: "white" }}
            >
              ↑
            </span>
          </div>
        </div>
      </div>

      {/* SIDE — grounding / citation preview */}
      <div className="border-l border-black/5 bg-[#fafaf9] flex flex-col overflow-hidden">
        <div className="px-3 h-10 flex items-center justify-between border-b border-black/5 bg-white">
          <div className="text-[9px] font-semibold text-[#777169] tracking-[0.6px]">GROUNDING</div>
          <motion.span
            className="text-[7px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{ backgroundColor: "#ecfdf5", color: "#047857" }}
            animate={live ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 }}
            transition={
              live
                ? { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                : { duration: 0 }
            }
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            LIVE
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="m-3 p-2.5 rounded-comfortable bg-white border border-black/5"
          style={{ boxShadow: "0 4px 10px -4px rgba(4,120,87,0.18)" }}
        >
          <div className="flex items-center gap-1 mb-1.5">
            <BookOpen size={9} strokeWidth={1.75} style={{ color: "#047857" }} />
            <span className="text-[8px] font-mono text-[#047857]">orders / saga</span>
          </div>
          <p className="text-[9px] leading-snug text-[#4e4e4e]">
            The saga uses{" "}
            <span className="font-mono bg-[#ecfdf5] text-[#047857] px-0.5 rounded">
              release_reservation
            </span>{" "}
            as the compensating action when payment fails after inventory is held.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.75 }}
          className="mx-3 mb-3 p-2.5 rounded-comfortable bg-white border border-black/5 font-mono text-[8px] leading-tight overflow-hidden"
        >
          <div className="flex items-center gap-1 mb-1.5">
            <FileCode size={9} strokeWidth={1.75} style={{ color: "#1d4ed8" }} />
            <span className="text-[8px] font-mono text-[#1d4ed8]">orders/saga.py:42</span>
          </div>
          <div className="space-y-0.5 text-[#4e4e4e]">
            <div className="flex gap-1.5">
              <span className="text-[#9ca3af] w-3 text-right">40</span>
              <span>
                <span style={{ color: "#1d4ed8" }}>def</span>{" "}
                <span style={{ color: "#047857" }}>place_order</span>(p):
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[#9ca3af] w-3 text-right">41</span>
              <span className="pl-1">res = inventory.reserve(p)</span>
            </div>
            <motion.div
              className="flex gap-1.5 rounded -mx-1 px-1"
              animate={live ? { backgroundColor: ["#fef9c3", "#ffffff", "#fef9c3"] } : {}}
              transition={
                live
                  ? { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                  : { duration: 0 }
              }
            >
              <span className="text-[#9ca3af] w-3 text-right">42</span>
              <span className="pl-1 text-black">pay = payments.charge(...)</span>
            </motion.div>
            <div className="flex gap-1.5">
              <span className="text-[#9ca3af] w-3 text-right">43</span>
              <span className="pl-1 text-[#9ca3af]"># compensate on fail</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-auto px-3 py-2 border-t border-black/5 bg-white text-[8px] text-[#9ca3af] flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
          Synced 2m ago
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

function FilterChip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium"
      style={{
        backgroundColor: muted ? "#fafaf9" : "#fffbeb",
        color: muted ? "#9ca3af" : "#b45309",
        border: `1px solid ${muted ? "rgba(0,0,0,0.06)" : "rgba(180,83,9,0.22)"}`,
      }}
    >
      {muted ? null : <span>✓</span>}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE mockup

const TONES = {
  blue: { fg: "#1d4ed8", bg: "#eff6ff" },
  green: { fg: "#047857", bg: "#ecfdf5" },
  amber: { fg: "#b45309", bg: "#fffbeb" },
  neutral: { fg: "#525252", bg: "#f5f5f4" },
} as const;

function GenerateMockup({ live }: { live: boolean }) {
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
            <h4 className="text-[14px] font-display font-light text-black">
              Generate exportable docs
            </h4>
          </div>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
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
                        animate={live ? { width: ["18%", "62%", "88%"] } : { width: "62%" }}
                        transition={
                          live
                            ? { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                            : { duration: 0 }
                        }
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
          <motion.span
            className="text-[7px] font-bold px-1 py-0.5 rounded text-white"
            style={{ backgroundColor: "#10b981" }}
            animate={live ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
            transition={
              live
                ? { duration: 3, times: [0, 0.2, 0.8, 1], repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }
                : { duration: 0 }
            }
          >
            + NEW
          </motion.span>
        </div>
        <div className="space-y-1.5">
          <LibraryItem title="API Catalog · v3" type="MD" date="2m" tone="green" />
          <LibraryItem title="Architecture Map" type="PDF" date="1h" tone="blue" />
          <LibraryItem title="Onboarding · Audio" type="MP3" date="3h" tone="amber" />
          <LibraryItem title="MCP Descriptors" type="JSON" date="1d" tone="neutral" />
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex items-center gap-2 p-1.5 rounded-comfortable hover:bg-[#fafaf9]">
      <div
        className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold flex-shrink-0"
        style={{ backgroundColor: palette.bg, color: palette.fg }}
      >
        {type}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-black font-medium leading-tight truncate">{title}</div>
        <div className="text-[8px] text-[#9ca3af]">{date} ago</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function rgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
