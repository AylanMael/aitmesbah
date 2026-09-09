export const agendaCategories = [
  { key: "collective", number: "01", name: "Vie collective", description: "Réunions, concertations et initiatives", mark: "◌" },
  { key: "culture", number: "02", name: "Culture", description: "Mémoire, transmission et rencontres", mark: "✦" },
  { key: "sport", number: "03", name: "Sport", description: "ASAM, JCAM et jeunesse", mark: "◇" },
  { key: "solidarity", number: "04", name: "Solidarité", description: "Entraide et actions citoyennes", mark: "＋" },
] as const;

export type AgendaCategory = typeof agendaCategories[number]["key"];
export type PublicEventStatus = "scheduled" | "postponed" | "cancelled";

export type PublicEvent = {
  slug: string;
  title: string;
  summary: string;
  category: AgendaCategory;
  startsAt: string;
  endsAt?: string;
  location: string;
  organizer: string;
  status: PublicEventStatus;
  publishedAt: string;
  updatedAt: string;
  sourceLabel: string;
  contactLabel?: string;
  image?: string;
};

/*
 * Registre initial utilisé au rendu statique. Le CRM écrit séparément sa
 * projection publique : seuls les contenus validés et explicitement publiés
 * peuvent atteindre la collection publique.
 */
export const publicEvents: readonly PublicEvent[] = [];

export function getPublicEvent(slug: string) {
  return publicEvents.find(event => event.slug === slug);
}

export function getUpcomingPublicEvents(reference = new Date()) {
  return [...publicEvents]
    .filter(event => event.status !== "cancelled" && new Date(event.endsAt ?? event.startsAt) >= reference)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
