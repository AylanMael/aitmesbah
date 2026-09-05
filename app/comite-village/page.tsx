import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Comité du village — Aït Mesbah",
  description: "Le comité du village d’Aït Mesbah, son rôle, ses priorités et les manières de participer à la vie collective.",
  alternates: { canonical: "/comite-village" },
};

const missions = [
  ["01", "Écouter", "Faire remonter les besoins, les préoccupations et les propositions de toutes les générations."],
  ["02", "Coordonner", "Relier les habitants, les associations et les bonnes volontés autour d’actions réalisables."],
  ["03", "Rendre compte", "Partager les informations utiles, les décisions prises et l’avancement des initiatives."],
] as const;

const priorities = [
  ["Cadre de vie", "Propreté, entretien, embellissement et respect des espaces communs."],
  ["Jeunesse", "Créer des occasions d’apprendre, de pratiquer, de se rencontrer et de prendre des initiatives."],
  ["Solidarité", "Mieux organiser l’entraide et rester attentif aux personnes ou aux familles qui en ont besoin."],
  ["Patrimoine", "Préserver les lieux, les récits, les savoir-faire et la mémoire vivante d’Aït Mesbah."],
  ["Dialogue", "Faire circuler une information claire entre le village, les associations et la diaspora."],
  ["Projets communs", "Transformer les idées utiles en projets partagés, suivis et menés jusqu’à leur réalisation."],
] as const;

const participation = [
  ["Signaler", "Faire connaître un besoin concret ou une situation qui mérite une attention collective."],
  ["Proposer", "Présenter une idée simple, son utilité, les moyens nécessaires et les personnes prêtes à aider."],
  ["Participer", "Donner un peu de temps, une compétence, du matériel ou un appui à une action précise."],
  ["Transmettre", "Partager une information fiable afin qu’elle puisse être vérifiée et diffusée à la communauté."],
] as const;

const organization = [
  ["Assemblée des délégués", "Chaque groupe familial désigne, selon les règles convenues, un ou deux représentants chargés de porter sa parole et de transmettre les informations."],
  ["Équipe de coordination", "Un bureau resserré prépare les réunions, suit les décisions et assure la continuité entre les différents délégués."],
  ["Relais territoriaux", "Dans un village étendu, des référents par quartier ou secteur permettent de repérer plus vite les besoins et d’éviter qu’une partie du territoire soit oubliée."],
  ["Commissions ouvertes", "Des groupes temporaires réunissent délégués, habitants compétents, jeunes, associations et membres de la diaspora autour d’un sujet précis."],
] as const;

const operatingCycle = ["Recueillir", "Prioriser", "Décider", "Agir", "Rendre compte"] as const;

const chapters = [["Nouveau départ", "nouveau-depart"], ["Rôle", "role"], ["Organisation", "organisation"], ["Missions", "missions"], ["Chantiers", "chantiers"], ["Confiance", "confiance"], ["Participer", "participer"]] as const;

