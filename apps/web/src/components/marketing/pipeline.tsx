"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { FadeUp } from "@/components/motion/fade-up";

const STAGES = [
  {
    eyebrow: "01 · Input",
    title: "Sources",
    body:
      "Connect GitHub, Drive, Notion, Slack. Every file becomes searchable, every commit becomes context.",
    illustration: <SourcesIllustration />,
  },
  {
    eyebrow: "02 · Understanding",
    title: "Knowledge",
    body:
      "Always-fresh Wiki and Intelligence dashboards. Cross-repo sagas. Health and security at a glance.",
    illustration: <KnowledgeIllustration />,
  },
  {
    eyebrow: "03 · Output",
    title: "Generate",
    body:
      "DocsGen bundles, OmniBoard onboarding packs, MCP descriptors. Ship artifacts your stakeholders can actually read.",
    illustration: <GenerateIllustration />,
  },
];

export function Pipeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.3"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative mx-auto max-w-[1100px] px-6 lg:px-10 py-32">
      <div className="text-center mb-20 space-y-4">
        <p className="text-button-upper text-[#777169]">From code to context</p>
        <h2 className="text-section-heading text-black">A single pipeline, three living stages.</h2>
      </div>

      {/* Connector line */}
      <svg
        role="presentation"
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-[260px] hidden lg:block"
        width="2"
        height="860"
        viewBox="0 0 2 860"
        preserveAspectRatio="none"
      >
        <title>Pipeline connector</title>
        <line x1="1" y1="0" x2="1" y2="860" stroke="#e5e5e5" strokeWidth="1" />
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="860"
          stroke="#000"
          strokeWidth="1.5"
          style={{ pathLength }}
        />
      </svg>

      <div className="space-y-28">
        {STAGES.map((stage, i) => (
          <div
            key={stage.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <FadeUp>
              <div className="space-y-3">
                <p className="text-button-upper text-[#777169]">{stage.eyebrow}</p>
                <h3 className="text-card-heading text-black">{stage.title}</h3>
                <p className="text-body text-[#4e4e4e] max-w-[480px]">{stage.body}</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>{stage.illustration}</FadeUp>
          </div>
        ))}
      </div>
    </section>
  );
}

function SourcesIllustration() {
  const items = [
    { label: "context-layer/api-gateway", type: "repo" },
    { label: "context-layer/offering-service", type: "repo" },
    { label: "rfcs/architecture.pdf", type: "file" },
  ];
  return (
    <div className="relative h-[260px] w-full">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="absolute left-0 right-0 mx-auto bg-white rounded-card shadow-[var(--shadow-outline-ring)] px-5 py-4 flex items-center gap-3 max-w-[360px]"
          style={{ top: `${i * 40 + 12}px`, transform: `translateX(${i * 14}px)` }}
        >
          <span
            className={`w-8 h-8 rounded-standard flex items-center justify-center text-micro ${
              it.type === "repo" ? "bg-black text-white" : "bg-[#f5f2ef] text-black"
            }`}
          >
            {it.type === "repo" ? "</>" : "PDF"}
          </span>
          <div className="flex-1">
            <p className="text-caption text-black">{it.label}</p>
            <p className="text-tiny text-[#777169]">Indexed · 2h ago</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
        </div>
      ))}
    </div>
  );
}

function KnowledgeIllustration() {
  return (
    <div className="bg-white rounded-large shadow-[var(--shadow-outline-ring)] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-micro text-[#777169] uppercase tracking-[0.08em]">Workspace Wiki</p>
        <span className="text-tiny text-[#22c55e]">● Live</span>
      </div>
      <h4 className="text-card-heading text-black">Cross-repo Saga Flows</h4>
      <div className="space-y-2">
        <span className="block h-1.5 w-full rounded-full bg-[#f5f5f5]" />
        <span className="block h-1.5 w-[92%] rounded-full bg-[#f5f5f5]" />
        <span className="block h-1.5 w-[75%] rounded-full bg-[#f5f5f5]" />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        {["88", "19", "84"].map((n, i) => (
          <div key={n} className="rounded-standard bg-[#f5f2ef] px-3 py-2">
            <p className="text-tiny text-[#777169] uppercase">
              {["Health", "Findings", "Coverage"][i]}
            </p>
            <p className="text-card-heading text-black leading-none mt-1">{n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenerateIllustration() {
  return (
    <div className="relative h-[260px] w-full">
      {["Architecture.md", "SRS.md", "Security-Report.pdf"].map((name, i) => (
        <div
          key={name}
          className="absolute inset-x-0 mx-auto max-w-[380px] bg-white rounded-large shadow-[var(--shadow-outline-ring)] p-5"
          style={{ top: `${i * 36 + 8}px`, transform: `rotate(${i % 2 === 0 ? -1.2 : 1.4}deg)` }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-micro uppercase text-[#777169] tracking-[0.08em]">{name}</p>
            <span className="text-tiny text-[#777169]">v1.4</span>
          </div>
          <div className="space-y-1.5">
            <span className="block h-1.5 w-[88%] rounded-full bg-[#f5f5f5]" />
            <span className="block h-1.5 w-[62%] rounded-full bg-[#f5f5f5]" />
            <span className="block h-1.5 w-[74%] rounded-full bg-[#f5f5f5]" />
          </div>
        </div>
      ))}
    </div>
  );
}
