import { getCannedQA, getSuggestedPrompts } from "@context-layer/mocks";
import { matchAnswer } from "../match";
import type { ToolTextResponse } from "./wiki";

export interface AskToolInput {
  question: string;
}

// ask_context_layer — semantic Q&A over the indexed knowledge. Uses the same
// deterministic bag-of-words matcher the playground chatbot uses, so an
// external agent and a playground user calling the same question get the
// same answer (and citations).

export async function askContextLayer(input: AskToolInput): Promise<ToolTextResponse> {
  const canned = await getCannedQA();
  const match = matchAnswer(input.question, canned);

  if (!match.matched) {
    const prompts = await getSuggestedPrompts();
    const top = prompts
      .slice(0, 3)
      .map((p) => `  - ${p.text}`)
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `${match.content}\n\nSuggested starter questions:\n${top}`,
        },
      ],
    };
  }

  const citationsText = formatCitationsByKind(match.citations);

  return {
    content: [
      { type: "text", text: match.content },
      { type: "text", text: citationsText },
    ],
  };
}

// Phase 18: group citations by kind so an external agent can decide which
// references to pull next. Order: wiki → code → file (most readable first).
function formatCitationsByKind(
  citations: ReadonlyArray<{
    id: string;
    kind: "wiki" | "code" | "file";
    anchor: string;
    label: string;
    repoId?: string;
    path?: string;
    lineRange?: [number, number];
  }>,
): string {
  if (citations.length === 0) return "Citations: (none)";
  const order: Array<"wiki" | "code" | "file"> = ["wiki", "code", "file"];
  const titleByKind: Record<"wiki" | "code" | "file", string> = {
    wiki: "Wiki references",
    code: "Code references",
    file: "File references",
  };
  let counter = 1;
  const sections: string[] = [];
  for (const kind of order) {
    const subset = citations.filter((c) => c.kind === kind);
    if (subset.length === 0) continue;
    const lines = subset.map((c) => {
      const where =
        c.kind === "code" && c.repoId && c.path
          ? `${c.repoId}/${c.path}${c.lineRange ? `:${c.lineRange[0]}-${c.lineRange[1]}` : ""}`
          : c.anchor;
      return `[${counter++}] ${c.label} — ${where}`;
    });
    sections.push(`${titleByKind[kind]}:\n${lines.join("\n")}`);
  }
  return `Citations\n\n${sections.join("\n\n")}`;
}
