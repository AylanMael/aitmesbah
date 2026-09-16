"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useCallback } from "react";
import "./image-archive-viewer.css";

type Props = { src: string; alt: string; aspectRatio?: string; title?: string };

export default function ImageArchiveViewer({ src, alt, aspectRatio, title = "Document original" }: Props) {
  const titleId = useId();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [filterMode, setFilterMode] = useState<"normal" | "contrast" | "invert">("normal");
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const viewerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number) => Math.min(300, Math.max(75, value));

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(100);
    setRotation(0);
    setFilterMode("normal");
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

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

  const getFilterStyle = () => {
    if (filterMode === "contrast") return "contrast(1.4) grayscale(1)";
    if (filterMode === "invert") return "invert(0.9) contrast(1.2)";
    return "none";
  };

  // Mouse / Touch Drag (Pan) logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 100 || !viewportRef.current) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !viewportRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    viewportRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    viewportRef.current.scrollTop = dragStart.current.scrollTop - dy;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture release fails
      }
    }
  };

  return <section className="village-archive-document" aria-labelledby={titleId} ref={viewerRef}>
    <header className="village-archive-toolbar">
      <div>
        <p id={titleId}>{title}</p>
        <span>{zoom > 100 ? "Glissez l'image ou utilisez les flèches pour vous déplacer" : "Double-cliquez ou zoomez pour explorer les détails"}</span>
      </div>
      <div className="village-archive-zoom" aria-label="Commandes de la visionneuse">
        <button type="button" disabled={zoom === 75} onClick={() => setZoom(value => clamp(value - 25))} aria-label="Réduire (−)">−</button>
        <button type="button" onClick={resetZoom} aria-label={`Zoom actuel : ${zoom} %. Cliquer pour réinitialiser`}>{zoom}%</button>
        <button type="button" disabled={zoom === 300} onClick={() => setZoom(value => clamp(value + 25))} aria-label="Agrandir (+)">+</button>
        <button type="button" onClick={() => setRotation(r => (r + 90) % 360)} title="Tourner l'image de 90°">↻ {rotation}°</button>
        <button
          type="button"
          onClick={() => setFilterMode(prev => prev === "normal" ? "contrast" : prev === "contrast" ? "invert" : "normal")}
          title="Mode de rendu pour révéler les détails">
          🧪 {filterMode === "normal" ? "Normal" : filterMode === "contrast" ? "Contraste" : "Négatif"}
        </button>
        <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen} aria-label={fullscreen ? "Quitter le mode plein écran" : "Afficher en plein écran"}>⛶</button>
      </div>
    </header>
    <p className="archive-viewer-status" role="status">{message || `Niveau de zoom : ${zoom} %`}</p>
    <div
      className={`village-archive-viewport ${zoom > 100 ? (isDragging ? "is-grabbing" : "is-grabbable") : ""}`}
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-label={`${title} : image à explorer. Touches + et - pour zoomer, 0 pour réinitialiser, flèches directionnelles pour glisser.`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (["+", "=", "-", "0"].includes(event.key)) {
          event.preventDefault();
          if (event.key === "0") resetZoom();
          else setZoom(value => clamp(value + (event.key === "-" ? -25 : 25)));
        } else if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          setRotation(r => (r + 90) % 360);
        } else if (event.key.toLowerCase() === "f") {
          event.preventDefault();
          setFilterMode(prev => prev === "normal" ? "contrast" : prev === "contrast" ? "invert" : "normal");
        } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && viewportRef.current && zoom > 100) {
          event.preventDefault();
          const step = 60;
          if (event.key === "ArrowUp") viewportRef.current.scrollTop -= step;
          if (event.key === "ArrowDown") viewportRef.current.scrollTop += step;
          if (event.key === "ArrowLeft") viewportRef.current.scrollLeft -= step;
          if (event.key === "ArrowRight") viewportRef.current.scrollLeft += step;
        }
      }}
      onDoubleClick={() => { if (zoom === 100) setZoom(200); else resetZoom(); }}>
      <div className="village-archive-image" style={{
        width: `${zoom}%`,
        aspectRatio,
        transform: `rotate(${rotation}deg)`,
        filter: getFilterStyle(),
        transition: isDragging ? "none" : "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease, filter 0.3s ease"
      }}>
        <Image src={src} alt={alt} fill loading="lazy" sizes="(max-width: 900px) 100vw, 65vw" draggable={false} />
      </div>
    </div>
    <footer className="village-archive-tools">
      <p>Zoom : + / − / Double-clic · Touche [R] : Rotation · Touche [F] : Filtres d'examen d'archives</p>
      <a href={src} target="_blank" rel="noreferrer">Ouvrir le fichier original HD ↗</a>
    </footer>
  </section>;
}

