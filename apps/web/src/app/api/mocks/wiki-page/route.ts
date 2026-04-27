import { getWikiPage } from "@context-layer/mocks";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Narrow loader for individual wiki pages. The Wiki View page calls this
// lazily when the user clicks a repo + slug; pages aren't bundled into the
// hydration payload because there are dozens and most aren't viewed in a
// session.

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.personaId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const repoId = url.searchParams.get("repoId");
  const slug = url.searchParams.get("slug");
  if (!repoId || !slug) {
    return NextResponse.json(
      { error: "repoId and slug query params are required" },
      { status: 400 },
    );
  }

  try {
    const page = await getWikiPage(repoId, slug);
    return NextResponse.json({
      title: page.title,
      markdown: page.markdown,
      tokenCount: page.tokenCount,
    });
  } catch {
    return NextResponse.json({ error: `Wiki page not found: ${repoId}/${slug}` }, { status: 404 });
  }
}
