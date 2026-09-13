import Link from "next/link";
import "./archive-discovery.css";

const routes = {
  pottery: { href: "/artisanat/poterie", label: "Un savoir-faire", title: "La poterie, des gestes aux usages", text: "Explorer les formes, les décors et la place des récipients dans la vie quotidienne." },
  reportage: { href: "/histoire-memoire/archives/hiani-debia-1939", label: "Un regard documentaire", title: "Le reportage photographique de 1939", text: "Observer les gestes du décor et de la cuisson dans une série de photographies anciennes." },
  pitcher: { href: "/histoire-memoire/archives/pichet-ait-mesbah-peabody", label: "Un objet conservé", title: "Le pichet du Peabody Museum", text: "Lire une notice de collection dont l’étiquette mentionne Aït Mesbah." },
  daily: { href: "/histoire-memoire/archives/retour-des-champs-1966", label: "Une scène du quotidien", title: "Retour des champs à Tharkavthe", text: "Retrouver jarres, paniers et troupeau dans une scène située en 1966 par le témoignage transmis." },
  village: { href: "/village", label: "Un territoire", title: "Découvrir Aït Mesbah", text: "Replacer les chemins, les lieux et les récits dans la présentation du village." },
} as const;
type Archive = "reportage" | "pitcher" | "daily" | "map";
const paths: Record<Archive, readonly (keyof typeof routes)[]> = {
  reportage: ["pottery", "daily", "pitcher"],
  pitcher: ["pottery", "reportage", "daily"],
  daily: ["pottery", "reportage", "village"],
  map: ["village", "daily", "reportage"],
};

export default function ArchiveDiscovery({ current }: { current: Archive }) {
  return <section className="archive-discovery" id="poursuivre" aria-labelledby="archive-discovery-title">
    <header><p className="eyebrow">Poursuivre la découverte</p><h2 id="archive-discovery-title">D’un document à l’autre</h2><p>Des lectures complémentaires autour du village et de ses savoir-faire. Ce rapprochement thématique n’établit ni origine commune ni lien direct entre les pièces.</p></header>
    <div className="archive-discovery-grid">{paths[current].map(key => { const item = routes[key]; return <Link href={item.href} key={key}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p><b>Découvrir <span aria-hidden="true">↗</span></b></Link>; })}</div>
    <Link className="archive-discovery-all" href="/histoire-memoire#archives">Parcourir toute la collection <span aria-hidden="true">→</span></Link>
  </section>;
}
