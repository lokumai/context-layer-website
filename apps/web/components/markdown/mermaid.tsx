"use client";

import { useEffect, useRef, useState } from "react";

let initialized = false;

async function ensureMermaid() {
  if (initialized) return;
  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    fontFamily: "Inter, ui-sans-serif, system-ui",
    themeVariables: {
      background: "#ffffff",
      primaryColor: "#f5f2ef",
      primaryTextColor: "#0a0a0a",
      primaryBorderColor: "#e8e3dd",
      lineColor: "#777169",
      secondaryColor: "#fafaf8",
      tertiaryColor: "#f7f5f2",
      fontSize: "13px",
      mainBkg: "#ffffff",
      actorBkg: "#fafaf8",
      actorBorder: "#e8e3dd",
      actorTextColor: "#0a0a0a",
      actorLineColor: "#c9a572",
      signalColor: "#0a0a0a",
      signalTextColor: "#4e4e4e",
      labelBoxBkgColor: "#f5f2ef",
      labelBoxBorderColor: "#e8e3dd",
      labelTextColor: "#0a0a0a",
      noteBkgColor: "#fdf6e7",
      noteTextColor: "#8a5a2b",
      noteBorderColor: "#c9a572",
    },
  });
  initialized = true;
}

let uid = 0;

export function Mermaid({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureMermaid();
        const mermaid = (await import("mermaid")).default;
        const id = `mermaid-${uid++}`;
        const { svg: rendered } = await mermaid.render(id, source.trim());
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (err) {
    return (
      <div className="my-6 rounded-[12px] border border-[var(--color-danger-fg)]/30 bg-[var(--color-danger-bg)] p-4 font-mono text-[12px] text-[var(--color-danger-fg)]">
        Diagram render error: {err}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center overflow-x-auto rounded-[16px] border border-[var(--color-border)] bg-white p-6 shadow-whisper"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
