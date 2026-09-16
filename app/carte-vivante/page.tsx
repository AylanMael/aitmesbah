import type { Metadata } from "next";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import VillageAtlas from "@/components/village/VillageAtlas";

export const metadata: Metadata = { title: "Carte vivante d’Aït Mesbah", description: "Un atlas participatif des quartiers, lieux, récits et mémoires d’Aït Mesbah.", alternates: { canonical: "/carte-vivante" } };

export default function LivingMapPage() { return <><a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient/><main id="contenu-principal" className="atlas-page" tabIndex={-1}>
  <header className="atlas-hero"><p className="eyebrow light">Territoire · mémoire · habitants</p><h1>La carte<br/><em>vivante</em> du village</h1><p>Un atlas appelé à relier chaque quartier à ses noms de lieux, ses photographies, ses récits et celles et ceux qui en gardent la mémoire.</p><span aria-hidden="true">ⵣ</span></header>
  <section className="atlas-intro"><div><p className="eyebrow">Atlas participatif</p><h2>Commencer par les quartiers principaux</h2></div><p>Cette première vue n’invente ni limites ni positions exactes. Elle organise la collecte. La géographie précise sera construite progressivement à partir des habitants, des cartes et des sources vérifiées.</p></section>
  <section className="atlas-stage"><VillageAtlas/></section>
  <section className="atlas-method">
    <div className="atlas-method-header">
      <p className="eyebrow light">Construire avec justesse</p>
      <h2>Du souvenir transmis<br/>au lieu documenté</h2>
      <p className="atlas-method-lead">
        Une démarche rigoureuse et participative pour recueillir, vérifier et transmettre la mémoire géographique d’Aït Mesbah sans altérer la vérité historique.
      </p>
    </div>

    <div className="atlas-method-grid">
      <div className="atlas-method-card">
        <span className="atlas-method-num">01</span>
        <div className="atlas-method-badge">Toponymie locale</div>
        <h3>Nommer</h3>
        <p>Recueillir fidèlement les nom traditionnels et les toponymes transmis oralement par les habitants et les anciens du village.</p>
      </div>

      <div className="atlas-method-card">
        <span className="atlas-method-num">02</span>
        <div className="atlas-method-badge">Cartographie &amp; Sources</div>
        <h3>Localiser</h3>
        <p>Croiser les indications orales avec les cartes historiques, l’imagerie satellite et les documents d’archives consultables.</p>
      </div>

      <div className="atlas-method-card">
        <span className="atlas-method-num">03</span>
        <div className="atlas-method-badge">Mémoire &amp; Témoignages</div>
        <h3>Raconter</h3>
        <p>Relier chaque repère géographique aux photographies d’époque, aux récits familiaux, aux personnages et aux événements marquants.</p>
      </div>

      <div className="atlas-method-card">
        <span className="atlas-method-num">04</span>
        <div className="atlas-method-badge">Rigueur &amp; Transparence</div>
        <h3>Valider</h3>
        <p>Distinguer avec clarté ce qui est historiquement établi, ce qui relève du témoignage transmis, et ce qui demeure incertain.</p>
      </div>
    </div>
  </section>

  <section className="atlas-call">
    <div className="atlas-call-container">
      <div className="atlas-call-badge">📍 Appel à contribution</div>
      <p className="eyebrow light">Votre quartier, votre mémoire</p>
      <h2>Quel lieu faudrait-il faire apparaître en premier&nbsp;?</h2>
      <p className="atlas-call-desc">
        Une fontaine patrimoniale, un chemin ancestral, une maison ancienne, un espace collectif ou un toponyme presque oublié peut devenir le prochain repère documenté de la Carte Vivante.
      </p>

      <div className="atlas-call-chips" aria-label="Exemples de lieux à proposer">
        <span>⛲ Fontaines &amp; Sources</span>
        <span>🛤️ Chemins &amp; Passages</span>
        <span>🏛️ Maisons anciennes</span>
        <span>🌳 Espaces collectifs</span>
        <span>📜 Noms de lieux oubliés</span>
      </div>

      <div className="atlas-call-cta">
        <Link className="primary atlas-call-btn" href="/contribuer?category=places_heritage&title=Un lieu à ajouter à la carte vivante#envoyer">
          <span>Proposer un lieu pour l’Atlas</span>
          <span className="atlas-btn-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  </section>
  </main><SiteFooter/></> }

