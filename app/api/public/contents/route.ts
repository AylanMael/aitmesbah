import { NextResponse } from "next/server";

import { loadPublicContents, type PublicContentKind } from "@/lib/public-contents-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const allowed = new Set(["article", "news", "archive", "photo"]);
  const contents = await loadPublicContents(allowed.has(kind ?? "") ? kind as PublicContentKind : undefined);
  return NextResponse.json({ contents }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
