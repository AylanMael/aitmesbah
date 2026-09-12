import type {Metadata} from "next";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import CraftSection from "@/components/home/CraftSection";
import "./artisanat.css";

export const metadata: Metadata = {title:"Artisanat & savoir-faire — Aït Mesbah",description:"Poterie, robe kabyle, tapisserie et burnous : découvrir et transmettre les savoir-faire d’Aït Mesbah.",alternates:{canonical:"/artisanat"}};

export default function ArtisanatPage() {
  return <><SiteHeaderClient/><main className="craft-page" id="contenu-principal">
    <header className="craft-hero"><p className="craft-label">Artisanat · Aït Mesbah</p><h1>Ce que les mains<br/><em>gardent vivant.</em></h1><p>Un village se raconte aussi dans la terre travaillée, une robe cousue et la laine devenue burnous. À Aït Mesbah, ces métiers font partie de notre histoire et de ce que nous voulons transmettre.</p><a className="craft-link" href="#metiers">Rencontrer les savoir-faire <span aria-hidden="true">↓</span></a><span className="craft-hero-word" aria-hidden="true">MATIÈRES</span></header>
    <div id="metiers"><CraftSection/></div>
    <section className="craft-manifesto"><div><p className="craft-label">Au-delà des objets</p><h2>Faire une place<br/>à celles et ceux<br/><em>qui savent faire.</em></h2></div><div><p>Une poterie ne se résume pas à son décor. Une robe ne se résume pas à ses couleurs. Un burnous ne se résume pas à sa matière.</p><p>Il y a derrière eux du temps, des apprentissages et des personnes. Nous voulons raconter ces métiers à hauteur d’atelier : les gestes, les outils, les souvenirs et les envies de transmettre.</p><Link className="craft-link" href="/contribuer">Faire connaître une artisane ou un artisan <span aria-hidden="true">↗</span></Link></div></section>
    <section className="craft-invitation"><p className="craft-label">Une mémoire à partager</p><h2>Un objet. Un geste.<br/>Une personne à faire connaître.</h2><p>Vous pratiquez l’un de ces métiers, connaissez une artisane ou un artisan, ou conservez un objet de famille ? Aidez-nous à raconter cette histoire avec des photographies, des souvenirs et des mots justes.</p><Link className="craft-link" href="/contribuer">Partager un savoir-faire <span aria-hidden="true">↗</span></Link></section>
  </main><SiteFooter/></>;
}
