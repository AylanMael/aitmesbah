import type { Metadata } from "next";
import Link from "next/link";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import "./peabody.css";

const source = "https://collections.peabody.harvard.edu/objects/details/125189";
export const metadata: Metadata = {
  title: "Un pichet portant la mention Aït Mesbah — Peabody Museum",
  description: "Une notice du Peabody Museum de Harvard mentionne Ait Mesbah sur l’étiquette d’un pichet kabyle. Description, référence et pistes de recherche.",
  alternates: { canonical: "/histoire-memoire/archives/pichet-ait-mesbah-peabody" },
};

export default function PeabodyArchivePage() {
  return <><SiteHeaderClient /><main className="village-archive-page peabody-archive" id="contenu-principal">
    <header className="village-archive-hero">
      <div><Link href="/histoire-memoire#archives">← Retour aux archives</Link><p className="eyebrow light">Objet & collection · Date non renseignée</p><h1>Un pichet,<br /><em>la trace d’un village</em></h1></div>
      <p>Dans le catalogue du Peabody Museum de Harvard, un pichet kabyle porte une mention qui nous rapproche de son histoire : « Ait Mesbah ».</p>
    </header>

    <section className="peabody-reference" aria-labelledby="peabody-reference-title">
      <div><p className="eyebrow">Peabody Museum · Harvard</p><h2 id="peabody-reference-title">Aït Mesbah dans une collection muséale</h2><p>Notice d’objet · Référence <strong>975-32-50/11891</strong></p></div>
      <div><p>La capture ci-dessous réunit la photographie du pichet et les informations de sa notice, dont la mention « Ait Mesbah ».</p><a href={source} target="_blank" rel="noreferrer">Consulter la notice originale <span aria-hidden="true">↗</span></a><small>Source : Peabody Museum of Archaeology & Ethnology, Harvard. Capture de consultation du 12 septembre 2026.</small></div>
    </section>
    <div id="capture-notice">
      <ImageArchiveViewer src="/archives/peabody/notice-125189.jpg" alt="Capture du catalogue du Peabody Museum : photographie du pichet, inventaire 975-32-50/11891 et étiquette mentionnant Ait Mesbah" title="La notice du musée · photographie et étiquette" aspectRatio="1425 / 1177" />
      <p className="peabody-capture-credit">Source : Peabody Museum of Archaeology & Ethnology, Harvard — notice 125189. Capture non retouchée. <a href={source} target="_blank" rel="noreferrer">Voir la source ↗</a> · Autorisation de reproduction non obtenue à ce jour.</p>
    </div>

    <section className="village-archive-reading"><div><p className="eyebrow">Lire l’objet</p><h2>De la terre, une anse et des décors</h2></div><div><p className="village-archive-lead">Le catalogue décrit un pichet en céramique beige, orné de lignes et de points rouges et noirs, avec une anse plate.</p><p>Ses dimensions sont de 20,6 × 17,3 × 14 cm. La notice le classe dans les collections ethnographiques, sous la culture « Kabylie », avec l’Algérie pour provenance géographique.</p><p><a href={source} target="_blank" rel="noreferrer">Source : notice du Peabody Museum ↗</a></p></div></section>

    <section className="village-archive-reading"><div><p className="eyebrow">Le lien avec le village</p><h2>Un nom sur l’étiquette</h2></div><div><p className="village-archive-lead">La transcription de l’étiquette comporte deux fois « Ait Mesbah ».</p><p>C’est le lien documentaire retenu ici. Cette mention ne suffit pas, à elle seule, à établir le lieu de fabrication, l’identité de la personne qui a façonné le pichet ou son parcours jusqu’au musée.</p><p>Le champ géographique complémentaire mentionne également « Sahara ». Nous signalons cette entrée sans la transformer en preuve d’une provenance précise.</p></div></section>

    <section className="village-archive-metadata"><p className="eyebrow">Repères de consultation</p><dl>
      <div><dt>Institution</dt><dd>Peabody Museum of Archaeology & Ethnology, Harvard</dd></div>
      <div><dt>Numéro d’inventaire</dt><dd>975-32-50/11891</dd></div>
      <div><dt>Titre du catalogue</dt><dd lang="en">Earthenware pitcher</dd></div>
      <div><dt>Traduction</dt><dd>Pichet en terre cuite</dd></div>
      <div><dt>Datation</dt><dd>Non renseignée dans la notice consultée</dd></div>
      <div><dt>Identifiant de la notice</dt><dd>125189</dd></div>
    </dl></section>

    <section className="village-archive-reading"><div><p className="eyebrow">Une histoire à poursuivre</p><h2>Retrouver le parcours du pichet</h2></div><div><p className="village-archive-lead">Qui l’a façonné ? Quand et dans quelles circonstances a-t-il rejoint la collection ?</p><p>La notice consultée ne permet pas de répondre à ces questions. Les dossiers d’acquisition et la lecture des inscriptions pourraient apporter de nouveaux repères.</p><p>Aucun lien n’est établi avec Hiani Debia ni avec les photographies de 1939. Ces documents peuvent être regardés ensemble pour nourrir la recherche, mais restent deux dossiers distincts.</p><p><Link href="/histoire-memoire/archives/hiani-debia-1939">Découvrir le reportage photographique de 1939 →</Link></p><p><Link href="/artisanat/poterie">Explorer le savoir-faire de la poterie →</Link></p><p><Link href="/contribuer?category=photographs_archives&title=Informations%20sur%20le%20pichet%20Peabody%20975-32-50%2F11891">Apporter une information sur cet objet →</Link></p></div></section>

    <section className="village-archive-reading" id="source"><div><p className="eyebrow">Source & reproduction</p><h2>Une notice, pas une attribution définitive</h2></div><div><p>Cette fiche propose une synthèse française du catalogue, consulté le 12 septembre 2026. La capture présente l’état visible de la notice à cette date ; elle ne remplace pas le catalogue du musée, qui peut évoluer.</p><p><a href={source} target="_blank" rel="noreferrer">Consulter la source originale ↗</a></p><p>La présence de la capture ne constitue pas une autorisation de réutilisation. Aucun accord de reproduction du musée n’a été obtenu à ce jour. <a href="https://peabody.harvard.edu/rights-and-reproductions" target="_blank" rel="noreferrer">Droits et reproductions ↗</a></p></div></section>
  </main><SiteFooter /></>;
}
