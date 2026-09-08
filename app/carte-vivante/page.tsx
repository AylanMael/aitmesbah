import type { Metadata } from "next";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import VillageAtlas from "@/components/village/VillageAtlas";

export const metadata: Metadata = { title: "Carte vivante d’Aït Mesbah", description: "Un atlas participatif des quartiers, lieux, récits et mémoires d’Aït Mesbah.", alternates: { canonical: "/carte-vivante" } };

export default function LivingMapPage() { return <><a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient/><main id="contenu-principal" className="atlas-page" tabIndex={-1}>
  <header className="atlas-hero"><p className="eyebrow light">Territoire · mémoire · habitants</p><h1>La carte<br/><em>vivante</em> du village</h1><p>Un atlas appelé à relier chaque quartier à ses noms de lieux, ses photographies, ses récits et celles et ceux qui en gardent la mémoire.</p><span aria-hidden="true">ⵣ</span></header>
  <section className="atlas-intro"><div><p className="eyebrow">Atlas participatif</p><h2>Commencer par les quartiers principaux</h2></div><p>Cette première vue n’invente ni limites ni positions exactes. Elle organise la collecte. La géographie précise sera construite progressivement à partir des habitants, des cartes et des sources vérifiées.</p></section>
  <section className="atlas-stage"><VillageAtlas/></section>
  <section className="atlas-method"><div><p className="eyebrow light">Construire avec justesse</p><h2>Du souvenir transmis<br/>au lieu documenté</h2></div><ol><li><span>01</span><strong>Nommer</strong><p>Recueillir les noms employés par les habitants.</p></li><li><span>02</span><strong>Localiser</strong><p>Comparer les indications et les sources disponibles.</p></li><li><span>03</span><strong>Raconter</strong><p>Relier lieux, images, personnes et événements.</p></li><li><span>04</span><strong>Valider</strong><p>Signaler ce qui est établi, transmis ou incertain.</p></li></ol></section>
  <section className="atlas-call"><p className="eyebrow">Votre quartier, votre mémoire</p><h2>Quel lieu faudrait-il faire apparaître en premier&nbsp;?</h2><p>Une fontaine, un chemin, une maison ancienne, un espace collectif ou un nom presque oublié peut devenir le premier repère documenté.</p><Link className="primary" href="/contribuer?category=places_heritage&title=Un lieu à ajouter à la carte vivante#envoyer">Proposer un lieu <span aria-hidden="true">↗</span></Link></section>
  </main><SiteFooter/></> }
