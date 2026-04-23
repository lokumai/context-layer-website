import { NextResponse } from "next/server";
import {
  getCoverage,
  getDependencies,
  getHealth,
  getKnowledgeGraph,
  getSecurity,
} from "@context-layer/mocks";
import { auth } from "@/auth";

// Narrow fetch — returns the full Intelligence dataset regardless of persona.
// Used by Configure's "Generate Intelligence" flow so the partial persona can
// populate the intelligence slice without touching bootstrap.

export async function GET() {
  const session = await auth();
  if (!session?.user?.personaId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [health, security, coverage, dependencies, knowledgeGraph] = await Promise.all([
    getHealth(),
    getSecurity(),
    getCoverage(),
    getDependencies(),
    getKnowledgeGraph(),
  ]);

  return NextResponse.json({ health, security, coverage, dependencies, knowledgeGraph });
}
