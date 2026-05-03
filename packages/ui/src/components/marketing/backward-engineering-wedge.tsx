import { ArrowLeft, ArrowRight } from "lucide-react";

export function BackwardEngineeringWedge() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white rounded-section shadow-[var(--shadow-outline-ring)] overflow-hidden">
      {/* Forward column */}
      <div className="bg-[#f9f9f9] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight size={16} strokeWidth={1.5} className="text-[#777169]" />
          <p className="text-button-upper text-[#777169]">Forward Engineering</p>
        </div>
        <h3 className="text-card-heading text-black mb-3">Write new code.</h3>
        <p className="text-body-standard text-[#4e4e4e] mb-6">
          Assistants that generate, refactor, and complete code. Great when the project is already understood.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Cursor", "Claude Code", "Copilot", "Windsurf"].map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-pill text-[12px] bg-white text-[#4e4e4e] shadow-[var(--shadow-inset-border)]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Backward column — emphasized */}
      <div className="bg-[#ecfdf5]/40 p-8 lg:p-10 relative">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft size={16} strokeWidth={1.5} className="text-[#047857]" />
          <p className="text-button-upper text-[#047857]">Backward Engineering</p>
        </div>
        <h3 className="text-card-heading text-black mb-3">Understand existing code.</h3>
        <p className="text-body-standard text-[#4e4e4e] mb-6">
          Reverse-engineer a legacy codebase into a persistent, versioned knowledge base. The layer that makes everything else trustworthy.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-black text-white text-[12px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          Context Layer lives here
        </div>
      </div>
    </div>
  );
}
