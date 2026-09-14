import { memoryItems } from "@/data/home";
import Link from "next/link";
import Image from "next/image";

export default function MemorySection() {
  return (
    <section id="memoire" className="memory dark-section section-pad">
      <div className="section-head">
        <div>
          <p className="eyebrow light">Mémoire du village</p>
          <h2>Des traces à regarder.<br/>Une histoire à comprendre.</h2>
        </div>
        <div className="memory-intro">
          <p>Une carte, une page de journal, un visage : commencez par un document. Retrouvez sa notice, ce qu’il nous apprend et les questions qui restent ouvertes.</p>
        </div>
      </div>
      <div className="memory-gesture" aria-label="Principes de transmission">
        <span>Identifier</span>
        <span>Contextualiser</span>
        <span>Transmettre</span>
      </div>
      <div className="memory-grid">
        <article className="feature-card">
          <Link className="memory-document-preview" href="/histoire-memoire/archives/carte-territoriale-1892" aria-label="Consulter la carte territoriale du douar des Beni Aïssi">
            <Image src="/archives/village/carte-ait-mesbah-1892.webp" alt="Détail de la carte territoriale du douar des Beni Aïssi" fill sizes="(max-width: 760px) 90vw, 360px"/>
            <span>Carte territoriale <b aria-hidden="true">↗</b></span>
          </Link>
          <div>
            <span className="card-no">01</span>
            <h3>Retrouver le village sur une carte ancienne</h3>
            <p>Chemins, limites et noms de lieux : explorez la carte du douar des Beni Aïssi, associée à 1892 dans la collection. Sa provenance et sa datation exacte restent à confirmer.</p>
            <span className="memory-document-status">Notice provisoire · Document consultable</span>
            <Link className="memory-feature-link" href="/histoire-memoire/archives/carte-territoriale-1892">Explorer la carte <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
        <div className="memory-list">
          {memoryItems.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span>
              <div>
                <small>{item.category}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className="memory-reading-link" href={item.href}>{item.action} <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="memory-source-note"><span>Pour aller plus loin</span><p>L’Institut du monde arabe situe Amar Imache parmi les figures de l’Étoile nord-africaine dans sa présentation du centenaire du mouvement.</p><a href="https://www.imarabe.org/fr/agenda/evenements-exceptionnels/centenaire-etoile-nord-africaine" target="_blank" rel="noreferrer">Lire le repère institutionnel <span aria-hidden="true">↗</span></a></aside>
    </section>
  );
}
