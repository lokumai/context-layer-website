"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  FileText,
  GitBranch,
  Hash,
  MessageCircle,
  RefreshCw,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Source } from "@context-layer/mocks";
import { Badge } from "@/components/ui/badge";
import { MetaField } from "@/components/ui/meta-field";

const PROVIDER_ICON: Record<string, LucideIcon> = {
  github: GitBranch,
  gitlab: GitBranch,
  bitbucket: GitBranch,
  gitea: GitBranch,
  gdrive: FileText,
  notion: StickyNote,
  confluence: StickyNote,
  sharepoint: StickyNote,
  slack: Hash,
  discord: MessageCircle,
};

// Sample content by provider kind for the preview
function samplePreview(source: Source): { title: string; lines: string[]; contentType: string } {
  if (source.kind === "repo") {
    return {
      title: "README.md",
      contentType: "markdown",
      lines: [
        `# ${source.name}`,
        "",
        source.name.includes("catalog")
          ? "TMF620-compatible catalog service. Single responsibility: own the canonical Product, ProductOffering, and ProductSpecification entities."
          : source.name.includes("order")
          ? "Order lifecycle and saga orchestrator. Owns the saga state machine; emits domain events via the outbox."
          : source.name.includes("shared")
          ? "Shared domain library. TMForum schemas, event payloads, telemetry middleware. No runtime dependencies — imported into every service."
          : "FastAPI microservice. Owns its own Postgres schema. Participates in the product catalog saga via shared-lib events.",
        "",
        "## Development",
        "",
        "```bash",
        "poetry install",
        "poetry run uvicorn app.main:app --reload",
        "```",
        "",
        "## Tests",
        "",
        "```bash",
        "poetry run pytest tests/ -v",
        "```",
        "",
        "## Contract",
        "",
        "See `/tmf-api/productCatalogManagement/v4/openapi.json` for the live TMF620 spec.",
      ],
    };
  }
  return {
    title: source.name,
    contentType: "document",
    lines: [
      `# ${source.name}`,
      "",
      "TMForum TMF620 — Product Catalog Management",
      "",
      "## Abstract",
      "",
      "This specification defines the canonical data model and REST interface for managing product offerings, specifications, and catalogs across federated operator systems.",
      "",
      "## Entities",
      "",
      "- Catalog",
      "- Category",
      "- ProductOffering",
      "- ProductSpecification",
      "- ProductOfferingPrice",
    ],
  };
}

export function SourcePreviewModal({
  source,
  onClose,
}: {
  source: Source | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {source && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 backdrop-blur-lg"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.28),0_0_0_1px_rgba(0,0,0,0.05)]"
            style={{ maxHeight: "85vh" }}
          >
            <SourceHeader source={source} onClose={onClose} />
            <SourceBody source={source} />
            <SourceFooter />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SourceHeader({ source, onClose }: { source: Source; onClose: () => void }) {
  const Icon = PROVIDER_ICON[source.provider] ?? FileText;
  const tone =
    source.status === "indexed" ? "success" : source.status === "indexing" ? "warn" : "danger";

  return (
    <div className="flex items-start justify-between border-b border-[var(--color-border-subtle)] px-8 py-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)]">
          <Icon size={22} strokeWidth={1.6} />
        </span>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-[28px] leading-none tracking-display">
              {source.name}
            </h2>
            <Badge tone={tone}>{source.status}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
            <span>{source.provider}</span>
            {source.branch && <span>/ {source.branch}</span>}
            <span>·</span>
            <span>{source.kind}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          title="Re-index"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
        >
          <RefreshCw size={14} strokeWidth={1.6} />
        </button>
        <button
          title="Delete"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger-fg)]"
        >
          <Trash2 size={14} strokeWidth={1.6} />
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
        >
          <X size={15} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

function SourceBody({ source }: { source: Source }) {
  const preview = samplePreview(source);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
          <span>Preview · {preview.contentType}</span>
          <span>{preview.title}</span>
        </div>
        <div className="rounded-[14px] bg-[var(--color-ink)] p-5 shadow-lift">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
          </div>
          <div className="font-mono text-[12.5px] leading-[1.8] text-white/85">
            {preview.lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.015 }}
                className="flex gap-4"
              >
                <span className="w-7 shrink-0 select-none text-right text-white/25">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{line || " "}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 flex-col gap-5 border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/60 p-6 md:flex">
        <MetaField label="Last Indexed" value={source.lastIndexedAt.slice(0, 10)} />
        <MetaField label="Auto Sync" value={source.autoSync ? "Enabled" : "Off"} />
        {source.url && (
          <MetaField
            label="URL"
            value={<span className="block truncate text-[12px] font-mono">{source.url}</span>}
          />
        )}
        <div className="mt-auto rounded-[12px] border border-[var(--color-border)] bg-white p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
            Reachable by
          </div>
          <ul className="mt-2 space-y-1 text-[12px] text-[var(--color-ink-muted)]">
            <li>• Wiki generation</li>
            <li>• Chatbot grounding</li>
            <li>• DocsGen bundles</li>
            <li>• Intelligence analyses</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function SourceFooter() {
  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/70 px-8 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
      <span>Markdown-indexed · embeddings cached</span>
      <span>Context Layer · Source preview</span>
    </div>
  );
}
