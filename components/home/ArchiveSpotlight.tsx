import Image from "next/image";
import Link from "next/link";
import "./archive-spotlight.css";

const archivePath = "/histoire-memoire/archives/retour-des-champs-1966";

export default function ArchiveSpotlight() {
  return <section className="home-archive-spotlight" id="archive-a-decouvrir" aria-labelledby="home-archive-title">
    <figure>
      <Link href={archivePath} aria-label="Ouvrir la photographie et la fiche du retour des champs à Tharkavthe">
        <Image src="/archives/vie-village/retour-des-champs-1966.jpg" alt="Femmes portant des jarres et des paniers sur un chemin, accompagnées d’un troupeau de moutons" width={720} height={951} sizes="(max-width: 700px) 85vw, 400px" />
        <span aria-hidden="true">Regarder la photographie ↗</span>
      </Link>
      <figcaption>Photographie transmise · Auteur et source originale à identifier</figcaption>
    </figure>
    <div className="home-archive-story">
      <p className="home-archive-eyebrow">Archive à découvrir</p>
      <h2 id="home-archive-title">Sur le chemin<br />du retour</h2>
      <p className="home-archive-place">Tharkavthe · Janvier 1966 <span>Selon le témoignage transmis</span></p>
      <p>Des jarres sur le dos, de grands paniers, un troupeau qui avance. Cette photographie ouvre une fenêtre sur les gestes et les chemins du quotidien à Aït Mesbah.</p>
      <p className="home-archive-context">La fiche réunit l’image à explorer, les précisions apportées par le contributeur et les questions qui restent à documenter.</p>
      <div className="home-archive-actions"><Link href={archivePath}>Découvrir cette archive <span aria-hidden="true">↗</span></Link><Link href="/histoire-memoire#archives">Explorer la collection <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>;
}
