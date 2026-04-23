import { describe, expect, it } from "vitest";
import { type StreamEvent, streamAnswer } from "@/lib/chatbot/stream";

describe("streamAnswer", () => {
  it("yields a thinking event then chunks then done", async () => {
    const events: StreamEvent[] = [];
    for await (const ev of streamAnswer("A quick brown fox jumps over the lazy dog.", {
      thinkingMs: 0,
      chunkDelayMs: 0,
      tokensPerChunk: 2,
    })) {
      events.push(ev);
    }
    expect(events[0]).toEqual({ kind: "thinking" });
    const done = events[events.length - 1];
    if (done.kind !== "done") throw new Error("last event is not done");
    expect(done.full).toBe("A quick brown fox jumps over the lazy dog.");
    const chunks = events.filter((e) => e.kind === "chunk");
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("stops emitting chunks when the abort signal fires", async () => {
    const controller = new AbortController();
    const events: StreamEvent[] = [];
    let seen = 0;
    for await (const ev of streamAnswer("one two three four five six seven eight nine ten", {
      thinkingMs: 0,
      chunkDelayMs: 1,
      tokensPerChunk: 1,
      signal: controller.signal,
    })) {
      events.push(ev);
      if (ev.kind === "chunk") {
        seen++;
        if (seen === 2) controller.abort();
      }
    }
    // Should not have reached "done"
    expect(events.some((e) => e.kind === "done")).toBe(false);
  });
});
