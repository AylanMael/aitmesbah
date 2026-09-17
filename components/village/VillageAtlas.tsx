"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import VillageTopographicSchema from "./VillageTopographicSchema";
import { villageDistricts } from "@/data/village-atlas";

export const districtCoords = [
  { x: 62, y: 64, lat: 36.6152, lon: 4.0645, category: "quartier", icon: "🏔️", name: "Aït Moussa", altitude: "780m · Sommet Ighf Ouguemoune" },
  { x: 55, y: 60, lat: 36.6141, lon: 4.0628, category: "memoire", icon: "🏛️", name: "Aït Salah", altitude: "740m · Maison Amar Imache" },
  { x: 52, y: 53, lat: 36.6123, lon: 4.0618, category: "memoire", icon: "🕊️", name: "Tanajelte", altitude: "710m · Cœur du village" },
  { x: 48, y: 46, lat: 36.6115, lon: 4.0592, category: "quartier", icon: "🕌", name: "Tassast", altitude: "690m · Quartier historique" },
  { x: 42, y: 40, lat: 36.6095, lon: 4.0575, category: "equipement", icon: "🏫", name: "Lakouyathe", altitude: "670m · École primaire" },
  { x: 38, y: 50, lat: 36.6082, lon: 4.0610, category: "quartier", icon: "☀️", name: "Timizart Oussamar", altitude: "685m · Versant Oussamar" },
  { x: 66, y: 46, lat: 36.6148, lon: 4.0672, category: "fontaine", icon: "⛲", name: "El Hammam", altitude: "630m · Sources & Vallon" },
  { x: 32, y: 64, lat: 36.6065, lon: 4.0545, category: "equipement", icon: "🫒", name: "Ighil Oussamar", altitude: "650m · CEM & Huileries" },
  { x: 72, y: 22, lat: 36.6210, lon: 4.0720, category: "quartier", icon: "📍", name: "Ighil Hammou", altitude: "610m · Limite Ath Douala" },
];

