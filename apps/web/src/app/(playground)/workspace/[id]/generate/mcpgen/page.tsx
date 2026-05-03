import { Plug } from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";

export default async function McpGenPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="max-w-2xl mx-auto py-24 text-center" data-testid="mcpgen-page">
      <div className="mx-auto w-[56px] h-[56px] rounded-[16px] bg-[#eef6ff] text-[#1d4ed8] flex items-center justify-center mb-6">
        <Plug size={28} strokeWidth={1.5} />
      </div>
      <div className="flex justify-center mb-3">
        <StatusPill tone="neutral">Tentative · UI_UX §7.3</StatusPill>
      </div>
      <h1 className="text-section-heading text-black mb-4">MCPGen</h1>
      <p className="text-body text-[#4e4e4e] mb-8">
        Auto-generate Model Context Protocol server descriptors from internal APIs, SDKs, and CLI
        tools so AI agents can instantly use your company's tooling. This module is still being
        shaped — for now, the MCP server that exposes this workspace's Wiki + Intelligence lives in
        Phase 12.
      </p>
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-pill bg-[#f5f5f5] text-[#9ca3af] px-5 py-2 text-button cursor-not-allowed"
      >
        Generate an MCP descriptor
      </button>
      <div className="mt-10">
        <Link
          href={`/workspace/${id}/generate/docsgen`}
          className="text-body-standard text-[#1d4ed8] hover:underline"
        >
          Back to DocsGen
        </Link>
      </div>
    </div>
  );
}
