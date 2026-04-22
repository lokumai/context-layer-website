import { describe, expect, it } from "vitest";
import { bootstrapPayload } from "@/lib/hydration/bootstrap";

describe("bootstrapPayload", () => {
  it("empty persona → everything empty", async () => {
    const p = await bootstrapPayload("empty");
    expect(p.workspaces).toHaveLength(0);
    expect(p.sources).toHaveLength(0);
    expect(p.wiki).toBeNull();
    expect(p.intelligence).toBeNull();
    expect(p.artifacts).toHaveLength(0);
    expect(p.chatbot).toBeNull();
    expect(p.activity).toHaveLength(0);
  });

  it("partial persona → workspace + sources, no wiki/intelligence/chatbot/artifacts", async () => {
    const p = await bootstrapPayload("partial");
    expect(p.workspaces).toHaveLength(1);
    expect(p.sources).toHaveLength(9);
    expect(p.wiki).toBeNull();
    expect(p.intelligence).toBeNull();
    expect(p.chatbot).toBeNull();
    expect(p.artifacts).toHaveLength(0);
    expect(p.activity).toHaveLength(0);
  });

  it("full persona → every slice populated", async () => {
    const p = await bootstrapPayload("full");
    expect(p.workspaces).toHaveLength(1);
    expect(p.sources).toHaveLength(9);

    expect(p.wiki).not.toBeNull();
    const wiki = p.wiki;
    if (!wiki) throw new Error("wiki unexpectedly null");
    expect(Object.keys(wiki.tree)).toHaveLength(9);
    expect(wiki.narrative).not.toBeNull();
    expect(wiki.sagaFlows).not.toBeNull();
    expect(Object.keys(wiki.llms)).toContain("_workspace");

    expect(p.intelligence).not.toBeNull();
    expect(p.intelligence?.health).toBeDefined();
    expect(p.intelligence?.security.findings.length).toBeGreaterThan(0);
    expect(p.intelligence?.knowledgeGraph.nodes.length).toBeGreaterThan(0);

    expect(p.artifacts.length).toBeGreaterThanOrEqual(20);

    expect(p.chatbot).not.toBeNull();
    expect(p.chatbot?.cannedQA.length).toBeGreaterThan(0);
    expect(p.chatbot?.suggestedPrompts.length).toBeGreaterThan(0);

    expect(p.activity.length).toBeGreaterThan(0);
  });
});
