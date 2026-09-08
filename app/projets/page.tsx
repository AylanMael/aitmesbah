import type { Metadata } from "next";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import ProjectBoard from "@/components/projects/ProjectBoard";

export const metadata: Metadata = { title: "Projets du village — Aït Mesbah", description: "Les besoins, idées et initiatives d’Aït Mesbah présentés avec méthode et transparence.", alternates: { canonical: "/projets" } };
export default function ProjectsPage(){return <><a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient/><main id="contenu-principal" className="projects-page" tabIndex={-1}>
  <header className="projects-hero"><div><p className="eyebrow light">Le chantier commun</p><h1>Des idées aux<br/><em>actions utiles</em></h1><p>Un espace transparent pour écouter les besoins, réunir les bonnes volontés et suivre ce qui avance réellement.</p></div><div className="projects-hero-rule"><span>Écouter</span><i>→</i><span>Construire</span><i>→</i><span>Rendre compte</span></div></header>
  <section className="projects-intro"><div><p className="eyebrow">Tableau des initiatives</p><h2>Voir où en est chaque sujet</h2></div><p>Ces cartes ne valent ni décision du comité ni promesse de réalisation. Elles rendent visibles des besoins et des pistes afin que les personnes concernées puissent les préciser, les contester ou les faire progresser.</p></section>
  <section className="projects-list"><ProjectBoard/></section>
  <section className="projects-charter"><div><p className="eyebrow light">La règle du jeu</p><h2>Pas de projet sans clarté</h2></div><ol><li><span>01</span><p>Un besoin clairement décrit.</p></li><li><span>02</span><p>Des personnes concernées écoutées.</p></li><li><span>03</span><p>Des moyens et responsabilités identifiés.</p></li><li><span>04</span><p>Un avancement rendu public.</p></li></ol></section>
  <section className="projects-call"><p className="eyebrow">Faire émerger l’utile</p><h2>Vous voyez un besoin concret&nbsp;?</h2><p>Décrivez le lieu, les personnes concernées et ce qui pourrait constituer une première étape raisonnable.</p><Link className="primary" href="/contribuer?category=events_village_life&title=Proposition de projet pour le village#envoyer">Proposer un projet <span aria-hidden="true">↗</span></Link></section>
  </main><SiteFooter/></>}
