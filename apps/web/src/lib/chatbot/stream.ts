// Simulated LLM streaming (UI_UX §9.10).
//
// Yields a "thinking" phase, then emits the answer chunk-by-chunk so the UI
// can append tokens and feel like a live stream. Kept framework-agnostic;
// the React consumer wires it to React state + store.patchLastMessage.

export type StreamEvent =
  | { kind: "thinking" }
  | { kind: "chunk"; delta: string; running: string }
  | { kind: "done"; full: string };

export interface StreamOptions {
  /** How long to stay in "thinking" before the first chunk. Default 1200 ms. */
  thinkingMs?: number;
  /** Approx ms between chunks. Default 40 ms. */
  chunkDelayMs?: number;
  /** Tokens per chunk (rough). Default 3. */
  tokensPerChunk?: number;
  sleep?: (ms: number) => Promise<void>;
  /** When set, the generator breaks out mid-stream (user clicks Stop). */
  signal?: AbortSignal;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function* streamAnswer(
  answer: string,
  opts: StreamOptions = {},
): AsyncGenerator<StreamEvent, void, void> {
  const {
    thinkingMs = 1200,
    chunkDelayMs = 40,
    tokensPerChunk = 3,
    sleep = defaultSleep,
    signal,
  } = opts;

  yield { kind: "thinking" };
  await sleep(thinkingMs);
  if (signal?.aborted) return;

  // Split on whitespace but keep the spaces so re-assembly is lossless.
  const parts = answer.split(/(\s+)/);
  let running = "";
  let tokenCounter = 0;
  let buffer = "";

  for (const part of parts) {
    buffer += part;
    const isSpace = /^\s+$/.test(part);
    if (!isSpace) tokenCounter++;

    if (tokenCounter >= tokensPerChunk) {
      running += buffer;
      yield { kind: "chunk", delta: buffer, running };
      buffer = "";
      tokenCounter = 0;
      await sleep(chunkDelayMs);
      if (signal?.aborted) return;
    }
  }

  if (buffer.length > 0) {
    running += buffer;
    yield { kind: "chunk", delta: buffer, running };
  }

  yield { kind: "done", full: running };
}
