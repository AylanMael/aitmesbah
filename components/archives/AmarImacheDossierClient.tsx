"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AmarImacheTimeline from "./AmarImacheTimeline";
import ArchiveInspectorModal from "./ArchiveInspectorModal";
import { amarImacheArchives } from "@/data/amar-imache-archives";

interface AmarImacheDossierClientProps {
  chronology: readonly (readonly [string, string, string])[];
  writings: readonly (readonly [string, string, string])[];
  archiveFamilies: readonly (readonly [string, string])[];
}

export default function AmarImacheDossierClient({
  chronology,
  writings,
  archiveFamilies,
}: AmarImacheDossierClientProps) {
  const [selectedArchive, setSelectedArchive] = useState<{
    isOpen: boolean;
    imageSrc: string;
    alt: string;
    title: string;
    date?: string;
    publication?: string;
    signature?: string;
    transcription?: readonly string[] | string;
    pdfUrl?: string;
  }>({
    isOpen: false,
    imageSrc: "",
    alt: "",
    title: "",
  });

  const handleOpenInspector = (archive: {
    title: string;
    imageSrc: string;
    date: string;
    publication?: string;
    signature?: string;
    transcription?: readonly string[] | string;
    pdfUrl?: string;
  }) => {
    setSelectedArchive({
      isOpen: true,
      imageSrc: archive.imageSrc,
      alt: archive.title,
      title: archive.title,
      date: archive.date,
      publication: archive.publication,
      signature: archive.signature,
      transcription: archive.transcription,
      pdfUrl: archive.pdfUrl,
    });
  };

  const handleOpen1937Archive = () => {
    const archive1937 = amarImacheArchives[0];
    handleOpenInspector({
      title: archive1937.title,
      imageSrc: archive1937.image,
      date: archive1937.displayDate,
      publication: `${archive1937.publication} · ${archive1937.issue}`,
      signature: archive1937.signature,
      transcription: archive1937.transcription,
      pdfUrl: archive1937.pdf,
    });
  };

  return (
    <>
      <section className="imache-dossier-chronology" id="parcours">
        <div className="imache-dossier-section-head">
          <p className="eyebrow light">Itinéraire</p>
          <h2>Les repères d’une vie de combat</h2>
          <p>Une frise chronologique interactive filtrable par époques historiques.</p>
        </div>

        <AmarImacheTimeline
          items={chronology}
          onOpenArchive={(data) =>
            handleOpenInspector({
              title: data.title,
              imageSrc: data.imageSrc,
              date: data.date,
              transcription: data.transcription,
            })
          }
        />
      </section>

      <section className="imache-dossier-photographs" aria-labelledby="imache-photographs-title">
        <div className="imache-dossier-photo-head">
          <p className="eyebrow">Documents photographiques</p>
          <h2 id="imache-photographs-title">Au cœur de l’Étoile nord-africaine</h2>
          <p>
            Deux images collectives replacent Amar Imache parmi les responsables. Cliquez pour ouvrir la loupe d&apos;inspection.
          </p>
        </div>
        <div className="imache-dossier-photo-grid">
          <figure
            className="cursor-pointer group"
            onClick={() =>
              handleOpenInspector({
                title: "Délégation de l’Étoile nord-africaine à Genève",
                imageSrc: "/images/amar-imache/delegation-ena-geneve.jpg",
                date: "Circa 1935",
                publication: "Photographie historique ENA",
                transcription: [
                  "Document photographique d'archive de l'Étoile nord-africaine lors de la délégation à Genève.",
                  "Amar Imache apparaît deuxième à droite au premier rang.",
                ],
              })
            }
          >
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/amar-imache/delegation-ena-geneve.jpg"
                alt="Délégation de l’Étoile nord-africaine à Genève"
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-[#aa593c] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  🔎 Inspecter la photo d&apos;archive
                </span>
              </div>
            </div>
            <figcaption>
              <span>Document 01 · Inspection loupe disponible</span>
              <strong>Délégation de l’ENA à Genève</strong>
              <p>Amar Imache apparaît deuxième à droite.</p>
            </figcaption>
          </figure>

          <figure
            className="cursor-pointer group"
            onClick={() =>
              handleOpenInspector({
                title: "Délégation de l’Étoile nord-africaine au ministère de l’Intérieur",
                imageSrc: "/images/amar-imache/delegation-ministere-interieur.jpg",
                date: "Paris, France",
                publication: "Photographie de presse d'époque",
                transcription: [
                  "Délégation des responsables de l'Étoile nord-africaine au ministère de l'Intérieur.",
                  "Amar Imache est identifié au premier rang, à droite.",
                ],
              })
            }
          >
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/amar-imache/delegation-ministere-interieur.jpg"
                alt="Délégation au ministère de l’Intérieur"
                fill
                sizes="(max-width: 800px) 100vw, 34vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-[#aa593c] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  🔎 Inspecter la photo d&apos;archive
                </span>
              </div>
            </div>
            <figcaption>
              <span>Document 02 · Inspection loupe disponible</span>
              <strong>Délégation au ministère de l’Intérieur</strong>
              <p>Amar Imache est identifié au premier rang, à droite.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Feature Section Archive 1937 "Ils nous ont trahis" */}
      <section className="imache-press-archive" id="archive-1937" aria-labelledby="archive-1937-title">
        <header className="imache-press-heading">
          <div>
            <p className="eyebrow light">Archives de presse & Inspecteur</p>
            <h2 id="archive-1937-title">
              Lire les textes<br />
              <em>dans leur temps</em>
            </h2>
          </div>
          <div>
            <p>Une collection intégrant l&apos;inspecteur d&apos;archives à loupe virtuelle.</p>
            <span>1 document numérisé interactif</span>
          </div>
        </header>

        <div className="imache-press-collection">
          <article className="imache-press-card">
            <div
              className="imache-press-thumb cursor-pointer relative group"
              onClick={handleOpen1937Archive}
            >
              <Image
                src="/images/amar-imache/la-lutte-ouvriere-1937-page-2.jpg"
                alt="Page 2 de La Lutte ouvrière du 5 février 1937"
                fill
                sizes="(max-width: 700px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-4">
                <span className="text-2xl">🔎</span>
                <span className="bg-[#aa593c] text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  Ouvrir la Loupe d&apos;Archive
                </span>
              </div>
            </div>

            <div className="imache-press-card-copy">
              <div className="imache-press-card-meta">
                <span>05.02.1937</span>
                <span>Page 2</span>
                <span>Article signé</span>
              </div>
              <p className="imache-press-publication">La Lutte ouvrière · n° 30</p>
              <h3>« Ils nous ont trahis »</h3>
              <p>
                Amar Imache dénonce la dissolution de l’Étoile nord-africaine par le gouvernement du Front populaire et défend le droit des travailleurs nord-africains à s’organiser librement.
              </p>
              <footer>
                <span>Signature : Imache Amar</span>
                <div className="imache-press-card-actions">
                  <button
                    type="button"
                    onClick={handleOpen1937Archive}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-colors"
                  >
                    <span>🔎 Inspecter le document (Loupe & Zoom)</span>
                  </button>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </section>

      {/* Modal Inspector Component */}
      <ArchiveInspectorModal
        isOpen={selectedArchive.isOpen}
        onClose={() => setSelectedArchive((prev) => ({ ...prev, isOpen: false }))}
        imageSrc={selectedArchive.imageSrc}
        alt={selectedArchive.alt}
        title={selectedArchive.title}
        date={selectedArchive.date}
        publication={selectedArchive.publication}
        signature={selectedArchive.signature}
        transcription={selectedArchive.transcription}
        pdfUrl={selectedArchive.pdfUrl}
      />
    </>
  );
}
