"use client";

import Link from "next/link";
import { agendaCategories, type PublicEvent } from "@/data/public-agenda";
import { usePublicEvents } from "./usePublicEvents";

export default function LiveAgendaPreview({ initial }: { initial: readonly PublicEvent[] }) {
  const events = usePublicEvents(initial);
  const nextEvent = events.find(event => event.status !== "cancelled" && new Date(event.endsAt ?? event.startsAt) >= new Date());
  return <div className="live-agenda-empty"><span aria-hidden="true">{nextEvent ? agendaCategories.find(item => item.key === nextEvent.category)?.name : "À venir"}</span><p>{nextEvent?.title ?? "Aucun événement confirmé n’est encore publié."}</p><small>{nextEvent ? `${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(nextEvent.startsAt))} · ${nextEvent.location}` : "Les dates apparaîtront ici dans l’ordre chronologique."}</small>{nextEvent && <Link href={`/agenda/${nextEvent.slug}`}>Voir le rendez-vous →</Link>}</div>;
}
