import { Sparkles } from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/marketing/status-pill";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="max-w-2xl mx-auto py-24 text-center">
      <div className="mx-auto w-[56px] h-[56px] rounded-[16px] bg-[#f5f5f5] text-[#525252] flex items-center justify-center mb-6">
        <Sparkles size={28} strokeWidth={1.5} />
      </div>
      <p className="text-button-upper text-[#777169] mb-2">Coming Soon</p>
      <h1 className="text-section-heading text-black mb-4">Generate</h1>
      <p className="text-body text-[#777169] mb-6">
        DocsGen bundles, OmniBoard onboarding packs, MCPGen descriptors. One-shot artifacts land in the Library.
      </p>
      <div className="flex justify-center mb-10">
        <StatusPill tone="neutral">Phase 7+</StatusPill>
      </div>
      <Link
        href={`/workspace/${id}/sources`}
        className="text-body-standard text-[#1d4ed8] hover:underline"
      >
        Back to Sources
      </Link>
    </div>
  );
}
