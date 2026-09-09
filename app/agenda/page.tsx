import type { Metadata } from "next";
import Link from "next/link";

import AgendaExplorer from "@/components/agenda/AgendaExplorer";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import { getUpcomingPublicEvents } from "@/data/public-agenda";

export const metadata: Metadata = {
  title: "Agenda du village — Aït Mesbah",
  description: "Les rendez-vous, activités associatives et événements culturels et sportifs d’Aït Mesbah.",
  alternates: { canonical: "/agenda" },
};

const publicationPrinciples = [
  ["Confirmé", "La date, le lieu et l’organisateur sont vérifiés avant publication."],
  ["Compréhensible", "Les informations essentielles restent visibles immédiatement."],
  ["À jour", "Tout report, changement ou annulation est signalé clairement."],
] as const;

export default function AgendaPage() {
  const events = getUpcomingPublicEvents();
  const currentYear = new Date().getFullYear();
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="agenda-page agenda-premium" tabIndex={-1}>
      <header className="agenda-premium-hero">
        <div className="agenda-premium-copy">
          <p className="eyebrow light">Le village se retrouve</p>
          <h1>Le temps<br /><em>du village</em></h1>
          <p>Réunions, activités associatives, rencontres sportives et rendez-vous culturels&nbsp;: un même calendrier pour rester reliés à Aït Mesbah.</p>
          <a href="#prochains-rendez-vous">Voir les rendez-vous <span aria-hidden="true">↓</span></a>
        </div>
        <div className="agenda-premium-calendar" aria-hidden="true"><span>Agenda</span><strong>{currentYear}</strong><div><i>Village</i><b>À venir</b></div></div>
        <span className="agenda-premium-word" aria-hidden="true">ENSEMBLE</span>
      </header>

      <section className="agenda-premium-opening" aria-labelledby="agenda-opening-title">
        <div><p className="eyebrow">Un calendrier commun</p><h2 id="agenda-opening-title">Savoir ce qui se passe.<br /><em>Savoir où se retrouver.</em></h2></div>
        <p>Cette page réunit les rendez-vous confirmés du village dans une présentation simple, fiable et accessible aux habitants comme aux personnes vivant loin d’Aït Mesbah.</p>
      </section>

      <AgendaExplorer events={events} />

      <section className="agenda-premium-trust" aria-labelledby="agenda-trust-title"><header><p className="eyebrow">Notre engagement</p><h2 id="agenda-trust-title">Un agenda utile inspire confiance</h2><p>Chaque publication doit permettre de décider rapidement&nbsp;: venir, participer, transmettre l’information ou proposer son aide.</p></header><div>{publicationPrinciples.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="agenda-premium-publish"><div><p className="eyebrow light">Faire circuler l’information</p><h2>Un rendez-vous<br />à faire connaître&nbsp;?</h2></div><div><p>Comité, associations, groupes de jeunes et organisateurs peuvent transmettre une annonce. Un visuel n’est pas obligatoire&nbsp;: des informations précises suffisent pour commencer.</p><ul><li>Date et horaires confirmés</li><li>Lieu précis</li><li>Structure organisatrice</li><li>Contact officiel</li></ul><Link href="/contribuer?category=events_village_life&title=Annonce%20pour%20l’agenda#envoyer">Soumettre une annonce <span aria-hidden="true">↗</span></Link></div></section>

      <section className="agenda-premium-footer"><p className="eyebrow">Le village au présent</p><h2>Les rendez-vous passent.<br />Leur énergie demeure.</h2><p>Retrouvez également les nouvelles, les structures et les initiatives qui font vivre Aït Mesbah au quotidien.</p><Link href="/vivre">Découvrir la vie du village <span aria-hidden="true">→</span></Link></section>
    </main>
    <SiteFooter />
  </>;
}
