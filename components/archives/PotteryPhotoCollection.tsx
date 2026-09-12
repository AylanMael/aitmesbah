"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import "./pottery-collection.css";

const photos = [
  [16, "Les décors", "Deux artisanes au travail"],
  [14, "Les décors", "Hiani Debia décorant une poterie"],
  [15, "Les décors", "Des lignes tracées à la main"],
  [11, "Les décors", "Autour d’une pièce élancée"],
  [12, "Les décors", "Le détail des anses et des motifs"],
  [13, "Les décors", "Le travail dans la cour"],
  [1, "Les décors", "Autour d’une coupe sur pied"],
  [2, "Les décors", "Une coupe, un moment de vie"],
  [10, "La cuisson", "Disposer les récipients au sol"],
  [9, "La cuisson", "Réunir les pièces"],
  [8, "La cuisson", "Ajuster la disposition des poteries"],
  [6, "La cuisson", "Recouvrir les pièces de combustible"],
  [5, "La cuisson", "Préparer le feu"],
  [3, "La cuisson", "Auprès des braises"],
  [4, "La cuisson", "Une autre vue de la cuisson au sol"],
  [17, "Les objets au quotidien", "Porter les poteries sur un chemin du village"],
] as const;
const groups = ["Les décors", "La cuisson", "Les objets au quotidien"] as const;
const documentary = {
  "Les décors": {
    title: "Décorer les pièces, un geste après l’autre",
    text: "Sur ces photographies anciennes, les artisanes travaillaient assises, les récipients maintenus entre les mains ou posés devant elles. Elles intervenaient sur des formes déjà façonnées : coupes sur pied, pièces à anses et petits récipients. Les vues rapprochées permettent de suivre le tracé manuel des lignes, des points et des motifs géométriques qui épousaient chaque forme.",
  },
  "La cuisson": {
    title: "Cuire les poteries au sol",
    text: "Cette partie de la série montre les récipients regroupés au sol, puis entourés et recouverts de combustible. Une femme intervenait auprès des pièces avec une longue branche ; d’autres vues montrent les cendres et la fumée. L’installation visible est une aire de cuisson au sol, et non un four maçonné. Les clichés ne renseignent ni la durée de cuisson ni la température atteinte.",
  },
  "Les objets au quotidien": {
    title: "Des objets portés à travers le village",
    text: "La dernière photographie montre deux personnes transportant de grands récipients sur un chemin bordé de pierres. Elle replace les poteries hors de l’espace de fabrication, dans le paysage habité. Leur destination et l’usage précis de ces pièces ne sont pas indiqués par l’image.",
  },
} as const;
const source = (id: number) => `/archives/poterie-1939/${id}.jpg`;
const verifiedCredit = "Thérèse Rivière · 1939 · Aït Mesbah. Musée du quai Branly – Jacques Chirac, ancienne photothèque du musée de l’Homme. Réf. PP0193025.";

