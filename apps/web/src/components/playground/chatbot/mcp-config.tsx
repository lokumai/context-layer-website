"use client";

import { Check, Copy, Plug, X } from "lucide-react";
import { useState } from "react";

interface Props {
  workspaceId: string;
  onClose: () => void;
}

export function McpConfigModal({ workspaceId, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const snippet = `{
  "mcpServers": {
    "context-layer-${workspaceId}": {
      "command": "npx",
      "args": ["-y", "@context-layer/mcp"],
      "env": {
        "CONTEXT_LAYER_WORKSPACE": "${workspaceId}",
        "CONTEXT_LAYER_TOKEN": "<your-token>"
      }
    }
  }
}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop div */}
      <div className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[640px] bg-white rounded-card shadow-[var(--shadow-card)] z-[70]"
        role="dialog"
        aria-label="MCP configuration"
        data-testid="mcp-config-modal"
      >
        <header className="px-6 py-4 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#eef6ff] text-[#1d4ed8] flex items-center justify-center">
              <Plug size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-caption text-[#777169] uppercase tracking-[0.08em]">MCP Server</p>
              <h3 className="text-card-heading text-black">Connect this workspace</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f2ef] transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="px-6 py-5 space-y-4">
          <p className="text-body text-[#4e4e4e]">
            Paste this into{" "}
            <code className="font-mono text-body-medium text-black bg-[#f5f2ef] rounded px-1">
              claude_desktop_config.json
            </code>{" "}
            or your editor's MCP settings to expose this workspace's Wiki, Intelligence, and chatbot
            to external AI agents.
          </p>

          <div className="relative rounded-card bg-[#0f0f0f] text-[#e4e4e4] font-mono text-caption px-4 py-3 overflow-x-auto">
            <button
              type="button"
              onClick={copy}
              className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-pill px-2 py-1 text-caption transition-colors"
            >
              {copied ? (
                <Check size={12} strokeWidth={1.75} />
              ) : (
                <Copy size={12} strokeWidth={1.75} />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <pre className="whitespace-pre">{snippet}</pre>
          </div>

          <p className="text-caption text-[#777169]">
            Tools exposed: <code className="font-mono">get_wiki_content</code>,{" "}
            <code className="font-mono">get_code_intelligence</code>,{" "}
            <code className="font-mono">ask_context_layer</code>. Full MCP server ships in Phase 12.
          </p>
        </div>
      </div>
    </>
  );
}
