/** biome-ignore-all lint/a11y/noStaticElementInteractions: menu panel container — the items inside are semantic buttons / links. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: outside-click closer is window-level, not on the panel itself. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { Download, Eye, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface ActionsMenuProps {
  artifact: Artifact;
  workspaceId: string;
  onPreview: () => void;
  onDelete: () => void;
}

export function ActionsMenu({ artifact, workspaceId, onPreview, onDelete }: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDownload = () => {
    window.alert("Download queued — stub.");
    setIsOpen(false);
  };

  const getRegenerateUrl = () => {
    if (artifact.tool === "docsgen") {
      return `/workspace/${workspaceId}/generate/docsgen/${artifact.bundle}`;
    }
    if (artifact.tool === "omniboard") {
      return `/workspace/${workspaceId}/generate/omniboard`;
    }
    if (artifact.tool === "mcpgen") {
      return `/workspace/${workspaceId}/generate/mcpgen`;
    }
    return `/workspace/${workspaceId}/generate/docsgen`;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        data-testid="actions-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-md hover:bg-[#f5f2ef] text-[#777169] transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          data-testid="actions-menu"
          className="absolute right-0 top-full mt-1 w-48 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-lg z-50 overflow-hidden flex flex-col py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            data-testid="actions-item-view"
            onClick={() => {
              onPreview();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4e4e4e] hover:bg-[#f5f2ef] hover:text-black transition-colors text-left"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>

          <button
            type="button"
            data-testid="actions-item-download"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4e4e4e] hover:bg-[#f5f2ef] hover:text-black transition-colors text-left"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <Link
            href={getRegenerateUrl()}
            data-testid="actions-item-regenerate"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4e4e4e] hover:bg-[#f5f2ef] hover:text-black transition-colors text-left"
            onClick={() => setIsOpen(false)}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </Link>

          <div className="h-[1px] bg-[rgba(0,0,0,0.05)] my-1" />

          <button
            type="button"
            data-testid="actions-item-delete"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#b91c1c] hover:bg-[#fef2f2] transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
