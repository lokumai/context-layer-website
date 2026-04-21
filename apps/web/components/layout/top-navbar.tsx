'use client';
import Link from 'next/link';
import { usePlaygroundStore } from '@/store/playground-store';

export function TopNavbar() {
  const { activeWorkspaceId, syncStatus, hasWiki } = usePlaygroundStore();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-black/[0.05] sticky top-0 z-50 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-screen-2xl mx-auto">
        
        {/* Left Region */}
        <div className="flex items-center gap-8">
          <Link href="/play/workspaces" className="font-waldenburg text-2xl tracking-tighter text-black">
            Context Layer
          </Link>
          {activeWorkspaceId && (
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium px-3 py-1 bg-neutral-100 rounded-full">{activeWorkspaceId}</span>
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`} title={`Sync Status: ${syncStatus}`} />
            </div>
          )}
        </div>

        {/* Center Region */}
        {activeWorkspaceId && (
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/play/${activeWorkspaceId}/sources`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Sources</Link>
            {hasWiki ? (
              <>
                <Link href={`/play/${activeWorkspaceId}/knowledge/wiki`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Wiki</Link>
                <Link href={`/play/${activeWorkspaceId}/chatbot`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Chatbot</Link>
                <Link href={`/play/${activeWorkspaceId}/generate/docsgen`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Generate</Link>
                <Link href={`/play/${activeWorkspaceId}/library`} className="text-neutral-500 hover:text-black font-inter text-[15px] font-medium tracking-[0.15px]">Library</Link>
              </>
            ) : (
               <span className="text-neutral-300 text-[15px] cursor-not-allowed" title="Generate Wiki first">Knowledge Locked</span>
            )}
          </div>
        )}

        {/* Right Region */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-neutral-200" title="Profile" />
        </div>

      </div>
    </nav>
  );
}
