import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Agenda du village — Aït Mesbah",
  description: "Les rendez-vous, activités associatives et événements culturels et sportifs d’Aït Mesbah.",
  alternates: { canonical: "/agenda" },
};

const categories = [
  ["Tous", "L’ensemble des rendez-vous"],
  ["Vie collective", "Réunions et initiatives du village"],
  ["Sport", "ASAM, JCAM et rencontres sportives"],
  ["Culture", "Transmission, mémoire et événements culturels"],
] as const;

export default function AgendaPage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="agenda-page" tabIndex={-1}>
      <header className="agenda-page-hero">
        <div><p className="eyebrow light">Le village se retrouve</p><h1>Agenda du village</h1><p>Réunions, activités associatives, rencontres sportives et rendez-vous culturels d’Aït Mesbah.</p></div>
        <time dateTime="2026">2026</time>
      </header>

      <section className="agenda-page-intro">
        <div><p className="eyebrow">Prochains rendez-vous</p><h2>À noter dans vos agendas</h2></div>
        <p>Chaque événement publié ici aura été confirmé par son organisateur. Les éventuelles modifications, reports ou annulations seront signalés clairement.</p>
      </section>

      <nav className="agenda-categories" aria-label="Catégories de l’agenda">
        <ul>{categories.map(([name, description], index) => <li key={name} className={index === 0 ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><small>{description}</small></li>)}</ul>
      </nav>

      <section className="agenda-empty" aria-labelledby="agenda-empty-title">
        <div className="agenda-empty-date" aria-hidden="true"><span>—</span><small>À venir</small></div>
        <div><p className="eyebrow">Agenda en préparation</p><h2 id="agenda-empty-title">Aucun événement confirmé pour le moment</h2><p>Les prochains rendez-vous seront publiés ici après validation de leur date, de leur lieu et de leur organisation.</p></div>
      </section>

      <section className="agenda-publish">
        <div><p className="eyebrow light">Organisateurs</p><h2>Faire connaître un rendez-vous</h2></div>
        <div><p>Le comité du village, les associations et les organisateurs peuvent proposer une information à publier. Merci d’indiquer la date, l’heure, le lieu, le public concerné et un contact officiel.</p><ul><li>Date et horaires confirmés</li><li>Lieu précis</li><li>Structure organisatrice</li><li>Visuel autorisé à la diffusion</li></ul><Link className="primary" href="/contribuer">Proposer un événement <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="agenda-page-conclusion"><p className="eyebrow">Vivre au village</p><h2>Retrouver aussi les nouvelles et les initiatives d’Aït Mesbah</h2><Link href="/vivre">Découvrir la vie du village <span aria-hidden="true">↗</span></Link></section>
    </main>
    <SiteFooter />
  </>;
}
