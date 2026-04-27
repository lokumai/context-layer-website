import type { SourceCategory, SourceKind } from "@context-layer/mocks";
import {
  Boxes,
  Cloud,
  Disc,
  FileText,
  GitBranch,
  HardDrive,
  Hash,
  KanbanSquare,
  Link as LinkIcon,
  type LucideIcon,
  MessageSquare,
  MessagesSquare,
  Notebook,
  Package,
  Upload,
} from "lucide-react";

// Per IMPROVE.md / Phase 14: each bucket exposes 2 primary connectors that
// are always visible, plus the rest behind a "More options" expander.

export type Bucket = "code" | "docs" | "discussion";

export interface Connector {
  name: string;
  kind: SourceKind;
  category: SourceCategory;
  label: "Connect" | "Paste" | "Upload";
  primary: boolean;
  icon: LucideIcon;
  /** Tailwind classes for the icon-square background + foreground. */
  accent: string;
}

const ACCENT_CODE = "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-fg)]";
const ACCENT_DOCS = "bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-fg)]";
const ACCENT_DISC = "bg-[var(--color-accent-amber-bg)] text-[var(--color-accent-amber-fg)]";

export const CONNECTORS_BY_BUCKET: Record<Bucket, Connector[]> = {
  code: [
    {
      name: "GitHub",
      kind: "code",
      category: "github",
      label: "Connect",
      primary: true,
      icon: GitBranch,
      accent: ACCENT_CODE,
    },
    {
      name: "GitLab",
      kind: "code",
      category: "gitlab",
      label: "Connect",
      primary: true,
      icon: GitBranch,
      accent: ACCENT_CODE,
    },
    {
      name: "Bitbucket",
      kind: "code",
      category: "bitbucket",
      label: "Connect",
      primary: false,
      icon: GitBranch,
      accent: ACCENT_CODE,
    },
    {
      name: "Gitea",
      kind: "code",
      category: "gitea",
      label: "Connect",
      primary: false,
      icon: GitBranch,
      accent: ACCENT_CODE,
    },
    {
      name: "Paste URL",
      kind: "code",
      category: "url",
      label: "Paste",
      primary: false,
      icon: LinkIcon,
      accent: ACCENT_CODE,
    },
    {
      name: "Upload zip",
      kind: "code",
      category: "upload",
      label: "Upload",
      primary: false,
      icon: Upload,
      accent: ACCENT_CODE,
    },
  ],
  docs: [
    {
      name: "Notion",
      kind: "file",
      category: "notion",
      label: "Connect",
      primary: true,
      icon: Notebook,
      accent: ACCENT_DOCS,
    },
    {
      name: "Confluence",
      kind: "file",
      category: "confluence",
      label: "Connect",
      primary: true,
      icon: FileText,
      accent: ACCENT_DOCS,
    },
    {
      name: "Google Drive",
      kind: "file",
      category: "drive",
      label: "Connect",
      primary: false,
      icon: HardDrive,
      accent: ACCENT_DOCS,
    },
    {
      name: "SharePoint",
      kind: "file",
      category: "sharepoint",
      label: "Connect",
      primary: false,
      icon: Cloud,
      accent: ACCENT_DOCS,
    },
    {
      name: "Upload file",
      kind: "file",
      category: "upload",
      label: "Upload",
      primary: false,
      icon: Upload,
      accent: ACCENT_DOCS,
    },
  ],
  discussion: [
    {
      name: "Slack",
      kind: "discussion",
      category: "slack",
      label: "Connect",
      primary: true,
      icon: MessageSquare,
      accent: ACCENT_DISC,
    },
    {
      name: "Discord",
      kind: "discussion",
      category: "discord",
      label: "Connect",
      primary: true,
      icon: Disc,
      accent: ACCENT_DISC,
    },
    {
      name: "Linear",
      kind: "discussion",
      category: "linear",
      label: "Connect",
      primary: false,
      icon: KanbanSquare,
      accent: ACCENT_DISC,
    },
    {
      name: "Jira",
      kind: "discussion",
      category: "jira",
      label: "Connect",
      primary: false,
      icon: Package,
      accent: ACCENT_DISC,
    },
    {
      name: "GitHub Discussions",
      kind: "discussion",
      category: "github",
      label: "Connect",
      primary: false,
      icon: MessagesSquare,
      accent: ACCENT_DISC,
    },
  ],
};

export interface BucketDef {
  id: Bucket;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
}

export const BUCKETS: BucketDef[] = [
  {
    id: "code",
    title: "Code",
    subtitle: "Repos and snippets",
    icon: GitBranch,
    accent: ACCENT_CODE,
  },
  {
    id: "docs",
    title: "Docs and Wikis",
    subtitle: "Notion, Confluence, files",
    icon: FileText,
    accent: ACCENT_DOCS,
  },
  {
    id: "discussion",
    title: "Discussion and Memory",
    subtitle: "Chat, tickets, threads",
    icon: Hash,
    accent: ACCENT_DISC,
  },
];

// Re-export Boxes so the chooser can use it for a generic-fallback.
export { Boxes };
