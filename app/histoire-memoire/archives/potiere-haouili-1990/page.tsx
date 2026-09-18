import type { Metadata } from "next";
import Link from "next/link";
import ArchiveDiscovery from "@/components/archives/ArchiveDiscovery";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import "../hiani-debia-1939/reportage.css";

export const metadata: Metadata = {
  title: "La peinture des engobes sur une jarre (Début des années 90) — Archives d’Aït Mesbah",
  description: "Photographie d'archive montrant l'application minutieuse des engobes rouges sur une jarre traditionnelle à Aït Mesbah au début des années 1990.",
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
              La peinture des engobes<br />
              <em>sur une jarre</em>
            </h1>
          </div>
          <div>
            <h2>Le geste et le savoir-faire de la terre</h2>
            <p>
              Prise au début des années 1990, cette photographie illustre la délicate étape de décoration à l’engobe rouge sur une poterie en terre cuite, lors des activités portées par l’Association Culturelle Imache Amar.
            </p>
          </div>
        </header>

        <section className="village-archive-reading">
          <div>
            <p className="eyebrow">Technique &amp; Geste</p>
            <h2>La précision du tracé manuel</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Sur ce cliché, la potière travaille assise au sol, appliquant avec un fin pinceau les lignes et motifs géométriques traditionnels sur la panse et le col d’une grande jarre.
            </p>
            <p>
              À ses côtés reposent les outils de travail : un mortier en pierre servant à broyer les minéraux pour former l’engobe rouge, ainsi qu’une coupe en céramique contenant les pigments.
            </p>
            <p>
              Cette archive témoigne de la continuité des techniques de façonnage et de décoration au village. Selon les témoignages transmis pour ce site, la personne photographiée a été identifiée comme Madame Haouili.
            </p>
          </div>
        </section>

        <ImageArchiveViewer
          src="/archives/poterie-1990/madame-haouili-potiere-1990.jpg"
          alt="Application au pinceau de l'engobe rouge sur les motifs géométriques d'une jarre traditionnelle"
          title="La peinture des engobes sur une jarre · Début des années 1990"
          aspectRatio="1 / 1"
        />

        <section className="village-archive-metadata">
          <p className="eyebrow">Notice et repères archivistiques</p>
          <dl>
            <div>
              <dt>Sujet / Geste</dt>
              <dd>Application de l’engobe et peinture des décors traditionnels</dd>
            </div>
            <div>
              <dt>Objet visible</dt>
              <dd>Jarre à anses, mortier en pierre et récipients à pigments</dd>
            </div>
            <div>
              <dt>Personne identifiée (mémoire locale)</dt>
              <dd>Madame Haouili</dd>
            </div>
            <div>
              <dt>Période de prise de vue</dt>
              <dd>Début des années 1990</dd>
            </div>
            <div>
              <dt>Contexte documentaire</dt>
              <dd>Archives de l’Association Culturelle Imache Amar d’Aït Mesbah</dd>
            </div>
            <div>
              <dt>Lieu</dt>
              <dd>Aït Mesbah, Grande Kabylie</dd>
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
              Retrouvez l’histoire de la poterie d’Aït Mesbah, ses outils, ses décors et d’autres repères documentaires sur la page dédiée aux savoir-faire du village.
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
