import type { IndexingStatus } from "@context-layer/mocks";
import { StatusPill, type StatusTone } from "@/components/marketing/status-pill";

const MAP: Record<IndexingStatus, { tone: StatusTone; label: string }> = {
  indexed: { tone: "indexed", label: "Indexed" },
  indexing: { tone: "info", label: "Indexing…" },
  error: { tone: "error", label: "Error" },
};

export function SourceStatusBadge({ status }: { status: IndexingStatus }) {
  const m = MAP[status];
  return (
    <StatusPill tone={m.tone} dot={status !== "indexing"}>
      {status === "indexing" ? (
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {m.label}
        </span>
      ) : (
        m.label
      )}
    </StatusPill>
  );
}
