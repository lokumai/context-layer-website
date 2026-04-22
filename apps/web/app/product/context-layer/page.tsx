import Link from "next/link";

export default function ContextLayerProductPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-8 py-24 text-center">
      <h1 className="font-waldenburg text-[64px] tracking-[-0.96px] mb-6">Context Layer Base</h1>
      <p className="inter-airy text-[24px] text-neutral-600 mb-12 max-w-3xl mx-auto">
        The persistent, versioned, multi-repository knowledge base that bridges the gap between human developers, AI agents, and your codebase.
      </p>
      <Link href="/play/workspaces">
        <button className="bg-black text-white px-8 py-4 rounded-full font-medium text-[16px] shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] hover:opacity-80 transition-all">
          Try the Playground
        </button>
      </Link>
    </main>
  );
}
