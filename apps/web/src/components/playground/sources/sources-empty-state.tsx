"use client";

import { useStore } from "@/stores";
import { IconMark, sourceIconForCategory } from "../icons/icon-mark";

const CTAS = [
  { label: "Connect GitHub", icon: sourceIconForCategory("github") },
  { label: "Connect Google Drive", icon: sourceIconForCategory("drive") },
  { label: "Upload files", icon: sourceIconForCategory("upload") },
  { label: "Paste URL", icon: sourceIconForCategory("url") },
] as const;

export function SourcesEmptyState() {
  const openChooser = useStore((s) => s.setAddSourceChooserOpen);
  return (
    <div className="bg-white rounded-section shadow-[var(--shadow-outline-ring)] px-10 py-16 text-center space-y-6 max-w-[760px] mx-auto">
      <div className="mx-auto w-14 h-14 rounded-comfortable bg-[#eff6ff] text-[#1d4ed8] flex items-center justify-center">
        <IconMark icon={sourceIconForCategory("upload")} size={32} />
      </div>
      <div className="space-y-3">
        <h2 className="text-section-heading text-black">Add your first source</h2>
        <p className="text-body text-[#4e4e4e] max-w-[520px] mx-auto">
          Connect a code repo, your doc workspace, or a discussion tool. Everything you add becomes
          searchable and agent-ready.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {CTAS.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => openChooser(true)}
            className="inline-flex items-center gap-2 bg-white text-black rounded-pill px-4 py-2 shadow-[var(--shadow-outline-ring)] hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <IconMark icon={icon} size={16} />
            <span className="text-caption font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
