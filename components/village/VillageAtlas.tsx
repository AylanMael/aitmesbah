"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import { villageDistricts } from "@/data/village-atlas";

export default function VillageAtlas() {
  const [active, setActive] = useState(0);
  const district = villageDistricts[active];
  return <div className="atlas-explorer">
    <div className="atlas-constellation" aria-label="Sélectionner un quartier">
      <svg viewBox="0 0 760 610" role="img" aria-label="Évocation topographique des quartiers principaux d’Aït Mesbah — positions non cartographiques">
        <path d="M45 470C120 325 143 385 214 244S357 125 421 239s108 98 152 4 85-81 142-42"/><path d="M21 515c101-80 164-37 238-106s131-91 208-35 145 31 268-40"/><path d="M68 557c104-50 177-23 261-64s197-61 358-10"/>
      </svg>
      {villageDistricts.map((item, index) => <button key={item.slug} className={active === index ? "active" : ""} style={{"--atlas-x": `${12 + (index * 31) % 77}%`, "--atlas-y": `${18 + (index * 47) % 67}%`} as CSSProperties} onClick={() => setActive(index)} aria-pressed={active === index}><span>{item.index}</span><strong>{item.name}</strong></button>)}
      <small>Évocation sensible · pas une carte de délimitation</small>
    </div>
    <article className="atlas-focus" aria-live="polite"><span>{district.index} · Quartier principal</span><h2>{district.name}</h2><p>{district.note}</p><dl><div><dt>État du dossier</dt><dd>À construire</dd></div><div><dt>Contributions utiles</dt><dd>Photos · récits · noms de lieux</dd></div></dl><Link href={`/contribuer?category=places_heritage&title=Mémoire du quartier ${encodeURIComponent(district.name)}#envoyer`}>Enrichir ce quartier <b aria-hidden="true">↗</b></Link></article>
  </div>;
}
