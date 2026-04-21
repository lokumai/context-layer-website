'use client';
import Link from 'next/link';

export default function WorkspacesPage() {
  return (
    <div className="max-w-screen-xl mx-auto w-full px-8 py-16">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-12">Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Create New Card */}
        <button className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 flex flex-col items-center justify-center text-neutral-500 hover:border-black hover:text-black transition-all min-h-[200px]">
          <span className="text-[32px] mb-2">+</span>
          <span className="font-inter font-medium">Create Workspace</span>
        </button>

        {/* Demo Workspace Card */}
        <Link href="/play/microservices-product-catalog/sources" className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all min-h-[200px] flex flex-col">
          <h2 className="font-waldenburg text-[24px] mb-2">microservices-product-catalog</h2>
          <p className="text-neutral-500 text-[14px] mt-auto">9 Sources • Synced 2h ago</p>
        </Link>
      </div>
    </div>
  );
}
