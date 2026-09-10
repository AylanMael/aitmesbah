import "server-only";

import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";

export type PublicContentKind = "article" | "news" | "archive" | "photo";
export type PublicContent = {
  publicationId: string;
  contributionId: string;
  kind: PublicContentKind;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  primaryAssetId: string | null;
  primaryAssetMimeType: string | null;
  publishedAt: string;
  updatedAt: string;
};

function dateValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString();
  return "";
}

function projection(data: FirebaseFirestore.DocumentData): PublicContent | null {
  const kinds = new Set<PublicContentKind>(["article", "news", "archive", "photo"]);
  if (data.status !== "published" || data.schemaVersion !== 1 || !kinds.has(data.kind)) return null;
  const required = [data.publicationId, data.contributionId, data.slug, data.title, data.summary, data.body, data.category];
  if (required.some((value) => typeof value !== "string" || !value.trim())) return null;
  const publishedAt = dateValue(data.publishedAt), updatedAt = dateValue(data.updatedAt);
  if (!publishedAt || !updatedAt) return null;
  return { publicationId: data.publicationId, contributionId: data.contributionId, kind: data.kind, slug: data.slug, title: data.title, summary: data.summary, body: data.body, category: data.category, primaryAssetId: typeof data.primaryAssetId === "string" ? data.primaryAssetId : null, primaryAssetMimeType: typeof data.primaryAssetMimeType === "string" ? data.primaryAssetMimeType : null, publishedAt, updatedAt };
}

export async function loadPublicContents(kind?: PublicContentKind) {
  try {
    const { database } = getLocalFirebaseAdmin();
    const snapshot = await database.collection("publicContents").where("status", "==", "published").limit(100).get();
    return snapshot.docs.map((document) => projection(document.data())).filter((item): item is PublicContent => Boolean(item)).filter((item) => !kind || item.kind === kind).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch {
    return [];
  }
}

export async function loadPublicContent(slug: string) {
  const contents = await loadPublicContents();
  return contents.find((item) => item.slug === slug) ?? null;
}
