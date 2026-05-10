"use client";

import type { Source } from "@context-layer/mocks";
import { ChevronDown, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CONTEXT_SPRING } from "@/lib/motion/spring";
import { simulateJob } from "@/lib/simulate-latency";
import { useStore } from "@/stores";
import { BUCKETS, type Bucket, CONNECTORS_BY_BUCKET, type Connector } from "./connector-catalog";
import { IconMark, sourceIconForCategory } from "../icons/icon-mark";

const STEPS = [
  "Contacting provider",
  "Authorizing",
  "Cloning repository",
  "Analyzing AST",
  "Building index",
  "Committing to wiki",
] as const;

export function AddSourceChooser() {
  const isOpen = useStore((s) => s.addSourceChooserOpen);
  const setOpen = useStore((s) => s.setAddSourceChooserOpen);
  const addSource = useStore((s) => s.addSource);
  const markIndexed = useStore((s) => s.markIndexed);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState("");
  const [expanded, setExpanded] = useState<Record<Bucket, boolean>>({
    code: false,
    docs: false,
    discussion: false,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !activeId) setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeId, setOpen]);

  if (!isOpen) return null;

  const busy = activeId !== null;

  async function handleConnect(connector: Connector) {
    if (busy) return;

    // Two-phase pipeline (Phase 14):
    //   1. addSource immediately with status="indexing", knowledgeSync="outdated"
    //   2. simulateJob runs the 6 steps
    //   3. markIndexed flips status; knowledgeSync stays "outdated"
    const id = globalThis.crypto.randomUUID();
    setActiveId(connector.name);
    setCurrentStep(STEPS[0]);

    const slug = connector.name.toLowerCase().replace(/\s+/g, "-");
    const source: Source = {
      id,
      name: `${connector.name} new source`,
      kind: connector.kind,
      category: connector.category,
      url: `https://${slug}.example/new`,
      path: "new",
      status: "indexing",
      autoSync: connector.category !== "upload" && connector.category !== "url",
      lastIndexed: new Date().toISOString(),
      lineCount: 0,
      tokenCount: 0,
      primaryLanguage: "Unknown",
      description: "",
      knowledgeSync: "outdated",
    };
    addSource(source);

    try {
      const job = simulateJob([...STEPS], () => undefined, {
        totalMs: 4500,
        minStepMs: 400,
      });
      for await (const event of job) {
        setCurrentStep(event.step);
      }
      markIndexed(id);
    } finally {
      setActiveId(null);
      setCurrentStep("");
      setOpen(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-[8vh] bg-black/30 backdrop-blur-sm overflow-y-auto"
      data-testid="add-source-chooser"
    >
      <div className="bg-white rounded-section p-7 max-w-xl w-full shadow-[var(--shadow-card)] relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-card-heading">Add Source</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            disabled={busy}
            className="p-1 hover:bg-black/5 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-body text-[#777169] mb-6">
          Pick where to import from. The most common providers per category are shown first; expand
          for the rest.
        </p>

        <div className="space-y-6">
          {BUCKETS.map((bucket) => {
            const list = CONNECTORS_BY_BUCKET[bucket.id];
            const primary = list.filter((c) => c.primary);
            const more = list.filter((c) => !c.primary);
            const isExpanded = expanded[bucket.id];
            return (
              <section key={bucket.id} className="space-y-3" data-testid={`bucket-${bucket.id}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${bucket.accent}`}
                  >
                    <bucket.icon size={14} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-body-medium text-black leading-tight">{bucket.title}</h3>
                    <p className="text-caption text-[#777169] leading-tight">{bucket.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {primary.map((c) => (
                    <ConnectorStrip
                      key={c.name}
                      connector={c}
                      onConnect={handleConnect}
                      busyConnector={activeId}
                      currentStep={currentStep}
                    />
                  ))}

                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        key="more"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={CONTEXT_SPRING}
                        className="space-y-2 overflow-hidden"
                      >
                        {more.map((c) => (
                          <ConnectorStrip
                            key={c.name}
                            connector={c}
                            onConnect={handleConnect}
                            busyConnector={activeId}
                            currentStep={currentStep}
                          />
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {more.length > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [bucket.id]: !prev[bucket.id] }))
                      }
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 text-caption text-[#4e4e4e] hover:text-black transition-colors px-2 py-1 disabled:opacity-40"
                      data-testid={`bucket-${bucket.id}-more`}
                      aria-expanded={isExpanded}
                    >
                      <ChevronDown
                        size={12}
                        strokeWidth={1.75}
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                      {isExpanded ? "Hide options" : `More options (${more.length})`}
                    </button>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnectorStrip({
  connector,
  onConnect,
  busyConnector,
  currentStep,
}: {
  connector: Connector;
  onConnect: (c: Connector) => void;
  busyConnector: string | null;
  currentStep: string;
}) {
  const isThisBusy = busyConnector === connector.name;
  const otherBusy = busyConnector !== null && !isThisBusy;

  return (
    <button
      type="button"
      onClick={() => onConnect(connector)}
      disabled={busyConnector !== null}
      className={`w-full flex items-center gap-3 bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] transition-all text-left group ${
        otherBusy ? "opacity-40 cursor-not-allowed" : "hover:shadow-[var(--shadow-outline-ring)]"
      }`}
      data-testid={`connector-${connector.category}-${connector.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${connector.accent}`}
      >
        <IconMark icon={sourceIconForCategory(connector.category)} size={18} />
      </div>
      <span className="text-body-medium text-black flex-1 truncate">{connector.name}</span>
      {isThisBusy ? (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] px-3 py-1.5 bg-[#1d4ed8] text-white rounded-pill min-w-[140px] justify-center"
          data-testid="connector-spinner"
        >
          <Loader2 size={12} strokeWidth={2} className="animate-spin" />
          <span className="truncate">{currentStep}</span>
        </span>
      ) : (
        <span className="text-[11px] uppercase tracking-[0.08em] px-3 py-1.5 bg-black text-white rounded-pill group-hover:bg-[#1a1a1a] transition-colors">
          {connector.label}
        </span>
      )}
    </button>
  );
}
