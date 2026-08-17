import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Découvrir Aït Mesbah — Village de Haute Kabylie",
  description:
    "Découvrez Aït Mesbah, village de la commune d’Ath Douala en Kabylie : son territoire, son artisanat, sa vie associative et ses principaux repères.",
  alternates: {
    canonical: "/village",
  },
};

const landmarks = [
  ["Commune", "Ath Douala"],
  ["Wilaya", "Tizi Ouzou"],
  ["Pays", "Algérie"],
  ["Région", "Kabylie"],
  ["Superficie estimée", "Environ 8 km²"],
  ["Altitude", "Approximativement de 500 à 820 mètres"],
  ["Point culminant", "Ikhf Ouguemoune"],
  ["Population résidente estimée", "Près de 4 000 habitants"],
  [
    "Communauté estimée en incluant les personnes établies hors du village",
    "Environ 6 000 personnes",
  ],
];

const districts = [
  "Aït Moussa",
  "Aït Salah",
  "Tanajelt",
  "Tassast",
  "Lakouyathe",
  "Timizart Oussamer",
  "El Hammam",
  "Ighil Oussamer",
  "Ighil Hamou",
];

export default function VillagePage() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">
        Aller au contenu principal
      </a>
      <SiteHeaderClient />
      <main id="contenu-principal" className="village-page" tabIndex={-1}>
        <header id="accueil" className="village-hero">
          <div className="village-hero-copy">
            <p className="eyebrow light">Le village</p>
            <h1>Découvrir Aït Mesbah</h1>
            <p className="village-lead">
              Aït Mesbah, appelé At Mesbaḥ en kabyle, est un village de Kabylie
              situé dans la commune d’Ath Douala, au sein de la wilaya de Tizi
              Ouzou, en Algérie.
            </p>
            <p>
              Établi sur les reliefs de Haute Kabylie, le village se distingue
              par son histoire, ses traditions artisanales et la vitalité des
              liens qui unissent ses habitants, au village comme au sein de la
              diaspora. Aït Mesbah est notamment associé à la couture de la
              robe kabyle, à la poterie et à la mémoire d’Amar Imache, figure
              importante du mouvement national algérien.
            </p>
          </div>
          <div className="village-hero-photo">
            <Image
              src="/ait-mesbah-village.jpg"
              alt="Vue de Tanajelt à Aït Mesbah"
              fill
              sizes="(max-width: 800px) 100vw, 46vw"
              priority
            />
          </div>
        </header>

        <section className="village-section village-geography">
          <div className="village-section-heading">
            <p className="eyebrow">Géographie</p>
            <h2>Un village établi sur les reliefs de Haute Kabylie</h2>
          </div>
          <div className="village-prose">
            <p>
              Aït Mesbah se trouve à environ 23 kilomètres au sud de la ville
              de Tizi Ouzou. Son territoire couvre approximativement 8 km² et
              s’étend sur un relief composé de crêtes, avec une altitude
              comprise entre environ 500 et 820 mètres.
            </p>
            <p>
              Le point culminant du village est Ikhf Ouguemoune. Tanajelt
              constitue également l’un des repères importants du territoire,
              sans en être le point le plus élevé.
            </p>
            <p>
              Le village est entouré notamment par Taguemount Oukerrouche au
              sud, Tighzert et Ihasnaouene au nord, la commune d’Ath Zmenzer à
              l’ouest, ainsi que Thaddarth Oufella, Ath Douala-centre, Ath
              Bouayahia et Icherdiouène à l’est.
            </p>
            <p className="village-note">
              Les délimitations, les distances et certaines graphies seront
              affinées à partir de documents cartographiques et de
              contributions locales validées.
            </p>

            <div className="village-subsection">
              <h3>Un village composé de plusieurs quartiers</h3>
              <p>
                Aït Mesbah est constitué de plusieurs quartiers et ensembles
                d’habitations répartis sur son territoire. Leur implantation,
                plus ou moins dispersée, reflète la géographie du village et
                son développement au fil du temps.
              </p>
              <ul className="district-list">
                {districts.map((district) => (
                  <li key={district}>{district}</li>
                ))}
              </ul>
              <p className="village-note">
                La graphie, les limites et la présentation historique de ces
                quartiers seront progressivement précisées avec les habitants
                et les personnes ressources du village.
              </p>
            </div>
          </div>
        </section>

        <section className="village-landmarks">
          <div className="village-section-heading">
            <p className="eyebrow">Repères</p>
            <h2>Aït Mesbah en quelques repères</h2>
          </div>
          <dl>
            {landmarks.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <p className="village-note">
            Les données démographiques et géographiques présentées ici sont
            des estimations communautaires. Elles seront progressivement
            rapprochées de sources officielles ou documentaires.
          </p>
        </section>

        <div className="village-editorial">
          <section className="village-section">
            <div className="village-section-heading">
              <p className="eyebrow">Savoir-faire</p>
              <h2>Artisanat et transmission</h2>
            </div>
            <div className="village-prose">
              <p>
                Aït Mesbah est depuis longtemps associé à différents métiers
                artisanaux. La couture, notamment celle de la robe kabyle,
                ainsi que la poterie occupent une place importante dans la
                mémoire économique et culturelle du village.
              </p>
              <p>
                Ces savoir-faire témoignent du rôle des artisanes et des
                artisans dans la transmission des formes, des motifs et des
                techniques propres à la culture kabyle. Cette rubrique pourra
                progressivement accueillir des portraits, des photographies
                d’objets, des récits d’ateliers et des témoignages sur
                l’évolution de ces métiers.
              </p>
            </div>
          </section>

          <section className="village-section">
            <div className="village-section-heading">
              <p className="eyebrow">Vie collective</p>
              <h2>Une vie associative à documenter</h2>
            </div>
            <div className="village-prose">
              <p>
                La vie collective du village s’appuie sur ses habitantes et
                habitants, son comité de village et différentes structures
                associatives.
              </p>
              <p>Parmi les organisations connues figurent notamment :</p>
              <ul>
                <li>l’Association sportive d’Aït Mesbah, l’ASAM ;</li>
                <li>sa section de judo ;</li>
                <li>l’association culturelle Amar Imache.</li>
              </ul>
              <p className="village-note">
                Cette première présentation ne constitue pas encore un
                annuaire exhaustif. Les associations, leurs responsables et
                leurs activités pourront être présentés dans une rubrique
                dédiée après validation des informations par chaque
                organisation.
              </p>
            </div>
          </section>

          <section className="village-section village-imache">
            <div className="village-section-heading">
              <p className="eyebrow">Une personnalité du village</p>
              <h2>Amar Imache et le mouvement national</h2>
            </div>
            <div className="village-prose">
              <p>
                Aït Mesbah est le village natal d’Amar Imache, personnalité
                importante du mouvement national algérien. Il a notamment
                exercé les fonctions de secrétaire général de l’Étoile
                nord-africaine et participé à la défense du droit des
                Algériens à disposer d’eux-mêmes.
              </p>
              <p>
                Son parcours politique, intellectuel et militant mérite une
                page documentaire distincte, fondée sur des archives et des
                sources historiques clairement identifiées. La présente page
                se limite à introduire son lien avec le village.
              </p>
              <h3>Futurs axes documentaires</h3>
              <ul>
                <li>sa naissance et son enfance à Aït Mesbah ;</li>
                <li>son parcours migratoire et professionnel ;</li>
                <li>son engagement dans l’Étoile nord-africaine ;</li>
                <li>sa participation au journal El Ouma ;</li>
                <li>sa pensée politique ;</li>
                <li>
                  son héritage dans l’histoire nationale et dans la mémoire du
                  village.
                </li>
              </ul>
            </div>
          </section>

          <section className="village-section village-oral-history">
            <div className="village-section-heading">
              <p className="eyebrow">Tradition orale</p>
              <h2>L’origine du nom</h2>
            </div>
            <div className="village-prose">
              <p>
                Selon une tradition orale rapportée localement, le nom du
                village serait associé à un premier habitant appelé Yahya ou
                Mesbah.
              </p>
              <p>
                Cette origine n’étant pas encore établie par une source
                historique suffisamment précise, elle ne doit pas être
                présentée comme un fait certain. Elle pourra être étudiée à
                partir de témoignages, d’archives, de travaux historiques et
                de recherches linguistiques.
              </p>
            </div>
          </section>
        </div>

        <section className="village-conclusion">
          <h2>Une connaissance à construire collectivement</h2>
          <p>
            Cette page constitue une première présentation d’Aït Mesbah. Elle
            sera progressivement complétée par des documents, des
            photographies, des cartes, des témoignages et des informations
            validées par les habitants, les associations et les personnes
            ressources du village.
          </p>
          <p>
            L’objectif n’est pas de figer l’histoire d’Aït Mesbah, mais de
            construire un espace documentaire fiable, accessible et
            respectueux de celles et ceux qui la transmettent.
          </p>
          <div className="village-actions">
            <Link className="primary" href="/#memoire">
              Explorer l’histoire et la mémoire
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="village-secondary-link" href="/#contribuer">
              Comment contribuer
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
