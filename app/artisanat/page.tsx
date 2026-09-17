import type { Metadata } from "next";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import CraftSection from "@/components/home/CraftSection";
import KabyleSymbolDecoder from "@/components/crafts/KabyleSymbolDecoder";
import "./artisanat.css";

export const metadata: Metadata = {
  title: "Artisanat, Savoir-Faire & Décodeur de Symboles — Aït Mesbah",
  description: "Poterie, robe kabyle, tapisserie, burnous et décodeur interactif des symboles géométriques traditionnels d'Aït Mesbah.",
  alternates: { canonical: "/artisanat" },
};

export default function ArtisanatPage() {
  return (
    <>
      <SiteHeaderClient />
      <main className="craft-page" id="contenu-principal">
        <header className="craft-hero">
          <p className="craft-label">Artisanat · Aït Mesbah</p>
          <h1>Ce que les mains<br /><em>gardent vivant.</em></h1>
          <p>Un village se raconte aussi dans la terre travaillée, une robe cousue et la laine devenue burnous. À Aït Mesbah, ces métiers font partie de notre histoire et de ce que nous voulons transmettre.</p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a className="craft-link" href="#symboles">
              🏺 Décodeur de Symboles Kabyles ↓
            </a>
            <a className="craft-link" href="#metiers">
              Rencontrer les savoir-faire ↓
            </a>
          </div>
          <span className="craft-hero-word" aria-hidden="true">MATIÈRES</span>
        </header>

        {/* SECTION 1: DECODEUR DE SYMBOLES KABYLES */}
        <section id="symboles" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
          <div className="text-center mb-10 space-y-3">
            <span className="bg-[#e9c982] text-[#08281f] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              🏺 Étape 3 · Conservatoire des Symboles
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Le Langage des Motifs & de la Terre
            </h2>
            <p className="text-sm md:text-base text-[#c8d6d0] max-w-2xl mx-auto leading-relaxed">
              Décodez la cosmogonie, les formules de protection et l&apos;histoire gravées dans la poterie et le tissage d&apos;Aït Mesbah.
            </p>
          </div>

          <KabyleSymbolDecoder />
        </section>

        {/* SECTION 2: SAVOIR-FAIRE & METIERS */}
        <div id="metiers">
          <CraftSection />
        </div>

        <section className="craft-manifesto">
          <div>
            <p className="craft-label">Au-delà des objets</p>
            <h2>Faire une place<br />à celles et ceux<br /><em>qui savent faire.</em></h2>
          </div>
          <div>
            <p>Une poterie ne se résume pas à son décor. Une robe ne se résume pas à ses couleurs. Un burnous ne se résume pas à sa matière.</p>
            <p>Il y a derrière eux du temps, des apprentissages et des personnes. Nous voulons raconter ces métiers à hauteur d’atelier : les gestes, les outils, les souvenirs et les envies de transmettre.</p>
            <Link className="craft-link" href="/contribuer">
              Faire connaître une artisane ou un artisan <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="craft-invitation">
          <p className="craft-label">Une mémoire à partager</p>
          <h2>Un objet. Un geste.<br />Une personne à faire connaître.</h2>
          <p>Vous pratiquez l’un de ces métiers, connaissez une artisane ou un artisan, ou conservez un objet de famille ? Aidez-nous à raconter cette histoire avec des photographies, des souvenirs et des mots justes.</p>
          <Link className="craft-link" href="/contribuer">
            Partager un savoir-faire <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

