import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Vivre au village — Aït Mesbah",
  description: "Actualités, rendez-vous, initiatives et vie collective à Aït Mesbah.",
  alternates: { canonical: "/vivre" },
};

const sections = [
  ["Actualités", "actualites"],
  ["Agenda", "agenda-village"],
  ["Vie collective", "vie-collective"],
  ["Repères utiles", "reperes-utiles"],
] as const;

export default function LiveInVillagePage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="live-page" tabIndex={-1}>
      <header className="live-hero">
        <div className="live-hero-copy">
          <p className="eyebrow light">Le village au présent</p>
          <h1>Vivre au village</h1>
          <p className="live-hero-lead">Les nouvelles, les rendez-vous et les initiatives qui font vivre Aït Mesbah au quotidien.</p>
          <p className="live-hero-note">Cette page grandira avec les informations transmises et validées par les habitants, le comité du village et les associations.</p>
        </div>
        <div className="live-hero-word" aria-hidden="true"><span>ICI</span><i>ⵣ</i></div>
      </header>

      <nav className="live-toc" aria-label="Sommaire de la page">
        <span>Parcourir la page</span>
        <ol>{sections.map(([label, id], index) => <li key={id}><a href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol>
      </nav>

      <section className="live-intro">
        <p className="eyebrow">Une mémoire du présent</p>
        <h2>Le quotidien fait aussi l’histoire du village</h2>
        <p>Une réunion, une fête, une réussite sportive, un chantier collectif ou une initiative culturelle racontent Aït Mesbah autant que ses archives. Cet espace a vocation à conserver la trace de cette vie commune, avec simplicité et justesse.</p>
      </section>

      <section id="actualites" className="live-news">
        <div className="live-section-heading"><p className="eyebrow">Actualités du village</p><h2>Ce qui se vit aujourd’hui</h2></div>
        <div className="live-awaiting"><span aria-hidden="true">01</span><div><p className="live-awaiting-title">Les premières nouvelles seront bientôt publiées</p><p>Les informations seront datées, vérifiées et accompagnées de leur source afin de proposer un fil d’actualité utile à toute la communauté.</p></div><Link href="/contribuer">Proposer une information <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section id="agenda-village" className="live-agenda">
        <div><p className="eyebrow light">Agenda</p><h2>Les prochains rendez-vous</h2><p>Réunions, activités associatives, événements culturels et sportifs pourront être annoncés ici après confirmation des organisateurs.</p></div>
        <div className="live-agenda-empty"><span aria-hidden="true">À venir</span><p>Aucun événement confirmé n’est encore publié.</p><small>Les dates apparaîtront ici dans l’ordre chronologique.</small></div>
      </section>

      <section id="vie-collective" className="live-community">
        <div className="live-section-heading"><p className="eyebrow">Initiatives</p><h2>Une énergie collective</h2></div>
        <div className="live-community-content"><p>La vie du village repose sur l’engagement de ses habitantes et habitants, de son comité et de ses structures associatives. Cet espace présentera progressivement leurs activités, leurs rendez-vous et leurs projets.</p><ul><li id="comite-village"><Link href="/comite-village"><span>01</span><strong>Comité du village</strong><small>Dialogue et initiatives collectives</small></Link></li><li id="asam"><Link href="/asam"><span>02</span><strong>Association sportive ASAM</strong><small>Football, jeunesse et palmarès</small></Link></li><li id="jcam"><Link href="/jcam"><span>03</span><strong>Club de judo JCAM</strong><small>Pratique, formation et rencontres sportives</small></Link></li><li id="imache-amar"><Link href="/association-imache-amar"><span>04</span><strong>Association culturelle Imache Amar</strong><small>Culture, jeunesse et mémoire</small></Link></li></ul><p className="live-caution">Chaque structure sera présentée plus précisément après validation de ses informations et avec son accord.</p></div>
      </section>

      <section id="reperes-utiles" className="live-practical">
        <div><p className="eyebrow light">Au quotidien</p><h2>Des repères utiles, réunis avec soin</h2></div>
        <div><p>Contacts associatifs, services, transports, informations communales et numéros utiles pourront être rassemblés ici lorsqu’ils auront été vérifiés et qu’une autorisation de publication aura été obtenue.</p><p className="live-practical-note">Aucune coordonnée personnelle ne sera publiée sans l’accord explicite de la personne ou de la structure concernée.</p></div>
      </section>

      <section className="live-conclusion">
        <p className="eyebrow">Faire circuler l’information</p>
        <h2>Une nouvelle à partager avec le village&nbsp;?</h2>
        <p>Signalez une initiative, un rendez-vous ou une information utile. Chaque proposition sera vérifiée avant sa publication.</p>
        <div className="live-actions"><Link className="primary" href="/contribuer">Contribuer <span aria-hidden="true">↗</span></Link><Link href="/village">Découvrir Aït Mesbah</Link></div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
