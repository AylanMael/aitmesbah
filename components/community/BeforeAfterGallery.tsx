"use client";

import { useState } from "react";
import Image from "next/image";

export interface HeritageComparison {
  id: string;
  title: string;
  location: string;
  periodBefore: string;
  periodAfter: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  details: string[];
}

interface BeforeAfterGalleryProps {
  comparisons?: HeritageComparison[];
}

export default function BeforeAfterGallery({ comparisons = [] }: BeforeAfterGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"after" | "before" | "split">("after");

  const current = comparisons[selectedIndex];

  return (
    <div className="before-after-gallery bg-[#08281f] border border-[#d7b56f]/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#ffffff15] pb-6">
        <div>
          <span className="bg-[#e9c982] text-[#08281f] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
            🏛️ Mémoire & Patrimoine
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white font-bold">
            Galerie de la Mémoire & des Lieux du Village
          </h3>
          <p className="text-xs text-[#c8d6d0]">
            Comparaisons photographiques et aménagement des espaces d&apos;Aït Mesbah.
          </p>
        </div>

        {/* View Mode Selector Buttons */}
        {comparisons.length > 0 && (
          <div className="flex items-center gap-2 bg-[#051d17] p-1.5 rounded-full border border-[#ffffff15]">
            <button
              type="button"
              onClick={() => setActiveTab("before")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                activeTab === "before" ? "bg-[#aa593c] text-white shadow" : "text-[#c8d6d0] hover:text-white"
              }`}
            >
              📜 Archive
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("after")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                activeTab === "after" ? "bg-[#103b30] text-[#efd094] border border-[#d7b56f]/40 shadow" : "text-[#c8d6d0] hover:text-white"
              }`}
            >
              ✨ Actuel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("split")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                activeTab === "split" ? "bg-[#e9c982] text-[#08281f] shadow font-extrabold" : "text-[#c8d6d0] hover:text-white"
              }`}
            >
              ↔ Comparaison
            </button>
          </div>
        )}
      </div>

      {comparisons.length > 0 ? (
        <>
          {/* Comparisons Selector Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {comparisons.map((comp, idx) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-2xl border transition-all whitespace-nowrap ${
                  selectedIndex === idx
                    ? "bg-[#0b3329] border-[#e9c982] text-[#e9c982] font-bold shadow-lg"
                    : "bg-[#061f19] border-[#ffffff10] text-[#c8d6d0] hover:border-[#ffffff30]"
                }`}
              >
                {comp.title}
              </button>
            ))}
          </div>

          {/* Visual Display Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Images Frame */}
            <div className="lg:col-span-8">
              {activeTab === "split" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative h-[320px] rounded-2xl overflow-hidden border border-[#ffffff15] group">
                    <Image
                      src={current.beforeImg}
                      alt={`Avant - ${current.title}`}
                      fill
                      className="object-cover filter sepia-[0.3] contrast-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#aa593c] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      📜 {current.periodBefore}
                    </div>
                  </div>
                  <div className="relative h-[320px] rounded-2xl overflow-hidden border border-[#d7b56f]/40 group">
                    <Image
                      src={current.afterImg}
                      alt={`Après - ${current.title}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#103b30] border border-[#d7b56f]/50 text-[#efd094] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      ✨ {current.periodAfter}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-[380px] rounded-2xl overflow-hidden border border-[#d7b56f]/40 shadow-2xl">
                  <Image
                    src={activeTab === "before" ? current.beforeImg : current.afterImg}
                    alt={current.title}
                    fill
                    className={`object-cover ${activeTab === "before" ? "sepia-[0.3]" : ""}`}
                  />
                  <div className="absolute top-4 left-4 bg-[#08281fe6] backdrop-blur-md border border-[#d7b56f]/40 text-[#efd094] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {activeTab === "before" ? `📜 ${current.periodBefore}` : `✨ ${current.periodAfter}`}
                  </div>
                </div>
              )}
            </div>

            {/* Text Explanations */}
            <div className="lg:col-span-4 bg-[#061f19] p-6 rounded-2xl border border-[#ffffff15] space-y-4">
              <span className="text-xs text-[#efd094] font-bold uppercase tracking-wider block">
                📍 {current.location}
              </span>
              <h4 className="font-serif text-2xl font-bold text-white">{current.title}</h4>
              <p className="text-xs text-[#c8d6d0] leading-relaxed text-justify">
                {current.description}
              </p>

              {current.details && current.details.length > 0 && (
                <div className="pt-3 border-t border-[#ffffff10] space-y-2">
                  <span className="text-[11px] font-bold text-[#e9c982] uppercase tracking-wider block">
                    🔧 Remarques :
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#dbe5e0]">
                    {current.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#e9c982]">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[#061f19] border border-[#ffffff15] p-8 rounded-2xl text-center space-y-3">
          <span className="text-4xl">🖼️</span>
          <h4 className="font-serif text-xl font-bold text-white">
            Espace d&apos;Archives Photographiques
          </h4>
          <p className="text-xs text-[#c8d6d0] max-w-md mx-auto leading-relaxed">
            Les clichés anciens et les documentations de lieux seront ajoutés à mesure de leur vérification par les contributeurs du village.
          </p>
        </div>
      )}
    </div>
  );
}
