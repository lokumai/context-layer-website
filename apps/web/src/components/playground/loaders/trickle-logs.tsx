"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// Per IMPROVE.md: "Generating states across the app show trickling, realistic
// fake agent logs rather than a simple spinner." Each topic has a deterministic
// rotation of fake log lines that scrolls into a small panel during the
// simulated job — same visual cadence regardless of what the underlying
// simulateJob is doing.

export type TrickleTopic = "wiki" | "intelligence" | "docsgen" | "omniboard";

const TEMPLATES: Record<TrickleTopic, string[]> = {
  wiki: [
    "Reading services/api-gateway/main.py",
    "Detected FastAPI router with 12 endpoints",
    "Cross-referencing offering-service public API",
    "Indexing 18 functions and 7 saga handlers",
    "Embedding identity-service auth flow",
    "Composing wiki tree for store-query-service",
    "Linking saga steps to Camunda BPMN ids",
    "Generating llms.txt for shared-chassis",
  ],
  intelligence: [
    "Scanning workspace for tech-debt smells",
    "Running CodeQL-equivalent security pass",
    "Computing cyclomatic complexity per repo",
    "Walking dependency graph (47 packages)",
    "Cross-checking 19 findings against severity rubric",
    "Aggregating coverage from 220 test files",
    "Building knowledge-graph (24 nodes, 46 edges)",
    "Finalising health score: 84",
  ],
  docsgen: [
    "Composing structure narrative",
    "Reading 14 files for API reference",
    "Drafting reverse-engineered SRS",
    "Validating cross-repo links",
    "Applying agentify style",
    "Embedding diagrams into bundle",
    "Indexing into Library",
  ],
  omniboard: [
    "Assembling onboarding outline",
    "Selecting representative saga flows",
    "Drafting speaker notes",
    "Rendering slide deck",
    "Encoding voice-over track",
    "Compositing video frames",
    "Preparing artifact for Library",
  ],
};

const MAX_LINES = 5;
const TICK_MS = 320;

// Pure picker — exposed for unit tests.
export function pickLine(topic: TrickleTopic, tick: number): string {
  const list = TEMPLATES[topic];
  return list[tick % list.length];
}

export function TrickleLogs({ topic, paused = false }: { topic: TrickleTopic; paused?: boolean }) {
  const [lines, setLines] = useState<Array<{ id: number; text: string }>>([]);

  useEffect(() => {
    if (paused) return;
    let tick = 0;
    let nextId = 0;
    const interval = setInterval(() => {
      const text = pickLine(topic, tick);
      tick++;
      const id = nextId++;
      setLines((prev) => {
        const next = [...prev, { id, text }];
        return next.length > MAX_LINES ? next.slice(-MAX_LINES) : next;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [topic, paused]);

  return (
    <div
      className="font-mono text-caption text-[#4e4e4e] bg-[#f9f9f9] rounded-card px-4 py-3 min-h-[8.5rem] overflow-hidden border border-[rgba(0,0,0,0.04)]"
      data-testid="trickle-logs"
    >
      <ul className="space-y-1">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="leading-relaxed"
            >
              <span className="text-[#9ca3af] mr-2">›</span>
              {l.text}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
