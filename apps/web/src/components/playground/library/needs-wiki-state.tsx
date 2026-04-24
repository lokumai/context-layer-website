import { Library } from "lucide-react";
import Link from "next/link";

export function NeedsWikiLibraryState({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="max-w-2xl mx-auto py-24 text-center" data-testid="library-needs-wiki">
      <div className="mx-auto w-[56px] h-[56px] rounded-[16px] bg-[#f5f2ef] text-[#4e4e4e] flex items-center justify-center mb-6">
        <Library size={28} strokeWidth={1.5} />
      </div>
      <h1 className="text-section-heading text-black mb-3">
        Generate the Wiki first to unlock the Library.
      </h1>
      <p className="text-body text-[#4e4e4e] mb-6">
        The Library stores every artifact your Generate tools produce. Start by generating the Wiki,
        then create your first artifact from DocsGen or OmniBoard.
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
