"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WikiViewPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));
  const pages = ws?.wikiPages ?? [];
  const [activeId, setActiveId] = useState<string>(pages[0]?.id ?? "");

  const active = useMemo(() => pages.find((p) => p.id === activeId) ?? pages[0], [pages, activeId]);

  if (pages.length === 0) {
    return <p className="text-neutral-500">No Wiki yet. Configure and generate one.</p>;
  }

  return (
    <div className="flex gap-8 min-h-[calc(100vh-200px)]">
      <aside className="w-64 shrink-0 border-r border-neutral-200 pr-4">
        <ul className="flex flex-col gap-1">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setActiveId(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] ${p.id === active?.id ? "bg-neutral-100 font-medium" : "hover:bg-neutral-50 text-neutral-600"}`}
              >
                {p.pathSegments.join(" / ")}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <article className="flex-1 prose max-w-none">
        <pre className="whitespace-pre-wrap font-inter text-[15px] leading-[1.7]">{active?.markdown ?? ""}</pre>
      </article>
    </div>
  );
}
