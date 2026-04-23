import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function ChatbotNeedsWikiState({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="max-w-2xl mx-auto py-24 text-center" data-testid="chatbot-needs-wiki">
      <div className="mx-auto w-[56px] h-[56px] rounded-[16px] bg-[#fdf6ec] text-[#b45309] flex items-center justify-center mb-6">
        <MessageSquare size={28} strokeWidth={1.5} />
      </div>
      <h1 className="text-section-heading text-black mb-3">
        Generate the Wiki first to unlock the Chatbot.
      </h1>
      <p className="text-body text-[#4e4e4e] mb-6">
        The chatbot grounds every answer in your workspace's Wiki. Once a Wiki exists, you can ask
        questions across all sources with clickable citations back to the source material.
      </p>
      <Link
        href={`/workspace/${workspaceId}/wiki/configure`}
        className="inline-flex items-center gap-2 bg-black text-white rounded-pill px-5 py-2 text-button hover:bg-[#1a1a1a] transition-colors"
      >
        Go to Wiki Configure
      </Link>
    </div>
  );
}
