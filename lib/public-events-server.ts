import "server-only";

import { getPublicEvent, publicEvents, type PublicEvent } from "@/data/public-agenda";
import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";

function dateValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString();
  return "";
}

function publicProjection(data: FirebaseFirestore.DocumentData): PublicEvent | null {
  const categories = new Set(["collective", "culture", "sport", "solidarity"]);
  const eventStatuses = new Set(["scheduled", "postponed", "cancelled"]);
  if (data.kind !== "event" || data.status !== "published" || data.schemaVersion !== 1 || !categories.has(data.category) || !eventStatuses.has(data.eventStatus)) return null;
  const required = [data.slug, data.title, data.summary, data.location, data.organizer, data.sourceLabel];
  if (required.some(value => typeof value !== "string" || !value.trim())) return null;
  const startsAt = dateValue(data.startsAt), publishedAt = dateValue(data.publishedAt), updatedAt = dateValue(data.updatedAt);
  if (!startsAt || !publishedAt || !updatedAt) return null;
  return { slug: data.slug, title: data.title, summary: data.summary, category: data.category, startsAt, endsAt: dateValue(data.endsAt) || undefined, location: data.location, organizer: data.organizer, status: data.eventStatus, publishedAt, updatedAt, sourceLabel: data.sourceLabel, contactLabel: typeof data.contactLabel === "string" ? data.contactLabel : undefined, image: typeof data.image === "string" ? data.image : undefined };
}

export async function loadPublicEvents() {
  try {
    const { database } = getLocalFirebaseAdmin();
    const snapshot = await database.collection("publicEvents").where("status", "==", "published").limit(100).get();
    return snapshot.docs.map(document => publicProjection(document.data())).filter((event): event is PublicEvent => Boolean(event)).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  } catch {
    return [...publicEvents];
  }
}

export async function loadPublicEvent(slug: string) {
  const events = await loadPublicEvents();
  return events.find(event => event.slug === slug) ?? getPublicEvent(slug);
}
