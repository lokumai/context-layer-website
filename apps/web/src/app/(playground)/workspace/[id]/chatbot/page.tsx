"use client";

import { useParams } from "next/navigation";
import { FullChatbot } from "@/components/playground/chatbot/full-chatbot";

export default function ChatbotPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  if (!id) return null;
  return <FullChatbot workspaceId={id} />;
}
