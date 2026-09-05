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

const villageForces = [
  { number: "01", href: "/comite-village", icon: "⌂", title: "Comité du village", kicker: "Représenter · coordonner", text: "Un espace de dialogue, de concertation et d’organisation au service de la vie commune." },
  { number: "02", href: "/asam", icon: "football", title: "Association sportive ASAM", kicker: "Football · jeunesse", text: "Les couleurs jaune et noir, une histoire sportive et une énergie qui rassemble les générations." },
  { number: "03", href: "/jcam", icon: "柔", title: "Club de judo JCAM", kicker: "Discipline · transmission", text: "Former par le sport, transmettre le respect et accompagner les jeunes vers l’excellence." },
  { number: "04", href: "/association-imache-amar", icon: "✦", title: "Association culturelle Imache Amar", kicker: "Culture · mémoire", text: "Créer, transmettre et retisser les liens autour de la culture et des initiatives de la jeunesse." },
] as const;

function ForceIcon({ icon }: { icon: string }) {
  if (icon === "football") return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14"/><path d="m20 14 5 3.7-1.9 5.9h-6.2L15 17.7 20 14Zm0 0v-8m5 11.7 7.7-2.5m-9.6 8.4 4.8 6.6m-11-6.6-4.8 6.6M15 17.7l-7.7-2.5M12.1 30.2l-1.5 3m17.3-3 1.5 3"/></svg>;
  return <>{icon}</>;
}

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
        <div className="live-community-heading">
          <p className="eyebrow light">Les forces du village</p>
          <h2>Une énergie<br /><em>collective</em></h2>
          <p>Le village vit par celles et ceux qui donnent du temps, transmettent une expérience et font naître des projets.</p>
        </div>
        <div className="live-community-content">
          <p className="live-community-lead">Comité, sport et culture composent une même maison commune. Chacun agit à sa manière, avec une ambition partagée&nbsp;: créer du lien et préparer l’avenir d’Aït Mesbah.</p>
          <div className="live-community-grid">
            {villageForces.map((item) => <article id={item.href.slice(1)} key={item.href}>
              <Link href={item.href}>
                <header><span>{item.number}</span><i aria-hidden="true"><ForceIcon icon={item.icon} /></i></header>
                <small>{item.kicker}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <b>Découvrir <span aria-hidden="true">↗</span></b>
              </Link>
            </article>)}
          </div>
          <p className="live-caution">Ces espaces évolueront avec les informations, les rendez-vous et les projets transmis par chaque structure.</p>
        </div>
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
