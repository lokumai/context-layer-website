/** biome-ignore-all lint/a11y/noStaticElementInteractions: clickable card — the <ActionsMenu> + keyboard-focusable buttons inside are the real controls. */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: tile is a decorative wrapper around semantic buttons; Enter lands on them via Tab order. */
"use client";

import type { Artifact, ArtifactBundle } from "@context-layer/mocks";
import {
  BookMarked,
  Bot,
  FileImage,
  FileText,
  FlaskConical,
  GitBranch,
  Headphones,
  type LucideIcon,
  Shield,
  Video,
} from "lucide-react";
import { StatusPill } from "@context-layer/ui/components/marketing/status-pill";
import { ActionsMenu } from "./actions-menu";

export const BUNDLE_ICON_MAP: Record<ArtifactBundle, LucideIcon> = {
  "structure-architecture": GitBranch,
  "specification-knowledge": FileText,
  "health-risk": Shield,
  agentify: Bot,
  "institutional-memory": BookMarked,
  "research-docs": FlaskConical,
};

const BUNDLE_COLOR_MAP: Record<ArtifactBundle, string> = {
  "structure-architecture": "bg-blue-100 text-blue-600",
  "specification-knowledge": "bg-purple-100 text-purple-600",
  "health-risk": "bg-red-100 text-red-600",
  agentify: "bg-orange-100 text-orange-600",
  "institutional-memory": "bg-emerald-100 text-emerald-600",
  "research-docs": "bg-amber-100 text-amber-600",
};

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function ToolBadge({ tool }: { tool?: string }) {
  if (!tool) return null;
  if (tool === "docsgen") return <StatusPill tone="neutral">DocsGen</StatusPill>;
  if (tool === "omniboard") return <StatusPill tone="info">OmniBoard</StatusPill>;
  if (tool === "mcpgen") return <StatusPill tone="warn">MCPGen</StatusPill>;
  return null;
}

export function ArtifactTile({
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
  let Icon = BUNDLE_ICON_MAP[artifact.bundle] || FileText;
  if (artifact.format === "slides") Icon = FileImage;
  else if (artifact.format === "audio") Icon = Headphones;
  else if (artifact.format === "video") Icon = Video;

  const colorClass = BUNDLE_COLOR_MAP[artifact.bundle] || "bg-gray-100 text-gray-600";
  const statusTone =
    artifact.status === "current" ? "indexed" : artifact.status === "superseded" ? "warn" : "error";

  return (
    <div
      data-testid={`artifact-tile-${artifact.id}`}
      className="bg-white rounded-card p-5 shadow-[var(--shadow-inset-border)] hover:shadow-[var(--shadow-outline-ring)] transition-shadow flex flex-col gap-3 cursor-pointer group"
      onClick={() => onPreview(artifact)}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-[10px] ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ToolBadge tool={artifact.tool} />
      </div>

      <div className="flex-1">
        <h3 className="text-card-heading text-black line-clamp-1 group-hover:text-blue-600 transition-colors">
          {artifact.title}
        </h3>
        <p className="text-body text-[#4e4e4e] line-clamp-2 mt-1">{artifact.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <StatusPill tone={statusTone}>
            {artifact.status.charAt(0).toUpperCase() + artifact.status.slice(1)}
          </StatusPill>
        </div>

        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.05)] pt-3">
          <div className="text-caption text-[#777169] flex items-center gap-1.5">
            <span>{Math.round(artifact.sizeBytes / 1024)} KB</span>
            <span className="opacity-30">·</span>
            <span className="uppercase">{artifact.format}</span>
            <span className="opacity-30">·</span>
            <span>{relativeTime(artifact.createdAt)}</span>
          </div>
          <ActionsMenu
            artifact={artifact}
            workspaceId={workspaceId}
            onPreview={() => onPreview(artifact)}
            onDelete={() => onDelete(artifact)}
          />
        </div>
      </div>
    </div>
  );
}
