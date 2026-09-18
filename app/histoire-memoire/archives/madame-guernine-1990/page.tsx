import type { Metadata } from "next";
import Link from "next/link";
import ArchiveDiscovery from "@/components/archives/ArchiveDiscovery";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import "../hiani-debia-1939/reportage.css";

export const metadata: Metadata = {
  title: "Madame Guernine au milieu des objets artisanaux (Début des années 90) — Archives d’Aït Mesbah",
  description: "Photographie d'archive de Madame Guernine posant en tenue traditionnelle auprès d'une grande jarre peinte (Akufi) et d'objets artisanaux à Aït Mesbah au début des années 1990.",
  alternates: { canonical: "/histoire-memoire/archives/madame-guernine-1990" },
};

export default function MadameGuernineArchivePage() {
  return (
    <>
      <SiteHeaderClient />
      <main className="village-archive-page" id="contenu-principal">
        <header className="village-archive-hero">
          <div>
            <Link href="/histoire-memoire#archives">← Retour aux archives</Link>
            <p className="eyebrow light">Photographie d’archive · Début des années 1990</p>
            <h1>
              Madame Guernine<br />
              <em>au milieu des objets artisanaux</em>
            </h1>
          </div>
          <div>
            <h2>L’apogée de l’Association Culturelle Imache Amar</h2>
            <p>
              Prise au début des années 1990, cette photographie immortalise Madame Guernine, une doyenne du village incarnant la mémoire vivante et l’héritage culturel d’Aït Mesbah.
            </p>
          </div>
        </header>

        <section className="village-archive-reading">
          <div>
            <p className="eyebrow">Patrimoine &amp; Mémoire</p>
            <h2>La mémoire vivante d’Aït Mesbah</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Sur ce portrait saisissant, Madame Guernine pose en tenue traditionnelle kabyle (robe aux broderies colorées, timelhefth/fouta à rayures, parures et tatouages traditionnels au front et au menton), le bras appuyé contre une imposante jarre peinte (*Akufi*) et entourée d’autres poteries artisanales.
            </p>
            <p>
              L’environnement — murs peints à la chaux, embrasure bleue et récipients en terre cuite — reflète le cadre intime des maisons du village et la fierté de transmettre ces savoir-faire.
            </p>
            <p>
              Cette archive photographique a été recueillie et préservée grâce au travail de documentation mené au début des années 1990 à l’apogée de l’Association Culturelle Imache Amar d’Aït Mesbah.
            </p>
          </div>
        </section>

        <ImageArchiveViewer
          src="/archives/poterie-1990/madame-guernine-poterie-1990.jpg"
          alt="Madame Guernine en tenue traditionnelle posant à côté d'un grand Akufi et d'objets en poterie à Aït Mesbah"
          title="Madame Guernine posant au milieu des objets artisanaux · Début des années 1990"
          aspectRatio="1 / 1"
        />

        <section className="village-archive-metadata">
          <p className="eyebrow">Notice et repères archivistiques</p>
          <dl>
            <div>
              <dt>Personne photographiée</dt>
              <dd>Madame Guernine</dd>
            </div>
            <div>
              <dt>Sujet</dt>
              <dd>Portrait et mise en valeur des objets artisanaux (Akufi, pichets)</dd>
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
            <h2>L’artisanat et l’histoire du village</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Découvrez la richesse des métiers traditionnels d’Aït Mesbah et la collection d’archives du village.
            </p>
            <Link className="craft-link" href="/artisanat/poterie">
              Explorer la poterie et les savoir-faire →
            </Link>
          </div>
        </section>

        <ArchiveDiscovery current="daily" />
      </main>
      <SiteFooter />
    </>
  );
}
