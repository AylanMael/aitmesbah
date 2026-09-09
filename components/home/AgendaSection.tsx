"use client";

import Link from "next/link";
import { agendaCategories, publicEvents } from "@/data/public-agenda";
import { usePublicEvents } from "@/components/agenda/usePublicEvents";

export default function AgendaSection() {
  const events = usePublicEvents(publicEvents);
  const nextEvent = getUpcomingPublicEventsFrom(events)[0];
  return (
    <section id="agenda" className="agenda section-pad">
      <div className="agenda-heading">
        <p className="eyebrow light">À vos agendas</p>
        <h2>Les prochains rendez-vous</h2>
        <p className="agenda-intro">
          Réunions, rencontres sportives, initiatives culturelles et temps
          forts de la vie collective.
        </p>
        <Link className="agenda-all-link" href="/agenda">
          Voir tout l’agenda <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="agenda-board">
        <div className="agenda-status"><span aria-hidden="true">{nextEvent ? new Date(nextEvent.startsAt).getDate().toString().padStart(2, "0") : "—"}</span><div><small>{nextEvent ? agendaCategories.find(item => item.key === nextEvent.category)?.name : "Agenda du village"}</small><strong>{nextEvent?.title ?? "Aucun rendez-vous confirmé pour le moment"}</strong></div></div>
        <p>{nextEvent ? `${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(nextEvent.startsAt))} · ${nextEvent.location} · ${nextEvent.organizer}` : "Les prochains événements seront publiés ici après confirmation de leur date, de leur lieu et de leur organisation."}</p>
        <ul aria-label="Catégories de l’agenda">
          <li><span>01</span>Vie collective</li>
          <li><span>02</span>Sport</li>
          <li><span>03</span>Culture</li>
        </ul>
        <Link className="agenda-submit-link" href={nextEvent ? `/agenda/${nextEvent.slug}` : "/contribuer?category=events_village_life&title=Proposition%20d’événement#envoyer"}>
          {nextEvent ? "Voir le rendez-vous" : "Proposer un événement"} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

function getUpcomingPublicEventsFrom(events: typeof publicEvents) {
  const now = new Date();
  return [...events].filter(event => event.status !== "cancelled" && new Date(event.endsAt ?? event.startsAt) >= now).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
