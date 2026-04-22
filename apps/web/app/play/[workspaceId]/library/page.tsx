"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { LibraryItemRow } from "@/components/library/library-item-row";
import type { LibrarySourceTool } from "@context-layer/mocks";

const TOOL_FILTERS: { id: LibrarySourceTool | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "docsgen", label: "DocsGen" },
  { id: "omniboard", label: "OmniBoard" },
  { id: "mcpgen", label: "MCPGen" },
];

export default function LibraryPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const [filter, setFilter] = useState<LibrarySourceTool | "all">("all");

  if (!ws) return null;

  const items = filter === "all" ? ws.libraryItems : ws.libraryItems.filter((i) => i.sourceTool === filter);

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-4">
        <h2 className="font-waldenburg text-[24px] mb-4">Library</h2>
        <h3 className="font-waldenburg-bold text-[12px] uppercase text-neutral-500 tracking-[0.7px]">Source</h3>
        <ul className="flex flex-col gap-1">
          {TOOL_FILTERS.map((f) => (
            <li key={f.id}>
              <button
                onClick={() => setFilter(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] ${filter === f.id ? "bg-white shadow-sm border border-neutral-200 font-medium" : "hover:bg-neutral-200 text-neutral-600"}`}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 overflow-y-auto p-8">
        {items.length === 0 ? (
          <div className="border border-dashed border-neutral-300 rounded-2xl p-16 text-center">
            <h2 className="font-waldenburg text-[32px] mb-4">Generate your first artifact</h2>
            <p className="text-neutral-500 mb-8">Artifacts from DocsGen and OmniBoard land here.</p>
            <Link href={`/play/${workspaceId}/generate/docsgen`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
              Open DocsGen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {items.map((i) => <LibraryItemRow key={i.id} item={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
