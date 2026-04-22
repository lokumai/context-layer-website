"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function OmniBoardPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const ws = usePlaygroundStore((s) => s.workspaces.find((w) => w.workspace.id === workspaceId));

  if (!ws) return null;

  if (!ws.wikiSummary) {
    return (
      <div className="max-w-xl p-12 mx-auto text-center">
        <h2 className="font-waldenburg text-[32px] mb-4">OmniBoard is locked</h2>
        <p className="text-neutral-500 mb-8">Generate the Wiki first.</p>
        <Link href={`/play/${workspaceId}/knowledge/wiki/configure`} className="inline-block bg-black text-white px-8 py-3 rounded-full font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
          Go to Wiki Configure
        </Link>
      </div>
    );
  }

  const artifacts = ws.omniBoardArtifacts;

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col bg-white p-8">
        <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4 text-center">OmniBoard</h1>
        <p className="inter-airy text-[20px] text-neutral-600 text-center mb-12">Multimodal onboarding generation hub.</p>

        <div className="max-w-2xl mx-auto w-full bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
          <p className="text-[16px] mb-4">I can help you generate onboarding artifacts. What would you like to create today?</p>
          <div className="flex gap-3 flex-wrap">
            {["Slides", "Podcast", "Video", "Deep-dive"].map((opt) => (
              <button key={opt} className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-[14px] hover:bg-neutral-100">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-96 border-l border-black/[0.05] bg-neutral-50 p-6 overflow-y-auto">
        <h3 className="font-waldenburg text-[24px] mb-6">Generated Artifacts</h3>
        {artifacts.length === 0 ? (
          <p className="text-[14px] text-neutral-500">No artifacts yet. Plan one with the chatbot.</p>
        ) : (
          artifacts.map((a) => (
            <div key={a.id} className="bg-white p-5 rounded-2xl shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] mb-4">
              <h4 className="font-medium text-[15px] mb-2">{a.title}</h4>
              <p className="text-[13px] text-neutral-500 mb-4 capitalize">
                {a.variant}
                {a.durationSec ? ` • ${Math.round(a.durationSec / 60)} min` : ""}
              </p>
              <button className="w-full bg-warm-stone py-2 rounded-[30px] text-[13px] font-medium shadow-[rgba(78,50,23,0.04)_0px_6px_16px]">
                {a.modality === "audio" ? "Play Audio" : a.modality === "video" ? "Play Video" : "View"}
              </button>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