export default function VillageCommitteePage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="committee-page" tabIndex={-1}>
      <header className="committee-hero">
        <div className="committee-hero-copy">
          <p className="eyebrow light">Vie collective</p>
          <h1>Le comité<br/>du village</h1>
          <p>Un espace de dialogue, de coordination et d’action au service de toutes celles et ceux qui font vivre Aït Mesbah.</p>
        </div>
        <div className="committee-emblem" aria-hidden="true"><span>ⵣ</span><i>Écouter · Rassembler · Agir</i></div>
      </header>

      <nav className="committee-toc" aria-label="Sommaire de la page"><span>Parcourir la page</span><ol>{chapters.map(([label, id], index) => <li key={id}><a href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol></nav>

      <section className="committee-rebirth" id="nouveau-depart">
        <div><p className="eyebrow">Un nouveau départ</p><h2>Après près de dix années de vide, le comité se reconstitue</h2></div>
        <div><p className="committee-lead">Cette reprise est une étape importante pour le village. Elle marque le retour d’un espace commun où les habitants peuvent se parler, définir des priorités et agir ensemble.</p><p>Un comité ne peut cependant réussir seul. Sa force dépend de la confiance, de la circulation de l’information et de la participation de chacun, au village comme au sein de la diaspora.</p><aside>La composition officielle du comité, la date de sa reconstitution et ses coordonnées seront publiées après validation par ses représentants.</aside></div>
      </section>

      <section className="committee-role" id="role">
        <div className="committee-heading"><p className="eyebrow">Comprendre son rôle</p><h2>Une instance de représentation et de coordination</h2><p>Le comité organise la parole collective et facilite les décisions qui concernent la vie commune. Il n’est ni une mairie, ni un service administratif, ni un groupe agissant à la place des habitants.</p></div>
        <div className="committee-role-content"><p className="committee-role-lead">À Aït Mesbah, sa légitimité repose sur les délégués des familles qui constituent le village. Une quinzaine de groupes familiaux sont ainsi représentés, généralement par un ou deux délégués selon l’organisation retenue.</p><div className="committee-role-columns"><div><h3>Ce qu’il peut faire</h3><ul><li>faire émerger les besoins communs ;</li><li>préparer et animer la concertation ;</li><li>coordonner des actions collectives ;</li><li>servir d’interlocuteur auprès des institutions ;</li><li>prévenir ou faciliter la résolution de désaccords ;</li><li>mobiliser les compétences du village et de la diaspora.</li></ul></div><div><h3>Ce qui fonde sa confiance</h3><ul><li>une représentation équilibrée des familles ;</li><li>des règles de fonctionnement connues ;</li><li>des décisions compréhensibles et traçables ;</li><li>une information régulière des habitants ;</li><li>une gestion transparente des moyens ;</li><li>un renouvellement organisé des responsabilités.</li></ul></div></div></div>
      </section>

      <section className="committee-organization" id="organisation">
        <div className="committee-heading"><p className="eyebrow light">Une organisation adaptée</p><h2>Représenter les familles, couvrir tout le territoire</h2><p>La représentation familiale peut rester le socle du comité tout en étant complétée par des relais de proximité et des groupes de travail. Cette organisation permet de respecter la structure du village et de répondre à sa réalité actuelle.</p></div>
        <div className="committee-organization-grid">{organization.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        <aside className="committee-model-note"><strong>Une proposition à adapter</strong><p>Les fonctions précises, le nombre de représentants, la durée des mandats et les modalités de décision devront être définis et validés collectivement par le comité et les familles.</p></aside>
      </section>

      <section className="committee-mission" id="missions">
        <div className="committee-heading"><p className="eyebrow light">Sa raison d’être</p><h2>Rassembler les énergies du village</h2><p>Le comité crée un cadre pour avancer collectivement. Il facilite l’action commune sans se substituer aux habitants ni aux associations.</p></div>
        <div className="committee-mission-grid">{missions.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="committee-priorities" id="chantiers">
        <div className="committee-heading"><p className="eyebrow">À construire ensemble</p><h2>Des chantiers pour remettre le village en mouvement</h2><p>Ces thèmes constituent une base de discussion. Les priorités réelles devront être choisies avec les habitants et confirmées par le comité.</p></div>
        <div className="committee-priority-grid">{priorities.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="committee-trust" id="confiance">
        <div><p className="eyebrow light">La confiance par les actes</p><h2>Informer clairement.<br/>Décider collectivement.<br/>Suivre dans le temps.</h2></div>
        <div className="committee-trust-list"><article><span>01</span><div><h3>Des informations accessibles</h3><p>Annoncer les réunions, préciser leur objet et rendre les informations utiles faciles à retrouver.</p></div></article><article><span>02</span><div><h3>Des décisions compréhensibles</h3><p>Expliquer les choix retenus, les responsabilités et les prochaines étapes, dans le respect de la confidentialité nécessaire.</p></div></article><article><span>03</span><div><h3>Des projets suivis</h3><p>Présenter sobrement l’état d’avancement des actions : à étudier, en préparation, en cours ou réalisées.</p></div></article><article><span>04</span><div><h3>Une mémoire de l’action</h3><p>Conserver les comptes rendus, les documents et les résultats afin que les efforts accomplis ne se perdent plus.</p></div></article></div>
      </section>

      <section className="committee-cycle">
        <div><p className="eyebrow">Une méthode simple</p><h2>De la parole à l’action</h2><p>Pour qu’une préoccupation ne se perde pas et qu’une décision ne reste pas sans suite, chaque sujet peut suivre le même chemin.</p></div>
        <ol>{operatingCycle.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol>
      </section>

      <section className="committee-participate" id="participer">
        <div className="committee-heading"><p className="eyebrow">Chacun peut être utile</p><h2>Participer sans forcément s’engager à plein temps</h2><p>Une contribution ponctuelle et concrète peut déjà faire avancer une action. L’essentiel est de savoir qui peut aider, sur quoi et à quel moment.</p></div>
        <div className="committee-participate-grid">{participation.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="committee-news">
        <div><p className="eyebrow light">Informations du comité</p><h2>Réunions, décisions et projets</h2></div>
        <div><p>Aucune annonce officielle n’est encore publiée sur cette page.</p><small>Les premières informations apparaîtront ici dès qu’elles auront été transmises et validées par le comité.</small><Link href="/agenda">Consulter l’agenda <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="committee-final">
        <p className="eyebrow">Faire sa part</p>
        <h2>Le village avance lorsque les bonnes volontés se rencontrent</h2>
        <p>Une idée, une compétence, quelques heures ou un relais auprès de la diaspora peuvent devenir le point de départ d’une action utile.</p>
        <div><Link className="primary" href="/contribuer">Proposer une contribution <span aria-hidden="true">↗</span></Link><Link href="/agir">Découvrir « Agir ensemble »</Link></div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
