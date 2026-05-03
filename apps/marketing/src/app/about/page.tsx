import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeUp } from "@context-layer/ui/components/motion/fade-up";

const BASE_PATH = "/context-layer-website";

export const metadata: Metadata = {
  title: "About | Context Layer",
  description: "About LokumAI and Intellica.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-[rgba(0,0,0,0.05)] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-[860px] space-y-5">
            <FadeUp delay={0.02}>
              <h1 className="text-display-hero text-black lg:text-[64px] lg:leading-[1.02]">
                Company, team, product.
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="max-w-[700px] text-body-large text-[#4e4e4e]">
                Intellica is the company. LokumAI is the in-house AI team. Context Layer is the
                product that turns that work into a shared knowledge system for humans and agents.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <BrandCard
            logo={`${BASE_PATH}/intellilca_logo.png`}
            alt="Intellica logo"
            title="Intellica"
            eyebrow="Company"
            body="Enterprise Data & AI delivery, governance, and platform discipline."
          />
          <BrandCard
            logo={`${BASE_PATH}/lokumai_logo.svg`}
            alt="LokumAI logo"
            title="LokumAI"
            eyebrow="Team"
            body="Intellica's in-house AI team translating enterprise depth into product thinking."
          />
          <BrandCard
            logo={`${BASE_PATH}/logo-landscape.svg`}
            alt="Context Layer logo"
            title="Context Layer"
            eyebrow="Product"
            body="The knowledge layer that keeps the codebase grounded and agent-ready."
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-24 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <FadeUp>
            <div className="rounded-section border border-[rgba(0,0,0,0.05)] bg-white p-8 shadow-[var(--shadow-outline-ring)]">
              <p className="text-button-upper text-[#777169]">Why it matters</p>
              <h2 className="mt-3 text-section-heading text-black">One system, three layers.</h2>
              <p className="mt-4 text-body text-[#4e4e4e]">
                Intellica brings enterprise rigor. LokumAI shapes the AI experience. Context Layer
                keeps everything connected to the source code, docs, and knowledge that make the
                system trustworthy.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rounded-section bg-[rgba(245,242,239,0.8)] p-8 shadow-[var(--shadow-warm)]">
              <div className="space-y-3">
                <InfoRow label="Intellica" value="Founded in 2006" />
                <InfoRow label="LokumAI" value="In-house AI team" />
                <InfoRow label="Context Layer" value="Knowledge product" />
              </div>
              <div className="mt-8 flex justify-end">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-pill bg-black px-4 py-2 text-button text-white transition-opacity hover:opacity-90"
                >
                  Home <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function BrandCard({
  logo,
  alt,
  title,
  eyebrow,
  body,
}: {
  logo: string;
  alt: string;
  title: string;
  eyebrow: string;
  body: string;
}) {
  return (
    <div className="rounded-section border border-[rgba(0,0,0,0.05)] bg-white p-6 shadow-[var(--shadow-outline-ring)]">
      <div className="space-y-2">
        <p className="text-micro uppercase tracking-[0.08em] text-[#777169]">{eyebrow}</p>
        <img
          src={logo}
          alt={alt}
          className="h-24 w-auto object-contain lg:h-28"
          width={320}
          height={120}
        />
      </div>
      <h2 className="mt-5 text-card-heading text-black">{title}</h2>
      <p className="mt-3 text-body text-[#4e4e4e]">{body}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-card bg-white px-4 py-3 shadow-[var(--shadow-outline-ring)] border border-[rgba(0,0,0,0.04)]">
      <p className="text-micro uppercase tracking-[0.08em] text-[#777169]">{label}</p>
      <p className="text-body-medium text-black">{value}</p>
    </div>
  );
}