export default function PotteryPhotoCollection() {
  const [group, setGroup] = useState<keyof typeof documentary>("Les décors");
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const photo = photos[selected];
  function open(index: number) { setSelected(index); setZoom(100); dialog.current?.showModal(); viewport.current?.scrollTo(0, 0); }
  function move(direction: number) { setSelected(value => (value + direction + photos.length) % photos.length); setZoom(100); viewport.current?.scrollTo(0, 0); }
  return <section className="pottery-collection" id="photographies-1939" aria-labelledby="pottery-collection-title">
    <header className="pottery-collection-heading">
      <p className="craft-label">Archives photographiques · 1939</p>
      <h2 id="pottery-collection-title">La poterie d’autrefois, en images.</h2>
      <p>En 1939, Thérèse Rivière photographiait la potière Hiani Debia à Aït Mesbah. Une notice du musée du quai Branly – Jacques Chirac identifie ce geste de décoration. Autour de cette image retrouvée, ce dossier rassemble les photographies transmises pour raconter le travail de la poterie autrefois, du décor à la cuisson.</p>
      <p className="pottery-documentary-scope">Un témoignage sur des pratiques anciennes, et non un reportage sur la fabrication actuelle. La préparation de l’argile et le façonnage ne sont pas clairement documentés dans cette série.</p>
    </header>
    <div className="pottery-collection-meta"><span>1 cliché identifié · 15 notices à retrouver</span><span>16 photographies</span><span>Cadrages originaux conservés</span></div>
    <div className="pottery-filters" role="group" aria-label="Parcourir les photographies par thème">{groups.map(item => <button type="button" key={item} aria-pressed={item === group} onClick={() => setGroup(item)}>{item}<span>{photos.filter(photo => photo[1] === item).length.toString().padStart(2, "0")}</span></button>)}</div>
    <div className="pottery-documentary-text" aria-live="polite"><p className="craft-label">Comprendre les images d’archives</p><h3>{documentary[group].title}</h3><p>{documentary[group].text}</p></div>
    <div className="pottery-photo-grid">{photos.map((item, index) => item[1] === group && <figure className="pottery-photo-entry" key={item[0]}><button className="pottery-photo" type="button" onClick={() => open(index)} aria-label={`Agrandir : ${item[2]}`}>
      <span className="pottery-photo-frame"><Image src={source(item[0])} alt={item[2]} width={920} height={960} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 28vw" /><span className="pottery-photo-enlarge" aria-hidden="true">Agrandir ↗</span></span>
      <span className="pottery-photo-caption"><small>{String(index + 1).padStart(2, "0")}</small><span>{item[2]}</span></span>
    </button><figcaption className="pottery-photo-credit">{item[0] === 14 ? <><strong>Source identifiée</strong><p>{verifiedCredit}</p><a href="https://collections.quaibranly.fr/" target="_blank" rel="noreferrer">Catalogue du musée · rechercher PP0193025 ↗</a></> : <><strong>Notice à retrouver</strong><p>Date de 1939 et attribution à Aït Mesbah transmises avec l’envoi, à confirmer pour ce cliché.</p></>}</figcaption></figure>)}</div>
    <details className="pottery-notice"><summary>Lire la notice documentaire</summary>
      <p><strong>Date et lieu transmis :</strong> 1939, « Douar Bi Aïssi, village Ait Mesbah ». Ces indications restent à rapprocher des notices originales.</p>
      <p><strong>Une photographie identifiée :</strong> le cliché intitulé ici « Hiani Debia décorant une poterie » correspond à la notice PP0193025 du musée du quai Branly – Jacques Chirac. Son titre historique est « Décor ». La notice attribue la photographie à Thérèse Rivière, la date de 1939 et nomme la potière Hiani Debia, à Aït Mesbah. Le PDF de cette notice a été transmis et vérifié ; il documente un tirage argentique de 9 × 14 cm.</p>
      <p><a href="https://collections.quaibranly.fr/" target="_blank" rel="noreferrer">Consulter le catalogue du musée</a> — rechercher « Hiani » ou « PP0193025 ». Cette identification rejoint le nom de famille transmis avec l’envoi ; elle ne vaut pas identification de toutes les personnes sur les autres clichés.</p>
      <p>Le parcours est thématique : il ne restitue pas un ordre de prise de vue établi. Ces images montrent surtout le décor et la cuisson ; elles ne permettent pas de présenter toutes les étapes de préparation de l’argile et de façonnage.</p>
      <p>Les références des autres photographies et les conditions de reproduction de l’ensemble restent à vérifier. Un fichier présent deux fois dans l’envoi n’est affiché qu’une seule fois.</p>
    </details>
    <dialog ref={dialog} className="pottery-lightbox" aria-labelledby="pottery-photo-title" onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <header><div><small>Archives · {photo[0] === 14 ? "1939 · source identifiée" : "1939 · date transmise"} · {selected + 1} / {photos.length} · {photo[1]}</small><h3 id="pottery-photo-title">{photo[2]}</h3></div><button type="button" onClick={() => dialog.current?.close()}>Fermer ×</button></header>
      <div className="pottery-lightbox-controls"><button type="button" onClick={() => move(-1)} aria-label="Photographie précédente">←</button><button type="button" disabled={zoom <= 100} onClick={() => setZoom(value => Math.max(100, value - 25))} aria-label="Réduire">−</button><button type="button" onClick={() => { setZoom(100); viewport.current?.scrollTo(0, 0); }} aria-label="Réinitialiser le zoom">{zoom} %</button><button type="button" disabled={zoom >= 300} onClick={() => setZoom(value => Math.min(300, value + 25))} aria-label="Agrandir">+</button><button type="button" onClick={() => move(1)} aria-label="Photographie suivante">→</button></div>
      <div className="pottery-lightbox-viewport" ref={viewport} tabIndex={0} aria-label="Photographie agrandie, zone défilable"><div style={{ width: `${zoom}%` }}><Image src={source(photo[0])} alt={photo[2]} width={920} height={960} sizes="90vw" /></div></div>
      <footer><div><p>{photo[0] === 14 ? verifiedCredit : "Photographe et collection à identifier. Date et lieu transmis avec l’envoi, non confirmés pour ce cliché."}</p><p>Utilisez le zoom puis faites défiler l’image pour observer les détails.</p></div><a href={source(photo[0])} target="_blank" rel="noreferrer">Ouvrir le fichier reçu ↗</a></footer>
    </dialog>
  </section>;
}
