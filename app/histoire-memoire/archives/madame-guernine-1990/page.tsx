import type { Metadata } from "next";
import Link from "next/link";
import ArchiveDiscovery from "@/components/archives/ArchiveDiscovery";
import ImageArchiveViewer from "@/components/archives/ImageArchiveViewer";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import "../hiani-debia-1939/reportage.css";

export const metadata: Metadata = {
  title: "Autour des récipients et de l’Akufi (Début des années 90) — Archives d’Aït Mesbah",
  description: "Photographie d'archive présentant un grand Akufi peint et des pièces de poterie traditionnelle dans une maison d'Aït Mesbah au début des années 1990.",
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
              Autour des récipients<br />
              <em>et de l’Akufi</em>
            </h1>
          </div>
          <div>
            <h2>Patrimoine domestique et mobilier artisanal</h2>
            <p>
              Prise au début des années 1990, cette photographie met en valeur de grandes pièces de poterie traditionnelle conservées dans l’architecture intérieure d’une maison du village.
            </p>
          </div>
        </header>

        <section className="village-archive-reading">
          <div>
            <p className="eyebrow">Objets &amp; Intérieur</p>
            <h2>Les formes de conservation de la maison</h2>
          </div>
          <div>
            <p className="village-archive-lead">
              Ce cliché met en scène un grand *Akufi* (récipient de conservation d’argile et de paille surélevé) orné de motifs géométriques peints, entouré de petits pichets et de pots en terre cuite.
            </p>
            <p>
              Le décor environnant — embrasure peinte en bleu indigo, murs blanchis à la chaux et sol battu — restitue l’ambiance chaleureuse du cadre domestique d'autrefois.
            </p>
            <p>
              Recueillie au début des années 1990 lors des actions de documentation portées par l’Association Culturelle Imache Amar d’Aït Mesbah, la personne au centre de ce portrait a été identifiée localement comme Madame Guernine, vêtue de la tenue traditionnelle avec broderies, *timelhefth* à rayures et parures.
            </p>
          </div>
        </section>

        <ImageArchiveViewer
          src="/archives/poterie-1990/madame-guernine-poterie-1990.jpg"
          alt="Grand Akufi peint et récipients traditionnels dans une maison d'Aït Mesbah"
          title="Autour des récipients et de l’Akufi · Début des années 1990"
          aspectRatio="1 / 1"
        />

        <section className="village-archive-metadata">
          <p className="eyebrow">Notice et repères archivistiques</p>
          <dl>
            <div>
              <dt>Sujet / Objets</dt>
              <dd>Akufi (jarre de conservation), pichets et céramiques artisanales</dd>
            </div>
            <div>
              <dt>Cadre &amp; Éléments</dt>
              <dd>Intérieur traditionnel, architecture de pierre et badigeon à la chaux</dd>
            </div>
            <div>
              <dt>Personne identifiée (mémoire locale)</dt>
              <dd>Madame Guernine</dd>
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
