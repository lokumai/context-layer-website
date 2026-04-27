"use client";

import type { Source } from "@context-layer/mocks";
import { FileText, Hash, MessagesSquare } from "lucide-react";

// Per-kind mock preview content. Phase 14 replaces the empty
// "Phase 7+ placeholder" with realistic-looking previews so the user can
// demo the slide-over end-to-end. All content is deterministic from
// source.id / name — no new mock files.

export function SourcePreviewBody({ source }: { source: Source }) {
  if (source.kind === "code") return <CodePreview source={source} />;
  if (source.kind === "discussion") return <DiscussionPreview source={source} />;
  return <FilePreview source={source} />;
}

// ──────────────── Code ────────────────

function CodePreview({ source }: { source: Source }) {
  const tree = buildFileTree(source);
  const code = buildCodeSnippet(source);

  return (
    <div className="space-y-5">
      <FactGrid source={source} />

      <section
        className="bg-white rounded-card shadow-[var(--shadow-inset-border)] overflow-hidden"
        data-testid="preview-code"
      >
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">File tree</p>
          <span className="text-caption text-[#9ca3af]">{tree.length} files</span>
        </header>
        <ul className="divide-y divide-[rgba(0,0,0,0.04)]">
          {tree.map((entry) => (
            <li
              key={entry.path}
              className="flex items-center gap-2 px-4 py-2 text-caption text-[#4e4e4e]"
            >
              <FileText size={12} strokeWidth={1.5} className="text-[#9ca3af]" />
              <span className="font-mono">{entry.path}</span>
              <span className="ml-auto text-[#9ca3af]">{entry.lines}L</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card overflow-hidden shadow-[var(--shadow-card)]">
        <header className="px-4 py-2 bg-[#0f0f0f] text-[#bdbdbd] flex items-center justify-between">
          <span className="text-caption font-mono">{tree[0]?.path ?? "preview.txt"}</span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-[#9ca3af]">
            {source.primaryLanguage}
          </span>
        </header>
        <pre className="bg-[#1a1a1a] text-[#e4e4e4] text-caption font-mono px-4 py-4 overflow-x-auto leading-relaxed">
          {code.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: deterministic line render per source
            <div key={i} className="flex">
              <span className="select-none text-[#525252] w-8 shrink-0">{i + 1}</span>
              <span>{line}</span>
            </div>
          ))}
        </pre>
      </section>
    </div>
  );
}

function buildFileTree(source: Source): Array<{ path: string; lines: number }> {
  const base = source.path || "src";
  return [
    { path: `${base}/main.${langExt(source.primaryLanguage)}`, lines: 240 },
    { path: `${base}/handlers.${langExt(source.primaryLanguage)}`, lines: 318 },
    { path: `${base}/models.${langExt(source.primaryLanguage)}`, lines: 142 },
    { path: `${base}/tests/test_main.${langExt(source.primaryLanguage)}`, lines: 96 },
  ];
}

function buildCodeSnippet(source: Source): string[] {
  const isPython = source.primaryLanguage.toLowerCase().includes("python");
  const isTs = source.primaryLanguage.toLowerCase().match(/typescript|javascript/);
  if (isPython) {
    return [
      `# ${source.name}`,
      `from common.security import verify_jwt`,
      `from fastapi import APIRouter, Depends, HTTPException`,
      ``,
      `router = APIRouter(prefix="/api/v1")`,
      ``,
      `@router.get("/healthz")`,
      `def healthz():`,
      `    return {"ok": True}`,
      ``,
      `@router.get("/items/{id}", dependencies=[Depends(verify_jwt)])`,
      `def get_item(id: str):`,
      `    item = repository.find(id)`,
      `    if not item:`,
      `        raise HTTPException(404, "not found")`,
      `    return item`,
    ];
  }
  if (isTs) {
    return [
      `// ${source.name}`,
      `import express from "express";`,
      `import { verifyJwt } from "@shared/security";`,
      ``,
      `export const router = express.Router();`,
      ``,
      `router.get("/healthz", (_req, res) => res.json({ ok: true }));`,
      ``,
      `router.get("/items/:id", verifyJwt, async (req, res) => {`,
      `  const item = await repo.find(req.params.id);`,
      `  if (!item) return res.status(404).json({ error: "not found" });`,
      `  res.json(item);`,
      `});`,
    ];
  }
  return [
    `// ${source.name}`,
    `// ${source.primaryLanguage} preview — content extracted at index time.`,
    `// First 200 lines available in the Wiki view.`,
    ``,
    `entry main {`,
    `  log "starting ${source.name}"`,
    `  call init`,
    `  serve on 8080`,
    `}`,
  ];
}

function langExt(lang: string): string {
  const l = lang.toLowerCase();
  if (l.includes("python")) return "py";
  if (l.includes("typescript")) return "ts";
  if (l.includes("javascript")) return "js";
  if (l.includes("go")) return "go";
  if (l.includes("rust")) return "rs";
  if (l.includes("java")) return "java";
  return "txt";
}

// ──────────────── File / Docs ────────────────

function FilePreview({ source }: { source: Source }) {
  const sections = [
    "Overview",
    "Architecture",
    "Public API",
    "Operational guide",
    "Edge cases",
    "Future work",
  ];
  return (
    <div className="space-y-5">
      <FactGrid source={source} />
      <section
        className="bg-white rounded-card shadow-[var(--shadow-inset-border)] p-5"
        data-testid="preview-file"
      >
        <p className="text-caption text-[#777169] uppercase tracking-[0.08em] mb-3">Outline</p>
        <ol className="space-y-2 mb-5">
          {sections.map((s, i) => (
            <li key={s} className="flex items-baseline gap-2 text-body text-[#4e4e4e]">
              <span className="text-caption text-[#9ca3af] font-mono w-6 shrink-0">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <hr className="border-[rgba(0,0,0,0.05)] my-4" />
        <div className="space-y-3 text-body text-[#4e4e4e] leading-relaxed">
          <p>
            <strong className="text-black">{source.name}</strong> documents the{" "}
            {source.primaryLanguage}- backed module rooted at{" "}
            <code className="font-mono text-caption">{source.path}</code>. It describes the public
            API surface, the lifecycle hooks, and the cross-service contracts.
          </p>
          <p>
            The "Architecture" section walks through the message flow and points at the relevant
            saga in the workspace narrative. The "Operational guide" section covers deploy,
            rollback, and the on-call runbook for the most common alerts.
          </p>
        </div>
      </section>
    </div>
  );
}

// ──────────────── Discussion ────────────────

function DiscussionPreview({ source }: { source: Source }) {
  const messages = [
    {
      who: "Sarah K.",
      tone: "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)]",
      body: `We're seeing intermittent 502s on ${source.name}. Anyone touched the ingress lately?`,
    },
    {
      who: "Hugo M.",
      tone: "bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)]",
      body: "Yeah, I bumped the readiness probe threshold. Reverting now — should clear in ~2 min.",
    },
    {
      who: "Sarah K.",
      tone: "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)]",
      body: "Confirmed, error rate dropped to baseline. Thanks!",
    },
    {
      who: "Bot",
      tone: "bg-[var(--color-accent-neutral-bg)] text-[var(--color-accent-neutral-fg)]",
      body: "Indexed 4 messages from this thread into the workspace knowledge base.",
    },
  ];
  return (
    <div className="space-y-5">
      <FactGrid source={source} />
      <section
        className="bg-white rounded-card shadow-[var(--shadow-inset-border)] p-5 space-y-4"
        data-testid="preview-discussion"
      >
        <header className="flex items-center gap-2">
          <Hash size={14} strokeWidth={1.5} className="text-[#9ca3af]" />
          <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">Recent thread</p>
        </header>
        <ul className="space-y-3">
          {messages.map((m, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: deterministic per source
              key={i}
              className="flex gap-3 items-start"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold shrink-0 ${m.tone}`}
                aria-hidden
              >
                {m.who === "Bot" ? <MessagesSquare size={12} strokeWidth={1.75} /> : m.who[0]}
              </span>
              <div className="min-w-0">
                <p className="text-body-medium text-black">{m.who}</p>
                <p className="text-body text-[#4e4e4e]">{m.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ──────────────── Shared ────────────────

function FactGrid({ source }: { source: Source }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Fact label="Line count" value={source.lineCount.toLocaleString()} />
      <Fact label="Token count" value={source.tokenCount.toLocaleString()} />
      <Fact label="Primary language" value={source.primaryLanguage} />
      <Fact label="Category" value={source.category} />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-card p-3 shadow-[var(--shadow-inset-border)]">
      <p className="text-[10px] uppercase tracking-[0.08em] text-[#777169]">{label}</p>
      <p className="text-body-medium text-black mt-0.5">{value}</p>
    </div>
  );
}
