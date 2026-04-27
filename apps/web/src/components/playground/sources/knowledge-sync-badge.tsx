import type { KnowledgeSyncStatus } from "@context-layer/mocks";
import { StatusPill } from "@/components/marketing/status-pill";

// Visual marker for whether a source is "in lock-step" with the workspace's
// Wiki. Orthogonal to the source's IndexingStatus — a source can be
// fully `Indexed` yet `Outdated` (Wiki hasn't been re-generated).
//
// Renders nothing when the field is undefined: this keeps tests + stale
// persisted state graceful, and means the Sources page only shows the
// badge once bootstrap (or Force Sync) has stamped it.

export function KnowledgeSyncBadge({ status }: { status: KnowledgeSyncStatus | undefined }) {
  if (!status) return null;
  const testid = status === "synced" ? "knowledge-sync-synced" : "knowledge-sync-outdated";
  return (
    <span data-testid={testid}>
      <StatusPill tone={status === "synced" ? "indexed" : "warn"} dot>
        {status === "synced" ? "Synced" : "Outdated"}
      </StatusPill>
    </span>
  );
}