export default function VillageAtlas() {
  const [active, setActive] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [mapMode, setMapMode] = useState<"satellite" | "embed" | "maps" | "schema">("satellite");
  const district = villageDistricts[active];
  const activeCoord = districtCoords[active] || districtCoords[0];

  const categories = [
    { id: "all", label: "Tous les lieux", icon: "🗺️" },
    { id: "quartier", label: "Quartiers & Relief", icon: "🏔️" },
    { id: "fontaine", label: "Fontaines & Sources (Tala)", icon: "⛲" },
    { id: "memoire", label: "Lieux de Mémoire & Imache", icon: "🏛️" },
    { id: "equipement", label: "Écoles & Huileries", icon: "🫒" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#08281f] border border-[#ffffff1c] rounded-2xl shadow-lg">
        <span className="text-xs font-bold uppercase tracking-widest text-[#efd094]">
          Filtres de l&apos;Atlas :
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                categoryFilter === cat.id
                  ? "bg-[#aa593c] text-white shadow scale-105"
                  : "bg-[#103b30] text-[#c8d6d0] border border-[#ffffff15] hover:border-[#efd094]"
              }`}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Atlas (Carte à gauche 1.4fr + Volet d'info à droite 0.6fr) */}
      <div className="atlas-explorer">
        <div className="atlas-constellation" aria-label="Sélectionner un quartier sur la carte d’Aït Mesbah">
          {/* Layer Carte (Satellite HD, OpenStreetMap Dynamic, Maps ou Schéma) */}
          {mapMode === "satellite" ? (
            <div className="atlas-map-layer relative w-full h-full min-h-[580px]">
              <iframe
                title={`Vue Satellite HD d'Aït Mesbah - ${activeCoord.name}`}
                src={`https://maps.google.com/maps?q=${activeCoord.lat},${activeCoord.lon}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                className="atlas-map-iframe w-full h-full min-h-[580px] border-0 filter brightness-95 contrast-105"
                loading="lazy"
              />
              <div className="atlas-map-overlay pointer-events-none" />
            </div>
          ) : mapMode === "embed" ? (
            <div className="atlas-map-layer atlas-map-locked">
              <iframe
                title={`Carte OpenStreetMap d'Aït Mesbah - ${activeCoord.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeCoord.lon - 0.005}%2C${activeCoord.lat - 0.004}%2C${activeCoord.lon + 0.005}%2C${activeCoord.lat + 0.004}&layer=mapnik&marker=${activeCoord.lat}%2C${activeCoord.lon}`}
                className="atlas-map-iframe"
                loading="lazy"
              />
              <div className="atlas-map-overlay" />
            </div>
          ) : mapMode === "maps" ? (
            <div className="atlas-map-layer">
              <Image
                src="/images/carte-ait-mesbah-maps.png"
                alt="Carte géographique d’Aït Mesbah (Aït Douala, Kabylie)"
                fill
                sizes="(max-width: 900px) 100vw, 65vw"
                className="atlas-map-img"
                priority
              />
              <div className="atlas-map-overlay" />
            </div>
          ) : (
            <VillageTopographicSchema
              activeDistrictIndex={active}
              onSelectDistrict={(index) => setActive(index)}
              categoryFilter={categoryFilter}
            />
          )}

          {/* Selector Map Mode */}
          <div className="atlas-mode-selector" role="group" aria-label="Mode d’affichage de la carte">
            <button
              type="button"
              className={mapMode === "satellite" ? "active" : ""}
              onClick={() => setMapMode("satellite")}
              aria-pressed={mapMode === "satellite"}
            >
              🛰️ Vue Satellite HD
            </button>
            <button
              type="button"
              className={mapMode === "embed" ? "active" : ""}
              onClick={() => setMapMode("embed")}
              aria-pressed={mapMode === "embed"}
            >
              🌐 OpenStreetMap
            </button>
            <button
              type="button"
              className={mapMode === "maps" ? "active" : ""}
              onClick={() => setMapMode("maps")}
              aria-pressed={mapMode === "maps"}
            >
              🗺️ Image HD
            </button>
            <button
              type="button"
              className={mapMode === "schema" ? "active" : ""}
              onClick={() => setMapMode("schema")}
              aria-pressed={mapMode === "schema"}
            >
              ✏️ Schéma Vectoriel
            </button>
          </div>

          {/* Real GPS Telemetry Overlay Bar */}
          <div className="absolute top-4 left-4 z-10 bg-[#061f19]/90 border border-[#d7b56f]/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-white shadow-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 font-bold text-[#efd094]">
              <span>📍 {activeCoord.icon} {activeCoord.name}</span>
              <span className="text-[10px] bg-[#aa593c] px-2 py-0.5 rounded-full text-white">
                {activeCoord.altitude}
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#c8d6d0]">
              GPS : {activeCoord.lat.toFixed(4)}° N, {activeCoord.lon.toFixed(4)}° E
            </div>
          </div>

          {/* Pins Overlay (Visible on satellite/embed/maps modes) */}
          {mapMode !== "schema" &&
            villageDistricts.map((item, index) => {
              const coords = districtCoords[index] || { x: 50, y: 50, category: "quartier", icon: "📍" };
              const isSelected = active === index;
              const isVisible = categoryFilter === "all" || coords.category === categoryFilter;

              if (!isVisible) return null;

              return (
                <button
                  key={item.slug}
                  className={`atlas-dot-pin ${isSelected ? "active" : ""}`}
                  style={{
                    "--atlas-x": `${coords.x}%`,
                    "--atlas-y": `${coords.y}%`,
                  } as CSSProperties}
                  onClick={() => setActive(index)}
                  aria-label={`Quartier ${item.index} : ${item.name}`}
                  aria-pressed={isSelected}
                >
                  <span className="atlas-dot-core">
                    <span className="atlas-dot-num text-xs font-bold">{coords.icon}</span>
                    <span className="atlas-dot-pulse" aria-hidden="true" />
                  </span>
                  <span className="atlas-dot-label shadow-xl">
                    <small>{item.index}</small>
                    <strong>{item.name}</strong>
                  </span>
                </button>
              );
            })}

          {/* Direct GPS Link Footer */}
          <div className="atlas-credits-bar">
            <small>Aït Mesbah (Ath Douala · Wilaya de Tizi Ouzou) · Coordonnées géographiques certifiées</small>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeCoord.lat},${activeCoord.lon}`}
              target="_blank"
              rel="noreferrer"
              className="atlas-hd-link font-bold text-[#efd094]"
            >
              Ouvrir dans Google Maps / Waze ↗
            </a>
          </div>
        </div>

        {/* Volet d'information du quartier sélectionné */}
        <article className="atlas-focus animate-fadeIn" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#efd094] font-bold">
              {district.index} · Quartier documenté
            </span>
            <span className="text-xl">
              {activeCoord.icon}
            </span>
          </div>

          <h2 className="text-3xl font-serif text-white mt-1 mb-2">{district.name}</h2>
          <div className="inline-block bg-[#103b30] text-[#efd094] border border-[#d7b56f]/30 text-xs px-3 py-1 rounded-full font-mono mb-3">
            {activeCoord.altitude}
          </div>

          <p className="text-[#c8d6d0] text-sm leading-relaxed">{district.note}</p>

          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs uppercase text-[#efd094] font-bold">Situation & Relief</dt>
              <dd className="text-sm text-white font-medium">{district.situation}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[#efd094] font-bold">Lieux & Repères emblématiques</dt>
              <dd className="atlas-landmarks-list flex flex-wrap gap-2 mt-1">
                {district.landmarks.map((lm, i) => (
                  <span key={i} className="atlas-landmark-tag bg-[#103b30] text-[#efd094] px-3 py-1 rounded-full text-xs font-semibold border border-[#ffffff15]">
                    📍 {lm}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-[#efd094] font-bold">Coordonnées GPS</dt>
              <dd className="text-xs font-mono text-[#efd094]">
                {activeCoord.lat.toFixed(4)}° N, {activeCoord.lon.toFixed(4)}° E
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2 mt-6">
            <Link
              href={`/contribuer?category=places_heritage&title=Mémoire du quartier ${encodeURIComponent(district.name)}#envoyer`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#aa593c] hover:bg-[#ab4a2f] text-white text-xs font-bold rounded-full transition-colors shadow-lg"
            >
              <span>Enrichir ce quartier de la carte</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeCoord.lat},${activeCoord.lon}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#103b30] hover:bg-[#164a3a] text-[#efd094] text-xs font-semibold rounded-full border border-[#d7b56f]/40 transition-colors"
            >
              <span>Navigation GPS directe ↗</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}


