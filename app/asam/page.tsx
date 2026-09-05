import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "ASAM — Football à Aït Mesbah",
  description: "L’histoire de l’ASAM, équipe de football d’Aït Mesbah lancée en 1973, son palmarès, ses couleurs et son projet pour la jeunesse.",
  alternates: { canonical: "/asam" },
};

const honours = [
  ["1990", "Championne de la région", "Une victoire devenue un repère majeur de la mémoire sportive du village."],
  ["1993", "Championne — juniors", "Une génération de jeunes porte les couleurs d’Aït Mesbah jusqu’au titre."],
  ["1998", "Championne — juniors", "Un nouveau sacre qui confirme la qualité de la formation et de la relève."],
  ["2006", "Finaliste", "L’équipe atteint une nouvelle finale et rassemble le village autour de son parcours."],
  ["2026", "Finaliste", "Plus d’un demi-siècle après ses débuts, l’ASAM continue de représenter Aït Mesbah."],
] as const;

const needs = [
  ["Un terrain adapté", "Un espace sûr, régulier et accessible pour permettre aux jeunes de s’entraîner dans de bonnes conditions."],
  ["Une structure durable", "Des statuts, une organisation claire, des éducateurs accompagnés et une continuité entre les générations."],
  ["Une école de football", "Un cadre progressif pour accueillir les enfants, transmettre les fondamentaux et faire grandir les talents."],
  ["Une mobilisation commune", "Habitants, anciens joueurs, diaspora, associations et partenaires réunis autour d’un projet réaliste."],
] as const;

function AsamJersey() {
  return <svg className="asam-jersey" viewBox="0 0 360 390" role="img" aria-label="Maillot jaune et noir de l’ASAM">
    <defs><pattern id="asam-pixels" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#111512"/><rect x="7" y="7" width="7" height="7" fill="#111512"/></pattern><clipPath id="asam-body"><path d="M104 52 151 29h58l47 23 70 35-34 72-42-19v215H110V140l-42 19-34-72 70-35Z"/></clipPath></defs>
    <path d="M104 52 151 29h58l47 23 70 35-34 72-42-19v215H110V140l-42 19-34-72 70-35Z" fill="#efc629" stroke="#e7bd1d" strokeWidth="3"/>
    <g clipPath="url(#asam-body)"><path d="M47 80 111 47l30 17-13 21-29-10-53 28Z" fill="#111512"/><path d="m313 80-64-33-30 17 13 21 29-10 53 28Z" fill="#111512"/><path d="M132 48h22v95h-22zM170 48h20v95h-20zM208 48h22v95h-22z" fill="#111512"/><path d="M120 83h120v58H120z" fill="url(#asam-pixels)" opacity=".96"/><path d="M132 278h22v90h-22zM170 278h20v90h-20zM208 278h22v90h-22z" fill="#111512"/><path d="M120 277h120v55H120z" fill="url(#asam-pixels)" opacity=".96"/></g>
    <path d="M151 29c5 31 53 31 58 0" fill="#111512"/><path d="M158 31c6 18 38 18 44 0" fill="#efc629"/>
    <g fill="#111512" textAnchor="middle"><text x="180" y="191" fontFamily="Georgia,serif" fontSize="19" fontWeight="700">ASAM</text><text x="180" y="246" fontFamily="Arial,sans-serif" fontSize="9" letterSpacing="3">AÏT MESBAH</text></g>
    <image href="/logo-ait-mesbah.webp" x="160" y="196" width="40" height="40" preserveAspectRatio="xMidYMid meet" style={{ filter: "brightness(0)" }} aria-hidden="true" />
  </svg>;
}

