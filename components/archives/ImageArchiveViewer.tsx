"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = { src: string; alt: string };

export default function ImageArchiveViewer({ src, alt }: Props) {
  const [zoom, setZoom] = useState(100);
  const viewerRef = useRef<HTMLElement>(null);
  const clamp = (value: number) => Math.min(300, Math.max(75, value));

  function toggleFullscreen() {
    if (!document.fullscreenElement) void viewerRef.current?.requestFullscreen();
    else void document.exitFullscreen();
  }

  return <section className="village-archive-document" aria-labelledby="archive-document-title" ref={viewerRef}>
    <header className="village-archive-toolbar">
      <div><p id="archive-document-title">Document original</p><span>Déplacez-vous dans l’image lorsqu’elle est agrandie</span></div>
      <div className="village-archive-zoom" aria-label="Commandes de la visionneuse">
        <button type="button" onClick={() => setZoom(value => clamp(value - 25))} aria-label="Réduire">−</button>
        <button type="button" onClick={() => setZoom(100)} aria-label="Revenir à la taille initiale">{zoom}%</button>
        <button type="button" onClick={() => setZoom(value => clamp(value + 25))} aria-label="Agrandir">+</button>
        <button type="button" onClick={toggleFullscreen} aria-label="Afficher en plein écran">⛶</button>
      </div>
    </header>
    <div className="village-archive-viewport" onDoubleClick={() => setZoom(value => value === 100 ? 200 : 100)}>
      <div className="village-archive-image" style={{ width: `${zoom}%` }}>
        <Image src={src} alt={alt} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
      </div>
    </div>
    <footer className="village-archive-tools"><p>Double-cliquez pour agrandir</p><a href={src} target="_blank" rel="noreferrer">Ouvrir le fichier seul ↗</a></footer>
  </section>;
}
