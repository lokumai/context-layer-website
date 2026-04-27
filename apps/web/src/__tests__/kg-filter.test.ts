import type { KnowledgeGraph } from "@context-layer/mocks";
import { describe, expect, it } from "vitest";
import { filterKnowledgeGraph } from "@/lib/intelligence/kg-filter";

const sample: KnowledgeGraph = {
  nodes: [
    {
      id: "offering-service",
      label: "Offering Service",
      repoId: "offering-service",
      type: "service",
    },
    { id: "pricing-service", label: "Pricing Service", repoId: "pricing-service", type: "service" },
    { id: "store-query", label: "Store Query", repoId: "store-query-service", type: "service" },
    { id: "rabbitmq", label: "RabbitMQ", repoId: "", type: "external" },
    { id: "outbox", label: "Outbox table", repoId: "shared-chassis", type: "datastore" },
  ],
  edges: [
    { source: "offering-service", target: "pricing-service", kind: "calls" },
    { source: "offering-service", target: "rabbitmq", kind: "publishes" },
    { source: "store-query", target: "rabbitmq", kind: "subscribes" },
    { source: "pricing-service", target: "outbox", kind: "writes" },
  ],
};

describe("filterKnowledgeGraph", () => {
  it("returns the graph unchanged on empty query", () => {
    const out = filterKnowledgeGraph(sample, "");
    expect(out.nodes).toHaveLength(sample.nodes.length);
    expect(out.edges).toHaveLength(sample.edges.length);
  });

  it("returns the graph unchanged on whitespace-only query", () => {
    const out = filterKnowledgeGraph(sample, "   ");
    expect(out.nodes).toHaveLength(sample.nodes.length);
    expect(out.edges).toHaveLength(sample.edges.length);
  });

  it("matches case-insensitive label substring", () => {
    const out = filterKnowledgeGraph(sample, "OFFERING");
    expect(out.nodes.map((n) => n.id)).toEqual(["offering-service"]);
  });

  it("matches by id substring", () => {
    const out = filterKnowledgeGraph(sample, "store-query");
    expect(out.nodes.map((n) => n.id)).toEqual(["store-query"]);
  });

  it("matches by repoId substring", () => {
    const out = filterKnowledgeGraph(sample, "shared-chassis");
    expect(out.nodes.map((n) => n.id)).toEqual(["outbox"]);
  });

  it("narrows edges to those connecting only surviving nodes", () => {
    const out = filterKnowledgeGraph(sample, "service");
    // 3 service nodes: offering, pricing, store-query.
    expect(out.nodes.map((n) => n.id).sort()).toEqual(
      ["offering-service", "pricing-service", "store-query"].sort(),
    );
    // Only the offering→pricing edge survives (both endpoints are kept).
    expect(out.edges.map((e) => `${e.source}->${e.target}`)).toEqual([
      "offering-service->pricing-service",
    ]);
  });

  it("returns empty when no nodes match", () => {
    const out = filterKnowledgeGraph(sample, "nonexistent-xyz");
    expect(out.nodes).toEqual([]);
    expect(out.edges).toEqual([]);
  });
});
