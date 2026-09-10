import { NextResponse } from "next/server";

import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const { database, bucket } = getLocalFirebaseAdmin();
    const publications = await database.collection("publicContents").where("slug", "==", slug).where("status", "==", "published").limit(1).get();
    if (publications.empty) return new NextResponse("Introuvable", { status: 404 });
    const publication = publications.docs[0].data();
    if (typeof publication.primaryAssetId !== "string") return new NextResponse("Aucun média", { status: 404 });
    const asset = await database.doc(`contributions/${publication.contributionId}/assets/${publication.primaryAssetId}`).get();
    const data = asset.data();
    if (!asset.exists || data?.status !== "validated" || typeof data.storagePath !== "string") return new NextResponse("Média indisponible", { status: 404 });
    const [buffer] = await bucket.file(data.storagePath).download();
    return new NextResponse(new Uint8Array(buffer).buffer, { headers: { "Content-Type": data.detectedMimeType || "application/octet-stream", "Cache-Control": "public, max-age=3600, s-maxage=86400", "X-Content-Type-Options": "nosniff", "Content-Disposition": "inline" } });
  } catch {
    return new NextResponse("Média indisponible", { status: 404 });
  }
}
