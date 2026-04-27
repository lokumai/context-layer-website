import type { KnowledgeGraph } from "@context-layer/mocks";

/**
 * Filters a KnowledgeGraph by a free-text query. Pure — no React, no state.
 *
 * - Empty / whitespace-only query → returns the graph unchanged.
 * - Non-empty query → keeps nodes whose `id`, `label`, or `repoId` contains
 *   the query (case-insensitive); narrows `edges` to those whose `source`
 *   AND `target` both survive the node filter.
 */
export function filterKnowledgeGraph(graph: KnowledgeGraph, query: string): KnowledgeGraph {
  const q = query.trim().toLowerCase();
  if (!q) return graph;

  const matchedNodes = graph.nodes.filter((n) => {
    if (n.id.toLowerCase().includes(q)) return true;
    if (n.label.toLowerCase().includes(q)) return true;
    if (n.repoId?.toLowerCase().includes(q)) return true;
    return false;
  });
  const ids = new Set(matchedNodes.map((n) => n.id));
  const edges = graph.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
  return { nodes: matchedNodes, edges };
}
