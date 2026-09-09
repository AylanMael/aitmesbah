import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { agendaCategories, publicEvents } from "@/data/public-agenda";
import { loadPublicEvent } from "@/lib/public-events-server";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publicEvents.map(event => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await loadPublicEvent((await params).slug);
  if (!event) return { title: "Rendez-vous introuvable — Aït Mesbah" };
  return { title: `${event.title} — Agenda d’Aït Mesbah`, description: event.summary, alternates: { canonical: `/agenda/${event.slug}` } };
}

export default async function EventPage({ params }: Props) {
  const event = await loadPublicEvent((await params).slug);
  if (!event) notFound();
  const category = agendaCategories.find(item => item.key === event.category);
  const start = new Date(event.startsAt);
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(start);
  const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(start);
  const structuredData = { "@context": "https://schema.org", "@type": "Event", name: event.title, description: event.summary, startDate: event.startsAt, endDate: event.endsAt, eventStatus: event.status === "cancelled" ? "https://schema.org/EventCancelled" : event.status === "postponed" ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled", location: { "@type": "Place", name: event.location, address: "Aït Mesbah, Aït Douala, Tizi Ouzou, Algérie" }, organizer: { "@type": "Organization", name: event.organizer } };

  return <><SiteHeaderClient /><main className="agenda-detail"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} /><header><Link href="/agenda">← Retour à l’agenda</Link><p className="eyebrow light">{category?.name}</p><h1>{event.title}</h1><p>{event.summary}</p></header><section><aside><time dateTime={event.startsAt}><strong>{start.getDate().toString().padStart(2, "0")}</strong><span>{new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(start)}</span></time><dl><div><dt>Date</dt><dd>{date}</dd></div><div><dt>Heure</dt><dd>{time}</dd></div><div><dt>Lieu</dt><dd>{event.location}</dd></div><div><dt>Organisation</dt><dd>{event.organizer}</dd></div></dl></aside><article><p className="eyebrow">Informations</p><h2>Tout savoir avant de venir</h2><p>{event.summary}</p><footer><span>Source&nbsp;: {event.sourceLabel}</span><span>Dernière vérification&nbsp;: {new Intl.DateTimeFormat("fr-FR").format(new Date(event.updatedAt))}</span></footer></article></section><section className="agenda-detail-call"><p className="eyebrow">Faire circuler</p><h2>Une précision ou une modification&nbsp;?</h2><p>Signalez un changement de lieu, d’horaire ou toute information utile. La correction sera vérifiée avant publication.</p><Link href={`/contribuer?category=events_village_life&title=${encodeURIComponent(`Correction · ${event.title}`)}#envoyer`}>Signaler une modification <span aria-hidden="true">↗</span></Link></section></main><SiteFooter /></>;
}
