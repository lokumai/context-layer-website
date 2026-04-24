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

  const citationsText =
    match.citations.length > 0
      ? match.citations.map((c, i) => `[${i + 1}] ${c.kind} · ${c.label} · ${c.anchor}`).join("\n")
      : "(no citations)";

  return {
    content: [
      { type: "text", text: match.content },
      { type: "text", text: `Citations:\n${citationsText}` },
    ],
  };
}
