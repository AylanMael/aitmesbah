"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ArchiveInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt: string;
  title: string;
  date?: string;
  publication?: string;
  signature?: string;
  transcription?: readonly string[] | string;
  pdfUrl?: string;
  externalUrl?: string;
}

export default function ArchiveInspectorModal({
  isOpen,
  onClose,
  imageSrc,
  alt,
  title,
  date,
  publication,
  signature,
  transcription,
  pdfUrl,
  externalUrl,
}: ArchiveInspectorModalProps) {

  const [activeTab, setActiveTab] = useState<"visual" | "text">("visual");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [magnifierActive, setMagnifierActive] = useState<boolean>(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number; bgX: number; bgY: number }>({
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setLensPos({ x, y, bgX, bgY });
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  const formattedTranscription = Array.isArray(transcription)
    ? transcription
    : typeof transcription === "string"
    ? [transcription]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Inspecteur d'archive : ${title}`}
    >
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] bg-[#0d2d25] border border-[#d7b56f]/40 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff1a] bg-[#08221b]">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <div>
              <h3 className="font-serif text-xl text-[#efd094] leading-tight">{title}</h3>
              <p className="text-xs text-[#b6c3bd]">
                {publication && <span>{publication} · </span>}
                {date && <span>{date}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Nav Tabs */}
            <div className="flex bg-[#164a3a] p-1 rounded-full text-xs font-semibold">
              <button
                type="button"
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  activeTab === "visual"
                    ? "bg-[#aa593c] text-white shadow"
                    : "text-[#c8d6d0] hover:text-white"
                }`}
                onClick={() => setActiveTab("visual")}
              >
                🖼️ Document visuel
              </button>
              {formattedTranscription.length > 0 && (
                <button
                  type="button"
                  className={`px-4 py-1.5 rounded-full transition-colors ${
                    activeTab === "text"
                      ? "bg-[#aa593c] text-white shadow"
                      : "text-[#c8d6d0] hover:text-white"
                  }`}
                  onClick={() => setActiveTab("text")}
                >
                  📜 Transcription ({formattedTranscription.length})
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fermer l'inspecteur"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="relative flex-1 overflow-auto p-6 bg-[#09251e] flex flex-col items-center justify-center">
          {activeTab === "visual" ? (
            <div className="flex flex-col items-center justify-center w-full h-full relative">
              {/* Zoom Controls Bar */}
              <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-[#061f19]/90 border border-[#ffffff20] backdrop-blur-md px-3 py-1.5 rounded-full text-xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="px-2 py-1 hover:text-[#efd094] transition-colors"
                  title="Dézoomer"
                >
                  ➖
                </button>
                <span className="font-mono text-[#efd094]">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="px-2 py-1 hover:text-[#efd094] transition-colors"
                  title="Zoomer"
                >
                  ➕
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 border-l border-[#ffffff20] ml-1 hover:text-[#efd094] transition-colors"
                  title="Réinitialiser"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={() => setMagnifierActive((prev) => !prev)}
                  className={`px-2 py-1 rounded ml-1 transition-colors ${
                    magnifierActive
                      ? "bg-[#aa593c] text-white"
                      : "text-[#b6c3bd] hover:text-white"
                  }`}
                  title="Activer/Désactiver la loupe virtuelle"
                >
                  🔎 Loupe {magnifierActive ? "ON" : "OFF"}
                </button>
              </div>

              {/* Document Display Frame */}
              <div
                ref={containerRef}
                className="relative overflow-hidden cursor-crosshair rounded-lg border border-[#ffffff20] shadow-2xl max-w-full max-h-[72vh] flex items-center justify-center"
                onMouseEnter={() => magnifierActive && setMagnifierActive(true)}
                onMouseLeave={() => setMagnifierActive(false)}
                onMouseMove={handleMouseMove}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={imageSrc}
                  alt={alt}
                  width={1200}
                  height={1600}
                  className="object-contain max-h-[70vh] w-auto select-none"
                  priority
                />

                {/* Virtual Magnifier Lens */}
                {magnifierActive && (
                  <div
                    className="absolute w-48 h-48 border-2 border-[#efd094] rounded-full pointer-events-none shadow-2xl z-30"
                    style={{
                      top: `${lensPos.y - 96}px`,
                      left: `${lensPos.x - 96}px`,
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: "300%",
                      backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                      boxShadow: "0 0 25px rgba(0,0,0,0.7), inset 0 0 15px rgba(255,255,255,0.3)",
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Transcription Tab */
            <div className="w-full max-w-3xl bg-[#08281f] border border-[#ffffff1e] p-8 rounded-xl overflow-y-auto max-h-[72vh] shadow-inner font-serif text-lg leading-relaxed text-[#e7ebe7]">
              <div className="mb-6 pb-4 border-b border-[#ffffff1a] flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#efd094] font-sans font-bold">
                    Transcription textuelle intégrale
                  </span>
                  <h4 className="text-2xl font-serif text-white mt-1">{title}</h4>
                </div>
                {signature && (
                  <span className="text-xs bg-[#aa593c]/30 text-[#efd094] px-3 py-1 rounded-full font-sans border border-[#aa593c]/50">
                    Signé : {signature}
                  </span>
                )}
              </div>

              <div className="space-y-4 text-justify">
                {formattedTranscription.map((paragraph, idx) => (
                  <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#efd094] first-letter:mr-1">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#08221b] border-t border-[#ffffff1a] flex items-center justify-between text-xs text-[#b6c3bd]">
          <span>Survoler l&apos;image avec la loupe pour examiner les détails d&apos;archive.</span>
          <div className="flex items-center gap-4">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#efd094] hover:underline font-semibold bg-[#103b30] px-3 py-1 rounded-full border border-[#d7b56f]/30"
              >
                🏛️ Notice Archives Nationales (SIV) ↗
              </a>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#efd094] hover:underline font-semibold"
              >
                📄 Télécharger le document PDF original ↗
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
