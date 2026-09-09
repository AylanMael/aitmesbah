import { NextResponse } from "next/server";

import { loadPublicEvents } from "@/lib/public-events-server";

const HEADERS = { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300", "Content-Type": "application/json; charset=utf-8" };

export async function GET() {
  return NextResponse.json({ events: await loadPublicEvents() }, { headers: HEADERS });
}
