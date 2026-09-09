"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { PublicEvent } from "@/data/public-agenda";
import { agendaCategories } from "@/data/public-agenda";
import { usePublicEvents } from "./usePublicEvents";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

export default function AgendaExplorer({ events }: { events: readonly PublicEvent[] }) {
  const [category, setCategory] = useState<string>("all");
  const publishedEvents = usePublicEvents(events);
  const visible = useMemo(() => category === "all" ? publishedEvents : publishedEvents.filter(event => event.category === category), [category, publishedEvents]);

  return <section id="prochains-rendez-vous" className="agenda-premium-stage" aria-labelledby="agenda-stage-title">
    <aside><p className="eyebrow light">Explorer</p><h2>Les rendez-vous<br />par univers</h2><nav aria-label="Filtrer l’agenda"><button className={category === "all" ? "active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}><span>00</span><i aria-hidden="true">•</i><strong>Tout l’agenda</strong><small>{publishedEvents.length ? `${publishedEvents.length} rendez-vous publiés` : "Les publications à venir"}</small></button>{agendaCategories.map(item => <button className={category === item.key ? "active" : ""} aria-pressed={category === item.key} onClick={() => setCategory(item.key)} key={item.key}><span>{item.number}</span><i aria-hidden="true">{item.mark}</i><strong>{item.name}</strong><small>{item.description}</small></button>)}</nav></aside>
    <div className="agenda-premium-board">
      <header><div><span>Prochains rendez-vous</span><strong>{category === "all" ? "Agenda ouvert" : agendaCategories.find(item => item.key === category)?.name}</strong></div><small>Mis à jour après confirmation</small></header>
      {visible.length ? <div className="agenda-event-list">{visible.map(event => <article className={`is-${event.status}`} key={event.slug}><time dateTime={event.startsAt}><strong>{new Date(event.startsAt).getDate().toString().padStart(2, "0")}</strong><span>{new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(event.startsAt))}</span></time><div><small>{agendaCategories.find(item => item.key === event.category)?.name} · {event.status === "postponed" ? "Reporté" : event.status === "cancelled" ? "Annulé" : "Confirmé"}</small><h2><Link href={`/agenda/${event.slug}`}>{event.title}</Link></h2><p>{event.summary}</p><dl><div><dt>Date</dt><dd>{dateFormat.format(new Date(event.startsAt))} · {timeFormat.format(new Date(event.startsAt))}</dd></div><div><dt>Lieu</dt><dd>{event.location}</dd></div><div><dt>Organisation</dt><dd>{event.organizer}</dd></div></dl><Link href={`/agenda/${event.slug}`}>Voir le rendez-vous <span aria-hidden="true">→</span></Link></div></article>)}</div> : <div className="agenda-premium-empty"><time aria-hidden="true"><span>—</span><small>À venir</small></time><div><p className="eyebrow">Première édition</p><h2 id="agenda-stage-title">Le prochain rendez-vous commence peut-être avec vous</h2><p>{category === "all" ? "Aucun événement n’est encore confirmé. Dès qu’une date, un lieu et un organisateur auront été vérifiés, l’annonce apparaîtra ici avec toutes les informations utiles." : `Aucun rendez-vous « ${agendaCategories.find(item => item.key === category)?.name} » n’est publié pour le moment.`}</p></div></div>}
      {!visible.length && <><div className="agenda-premium-requirements" aria-label="Informations attendues"><span>Date & heure</span><span>Lieu</span><span>Organisateur</span><span>Public concerné</span></div><Link href="/contribuer?category=events_village_life&title=Proposition%20d’événement#envoyer">Proposer le premier rendez-vous <span aria-hidden="true">↗</span></Link></>}
    </div>
  </section>;
}
