"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./archive-collection.css";

export type ArchiveCard = {
  id: string; title: string; summary: string; href: string;
  type: "Cartes" | "Photographies" | "Objets" | "Documents";
  date: string; source: string; image?: string; alt?: string;
};

const originals: ArchiveCard[] = [
  { id: "carte-1892", type: "Cartes", title: "Carte du douar des Beni Aïssi", date: "1892 · date transmise", source: "Notice en cours d’étude", summary: "Chemins, reliefs et implantations villageoises : une lecture du territoire dans une carte ancienne.", href: "/histoire-memoire/archives/carte-territoriale-1892", image: "/archives/village/carte-ait-mesbah-1892.webp", alt: "Carte ancienne du douar des Beni Aïssi" },
  { id: "poterie-1939", type: "Photographies", title: "Reportage à Aït Mesbah en 1939", date: "1939 · un cliché identifié", source: "Quai Branly — PP0193025 ; autres notices à retrouver", summary: "Seize photographies autour des gestes du décor, de la cuisson et des objets du quotidien.", href: "/histoire-memoire/archives/hiani-debia-1939", image: "/archives/poterie-1939/14.jpg", alt: "Une potière décore un récipient à anse" },
  { id: "peabody", type: "Objets", title: "Un pichet portant la mention Aït Mesbah", date: "Date non renseignée", source: "Peabody Museum, Harvard — 975-32-50/11891", summary: "Le nom du village sur l’étiquette d’un pichet kabyle : une piste pour retrouver le parcours d’un objet.", href: "/histoire-memoire/archives/pichet-ait-mesbah-peabody", image: "/archives/peabody/notice-125189.jpg", alt: "Capture du catalogue de Harvard présentant le pichet et sa notice" },
  { id: "tharkavthe", type: "Photographies", title: "Retour des champs à Tharkavthe", date: "Janvier 1966 · date transmise", source: "Témoignage local ; photographe à identifier", summary: "Femmes, jarres, paniers et troupeau sur un chemin vers Aït Mesbah, selon les informations transmises.", href: "/histoire-memoire/archives/retour-des-champs-1966", image: "/archives/vie-village/retour-des-champs-1966.jpg", alt: "Femmes portant jarres et paniers auprès d’un troupeau" },
];
const categories = ["Tout", "Cartes", "Photographies", "Objets", "Documents"] as const;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[’']/g, " ");

export default function ArchiveCollection({ publications }: { publications: ArchiveCard[] }) {
  const [category, setCategory] = useState<string>("Tout");
  const [query, setQuery] = useState("");
  useEffect(() => {
    function restoreSelection() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("archiveType");
      setCategory(categories.find(item => item === value) || "Tout");
      setQuery((params.get("archiveQuery") || "").slice(0, 160));
    }
    restoreSelection();
    window.addEventListener("popstate", restoreSelection);
    window.addEventListener("pageshow", restoreSelection);
    return () => {
      window.removeEventListener("popstate", restoreSelection);
      window.removeEventListener("pageshow", restoreSelection);
    };
  }, []);
  function select(nextCategory: string, nextQuery: string) {
    setCategory(nextCategory);
    setQuery(nextQuery);
    const url = new URL(window.location.href);
    if (nextCategory === "Tout") url.searchParams.delete("archiveType");
    else url.searchParams.set("archiveType", nextCategory);
    if (!nextQuery) url.searchParams.delete("archiveQuery");
    else url.searchParams.set("archiveQuery", nextQuery);
    url.hash = "archives";
    window.history.replaceState(window.history.state, "", url);
  }
  const entries = [...originals, ...publications];
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matches = entries.filter(entry => (category === "Tout" || entry.type === category) && words.every(word => normalize(`${entry.title} ${entry.summary} ${entry.date} ${entry.source} ${entry.type}`).includes(word)));
  return <div className="archive-collection">
    <div className="archive-collection-search"><label htmlFor="archive-search">Chercher dans la collection</label><input id="archive-search" type="search" maxLength={160} value={query} onChange={event => select(category, event.target.value)} placeholder="Un lieu, un métier, une année…" aria-controls="archive-results" /><small>Le lien de cette page conserve votre sélection : vous pouvez le partager ou y revenir avec le bouton précédent du navigateur.</small></div>
    <div className="archive-collection-filters" role="group" aria-label="Types de documents">{categories.map(item => <button key={item} type="button" aria-pressed={category === item} aria-controls="archive-results" onClick={() => select(item, query)}>{item}<span>{item === "Tout" ? entries.length : entries.filter(entry => entry.type === item).length}</span></button>)}</div>
    {(query || category !== "Tout") && <button type="button" onClick={() => select("Tout", "")}>Effacer les filtres</button>}
    <p className="archive-collection-count" role="status">{matches.length} {matches.length === 1 ? "document affiché" : "documents affichés"} sur {entries.length}</p>
    <div id="archive-results" className="archive-collection-grid">{matches.map(entry => <article key={entry.id}><Link href={entry.href}>
      <div className="archive-collection-image">{entry.image ? <img src={entry.image} alt={entry.alt || entry.title} loading="lazy" /> : <span aria-hidden="true">Document<br />du village</span>}<span className="archive-collection-open" aria-hidden="true">↗</span></div>
      <div className="archive-collection-copy"><p className="archive-collection-type">{entry.type} <span>· {entry.date}</span></p><h3>{entry.title}</h3><p>{entry.summary}</p><p className="archive-collection-source">{entry.source}</p><b>Ouvrir la fiche <span aria-hidden="true">→</span></b></div>
    </Link></article>)}</div>
    {!matches.length && <div className="archive-collection-empty"><h3>Aucun document ne correspond pour le moment.</h3><p>Essayez un autre mot ou explorez l’ensemble de la collection.</p><button type="button" onClick={() => select("Tout", "")}>Réinitialiser la recherche</button></div>}
  </div>;
}
