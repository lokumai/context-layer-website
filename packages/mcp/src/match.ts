import type { CannedQAPair, Citation } from "@context-layer/mocks";

// Bag-of-words Q&A matcher. Mirrors the apps/web lib/chatbot/match.ts algorithm
// so the MCP server and the in-playground chatbot produce the same answer for
// the same question — users see consistency regardless of which surface they
// hit. The copy is intentional: the matcher has no runtime deps beyond the
// mocks type definitions, and splitting it into a shared package for two
// short files would be over-engineered.

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "me",
  "of",
  "on",
  "or",
  "our",
  "the",
  "this",
  "to",
  "us",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export interface MatchedAnswer {
  content: string;
  citations: Citation[];
  matched: CannedQAPair | null;
}

export function matchAnswer(question: string, pool: readonly CannedQAPair[]): MatchedAnswer {
  if (pool.length === 0) {
    return { content: fallbackContent(question), citations: [], matched: null };
  }

  const qTokens = new Set(tokenize(question));
  if (qTokens.size === 0) {
    return { content: fallbackContent(question), citations: [], matched: null };
  }

  let best: { pair: CannedQAPair; score: number } | null = null;
  for (const pair of pool) {
    const pTokens = new Set(tokenize(pair.question));
    let overlap = 0;
    for (const t of qTokens) if (pTokens.has(t)) overlap++;
    const score = overlap / Math.max(qTokens.size, 1);
    if (!best || score > best.score) best = { pair, score };
  }

  if (!best || best.score < 0.15) {
    return { content: fallbackContent(question), citations: [], matched: null };
  }

  return { content: best.pair.answer, citations: best.pair.citations, matched: best.pair };
}

function fallbackContent(question: string): string {
  return `I don't have a grounded answer for "${question.slice(0, 80)}" in the indexed knowledge. Try rewording with a repo or file reference, or call \`get_wiki_content\` directly.`;
}
