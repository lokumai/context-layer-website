// Simulated job progress generator (UI_UX §9.10).
//
// Later phases (Generate Wiki, Generate Intelligence, DocsGen cards, OmniBoard)
// wrap real store mutations in this helper so the UI streams plausible step
// labels instead of a static spinner. Phase 4 only ships the primitive.

export interface ProgressEvent {
  step: string;
  index: number;
  total: number;
  elapsedMs: number;
}

export interface SimulateOptions {
  /** Total wall-clock time the job should take. Default 4000 ms. */
  totalMs?: number;
  /** Minimum ms between steps (so fast step counts still feel paced). Default 350. */
  minStepMs?: number;
  /** Optional custom clock for tests. */
  now?: () => number;
  /** Optional custom delay for tests. */
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Yields a ProgressEvent per step with realistic pacing, then awaits finalize().
 * The final promise resolves with whatever finalize() returns.
 */
export async function* simulateJob<T>(
  steps: readonly string[],
  finalize: () => Promise<T> | T,
  opts: SimulateOptions = {},
): AsyncGenerator<ProgressEvent, T, void> {
  const { totalMs = 4000, minStepMs = 350, now = Date.now, sleep = defaultSleep } = opts;
  if (steps.length === 0) return (await finalize()) as T;

  const perStep = Math.max(minStepMs, Math.floor(totalMs / steps.length));
  const start = now();

  for (let i = 0; i < steps.length; i++) {
    await sleep(perStep);
    yield { step: steps[i], index: i, total: steps.length, elapsedMs: now() - start };
  }

  return (await finalize()) as T;
}
