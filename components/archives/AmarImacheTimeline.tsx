"use client";

import { useState } from "react";
import Image from "next/image";

export interface ChronologyItem {
  year: string;
  title: string;
  body: string;
  category?: "jeunesse" | "etoile" | "ecrits" | "guerre" | "memoire";
  archiveImage?: string;
  archiveCaption?: string;
  hasInspector?: boolean;
}

interface AmarImacheTimelineProps {
  items: readonly (readonly [string, string, string])[];
  onOpenArchive?: (archiveData: {
    title: string;
    imageSrc: string;
    date: string;
    transcription?: string[];
  }) => void;
}

export default function AmarImacheTimeline({ items, onOpenArchive }: AmarImacheTimelineProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Toutes les périodes" },
    { id: "1895-1923", label: "1895–1923 · Jeunesse & Travail" },
    { id: "1924-1939", label: "1924–1939 · Étoile Nord-Africaine" },
    { id: "1940-1945", label: "1940–1945 · Captivité & Guerre" },
    { id: "1946-1960", label: "1946–1960 · Écrits & Mémoire" },
  ];

  const getYearNum = (yearStr: string) => {
    const match = yearStr.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 1900;
  };

  const filteredItems = items.filter(([year]) => {
    if (filterCategory === "all") return true;
    const y = getYearNum(year);
    if (filterCategory === "1895-1923") return y <= 1923;
    if (filterCategory === "1924-1939") return y >= 1924 && y <= 1939;
    if (filterCategory === "1940-1945") return y >= 1940 && y <= 1945;
    if (filterCategory === "1946-1960") return y >= 1946;
    return true;
  });

  return (
    <div className="imache-timeline-container space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#ffffff1c]">
        <span className="text-xs font-bold uppercase tracking-widest text-[#efd094] mr-2">
          Filtrer par époque :
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
              filterCategory === cat.id
                ? "bg-[#aa593c] text-white shadow-lg scale-105"
                : "bg-[#08281f] text-[#c8d6d0] border border-[#ffffff20] hover:border-[#efd094] hover:text-white"
            }`}
            onClick={() => setFilterCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="imache-dossier-years space-y-6">
        {filteredItems.map(([year, title, body], i) => {
          const isArchive1910 = year === "1910";
          return (
            <article
              key={year}
              className={`relative group transition-all duration-300 p-6 rounded-2xl bg-[#08281f]/80 border border-[#ffffff15] hover:border-[#d7b56f]/50 hover:bg-[#0d352a] ${
                isArchive1910 ? "imache-dossier-year-with-archive border-l-4 border-l-[#aa593c]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="imache-dossier-year text-3xl font-serif text-[#efd094] font-bold">
                  {year}
                </span>
                <span className="text-xs font-mono text-[#b6c3bd] opacity-70">
                  Étape {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif text-white font-medium mb-3 group-hover:text-[#efd094] transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-[#c8d6d0] leading-relaxed">{body}</p>

                {/* Specific 1910 Archive Exhibit */}
                {isArchive1910 && (
                  <figure className="imache-dossier-certificate mt-6 p-4 rounded-xl bg-[#051d17] border border-[#ffffff20]">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden group/img cursor-pointer"
                      onClick={() =>
                        onOpenArchive?.({
                          title: "Résultats du certificat d’études spécial — Le Petit Kabyle (1910)",
                          imageSrc: "/images/amar-imache/certificat-etudes-petit-kabyle-1910.png",
                          date: "9 juillet 1910",
                          transcription: [
                            "Le Petit Kabyle du 9 juillet 1910 récapitule les lauréats de l'école d'indigènes de Taguemount Oukerrouche.",
                            "Amar Imache y figure brillamment avec quatre autres lauréats d'Aït Mesbah : Guernine, Halès, Hemdani et Haouili.",
                          ],
                        })
                      }
                    >
                      <Image
                        src="/images/amar-imache/certificat-etudes-petit-kabyle-1910.png"
                        alt="Résultats du certificat d’études spécial aux écoles indigènes publiés dans Le Petit Kabyle du 9 juillet 1910"
                        fill
                        sizes="(max-width: 700px) 82vw, 360px"
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-xs text-[#efd094] font-semibold flex items-center gap-1.5">
                          🔍 Cliquer pour ouvrir la loupe d&apos;archive ↗
                        </span>
                      </div>
                    </div>

                    <figcaption className="mt-3 text-xs text-[#b6c3bd]">
                      <span className="text-[#efd094] font-bold block mb-1">
                        Archive scolaire · 09 juillet 1910 — Le Petit Kabyle
                      </span>
                      <p>
                        Résultats de l’école de Taguemount Oukerrouche. Amar Imache y figure avec 4 lauréats d’Aït Mesbah.
                      </p>
                    </figcaption>
                  </figure>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
