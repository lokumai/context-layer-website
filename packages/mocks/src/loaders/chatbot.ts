import type { CannedQAPair, SuggestedPrompt } from "../types";
import { readJSON } from "./_fs";

interface PromptsFile {
  prompts: SuggestedPrompt[];
}

interface QAFile {
  pairs: CannedQAPair[];
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  const f = await readJSON<PromptsFile>("chatbot/suggested-prompts.json");
  return f.prompts;
}

export async function getCannedQA(): Promise<CannedQAPair[]> {
  const f = await readJSON<QAFile>("chatbot/canned-qa.json");
  return f.pairs;
}