export default function AsamPage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient />
    <main id="contenu-principal" className="asam-page" tabIndex={-1}>
      <header className="asam-hero"><div className="asam-hero-copy"><p className="eyebrow">Football · Aït Mesbah</p><h1>ASAM</h1><p>Depuis 1973, une équipe, deux couleurs et la fierté de représenter tout un village.</p></div><div className="asam-jersey-showcase"><AsamJersey/><span>Le maillot du village</span><i>Jaune · Noir</i></div></header>

      <nav className="asam-toc" aria-label="Sommaire de la page"><span>Parcourir la page</span><ol><li><a href="#histoire"><span>01</span>Histoire</a></li><li><a href="#couleurs"><span>02</span>Identité</a></li><li><a href="#palmares"><span>03</span>Palmarès</a></li><li><a href="#stade"><span>04</span>Le stade</a></li><li><a href="#avenir"><span>05</span>Avenir</a></li></ol></nav>

      <section id="histoire" className="asam-origin"><div><p className="eyebrow">Depuis 1973</p><h2>L’équipe qui porte le nom du village</h2></div><div><p className="asam-lead">Lancée en 1973, l’ASAM représente Aït Mesbah lors des tournois intervillages. Match après match, elle fait vivre une histoire sportive partagée entre joueurs, dirigeants, bénévoles, familles et supporters.</p><p>Chaque génération reprend le maillot, défend les mêmes couleurs et ajoute ses souvenirs à ceux de ses aînés. L’équipe est ainsi devenue bien davantage qu’une formation de football : un lien entre les quartiers, les familles et les générations.</p><aside>Les noms des fondateurs, entraîneurs, joueurs et équipes successives seront ajoutés après vérification des archives et témoignages.</aside></div></section>

      <section id="couleurs" className="asam-identity"><div className="asam-stripes" aria-hidden="true"><span>JAUNE</span><span>NOIR</span></div><div><p className="eyebrow">Nos couleurs</p><h2>Deux couleurs.<br/>Une seule équipe.</h2><p>Le jaune porte l’énergie, la jeunesse et l’élan. Le noir affirme la détermination et la force du collectif. Ensemble, ils rendent l’ASAM immédiatement reconnaissable sur tous les terrains.</p><blockquote>Porter le maillot, c’est représenter Aït Mesbah.</blockquote></div></section>

      <section className="asam-team-2026"><figure><Image src="/images/asam-2026-finaliste.jpg" alt="L’équipe de l’ASAM, finaliste en 2026, entourée de son encadrement et de ses supporters" fill sizes="100vw" priority={false}/><figcaption><span>ASAM · 2026</span><strong>L’équipe finaliste</strong><small>Une génération, un maillot, tout un village derrière elle.</small></figcaption></figure></section>

      <section id="palmares" className="asam-honours"><div className="asam-heading"><p className="eyebrow">Mémoire des compétitions</p><h2>Des générations qui ont marqué l’histoire</h2><p>Ce premier palmarès rassemble les grands repères transmis par le club. Il pourra être enrichi par les feuilles de match, trophées, photographies et témoignages.</p></div><div className="asam-honours-list">{honours.map(([year, title, text], index) => <article key={year}><span>{String(index + 1).padStart(2, "0")}</span><strong>{year}</strong><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section id="stade" className="asam-stadium"><div><p className="eyebrow">Une nécessité pour la jeunesse</p><h2>Donner enfin un terrain à nos ambitions</h2><p className="asam-lead">Pour former, jouer et progresser durablement, les jeunes d’Aït Mesbah ont besoin d’un stade adapté, sûr et accessible.</p><p>Construire cet équipement ne répondrait pas seulement à un besoin sportif. Ce serait créer un lieu de rencontre, d’éducation, de santé et de cohésion pour l’ensemble du village.</p></div><div className="asam-pitch" aria-hidden="true"><span></span><i></i><b>Un stade<br/>pour demain</b></div></section>

      <section className="asam-project"><div className="asam-heading"><p className="eyebrow">Passer un cap</p><h2>De l’équipe intervillages à un club structuré</h2><p>La volonté de créer un véritable club peut donner à l’ASAM un cadre durable, capable de former les jeunes, d’organiser les responsabilités et de porter des projets sur plusieurs années.</p></div><div className="asam-needs">{needs.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section id="avenir" className="asam-future"><p className="eyebrow">Le prochain match se prépare aujourd’hui</p><h2>Faire grandir l’ASAM.<br/>Faire grandir nos jeunes.</h2><p>Les souvenirs et les trophées racontent le chemin parcouru. Le stade, la formation et la création d’un club structuré peuvent écrire la suite.</p><div><Link className="primary" href="/agir">Soutenir un projet collectif <span aria-hidden="true">↗</span></Link><Link href="/contribuer">Partager une archive de l’ASAM</Link></div></section>
    </main><SiteFooter />
  </>;
}
