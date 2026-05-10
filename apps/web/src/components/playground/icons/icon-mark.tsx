"use client";

import type { ArtifactBundle, ArtifactFormat, SourceCategory } from "@context-layer/mocks";
import { BRAND_ICONS, type BrandKey as SharedBrandKey } from "@context-layer/ui/brand-icons";

type LocalBrandKey = "bitbucket" | "discord" | "gitea" | "sharepoint";
type BrandKey = SharedBrandKey | LocalBrandKey;

type ContentKey =
  | "upload"
  | "link"
  | "file"
  | "slides"
  | "audio"
  | "video"
  | "architecture"
  | "knowledge"
  | "risk"
  | "agentify"
  | "memory"
  | "research";

export type IconRef = { type: "brand"; key: BrandKey } | { type: "content"; key: ContentKey };

const LOCAL_BRAND_ASSETS: Record<LocalBrandKey, string> = {
  bitbucket: "/icons/brands/bitbucket.svg",
  discord: "/icons/brands/discord.svg",
  gitea: "/icons/brands/gitea.svg",
  sharepoint: "/icons/brands/sharepoint.svg",
};

const CONTENT_ASSETS: Record<ContentKey, string> = {
  upload: "/icons/content/upload.svg",
  link: "/icons/content/link.svg",
  file: "/icons/content/file.svg",
  slides: "/icons/content/slides.svg",
  audio: "/icons/content/audio.svg",
  video: "/icons/content/video.svg",
  architecture: "/icons/content/architecture.svg",
  knowledge: "/icons/content/knowledge.svg",
  risk: "/icons/content/risk.svg",
  agentify: "/icons/content/agentify.svg",
  memory: "/icons/content/memory.svg",
  research: "/icons/content/research.svg",
};

export function sourceIconForCategory(category: SourceCategory): IconRef {
  switch (category) {
    case "github":
      return { type: "brand", key: "github" };
    case "gitlab":
      return { type: "brand", key: "gitlab" };
    case "bitbucket":
      return { type: "brand", key: "bitbucket" };
    case "gitea":
      return { type: "brand", key: "gitea" };
    case "upload":
      return { type: "content", key: "upload" };
    case "url":
      return { type: "content", key: "link" };
    case "notion":
      return { type: "brand", key: "notion" };
    case "confluence":
      return { type: "brand", key: "confluence" };
    case "drive":
      return { type: "brand", key: "gdrive" };
    case "sharepoint":
      return { type: "brand", key: "sharepoint" };
    case "slack":
      return { type: "brand", key: "slack" };
    case "discord":
      return { type: "brand", key: "discord" };
    case "linear":
      return { type: "brand", key: "linear" };
    case "jira":
      return { type: "brand", key: "jira" };
  }
}

export function artifactIconFor(bundle: ArtifactBundle, format: ArtifactFormat): IconRef {
  if (format === "slides") return { type: "content", key: "slides" };
  if (format === "audio") return { type: "content", key: "audio" };
  if (format === "video") return { type: "content", key: "video" };

  switch (bundle) {
    case "structure-architecture":
      return { type: "content", key: "architecture" };
    case "specification-knowledge":
      return { type: "content", key: "knowledge" };
    case "health-risk":
      return { type: "content", key: "risk" };
    case "agentify":
      return { type: "content", key: "agentify" };
    case "institutional-memory":
      return { type: "content", key: "memory" };
    case "research-docs":
      return { type: "content", key: "research" };
  }
}

export function IconMark({
  icon,
  size = 18,
  className = "",
}: {
  icon: IconRef;
  size?: number;
  className?: string;
}) {
  if (icon.type === "brand") {
    const shared = BRAND_ICONS[icon.key as SharedBrandKey];
    if (shared) {
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon rendered inside labeled UI
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          style={{ color: shared.color }}
        >
          {shared.paths ? (
            shared.paths.map((path) => <path key={`${path.d}-${path.fill}`} d={path.d} fill={path.fill} />)
          ) : (
            <path d={shared.path} fill="currentColor" />
          )}
        </svg>
      );
    }

    return (
      // biome-ignore lint/performance/noImgElement: local SVG assets are intentional here
      <img
        aria-hidden
        src={LOCAL_BRAND_ASSETS[icon.key as LocalBrandKey]}
        alt=""
        width={size}
        height={size}
        className={className}
      />
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: local SVG assets are intentional here
    <img
      aria-hidden
      src={CONTENT_ASSETS[icon.key]}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
