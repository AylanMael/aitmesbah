import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Carte territoriale du douar des Beni Aïssi — 1892",
  description: "Notice documentaire et reproduction d’une carte territoriale de 1892 où figure Aït Mesbah.",
  alternates: { canonical: "/histoire-memoire/archives/carte-territoriale-1892" },
};

export default function MapArchivePage() {
  return <><SiteHeaderClient /><main className="village-archive-page">
    <header className="village-archive-hero"><div><Link href="/histoire-memoire#archives">← Retour aux archives</Link><p className="eyebrow light">Archive du village · Pièce 001</p><h1>Carte territoriale<br/><em>de 1892</em></h1></div><p>Une représentation du douar des Beni Aïssi qui permet de replacer Aït Mesbah dans son environnement territorial à la fin du XIXe siècle.</p></header>
    <section className="village-archive-document" aria-labelledby="archive-document-title"><div className="village-archive-image"><a href="/archives/village/carte-ait-mesbah-1892.webp" target="_blank" rel="noreferrer"><Image src="/archives/village/carte-ait-mesbah-1892.webp" alt="Reproduction complète de la carte territoriale de 1892" fill priority sizes="(max-width: 900px) 100vw, 65vw" /></a></div><div className="village-archive-tools"><p id="archive-document-title">Document original</p><a href="/archives/village/carte-ait-mesbah-1892.webp" target="_blank" rel="noreferrer">Agrandir en haute définition ↗</a></div></section>
    <section className="village-archive-reading"><div><p className="eyebrow">Notice documentaire</p><h2>Ce que cette carte nous permet de lire</h2></div><div><p className="village-archive-lead">Le document porte les mentions « Tribu des Beni Aïssi » et « Douar Beni Aïssi ». Il représente un espace territorial plus large qu’Aït Mesbah et conserve la logique administrative et graphique de son époque.</p><p>On y distingue des tracés de chemins, des limites, des cours d’eau, des groupements d’habitations et plusieurs noms de lieux. Aït Mesbah apparaît dans la partie orientale de la carte. Une étude détaillée permettra de comparer ces indications avec les cartes actuelles, la mémoire des habitants et les documents fonciers.</p><aside><strong>Précaution de lecture</strong><p>Cette première notice décrit uniquement les éléments visibles. La cote, le service producteur, la date exacte d’établissement et le contexte administratif doivent encore être confirmés à partir de la source originale.</p></aside></div></section>
    <section className="village-archive-metadata"><p className="eyebrow">Fiche de la pièce</p><dl><div><dt>Date portée ou associée</dt><dd>1892</dd></div><div><dt>Type</dt><dd>Carte territoriale</dd></div><div><dt>Territoire</dt><dd>Douar des Beni Aïssi</dd></div><div><dt>Langue</dt><dd>Français</dd></div><div><dt>Provenance</dt><dd>À documenter</dd></div><div><dt>Statut éditorial</dt><dd>Notice provisoire</dd></div></dl></section>
    <section className="village-archive-callout"><p className="eyebrow light">Enquête collective</p><h2>Vous reconnaissez un lieu,<br/>un nom ou un ancien chemin&nbsp;?</h2><p>Votre lecture peut aider à préciser la carte. Indiquez la zone concernée et, si possible, la source de votre information.</p><Link className="primary" href="/contribuer?category=documentary_correction&title=Lecture%20de%20la%20carte%20de%201892">Apporter une précision <span aria-hidden="true">↗</span></Link></section>
  </main><SiteFooter /></>;
}
