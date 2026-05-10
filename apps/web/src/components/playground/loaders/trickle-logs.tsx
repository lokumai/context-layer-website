"use client";

import { useEffect, useRef, useState } from "react";

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

const MAX_LINES = 10;
const TICK_MS = 320;

// Pure picker — exposed for unit tests.
export function pickLine(topic: TrickleTopic, tick: number): string {
  const list = TEMPLATES[topic];
  return list[tick % list.length];
}

export function TrickleLogs({ topic, paused = false }: { topic: TrickleTopic; paused?: boolean }) {
  const [lines, setLines] = useState<Array<{ id: number; text: string }>>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={scrollRef}
      className="font-mono text-caption text-[#4e4e4e] bg-[#f9f9f9] rounded-card px-4 py-3 h-[8.5rem] overflow-y-auto border border-[rgba(0,0,0,0.04)] scroll-smooth"
      data-testid="trickle-logs"
    >
      <ul className="space-y-1">
        {lines.map((l) => (
          <li key={l.id} className="leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-200">
            <span className="text-[#9ca3af] mr-2">›</span>
            {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
