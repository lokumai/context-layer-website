import { describe, expect, it } from "vitest";
import { simulateJob, type ProgressEvent } from "@/lib/simulate-latency";

describe("simulateJob", () => {
  it("yields one event per step and resolves with the finalize value", async () => {
    const events: ProgressEvent[] = [];
    let t = 0;
    const iter = simulateJob(["clone", "analyze", "render", "commit"], () => 42, {
      totalMs: 400,
      minStepMs: 10,
      now: () => t,
      sleep: async (ms) => {
        t += ms;
      },
    });
    let result: number | undefined;
    while (true) {
      const next = await iter.next();
      if (next.done) {
        result = next.value;
        break;
      }
      events.push(next.value);
    }
    expect(events.map((e) => e.step)).toEqual(["clone", "analyze", "render", "commit"]);
    expect(events[0].total).toBe(4);
    expect(events.at(-1)?.index).toBe(3);
    expect(result).toBe(42);
  });

  it("handles zero steps by resolving finalize immediately", async () => {
    const iter = simulateJob([], async () => "done");
    const result = await iter.next();
    expect(result.done).toBe(true);
    expect(result.value).toBe("done");
  });
});
