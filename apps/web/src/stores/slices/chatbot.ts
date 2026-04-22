import type { StateCreator } from "zustand";
import type { AppState, ChatbotSlice } from "../types";

export const createChatbotSlice: StateCreator<AppState, [], [], ChatbotSlice> = () => ({
  suggestedPrompts: [],
  cannedQA: [],
  threads: [],
});
