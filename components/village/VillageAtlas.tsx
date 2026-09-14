"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import { villageDistricts } from "@/data/village-atlas";

const districtCoords = [
  { x: 61, y: 67 }, // 0: Aït Moussa
  { x: 54, y: 63 }, // 1: Aït Salah
  { x: 53, y: 57 }, // 2: Tanajelt
  { x: 50, y: 50 }, // 3: Tassast
  { x: 44, y: 44 }, // 4: Lakouyathe
  { x: 38, y: 56 }, // 5: Timizart Oussamer
  { x: 64, y: 49 }, // 6: El Hammam
  { x: 34, y: 70 }, // 7: Ighil Oussamer
  { x: 70, y: 20 }, // 8: Ighil Hamou
];

export default function VillageAtlas() {
  const [active, setActive] = useState(0);
  const [mapMode, setMapMode] = useState<"embed" | "maps" | "schema">("embed");
  const district = villageDistricts[active];

  return (
    <div className="atlas-explorer">
      <div className="atlas-constellation" aria-label="Sélectionner un quartier sur la carte d’Aït Mesbah">
        {/* Layer Carte (OpenStreetMap Iframe comme /village, Image HD ou Schéma) - Vue Zoomée */}
        {mapMode === "embed" ? (
          <div className="atlas-map-layer atlas-map-locked">
            <iframe
              title="Carte OpenStreetMap d’Aït Mesbah - Vue zoomée"
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.050%2C36.604%2C4.073%2C36.620&layer=mapnik&marker=36.61233%2C4.06181"
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
          <svg viewBox="0 0 760 610" role="img" aria-label="Évocation topographique des quartiers principaux d’Aït Mesbah">
            <path d="M45 470C120 325 143 385 214 244S357 125 421 239s108 98 152 4 85-81 142-42" />
            <path d="M21 515c101-80 164-37 238-106s131-91 208-35 145 31 268-40" />
            <path d="M68 557c104-50 177-23 261-64s197-61 358-10" />
          </svg>
        )}

        {/* Commandes du mode de carte */}
        <div className="atlas-mode-selector" role="group" aria-label="Mode d’affichage de la carte">
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
            🗺️ Google Maps
          </button>
          <button
            type="button"
            className={mapMode === "schema" ? "active" : ""}
            onClick={() => setMapMode("schema")}
            aria-pressed={mapMode === "schema"}
          >
            ✏️ Schéma
          </button>
        </div>

        {/* Marqueurs points avec légende au survol */}
        {villageDistricts.map((item, index) => {
          const coords = districtCoords[index] || { x: 50, y: 50 };
          const isSelected = active === index;
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
                <span className="atlas-dot-num">{item.index}</span>
                <span className="atlas-dot-pulse" aria-hidden="true" />
              </span>
              <span className="atlas-dot-label">
                <small>{item.index}</small>
                <strong>{item.name}</strong>
              </span>
            </button>
          );
        })}

        <div className="atlas-credits-bar">
          <small>Carte d’Aït Mesbah (Ath Douala · Wilaya de Tizi Ouzou) · Repères de mémoire</small>
          <a
            href={
              mapMode === "embed"
                ? "https://www.openstreetmap.org/?mlat=36.61233&mlon=4.06181#map=14/36.61233/4.06181"
                : "/images/carte-ait-mesbah-maps.png"
            }
            target="_blank"
            rel="noreferrer"
            className="atlas-hd-link"
          >
            Ouvrir la carte détaillée ↗
          </a>
        </div>
      </div>

      <article className="atlas-focus" aria-live="polite">
        <span>{district.index} · Quartier principal</span>
        <h2>{district.name}</h2>
        <p>{district.note}</p>
        <dl>
          <div>
            <dt>Commune</dt>
            <dd>Aït Douala · Wilaya de Tizi Ouzou</dd>
          </div>
          <div>
            <dt>État du dossier</dt>
            <dd>En cours de documentation</dd>
          </div>
          <div>
            <dt>Contributions utiles</dt>
            <dd>Photos · récits d’habitants · noms de lieux</dd>
          </div>
        </dl>
        <Link href={`/contribuer?category=places_heritage&title=Mémoire du quartier ${encodeURIComponent(district.name)}#envoyer`}>
          Enrichir ce quartier <b aria-hidden="true">↗</b>
        </Link>
      </article>
    </div>
  );
}

