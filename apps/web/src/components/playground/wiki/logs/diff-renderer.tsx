"use client";

import type { Job } from "@context-layer/mocks";

// Synthesises a deterministic, plausible-looking unified-diff body from the
// job's diffStats + repoIds. The mock data doesn't carry actual diff content
// (per Phase 3 mocks), so Phase 16 fakes it on the fly — same input always
// produces the same output, so visual order is stable across re-renders.
//
// Output is a single string of unified-diff lines (with `@@`, `+`, `-`,
// space prefixes). Capped to MAX_LINES so the rendered <pre> stays readable.

const MAX_LINES = 50;
const HUNKS_PER_REPO = 3;

const ADD_TEMPLATES = [
  "## Architecture overview",
  "Each request flows through the gateway → service mesh → write-side projection.",
  "Compensation runs via the saga orchestrator.",
  "- Trigger: `POST /api/v1/{resource}/publish`",
  "- Outbox table: `<schema>.outbox`",
  "JWT validation is local-cache only — no remote auth round-trip.",
  "```python",
  "result = await orchestrator.start(payload)",
  "```",
  "Failure mode: stuck-in-PUBLISHING is reaped by the saga watchdog (see TODO).",
];

const REMOVE_TEMPLATES = [
  "## Legacy section",
  "Originally orchestrated via Celery — replaced in Q1 2026.",
  "_(stale; superseded by saga-flows.md)_",
  "- Old endpoint: `POST /api/v0/legacy`",
];

const CONTEXT_TEMPLATES = [
  " ",
  "## Overview",
  "## Sequence",
  "The publication-saga is initiated synchronously, then continues async.",
  "## Edge cases",
];

interface SynthOpts {
  hashSeed?: number;
}

// Tiny seeded PRNG for stable picks. xmur3 + mulberry32.
function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h ^= h >>> 16;
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const repoFiles = (repoId: string): string[] => [
  `services/${repoId}/wiki/architecture.md`,
  `services/${repoId}/wiki/overview.md`,
  `services/${repoId}/llms.txt`,
];

/**
 * Build a unified-diff string from a Job. Deterministic per (job.id + diffStats).
 */
export function synthesiseDiff(job: Job, opts: SynthOpts = {}): string {
  const stats = job.diffStats ?? { added: 0, modified: 0, removed: 0 };
  const repos = job.repoIds.length > 0 ? job.repoIds : ["workspace"];
  const seed =
    opts.hashSeed != null
      ? String(opts.hashSeed)
      : `${job.id}:${stats.added}:${stats.modified}:${stats.removed}`;
  const rand = rng(seed);

  // Distribute the budget proportionally across repos × hunks.
  let addBudget = stats.added;
  let modBudget = stats.modified;
  let remBudget = stats.removed;

  const out: string[] = [];

  outer: for (const repo of repos) {
    const files = repoFiles(repo);
    for (let h = 0; h < HUNKS_PER_REPO; h++) {
      if (out.length >= MAX_LINES) break outer;
      const file = files[h % files.length];
      const hunkLine = 12 + Math.floor(rand() * 80);
      out.push(`@@ ${file} L${hunkLine} @@`);
      if (out.length >= MAX_LINES) break outer;

      // 1 context line, then a few add/remove lines drawn from templates.
      out.push(` ${CONTEXT_TEMPLATES[Math.floor(rand() * CONTEXT_TEMPLATES.length)]}`);
      if (out.length >= MAX_LINES) break outer;

      // Adds for this hunk (max ~3, capped by budget).
      const addsThisHunk = Math.min(addBudget, 1 + Math.floor(rand() * 3));
      for (let i = 0; i < addsThisHunk; i++) {
        if (out.length >= MAX_LINES) break outer;
        out.push(`+${ADD_TEMPLATES[Math.floor(rand() * ADD_TEMPLATES.length)]}`);
        addBudget--;
      }

      // Removes (max ~2).
      const remsThisHunk = Math.min(remBudget, 1 + Math.floor(rand() * 2));
      for (let i = 0; i < remsThisHunk; i++) {
        if (out.length >= MAX_LINES) break outer;
        out.push(`-${REMOVE_TEMPLATES[Math.floor(rand() * REMOVE_TEMPLATES.length)]}`);
        remBudget--;
      }

      // Modifies → render as a remove + add pair.
      const modsThisHunk = Math.min(modBudget, 1 + Math.floor(rand() * 2));
      for (let i = 0; i < modsThisHunk; i++) {
        if (out.length >= MAX_LINES - 1) break outer;
        out.push(`-${REMOVE_TEMPLATES[Math.floor(rand() * REMOVE_TEMPLATES.length)]}`);
        out.push(`+${ADD_TEMPLATES[Math.floor(rand() * ADD_TEMPLATES.length)]}`);
        modBudget--;
      }
    }
  }

  return out.join("\n");
}

/**
 * Renders a unified-diff string with semantic +/- colouring.
 */
export function DiffRenderer({ job }: { job: Job }) {
  const diff = synthesiseDiff(job);
  const lines = diff.split("\n");
  return (
    <pre
      className="rounded-card bg-[#0a0a0a] text-[#e5e5e5] px-4 py-3 overflow-x-auto font-mono text-caption mt-3 leading-relaxed"
      data-testid="log-diff"
    >
      {lines.map((line, i) => {
        const tone = line.startsWith("+")
          ? "text-[#34d399]"
          : line.startsWith("-")
            ? "text-[#f87171]"
            : line.startsWith("@@")
              ? "text-[#a78bfa]"
              : "text-[#9ca3af]";
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: deterministic content per job
          <div key={i} className={tone}>
            {line || " "}
          </div>
        );
      })}
    </pre>
  );
}
