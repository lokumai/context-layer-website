export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Context Layer</h1>
      <p className="inter-airy text-[20px] text-neutral-600 mb-8 max-w-2xl text-center">
        Reverse-engineer the knowledge your codebase never had.
      </p>
      <button className="bg-warm-stone px-8 py-3 rounded-[30px] shadow-eleven-warm hover:opacity-90 transition-all text-primary font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
        Enter Playground
      </button>
    </main>
  );
}
