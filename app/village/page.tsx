import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Découvrir Aït Mesbah — Village de Haute Kabylie",
  description:
    "Découvrez Aït Mesbah, village de la commune d’Ath Douala en Kabylie : son territoire, son artisanat, sa vie associative et ses principaux repères.",
  alternates: { canonical: "/village" },
};

const landmarks = [
  ["Commune", "Ath Douala"], ["Wilaya", "Tizi Ouzou"],
  ["Pays", "Algérie"], ["Région", "Kabylie"],
  ["Superficie estimée", "Environ 8 km²"],
  ["Altitude", "Approximativement de 500 à 820 mètres"],
  ["Point culminant", "Ikhf Ouguemoune"],
  ["Population résidente estimée", "Près de 4 000 habitants"],
  ["Communauté estimée en incluant les personnes établies hors du village", "Environ 6 000 personnes"],
];

const districts = ["Aït Moussa", "Aït Salah", "Tanajelt", "Tassast", "Lakouyathe", "Timizart Oussamer", "El Hammam", "Ighil Oussamer", "Ighil Hamou"];
const tableOfContents = [["Territoire", "territoire"], ["Quartiers", "quartiers"], ["Repères", "reperes"], ["Savoir-faire", "savoir-faire"], ["Vie collective", "vie-collective"], ["Amar Imache", "amar-imache"], ["Origine du nom", "origine-nom"]];

