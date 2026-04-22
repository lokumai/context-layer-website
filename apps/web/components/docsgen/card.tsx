"use client";

import { useState } from "react";
import type { DocsGenCard } from "@context-layer/mocks";
import { usePlaygroundStore } from "@/store/playground-store";

export function DocsGenCardView({ card, workspaceId }: { card: DocsGenCard; workspaceId: string }) {
  const runCard = usePlaygroundStore((s) => s.runDocsGenCard);
  const [running, setRunning] = useState(false);

  async function handleClick() {
    if (card.state === "done" || running) return;
    setRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    runCard(workspaceId, card.id);
    setRunning(false);
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-waldenburg text-[22px]">{card.title}</h3>
        {card.state === "done" && (
          <span className="px-3 py-1 text-[11px] font-semibold rounded-full uppercase bg-green-50 text-green-700">Done</span>
        )}
      </div>
      <p className="text-[14px] text-neutral-500 mb-8 flex-1">{card.description}</p>
      <button
        onClick={handleClick}
        disabled={running || card.state === "done"}
        className="w-full bg-black text-white py-3 rounded-[30px] font-waldenburg-bold uppercase tracking-[0.7px] text-[14px] disabled:opacity-40"
      >
        {running ? "Generating…" : card.state === "done" ? "Regenerate" : "Generate"}
      </button>
    </div>
  );
}
