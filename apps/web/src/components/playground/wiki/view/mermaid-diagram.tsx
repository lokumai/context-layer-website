"use client";

import { useEffect, useId, useState } from "react";

// Client-only mermaid renderer. Lazily imports the mermaid library on mount
// so the wiki-view chunk stays slim. Falls back to a styled <pre> if the
// diagram is malformed (mermaid throws on invalid graphs).

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

interface Props {
  code: string;
}

export function MermaidDiagram({ code }: Props) {
  const id = `mermaid-${useId().replace(/[:]/g, "-")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setSvg(null);
    loadMermaid()
      .then((mermaid) => mermaid.render(id, code.trim()))
      .then((res) => {
        if (!cancelled) setSvg(res.svg);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [id, code]);

  if (error) {
    return (
      <pre
        className="rounded-card bg-[#fef2f2] text-[#b91c1c] px-4 py-3 my-4 font-mono text-caption whitespace-pre-wrap"
        data-testid="mermaid-diagram"
        data-state="error"
      >
        {`Diagram failed to render — showing source.\n\n${code.trim()}`}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className="rounded-card bg-[#f9f9f9] text-[#777169] px-4 py-6 my-4 text-center text-caption"
        data-testid="mermaid-diagram"
        data-state="loading"
      >
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="rounded-card bg-white border border-[rgba(0,0,0,0.05)] px-4 py-4 my-4 overflow-x-auto"
      data-testid="mermaid-diagram"
      data-state="ready"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid.render returns SVG string we just built.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
