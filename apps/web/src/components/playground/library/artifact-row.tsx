/** biome-ignore-all lint/a11y/useKeyWithClickEvents: table row is a decorative wrapper — the inline actions cell has the real keyboard-reachable buttons. */
"use client";

import type { Artifact } from "@context-layer/mocks";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { DOCSGEN_CATALOG } from "@/components/playground/generate/docsgen/catalog";
import { ActionsMenu } from "./actions-menu";
import { artifactIconFor, IconMark } from "../icons/icon-mark";
import { relativeTime } from "./artifact-tile";

const BUNDLE_COLOR_HEX: Record<string, string> = {
  "structure-architecture": "#2563eb",
  "specification-knowledge": "#9333ea",
  "health-risk": "#dc2626",
  agentify: "#ea580c",
  "institutional-memory": "#059669",
  "research-docs": "#d97706",
};

export function ArtifactRow({
  artifact,
  workspaceId,
  onPreview,
  onDelete,
}: {
  artifact: Artifact;
  workspaceId: string;
  onPreview: (a: Artifact) => void;
  onDelete: (a: Artifact) => void;
}) {
  const icon = artifactIconFor(artifact.bundle, artifact.format);

  const statusTone =
    artifact.status === "current" ? "indexed" : artifact.status === "superseded" ? "warn" : "error";
  const bundleTitle = DOCSGEN_CATALOG[artifact.bundle]?.title || artifact.bundle;

  return (
    <tr
      data-testid={`artifact-row-${artifact.id}`}
      className="group hover:bg-[#f5f2ef] transition-colors cursor-pointer border-b border-[rgba(0,0,0,0.05)]"
      onClick={() => onPreview(artifact)}
    >
      <td className="py-4 pl-4 w-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: BUNDLE_COLOR_HEX[artifact.bundle] || "#9ca3af" }}
        />
      </td>
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <IconMark icon={icon} size={18} className="w-[18px] h-[18px]" />
          <span className="text-body-medium text-black line-clamp-1">{artifact.title}</span>
        </div>
      </td>
      <td className="py-4 px-2">
        <span className="text-caption text-[#4e4e4e] capitalize">{artifact.tool || "—"}</span>
      </td>
      <td className="py-4 px-2">
        <span className="text-caption text-[#4e4e4e]">{bundleTitle}</span>
      </td>
      <td className="py-4 px-2">
        <span className="text-caption text-[#4e4e4e] uppercase">{artifact.format}</span>
      </td>
      <td className="py-4 px-2">
        <span className="text-caption text-[#4e4e4e]">
          {Math.round(artifact.sizeBytes / 1024)} KB
        </span>
      </td>
      <td className="py-4 px-2 whitespace-nowrap">
        <span className="text-caption text-[#4e4e4e]">{relativeTime(artifact.createdAt)}</span>
      </td>
      <td className="py-4 px-2">
        <StatusPill tone={statusTone}>
          {artifact.status.charAt(0).toUpperCase() + artifact.status.slice(1)}
        </StatusPill>
      </td>
      <td className="py-4 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
        <ActionsMenu
          artifact={artifact}
          workspaceId={workspaceId}
          onPreview={() => onPreview(artifact)}
          onDelete={() => onDelete(artifact)}
        />
      </td>
    </tr>
  );
}
