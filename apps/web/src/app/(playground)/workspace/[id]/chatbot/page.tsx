import { FullChatbot } from "@/components/playground/chatbot/full-chatbot";
import { connection } from "next/server";

export default async function ChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return <FullChatbot workspaceId={id} />;
}
