"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import "./image-archive-viewer.css";

type Props = { src: string; alt: string; aspectRatio?: string; title?: string };

export default function ImageArchiveViewer({ src, alt, aspectRatio, title = "Document original" }: Props) {
  const titleId = useId();
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const viewerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const clamp = (value: number) => Math.min(300, Math.max(75, value));

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  function resetZoom() {
    setZoom(100);
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  }

  async function toggleFullscreen() {
    setMessage("");
    try {
      if (document.fullscreenElement === viewerRef.current) await document.exitFullscreen();
      else if (viewerRef.current?.requestFullscreen) await viewerRef.current.requestFullscreen();
      else setMessage("Le plein écran n’est pas disponible ici. Vous pouvez ouvrir le fichier seul avec le lien ci-dessous.");
    } catch {
      setMessage("Le navigateur n’a pas autorisé le plein écran. Le zoom reste disponible, ainsi que le lien vers le fichier original.");
    }
  }

  return <section className="village-archive-document" aria-labelledby={titleId} ref={viewerRef}>
    <header className="village-archive-toolbar">
      <div><p id={titleId}>{title}</p><span>Déplacez-vous dans l’image lorsqu’elle est agrandie</span></div>
      <div className="village-archive-zoom" aria-label="Commandes de la visionneuse">
        <button type="button" disabled={zoom === 75} onClick={() => setZoom(value => clamp(value - 25))} aria-label="Réduire">−</button>
        <button type="button" onClick={resetZoom} aria-label={`Zoom ${zoom} %. Revenir à la taille initiale`}>{zoom}%</button>
        <button type="button" disabled={zoom === 300} onClick={() => setZoom(value => clamp(value + 25))} aria-label="Agrandir">+</button>
        <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen} aria-label={fullscreen ? "Quitter le plein écran" : "Afficher en plein écran"}>⛶</button>
      </div>
    </header>
    <p className="archive-viewer-status" role="status">{message || `Zoom : ${zoom} %`}</p>
    <div className="village-archive-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label={`${title} : image à explorer. Touches plus et moins pour zoomer, zéro pour réinitialiser, flèches pour se déplacer.`}
      onKeyDown={event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (["+", "=", "-", "0"].includes(event.key)) {
          event.preventDefault();
          if (event.key === "0") resetZoom();
          else setZoom(value => clamp(value + (event.key === "-" ? -25 : 25)));
        }
      }}
      onDoubleClick={() => { if (zoom === 100) setZoom(200); else resetZoom(); }}>
      <div className="village-archive-image" style={{ width: `${zoom}%`, aspectRatio }}>
        <Image src={src} alt={alt} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
      </div>
    </div>
    <footer className="village-archive-tools"><p>Zoom : + / − · Défilez dans l’image pour l’explorer.</p><a href={src} target="_blank" rel="noreferrer">Ouvrir le fichier seul ↗</a></footer>
  </section>;
}