function ChapterHeading({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <div className="village-section-heading"><span className="village-chapter-number" aria-hidden="true">{number}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

export default function VillagePage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="village-page" tabIndex={-1}>
      <header id="accueil" className="village-hero">
        <div className="village-hero-copy">
          <p className="eyebrow light">Découvrir le village</p>
          <h1>Découvrir Aït Mesbah</h1>
          <p className="village-identity-line">At Mesbaḥ <span aria-hidden="true">·</span> Ath Douala <span aria-hidden="true">·</span> Haute Kabylie</p>
          <p className="village-lead">Aït Mesbah, appelé At Mesbaḥ en kabyle, est un village de Kabylie situé dans la commune d’Ath Douala, au sein de la wilaya de Tizi Ouzou, en Algérie.</p>
          <p>Établi sur les reliefs de Haute Kabylie, le village se distingue par son histoire, ses traditions artisanales et la vitalité des liens qui unissent ses habitants, au village comme au sein de la diaspora. Aït Mesbah est notamment associé à la couture de la robe kabyle, à la poterie et à la mémoire d’Amar Imache, figure importante du mouvement national algérien.</p>
        </div>
        <div className="village-hero-visual"><div className="village-hero-photo"><Image src="/ait-mesbah-village.jpg" alt="Vue de Tanajelt à Aït Mesbah" fill sizes="(max-width: 800px) 100vw, 44vw" priority /></div><span className="village-hero-motif" aria-hidden="true">ⵣ</span></div>
      </header>

      <nav className="village-toc" aria-label="Sommaire de la page"><span className="village-toc-label">Sur cette page</span><ol>{tableOfContents.map(([label, id], index) => <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol></nav>

      <section id="territoire" className="village-section village-territory">
        <ChapterHeading number="01" eyebrow="Géographie" title="Un village établi sur les reliefs de Haute Kabylie" />
        <div className="village-territory-content">
          <div className="village-prose"><p>Aït Mesbah se trouve à environ 23 kilomètres au sud de la ville de Tizi Ouzou. Son territoire couvre approximativement 8 km² et s’étend sur un relief composé de crêtes, avec une altitude comprise entre environ 500 et 820 mètres.</p><p>Le point culminant du village est Ikhf Ouguemoune. Tanajelt constitue également l’un des repères importants du territoire, sans en être le point le plus élevé.</p></div>
          <div className="village-boundaries"><h3>Autour du village</h3><dl><div><dt>Au sud</dt><dd>Taguemount Oukerrouche</dd></div><div><dt>Au nord</dt><dd>Tighzert et Ihasnaouene</dd></div><div><dt>À l’ouest</dt><dd>La commune d’Ath Zmenzer</dd></div><div><dt>À l’est</dt><dd>Thaddarth Oufella, Ath Douala-centre, Ath Bouayahia et Icherdiouène</dd></div></dl></div>
        </div>
        <p className="village-note">Les délimitations, les distances et certaines graphies seront affinées à partir de documents cartographiques et de contributions locales validées.</p>
      </section>

      <section className="village-map-section" aria-labelledby="village-map-title">
        <div className="village-map-copy">
          <p className="eyebrow">Situer Aït Mesbah</p>
          <h2 id="village-map-title">Au cœur des reliefs d’Ath Douala</h2>
          <p>La carte permet de situer le village dans son environnement immédiat, au sud de Tizi Ouzou et à proximité des localités qui l’entourent.</p>
          <dl className="village-coordinates">
            <div><dt>Latitude</dt><dd>36.61233° N</dd></div>
            <div><dt>Longitude</dt><dd>4.06181° E</dd></div>
          </dl>
          <a className="village-map-link" href="https://www.openstreetmap.org/?mlat=36.61233&mlon=4.06181#map=14/36.61233/4.06181" target="_blank" rel="noreferrer">Ouvrir la carte détaillée <span aria-hidden="true">↗</span></a>
        </div>
        <div className="village-map-frame">
          <iframe title="Carte OpenStreetMap centrée sur Aït Mesbah" src="https://www.openstreetmap.org/export/embed.html?bbox=4.03181%2C36.58733%2C4.09181%2C36.63733&layer=mapnik&marker=36.61233%2C4.06181" loading="lazy" />
          <span className="village-map-attribution">© contributeurs OpenStreetMap</span>
        </div>
      </section>

      <section id="quartiers" className="village-districts village-section">
        <ChapterHeading number="02" eyebrow="Le village habité" title="Un village composé de plusieurs quartiers" />
        <div className="village-prose"><p>Aït Mesbah est constitué de plusieurs quartiers et ensembles d’habitations répartis sur son territoire. Leur implantation, plus ou moins dispersée, reflète la géographie du village et son développement au fil du temps.</p><ol className="district-list">{districts.map((district, index) => <li key={district}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{district}</li>)}</ol><p className="village-note">La graphie, les limites et la présentation historique de ces quartiers seront progressivement précisées avec les habitants et les personnes ressources du village.</p></div>
      </section>

      <section className="village-gallery" aria-labelledby="village-gallery-title">
        <div className="village-gallery-heading">
          <p className="eyebrow">Regards sur le village</p>
          <h2 id="village-gallery-title">Tanajelt, entre habitat et paysage</h2>
          <p>Une même vue, observée à différentes échelles, révèle la silhouette du village, le tissu des habitations et la présence de la végétation.</p>
        </div>
        <div className="village-gallery-grid">
          <figure className="village-gallery-main"><Image src="/ait-mesbah-village.jpg" alt="Vue d’ensemble de Tanajelt à Aït Mesbah" fill sizes="(max-width: 800px) 100vw, 58vw" /><figcaption><span>01</span> Vue d’ensemble</figcaption></figure>
          <figure className="village-gallery-detail village-gallery-roofs"><Image src="/ait-mesbah-village.jpg" alt="Détail des habitations de Tanajelt à Aït Mesbah" fill sizes="(max-width: 800px) 100vw, 28vw" /><figcaption><span>02</span> Le village habité</figcaption></figure>
          <figure className="village-gallery-detail village-gallery-landscape"><Image src="/ait-mesbah-village.jpg" alt="Détail du paysage autour de Tanajelt à Aït Mesbah" fill sizes="(max-width: 800px) 100vw, 28vw" /><figcaption><span>03</span> Relief et végétation</figcaption></figure>
        </div>
        <p className="village-gallery-credit">Photographie : vue de Tanajelt à Aït Mesbah.</p>
      </section>

      <section id="reperes" className="village-facts">
        <div className="village-facts-intro"><p className="eyebrow">Repères essentiels</p><h2>Aït Mesbah en quelques repères</h2></div>
        <dl>{landmarks.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
        <p className="village-note">Les données démographiques et géographiques présentées ici sont des estimations communautaires. Elles seront progressivement rapprochées de sources officielles ou documentaires.</p>
      </section>

      <section id="savoir-faire" className="village-section village-craft">
        <ChapterHeading number="03" eyebrow="Savoir-faire" title="Artisanat et transmission" />
        <div className="village-prose"><p>Aït Mesbah est depuis longtemps associé à différents métiers artisanaux. La couture, notamment celle de la robe kabyle, ainsi que la poterie occupent une place importante dans la mémoire économique et culturelle du village.</p><p>Ces savoir-faire témoignent du rôle des artisanes et des artisans dans la transmission des formes, des motifs et des techniques propres à la culture kabyle. Cette rubrique pourra progressivement accueillir des portraits, des photographies d’objets, des récits d’ateliers et des témoignages sur l’évolution de ces métiers.</p><ul className="village-keywords"><li>Couture de la robe kabyle</li><li>Poterie</li><li>Transmission des gestes et des motifs</li></ul></div>
      </section>

      <section id="vie-collective" className="village-section village-community">
        <ChapterHeading number="04" eyebrow="Vie collective" title="Une vie associative à documenter" />
        <div className="village-prose"><p>La vie collective du village s’appuie sur ses habitantes et habitants, son comité de village et différentes structures associatives.</p><p>Parmi les organisations connues figurent notamment :</p><ul className="village-organizations"><li>l’Association sportive d’Aït Mesbah, l’ASAM ;</li><li>sa section de judo ;</li><li>l’association culturelle Amar Imache.</li></ul><p className="village-note">Cette première présentation ne constitue pas encore un annuaire exhaustif. Les associations, leurs responsables et leurs activités pourront être présentés dans une rubrique dédiée après validation des informations par chaque organisation.</p></div>
      </section>

      <section id="amar-imache" className="village-imache">
        <ChapterHeading number="05" eyebrow="Une personnalité du village" title="Amar Imache et le mouvement national" />
        <div className="village-imache-content"><div className="village-prose"><p className="village-pullquote">Aït Mesbah est le village natal d’Amar Imache, personnalité importante du mouvement national algérien.</p><p>Il a notamment exercé les fonctions de secrétaire général de l’Étoile nord-africaine et participé à la défense du droit des Algériens à disposer d’eux-mêmes.</p><p>Son parcours politique, intellectuel et militant mérite une page documentaire distincte, fondée sur des archives et des sources historiques clairement identifiées. La présente page se limite à introduire son lien avec le village.</p></div><div className="village-documentary-axes"><h3>Futurs axes documentaires</h3><ul><li>sa naissance et son enfance à Aït Mesbah ;</li><li>son parcours migratoire et professionnel ;</li><li>son engagement dans l’Étoile nord-africaine ;</li><li>sa participation au journal El Ouma ;</li><li>sa pensée politique ;</li><li>son héritage dans l’histoire nationale et dans la mémoire du village.</li></ul></div></div>
      </section>

      <section id="origine-nom" className="village-oral-history">
        <ChapterHeading number="06" eyebrow="Tradition orale" title="L’origine du nom" />
        <div className="village-prose"><p>Selon une tradition orale rapportée localement, le nom du village serait associé à un premier habitant appelé Yahya ou Mesbah.</p><p>Cette origine n’étant pas encore établie par une source historique suffisamment précise, elle ne doit pas être présentée comme un fait certain. Elle pourra être étudiée à partir de témoignages, d’archives, de travaux historiques et de recherches linguistiques.</p></div>
      </section>

      <section className="village-conclusion"><p className="eyebrow">Documenter et transmettre</p><h2>Une connaissance à construire collectivement</h2><p>Cette page constitue une première présentation d’Aït Mesbah. Elle sera progressivement complétée par des documents, des photographies, des cartes, des témoignages et des informations validées par les habitants, les associations et les personnes ressources du village.</p><p>L’objectif n’est pas de figer l’histoire d’Aït Mesbah, mais de construire un espace documentaire fiable, accessible et respectueux de celles et ceux qui la transmettent.</p><div className="village-actions"><Link className="primary" href="/#memoire">Explorer l’histoire et la mémoire<span aria-hidden="true">↗</span></Link><Link className="village-secondary-link" href="/contribuer">Comment contribuer</Link></div></section>
    </main>
    <SiteFooter />
  </>;
}
