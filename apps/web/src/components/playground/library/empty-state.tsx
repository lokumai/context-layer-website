"use client";

import { Bot, Library, Sparkles } from "lucide-react";
import Link from "next/link";

export function LibraryEmptyState({ workspaceId }: { workspaceId: string }) {
  return (
    <div
      data-testid="library-empty-state"
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      <div className="w-16 h-16 rounded-[18px] bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center mb-6">
        <Library className="w-8 h-8" />
      </div>

      <h1 className="text-section-heading text-black mb-3">No artifacts yet.</h1>
      <p className="text-body text-[#4e4e4e] max-w-[400px] mb-8">
        The Library saves everything your Generate tools produce. Start by creating a specification
        or architecture map.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/workspace/${workspaceId}/generate/docsgen`}
          className="flex items-center gap-2 px-6 py-3 rounded-pill bg-[#f5f2ef] text-[#4e4e4e] hover:text-black hover:bg-[#ebe8e4] transition-all text-sm font-medium"
        >
          <Sparkles className="w-4 h-4 text-[#777169]" />
          Go to DocsGen
        </Link>
        <Link
          href={`/workspace/${workspaceId}/generate/omniboard`}
          className="flex items-center gap-2 px-6 py-3 rounded-pill bg-[#f5f2ef] text-[#4e4e4e] hover:text-black hover:bg-[#ebe8e4] transition-all text-sm font-medium"
        >
          <Bot className="w-4 h-4 text-[#777169]" />
          Try OmniBoard
        </Link>
      </div>
    </div>
  );
}
