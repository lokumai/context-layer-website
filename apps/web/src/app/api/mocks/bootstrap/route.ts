import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bootstrapPayload } from "@/lib/hydration/bootstrap";
import { isPersonaId } from "@/lib/personas";

// Persona-filtered state snapshot. Single point of branching — consumers
// (the HydrationProvider) are persona-agnostic.

export async function GET() {
  const session = await auth();
  const personaId = session?.user?.personaId;
  if (!personaId || !isPersonaId(personaId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await bootstrapPayload(personaId);
  return NextResponse.json({ personaId, payload });
}
