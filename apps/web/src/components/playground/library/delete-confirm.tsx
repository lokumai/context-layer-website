/** biome-ignore-all lint/a11y/noStaticElementInteractions: modal backdrop + stop-propagation wrapper — real controls are buttons inside. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Escape is handled via a window listener; close X button is the keyboard path. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function DeleteConfirmModal({
  artifact,
  onCancel,
  onConfirm,
}: {
  artifact: Artifact;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center p-4 backdrop-blur-[1px]"
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        data-testid="delete-confirm"
        className="bg-white rounded-card shadow-[var(--shadow-card)] w-full max-w-[420px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-card-heading text-black">Delete artifact?</h3>
            <button
              type="button"
              onClick={onCancel}
              className="text-[#777169] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-body text-[#4e4e4e]">
            This will remove <span className="font-medium text-black">{artifact.title}</span> from
            the Library. The action is immediate.
          </p>
        </div>

        <div className="bg-[#f9f9f9] p-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium text-[#4e4e4e] hover:bg-[#f5f2ef] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium bg-[#b91c1c] text-white hover:bg-[#991b1b] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
