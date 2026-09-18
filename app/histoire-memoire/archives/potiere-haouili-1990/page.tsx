import type { Metadata } from "next";
import Link from "next/link";
import ArchiveDiscovery from "@/components/archives/ArchiveDiscovery";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import "../hiani-debia-1939/reportage.css";

export const metadata: Metadata = {
  title: "Madame Haouili peignant une jarre (Début des années 90) — Archives d’Aït Mesbah",
  description: "Photographie d'archive de Madame Haouili, potière d'Aït Mesbah, peignant une jarre traditionnelle. Prise au début des années 1990 lors de l'apogée de l'Association Culturelle Imache Amar.",
  alternates: { canonical: "/histoire-memoire/archives/potiere-haouili-1990" },
};

export default function PotiereHaouiliArchivePage() {
  return (
    <>
      <SiteHeaderClient />
      <main className="village-archive-page" id="contenu-principal">
        <header className="village-archive-hero">
          <div>
            <Link href="/histoire-memoire#archives">← Retour aux archives</Link>
            <p className="eyebrow light">Photographie d’archive · Début des années 1990</p>
            <h1>
              Madame Haouili<br />
              <em>peignant une jarre</em>
            </h1>
          </div>
          <div>
            <h2>L’apogée de l’Association Culturelle Imache Amar</h2>
            <p>
              Prise au début des années 1990, cette photographie témoigne de la vitalité de l’artisanat de la poterie à Aït Mesbah et du travail de préservation porté par l’Association Culturelle Imache Amar.
            </p>
          </div>
        </header>

        <section className="village-archive-reading">
          <div>
            <p className="eyebrow">Le geste et la matière</p>
            <h2>La précision du décor aux engobes</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Sur ce cliché, Madame Haouili est assise à même le sol, tenant délicatement un pinceau pour appliquer l’engobe rouge sur les contours et les motifs géométriques d’une grande jarre en terre cuite.
            </p>
            <p>
              Aux côtés d’un récipient en pierre servant à préparer le pigment et de coupes en céramique contenant les pinceaux et couleurs, l’artisane perpétue des gestes séculaires transmis de génération en génération au village.
            </p>
            <p>
              Cette photographie fait partie des clichés marquants réalisés au début des années 1990, lors de la période florissante de l’Association Culturelle Imache Amar, qui œuvrait pour la mémoire, la culture et la valorisation du patrimoine artisanal d’Aït Mesbah.
            </p>
          </div>
        </section>

        <ImageArchiveViewer
          src="/archives/poterie-1990/madame-haouili-potiere-1990.jpg"
          alt="Madame Haouili, potière d'Aït Mesbah, peignant les motifs d'une jarre avec un pinceau"
          title="Madame Haouili peignant une jarre · Début des années 1990"
          aspectRatio="1 / 1"
        />

        <section className="village-archive-metadata">
          <p className="eyebrow">Notice et repères archivistiques</p>
          <dl>
            <div>
              <dt>Personne photographiée</dt>
              <dd>Madame Haouili</dd>
            </div>
            <div>
              <dt>Activité / Métier</dt>
              <dd>Potière (peinture et décor traditionnel)</dd>
            </div>
            <div>
              <dt>Période de prise de vue</dt>
              <dd>Début des années 1990</dd>
            </div>
            <div>
              <dt>Contexte historique</dt>
              <dd>Apogée de l’Association Culturelle Imache Amar</dd>
            </div>
            <div>
              <dt>Lieu</dt>
              <dd>Aït Mesbah, Grande Kabylie</dd>
            </div>
            <div>
              <dt>Collection / Source</dt>
              <dd>Archives de l’Association Culturelle Imache Amar</dd>
            </div>
          </dl>
        </section>

        <section className="village-archive-reading">
          <div>
            <p className="eyebrow">Voir aussi</p>
            <h2>L’artisanat de la poterie au village</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Retrouvez l’histoire de la poterie d’Aït Mesbah, ses outils, ses décors et d’autres figures d’artisanes sur la page dédiée aux savoir-faire du village.
            </p>
            <Link className="craft-link" href="/artisanat/poterie">
              Découvrir la rubrique Poterie &amp; Savoir-faire →
            </Link>
          </div>
        </section>

        <ArchiveDiscovery current="reportage" />
      </main>
      <SiteFooter />
    </>
  );
}
