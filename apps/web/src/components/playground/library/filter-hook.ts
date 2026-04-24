"use client";

import type { Artifact, ArtifactBundle, ArtifactFormat, ArtifactTool } from "@context-layer/mocks";
import { useMemo, useState } from "react";

// Pure filter reducer for the Library (UI_UX §8). All filter axes combine
// with AND; "all" / "any" means the axis is inactive. Kept deliberately small
// and test-friendly so we can pin behaviour via Vitest before exercising it
// through the UI.

export type ToolFilter = "all" | ArtifactTool;
export type BundleFilter = "all" | ArtifactBundle;
export type FormatFilter = "all" | ArtifactFormat;
export type StatusFilter = "all" | "current" | "superseded" | "failed";
export type WindowFilter = "any" | "7d" | "30d" | "90d";

export interface LibraryFilters {
  query: string;
  tool: ToolFilter;
  bundle: BundleFilter;
  format: FormatFilter;
  status: StatusFilter;
  window: WindowFilter;
}

export const DEFAULT_FILTERS: LibraryFilters = {
  query: "",
  tool: "all",
  bundle: "all",
  format: "all",
  status: "all",
  window: "any",
};

export interface LibraryFilterApi {
  filters: LibraryFilters;
  setFilter: <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => void;
  reset: () => void;
  filtered: Artifact[];
}

export function applyFilters(
  artifacts: readonly Artifact[],
  filters: LibraryFilters,
  now: Date = new Date(),
): Artifact[] {
  const q = filters.query.trim().toLowerCase();
  const windowMs = windowToMs(filters.window);
  const cutoff = windowMs === null ? null : now.getTime() - windowMs;

  return artifacts.filter((a) => {
    if (q && !a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) {
      return false;
    }
    if (filters.tool !== "all" && (a.tool ?? "docsgen") !== filters.tool) return false;
    if (filters.bundle !== "all" && a.bundle !== filters.bundle) return false;
    if (filters.format !== "all" && a.format !== filters.format) return false;
    if (filters.status !== "all" && a.status !== filters.status) return false;
    if (cutoff !== null) {
      const created = new Date(a.createdAt).getTime();
      if (Number.isNaN(created) || created < cutoff) return false;
    }
    return true;
  });
}

function windowToMs(w: WindowFilter): number | null {
  switch (w) {
    case "7d":
      return 7 * 24 * 3_600_000;
    case "30d":
      return 30 * 24 * 3_600_000;
    case "90d":
      return 90 * 24 * 3_600_000;
    default:
      return null;
  }
}

export function useLibraryFilters(artifacts: readonly Artifact[]): LibraryFilterApi {
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_FILTERS);

  const setFilter = <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // If the tool filter leaves DocsGen behind, the bundle filter becomes
      // meaningless — reset it to "all" so the UI stays consistent.
      if (key === "tool" && value !== "all" && value !== "docsgen") {
        next.bundle = "all";
      }
      return next;
    });
  };

  const filtered = useMemo(() => applyFilters(artifacts, filters), [artifacts, filters]);

  return {
    filters,
    setFilter,
    reset: () => setFilters(DEFAULT_FILTERS),
    filtered,
  };
}
