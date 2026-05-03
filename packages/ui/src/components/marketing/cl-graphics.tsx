// Stylized mock illustrations for Context Layer capabilities. Pure CSS + design
// tokens — intentionally abstract, not screenshots.

export function WikiGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-3">
      <p className="text-button-upper text-[#777169]">Three layers</p>
      <div className="space-y-3">
        {[
          { label: "Workspace narrative", w: "w-full", faded: false },
          { label: "Per-repo wikis (×9)", w: "w-[88%]", faded: false },
          { label: "llms.txt", w: "w-[72%]", faded: false },
        ].map((row) => (
          <div
            key={row.label}
            className={`relative ${row.w} bg-white rounded-large shadow-[var(--shadow-outline-ring)] p-4`}
          >
            <p className="text-micro text-[#777169] uppercase">{row.label}</p>
            <div className="mt-2 space-y-1.5">
              <span className="block h-1.5 w-full rounded-full bg-[#f5f5f5]" />
              <span className="block h-1.5 w-[70%] rounded-full bg-[#f5f5f5]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocsGenGraphic() {
  const bundles = ["Structure", "Specification", "Health & Risk", "Agentify", "Memory", "Research"];
  return (
    <div className="grid grid-cols-3 gap-3 max-w-[420px]">
      {bundles.map((b, i) => (
        <div
          key={b}
          className={`rounded-large p-4 ${
            i === 0 ? "bg-black text-white" : "bg-white shadow-[var(--shadow-outline-ring)]"
          }`}
        >
          <p className={`text-micro uppercase ${i === 0 ? "text-white" : "text-[#777169]"}`}>
            Bundle
          </p>
          <p
            className={`text-caption mt-1 leading-tight ${i === 0 ? "text-white" : "text-black"}`}
          >
            {b}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ChatbotGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-3">
      <div className="bg-[#f5f2ef] rounded-card p-4 space-y-2">
        <p className="text-caption text-black">
          How does the offering publication saga work across services?
        </p>
      </div>
      <div className="bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)] space-y-2">
        <p className="text-caption text-[#4e4e4e]">
          The Offering Service starts a Camunda process that locks prices, validates specs, and
          pre-creates the store entry
          <span className="inline-flex items-center px-1.5 py-[1px] mx-1 rounded-subtle bg-[#f5f2ef] text-[#777169] text-tiny font-mono">
            [1]
          </span>
          .
        </p>
      </div>
      <div className="flex gap-2">
        <span className="text-tiny px-2 py-[2px] rounded-pill bg-[#f5f5f5] text-[#4e4e4e]">
          ✓ Wiki
        </span>
        <span className="text-tiny px-2 py-[2px] rounded-pill bg-[#f5f5f5] text-[#4e4e4e]">
          ✓ Codebase
        </span>
        <span className="text-tiny px-2 py-[2px] rounded-pill bg-[#f5f5f5] text-[#4e4e4e]">
          ✓ Files
        </span>
      </div>
    </div>
  );
}

export function OmniBoardGraphic() {
  return (
    <div className="w-full max-w-[420px] space-y-3">
      {[
        { label: "Text", detail: "Onboarding doc · 14 pages" },
        { label: "Audio", detail: "Deep dive · 22 min" },
        { label: "Video", detail: "Narrated slides · 18 min" },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between bg-white rounded-card p-4 shadow-[var(--shadow-outline-ring)]"
        >
          <div>
            <p className="text-micro uppercase text-[#777169]">{row.label}</p>
            <p className="text-caption text-black mt-1">{row.detail}</p>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-pill bg-[#f5f2ef] text-black flex items-center justify-center"
            aria-label={`Play ${row.label}`}
          >
            ▶
          </button>
        </div>
      ))}
    </div>
  );
}

export function MCPGenGraphic() {
  return (
    <pre className="w-full max-w-[420px] text-code bg-[#0a0a0a] text-white rounded-card p-5 overflow-hidden">
      <span className="text-[#89d185]">{"// context-layer.mcp.json"}</span>
      {`
{
  "name": "context-layer",
  "version": "1.0",
  "tools": [
    { "name": "get_wiki_content" },
    { "name": "get_code_intelligence" },
    { "name": "ask_context_layer" }
  ]
}`}
    </pre>
  );
}
