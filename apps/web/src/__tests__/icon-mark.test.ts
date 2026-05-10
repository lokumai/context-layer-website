import { describe, expect, it } from "vitest";
import { artifactIconFor, sourceIconForCategory } from "@/components/playground/icons/icon-mark";

describe("playground icon mapping", () => {
  it("maps source categories to brand or asset icons", () => {
    expect(sourceIconForCategory("github")).toEqual({ type: "brand", key: "github" });
    expect(sourceIconForCategory("sharepoint")).toEqual({ type: "brand", key: "sharepoint" });
    expect(sourceIconForCategory("upload")).toEqual({ type: "content", key: "upload" });
    expect(sourceIconForCategory("url")).toEqual({ type: "content", key: "link" });
  });

  it("maps generate bundles and output formats to content icons", () => {
    expect(artifactIconFor("structure-architecture", "markdown")).toEqual({
      type: "content",
      key: "architecture",
    });
    expect(artifactIconFor("specification-knowledge", "pdf")).toEqual({
      type: "content",
      key: "knowledge",
    });
    expect(artifactIconFor("research-docs", "slides")).toEqual({
      type: "content",
      key: "slides",
    });
    expect(artifactIconFor("agentify", "video")).toEqual({
      type: "content",
      key: "video",
    });
  });
});
