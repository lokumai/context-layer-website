import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";
import { FadeUp } from "@/components/motion/fade-up";
import {
  CapabilityScroller,
  type Capability,
} from "@/components/marketing/capability-sticky";
import {
  ChatbotGraphic,
  DocsGenGraphic,
  MCPGenGraphic,
  OmniBoardGraphic,
  WikiGraphic,
} from "@/components/marketing/cl-graphics";

const CAPABILITIES: Capability[] = [
  {
    id: "wiki",
    eyebrow: "01 · Context Wiki",
    title: "A living, three-layer knowledge base.",
    body:
      "Workspace narrative on top, per-repo wikis underneath, and llms.txt for agents. Always synced. Diff-viewable. Exportable as markdown or PDF.",
    graphic: <WikiGraphic />,
  },
  {
    id: "docsgen",
    eyebrow: "02 · DocsGen",
    title: "Frozen-in-time artifacts, six bundles.",
    body:
      "Structure, Specification, Health & Risk, Agentify, Institutional Memory, Research. Cards inside each bundle produce clean markdown or PDF, straight to the Library.",
    graphic: <DocsGenGraphic />,
  },
  {
    id: "chatbot",
    eyebrow: "03 · QnA Chatbot",
    title: "Conversational over everything — always grounded.",
    body:
      "A chat surface over sources, wikis, and intelligence. Every answer cites both wiki anchors and @file:line-range code locations — no ungrounded replies, ever.",
    graphic: <ChatbotGraphic />,
  },
  {
    id: "omniboard",
    eyebrow: "04 · OmniBoard",
    title: "Onboard teammates with multimodal packs.",
    body:
      "Plan an artifact through a specialized chat, then generate it as text, audio, or video. Long-running jobs run in the background; artifacts land in the Library.",
    graphic: <OmniBoardGraphic />,
  },
  {
    id: "mcpgen",
    eyebrow: "05 · MCPGen",
    title: "Expose your workspace to external agents.",
    body:
      "Produce an MCP descriptor for Claude Code, Cursor, and any MCP-aware client. Treat your codebase as a first-class tool in every agentic workflow.",
    tentative: true,
    graphic: <MCPGenGraphic />,
  },
];

export default function ContextLayerProductPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-24 pb-20 lg:pt-32">
          <div className="max-w-[860px] space-y-6">
            <FadeUp>
              <p className="text-button-upper text-[#777169]">The base product</p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-display-hero text-black md:text-[72px] md:leading-[1.04] md:tracking-[-1.2px]">
                Context Layer.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-body-large text-[#4e4e4e] max-w-[640px]">
                A workspace-aware, multi-repo knowledge engine. Living wikis, grounded chatbots, and
                frozen artifacts — all from the same indexed substrate.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <PlaygroundButton>Open in playground</PlaygroundButton>
                <a
                  href="#wiki"
                  className="text-button text-[#4e4e4e] hover:text-black transition-colors inline-flex items-center gap-1.5"
                >
                  Five capabilities <span aria-hidden>↓</span>
                </a>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.3}>
            <LayeredHeroGraphic />
          </FadeUp>
        </div>
      </section>

      <CapabilityScroller items={CAPABILITIES} />

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-10 pb-32">
        <FadeUp>
          <div className="bg-[rgba(245,242,239,0.8)] rounded-section shadow-[var(--shadow-warm)] px-10 py-16 text-center space-y-6">
            <h2 className="text-section-heading text-black">Stop reading stale docs.</h2>
            <p className="text-body text-[#4e4e4e] max-w-[560px] mx-auto">
              The playground ships with a 9-repo TMForum catalog. Everything you just read is real
              inside it.
            </p>
            <div className="pt-2">
              <PlaygroundButton variant="hero">Open the playground</PlaygroundButton>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function LayeredHeroGraphic() {
  const layers = [
    { label: "Workspace narrative", top: 0, z: 3, opacity: 1 },
    { label: "Per-repo wikis", top: 38, z: 2, opacity: 0.85 },
    { label: "llms.txt index", top: 76, z: 1, opacity: 0.7 },
  ];
  return (
    <div className="relative mt-16 h-[220px]">
      {layers.map((l, i) => (
        <div
          key={l.label}
          className="absolute left-1/2 -translate-x-1/2 w-[680px] max-w-full bg-white rounded-large shadow-[var(--shadow-outline-ring)] backdrop-blur"
          style={{
            top: `${l.top}px`,
            zIndex: l.z,
            opacity: l.opacity,
            transform: `translateX(-50%) rotate(${(i - 1) * 1.2}deg)`,
          }}
        >
          <div className="px-6 py-5">
            <p className="text-button-upper text-[#777169]">Layer {i + 1}</p>
            <p className="text-card-heading text-black mt-1">{l.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
