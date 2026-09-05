import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Association culturelle Imache Amar — Aït Mesbah",
  description: "Histoire, mémoire et projet de relance de l’Association culturelle Imache Amar d’Aït Mesbah.",
  alternates: { canonical: "/association-imache-amar" },
};

const eras = [
  ["Années 1970", "Les premiers élans", "L’association prend forme dans un village porté par l’envie de créer, de transmettre et d’offrir à la jeunesse un espace d’expression."],
  ["Fin des années 1980", "Une reconnaissance officielle", "L’obtention de l’agrément donne à l’association un cadre officiel et ouvre une nouvelle étape de son développement."],
  ["Années 1990", "L’âge d’or", "Une période de forte activité culturelle, de rencontres et d’engagement collectif qui demeure un repère dans la mémoire du village."],
  ["Depuis les années 2000", "Des cycles successifs", "Plusieurs bureaux se succèdent. L’association connaît des reprises, des ralentissements et des périodes de moindre activité."],
  ["Aujourd’hui", "Une énergie à réveiller", "L’association est en retrait, mais son histoire, ses espaces et le besoin exprimé par la jeunesse rendent sa relance possible et nécessaire."],
] as const;

const culturalActions = [
  ["Ateliers", "Langue, patrimoine, arts, lecture, théâtre, musique, écriture et pratiques numériques."],
  ["Rencontres", "Débats, conférences, projections, hommages et échanges entre générations."],
  ["Mémoire", "Collecte d’archives, témoignages, photographies et récits liés au village et à Amar Imache."],
  ["Jeunesse", "Accompagnement de projets portés par les jeunes et création d’occasions de prendre des responsabilités."],
  ["Village", "Fêtes, expositions, actions citoyennes et rendez-vous capables de réunir les familles et les quartiers."],
  ["Diaspora", "Initiatives communes et transmission culturelle aux nouvelles générations établies loin d’Aït Mesbah."],
] as const;

const restartSteps = ["Écouter les attentes", "Réunir les volontaires", "Définir un projet", "Rouvrir les activités", "Installer la continuité"] as const;

export default function ImacheAmarAssociationPage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient />
    <main id="contenu-principal" className="imache-assoc-page" tabIndex={-1}>
      <header className="imache-assoc-hero"><div className="imache-assoc-hero-copy"><p className="eyebrow light">Culture · Mémoire · Jeunesse</p><h1>Association<br/>Imache Amar</h1><p>Une histoire culturelle à préserver. Une énergie collective à réveiller.</p></div><div className="imache-assoc-emblem" aria-hidden="true"><span>ⵣ</span><i>Créer · Transmettre · Rassembler</i></div></header>

      <nav className="imache-assoc-toc" aria-label="Sommaire de la page"><span>Parcourir la page</span><ol><li><a href="#histoire"><span>01</span>Histoire</a></li><li><a href="#age-or"><span>02</span>Âge d’or</a></li><li><a href="#aujourdhui"><span>03</span>Aujourd’hui</a></li><li><a href="#lieux"><span>04</span>Lieux</a></li><li><a href="#relance"><span>05</span>Relance</a></li></ol></nav>

      <section id="histoire" className="imache-assoc-intro"><div><p className="eyebrow">Une association pionnière</p><h2>Plus d’un demi-siècle d’engagement culturel</h2></div><div><p className="imache-assoc-lead">Créée dans les années 1970 et agréée vers la fin des années 1980, l’Association culturelle Imache Amar accompagne depuis plusieurs générations la vie culturelle d’Aït Mesbah.</p><p>Son parcours n’a pas été linéaire. Des bureaux et des équipes bénévoles se sont succédé, avec des périodes d’intense activité et d’autres plus fragiles. Cette histoire faite de hauts et de bas témoigne surtout d’une capacité à renaître lorsque les habitants se mobilisent.</p><aside>Les dates précises, la composition des premiers bureaux et les principales activités seront complétées à partir des statuts, archives et témoignages de l’association.</aside></div></section>

      <section className="imache-assoc-timeline" aria-label="Repères historiques"><div>{eras.map(([period, title, text], index) => <article id={index === 2 ? "age-or" : index === 4 ? "aujourdhui" : undefined} key={period}><span>{String(index + 1).padStart(2, "0")}</span><small>{period}</small><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="imache-assoc-golden"><div><p className="eyebrow light">Les années 1990</p><h2>Quand la culture mettait le village en mouvement</h2></div><div><p className="imache-assoc-golden-lead">Cette décennie demeure dans les mémoires comme l’âge d’or de l’association : une période où les activités, les rencontres et l’engagement des bénévoles créaient une dynamique visible dans tout le village.</p><p>Retrouver cet élan ne signifie pas reproduire le passé. Il s’agit d’en retrouver l’esprit : donner aux jeunes un cadre, faire circuler les idées, créer des occasions de se rencontrer et transformer les talents individuels en énergie collective.</p><blockquote>La nostalgie devient utile lorsqu’elle inspire une nouvelle génération.</blockquote></div></section>

      <section className="imache-assoc-actions"><div className="imache-assoc-heading"><p className="eyebrow">Un projet culturel vivant</p><h2>Ce que l’association peut à nouveau rendre possible</h2><p>Une programmation régulière, même modeste, peut recréer des habitudes, révéler des talents et renforcer les liens entre les habitants.</p></div><div className="imache-assoc-action-grid">{culturalActions.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section id="lieux" className="imache-assoc-places"><div><p className="eyebrow light">Des lieux pour faire</p><h2>Un patrimoine culturel à habiter</h2><p>Une association vivante a besoin de lieux ouverts, identifiables et accueillants. Aït Mesbah dispose aujourd’hui de points d’appui qui peuvent devenir complémentaires.</p></div><div className="imache-assoc-place-grid"><article><span>01</span><small>Équipement municipal</small><h3>Bibliothèque Mouloud Feraoun</h3><p>Récemment inaugurée, la bibliothèque municipale peut devenir un lieu majeur de lecture, d’apprentissage, de rencontres et d’ouverture pour les jeunes.</p></article><article><span>02</span><small>Mémoire associative</small><h3>Le siège de l’association</h3><p>Le siège peut retrouver sa fonction de maison culturelle : un lieu où préparer les activités, accueillir les habitants et conserver les archives de l’association.</p></article></div></section>

      <section id="relance" className="imache-assoc-restart"><div><p className="eyebrow">Sortir de la léthargie</p><h2>Relancer sans brûler les étapes</h2><p>La relance doit être collective, réaliste et durable. Elle peut commencer par quelques rendez-vous réguliers, un projet clair et une équipe capable de transmettre progressivement les responsabilités.</p></div><ol>{restartSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol></section>

      <section className="imache-assoc-call"><p className="eyebrow light">Un appel aux énergies</p><h2>La jeunesse du village mérite une association culturelle à la hauteur de ses talents</h2><p>Anciens membres, jeunes, parents, artistes, enseignants, associations et diaspora peuvent contribuer à écrire une nouvelle étape, chacun selon son temps et ses possibilités.</p><div><Link className="primary" href="/agir">Participer à la relance <span aria-hidden="true">↗</span></Link><Link href="/contribuer">Partager une archive de l’association</Link></div></section>
    </main><SiteFooter />
  </>;
}
