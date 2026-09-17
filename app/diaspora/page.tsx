import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import FamilyRegistryIndex from "@/components/family/FamilyRegistryIndex";

export const metadata: Metadata = {
  title: "Diaspora, Registre des Familles & Liens du Monde — Aït Mesbah",
  description: "Découvrez l'index des familles d'Aït Mesbah et les liens de sa communauté établie en Algérie, en France, au Québec et dans le monde.",
  alternates: { canonical: "/diaspora" },
};

const contents = [
  ["Registre des Familles", "registre"],
  ["Des départs anciens", "departs"],
  ["Ailleurs en Algérie", "algerie"],
  ["France", "france"],
  ["Québec", "quebec"],
  ["États-Unis", "etats-unis"],
  ["Liens avec le village", "liens"],
  ["Nouvelles générations", "transmission"],
  ["Réseau à construire", "reseau"],
] as const;

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="diaspora-page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default function DiasporaPage() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
      <SiteHeaderClient />
      <main id="contenu-principal" className="diaspora-page" tabIndex={-1}>
        <header className="diaspora-page-hero">
          <div className="diaspora-page-hero-copy">
            <p className="eyebrow light">Diaspora et liens avec le village</p>
            <h1>Aït Mesbah, ici et ailleurs<br /><em>& Registre Familial</em></h1>
            <p className="diaspora-page-lead">
              L’histoire d’Aït Mesbah dépasse les limites de son territoire. Au fil des générations, des habitantes et des habitants se sont établis dans d’autres régions d’Algérie et dans plusieurs pays.
            </p>
            <div className="mt-6">
              <a href="#registre" className="px-6 py-3 bg-[#aa593c] text-white font-bold rounded-full shadow-lg hover:bg-[#8b432a] transition-all">
                👨‍👩‍👧‍👦 Explorer le Registre des Familles ↓
              </a>
            </div>
          </div>
          <div className="diaspora-connections" aria-hidden="true">
            <span className="diaspora-origin">ⵣ</span><i /><i /><i /><i /><b /><b /><b /><b />
          </div>
        </header>

        <nav className="diaspora-page-toc" aria-label="Sommaire de la page">
          <span>Parcourir la page</span>
          <ol>
            {contents.map(([label, id], index) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* SECTION 1: REGISTRE DES FAMILLES */}
        <section id="registre" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
          <FamilyRegistryIndex />
        </section>

        <section id="departs" className="diaspora-story diaspora-story-opening">
          <SectionHeading eyebrow="Histoire des mobilités" title="Des départs anciens" />
          <div className="diaspora-page-prose">
            <p>Les mobilités hors d’Aït Mesbah ne sont pas récentes. Dès la fin du XIXe siècle et au début du XXe siècle, de jeunes hommes quittèrent le village pour chercher du travail à Tizi Ouzou, à Alger ou dans la plaine de la Mitidja.</p>
            <p>Au début du XXe siècle, certains partirent également travailler en France, notamment dans les mines du nord du pays, dans les Bouches-du-Rhône et dans la région parisienne.</p>
            <p>Ces premiers départs ont progressivement créé des liens durables entre le village, les villes algériennes et la France.</p>
            <Link className="diaspora-text-link" href="/histoire-memoire#migrations">
              Approfondir l’histoire des migrations <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="diaspora-regions" aria-label="Communautés établies ailleurs">
          <article id="algerie" className="diaspora-region diaspora-region-algeria">
            <p className="eyebrow">Algérie</p>
            <h2>Du village aux autres régions du pays</h2>
            <p>Une partie de la communauté originaire d’Aït Mesbah vit aujourd’hui dans d’autres localités de la wilaya de Tizi Ouzou, à Alger et dans différentes régions d’Algérie.</p>
            <p>Ces installations s’inscrivent dans des parcours familiaux, professionnels, universitaires et résidentiels variés.</p>
            <aside>La présentation de ces communautés sera précisée progressivement, sans publier de données personnelles ni de chiffres non vérifiés.</aside>
          </article>

          <article id="france" className="diaspora-region diaspora-region-france">
            <p className="eyebrow">France</p>
            <h2>Des liens construits sur plusieurs générations</h2>
            <p>La France occupe une place ancienne dans l’histoire migratoire d’Aït Mesbah. Les premières migrations de travail ont progressivement donné naissance à des installations plus durables.</p>
            <aside>Les villes, associations et initiatives seront présentées après validation par les personnes et structures concernées.</aside>
          </article>

          <article id="quebec" className="diaspora-region diaspora-region-quebec">
            <p className="eyebrow">Québec</p>
            <h2>Une communauté à mieux connaître</h2>
            <p>Des personnes et des familles originaires d’Aït Mesbah sont également établies au Québec. Cette rubrique accueillera progressivement des informations validées sur leurs parcours.</p>
          </article>

          <article id="etats-unis" className="diaspora-region diaspora-region-usa">
            <p className="eyebrow">États-Unis</p>
            <h2>Des parcours encore à documenter</h2>
            <p>Des membres de la communauté d’Aït Mesbah vivent également aux États-Unis.</p>
          </article>
        </section>

        <section id="liens" className="diaspora-bonds">
          <SectionHeading eyebrow="Solidarité" title="Maintenir une relation vivante" />
          <div>
            <ul>
              <li>Relations familiales</li>
              <li>Retours et séjours au village</li>
              <li>Transmission de la langue et de la culture</li>
              <li>Participation à des initiatives collectives</li>
              <li>Soutien à des projets locaux</li>
              <li>Échanges entre générations</li>
              <li>Préservation des photographies, documents et témoignages</li>
            </ul>
          </div>
        </section>

        <section id="transmission" className="diaspora-transmission">
          <SectionHeading eyebrow="Transmission" title="Faire connaître le village aux nouvelles générations" />
          <div className="diaspora-page-prose">
            <p>Pour les enfants et petits-enfants nés ou élevés loin d’Aït Mesbah, le lien avec le village peut passer par les récits familiaux, les séjours, la langue, les photographies et la cuisine.</p>
            <div className="diaspora-inline-links">
              <Link href="/village">Découvrir le village <span aria-hidden="true">↗</span></Link>
              <Link href="/histoire-memoire">Explorer son histoire <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section id="reseau" className="diaspora-network">
          <div className="diaspora-network-intro">
            <p className="eyebrow light">Projet collectif</p>
            <h2>Relier les initiatives sans centraliser la communauté</h2>
            <p>À terme, le site pourra faciliter la circulation d’informations entre le village, les associations locales, et les membres de la communauté établis ailleurs.</p>
          </div>
        </section>

        <section className="diaspora-page-conclusion">
          <p className="eyebrow">Ici et ailleurs</p>
          <h2>Un même village, plusieurs lieux de vie</h2>
          <p>La diversité des parcours fait désormais partie de l’histoire d’Aït Mesbah.</p>
          <div className="diaspora-page-actions">
            <Link className="primary" href="/village">Découvrir Aït Mesbah <span aria-hidden="true">↗</span></Link>
            <Link className="diaspora-page-secondary" href="/contribuer">Comment contribuer</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

