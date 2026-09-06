"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ArchiveViewerProps = { src: string; alt: string; caption: string; title: string; transcription: readonly string[] };

export default function ArchiveViewer({ src, alt, caption, title, transcription }: ArchiveViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState<"document" | "transcription">("document");
  const viewerRef = useRef<HTMLDivElement>(null);
  const clamp = (value: number) => Math.min(300, Math.max(60, value));

  useEffect(() => {
    const openRequestedMode = () => {
      if (window.location.hash === "#transcription") setMode("transcription");
    };
    openRequestedMode();
    window.addEventListener("hashchange", openRequestedMode);
    return () => window.removeEventListener("hashchange", openRequestedMode);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) void viewerRef.current?.requestFullscreen();
    else void document.exitFullscreen();
  }

  return <figure className="archive-viewer" id="transcription" ref={viewerRef}>
    <header className="archive-viewer-toolbar">
      <div className="archive-viewer-tabs" role="tablist" aria-label="Mode de lecture"><button type="button" role="tab" aria-selected={mode === "document"} onClick={() => setMode("document")}>Document original</button><button type="button" role="tab" aria-selected={mode === "transcription"} onClick={() => setMode("transcription")}>Lire la transcription</button></div>
      {mode === "document" && <div className="archive-viewer-actions">
        <button type="button" onClick={() => setZoom(value => clamp(value - 25))} aria-label="Réduire le document">−</button>
        <button type="button" onClick={() => setZoom(100)}>100%</button>
        <button type="button" onClick={() => setZoom(value => clamp(value + 25))} aria-label="Agrandir le document">+</button>
        <button type="button" onClick={toggleFullscreen} aria-label="Afficher en plein écran">⛶</button>
      </div>}
    </header>
    {mode === "document" ? <div className="archive-viewer-viewport" onDoubleClick={() => setZoom(value => value === 100 ? 200 : 100)}>
      <div className="archive-viewer-canvas" style={{ width: `${zoom}%` }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 55vw" priority />
      </div>
    </div> : <article className="archive-transcription" role="tabpanel"><header><span>Transcription fidèle</span><h2>« {title} »</h2><p>Orthographe et formulation du document conservées. La ponctuation et les accents ont été harmonisés pour faciliter la lecture.</p></header>{transcription.map((paragraph,index) => index === 0 ? <p className="archive-transcription-subtitle" key={index}>{paragraph}</p> : <p key={index}>{paragraph}</p>)}<footer><span>IMACHE AMAR</span><small>Transcription établie à partir de la page numérisée. Tout passage incertain pourra être corrigé après confrontation avec une reproduction de meilleure définition.</small></footer></article>}
    <figcaption>{mode === "document" ? caption : "Texte transcrit pour la lecture et la recherche"}<span>{mode === "document" ? "Double-cliquez sur le document pour agrandir" : `${transcription.length} paragraphes`}</span></figcaption>
  </figure>;
}
