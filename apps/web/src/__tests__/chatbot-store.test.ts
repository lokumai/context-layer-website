import type { CannedQAPair, ChatMessage } from "@context-layer/mocks";
import { beforeEach, describe, expect, it } from "vitest";
import { matchAnswer } from "@/lib/chatbot/match";
import { useStore } from "@/stores";

describe("chatbot store slice", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("createThread prepends to the list and becomes active", () => {
    const a = useStore.getState().createThread();
    const b = useStore.getState().createThread();
    const s = useStore.getState();
    expect(s.threads[0].id).toBe(b);
    expect(s.threads[1].id).toBe(a);
    expect(s.activeThreadId).toBe(b);
  });

  it("appendMessage stores the message and derives the thread title from the first user message", () => {
    const id = useStore.getState().createThread();
    useStore.getState().appendMessage(id, {
      role: "user",
      content: "Where is JWT validation implemented in this codebase?",
    } as ChatMessage);
    const t = useStore.getState().threads.find((x) => x.id === id);
    expect(t?.messages).toHaveLength(1);
    expect(t?.title.startsWith("Where is JWT validation")).toBe(true);
  });

  it("patchLastMessage mutates only the last message's content", () => {
    const id = useStore.getState().createThread();
    useStore.getState().appendMessage(id, { role: "user", content: "hello" });
    useStore.getState().appendMessage(id, { role: "assistant", content: "" });
    useStore.getState().patchLastMessage(id, "streamed chunk 1");
    useStore.getState().patchLastMessage(id, "streamed chunk 1 and 2");
    const t = useStore.getState().threads.find((x) => x.id === id);
    expect(t?.messages[0].content).toBe("hello");
    expect(t?.messages[1].content).toBe("streamed chunk 1 and 2");
  });

  it("deleteThread removes + clears active when it was the active one", () => {
    const id = useStore.getState().createThread();
    useStore.getState().deleteThread(id);
    const s = useStore.getState();
    expect(s.threads).toHaveLength(0);
    expect(s.activeThreadId).toBeNull();
  });

  it("renameThread updates the title in-place", () => {
    const id = useStore.getState().createThread();
    useStore.getState().renameThread(id, "Saga flows deep dive");
    const t = useStore.getState().threads.find((x) => x.id === id);
    expect(t?.title).toBe("Saga flows deep dive");
  });
});

describe("matchAnswer helper", () => {
  const pool: CannedQAPair[] = [
    {
      id: "qa-1",
      question: "How does the Transactional Outbox pattern work in this codebase?",
      answer:
        "Each write service writes the business row and an outbox row inside a single transaction.",
      citations: [{ id: "c-1", kind: "wiki", anchor: "wiki://shared/outbox", label: "outbox" }],
    },
    {
      id: "qa-2",
      question: "Where is JWT validation implemented?",
      answer: "In libs/common-python/src/common/security.py.",
      citations: [],
    },
  ];

  it("picks the best overlapping question", () => {
    const m = matchAnswer("Tell me how the transactional outbox works here", pool);
    expect(m.matched?.id).toBe("qa-1");
    expect(m.citations).toHaveLength(1);
  });

  it("falls back when no question overlaps meaningfully", () => {
    const m = matchAnswer("What is the capital of France?", pool);
    expect(m.matched).toBeNull();
    expect(m.citations).toHaveLength(0);
    expect(m.content).toMatch(/don't have a grounded answer/i);
  });
});
