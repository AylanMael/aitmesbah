import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import TajmaatBoard from "@/components/governance/TajmaatBoard";

export const metadata: Metadata = {
  title: "Comité du Village, Tajmaât Numérique & Gazette — Aït Mesbah",
  description: "Ordre du jour de la Tajmaât, décisions collectives des délégués de famille et gazette du terroir d'Aït Mesbah.",
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
  ["Assemblée des délégués", "Chaque groupe familial désigne, selon les règles convenues, un ou deux représentants chargés de porter sa parole."],
  ["Équipe de coordination", "Un bureau resserré prépare les réunions, suit les décisions et assure la continuité."],
  ["Relais territoriaux", "Dans un village étendu, des référents par quartier permettent de repérer plus vite les besoins."],
  ["Commissions ouvertes", "Des groupes temporaires réunissent délégués, habitants, jeunes et diaspora autour d’un sujet précis."],
] as const;

const operatingCycle = ["Recueillir", "Prioriser", "Décider", "Agir", "Rendre compte"] as const;

const chapters = [
  ["Tajmaât Numérique", "tajmaat-numerique"],
  ["Nouveau départ", "nouveau-depart"],
  ["Rôle", "role"],
  ["Organisation", "organisation"],
  ["Missions", "missions"],
  ["Chantiers", "chantiers"],
  ["Confiance", "confiance"],
  ["Participer", "participer"],
] as const;

export default function VillageCommitteePage() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
      <SiteHeaderClient />
      <main id="contenu-principal" className="committee-page" tabIndex={-1}>
        <header className="committee-hero">
          <div className="committee-hero-copy">
            <p className="eyebrow light">Vie collective</p>
            <h1>Le comité du village<br /><em>& Tajmaât Numérique</em></h1>
            <p>Un espace de dialogue, de coordination et d’action au service de toutes celles et ceux qui font vivre Aït Mesbah.</p>
            <div className="mt-6">
              <a href="#tajmaat-numerique" className="px-6 py-3 bg-[#aa593c] text-white font-bold rounded-full shadow-lg hover:bg-[#8b432a] transition-all">
                📢 Panneau de Tajmaât & Gazette ↓
              </a>
            </div>
          </div>
          <div className="committee-emblem" aria-hidden="true">
            <span>ⵣ</span><i>Écouter · Rassembler · Agir</i>
          </div>
        </header>

        <nav className="committee-toc" aria-label="Sommaire de la page">
          <span>Parcourir la page</span>
          <ol>
            {chapters.map(([label, id], index) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* SECTION 1: TAJMAAT NUMERIQUE & GAZETTE */}
        <section id="tajmaat-numerique" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
          <TajmaatBoard />
        </section>

        <section className="committee-rebirth" id="nouveau-depart">
          <div>
            <p className="eyebrow">Un nouveau départ</p>
            <h2>Après près de dix années de vide, le comité se reconstitue</h2>
          </div>
          <div>
            <p className="committee-lead">Cette reprise est une étape importante pour le village. Elle marque le retour d’un espace commun où les habitants peuvent se parler.</p>
            <p>Un comité ne peut réussir seul. Sa force dépend de la confiance et de la participation de chacun.</p>
          </div>
        </section>

        <section className="committee-role" id="role">
          <div className="committee-heading">
            <p className="eyebrow">Comprendre son rôle</p>
            <h2>Une instance de représentation et de coordination</h2>
          </div>
          <div className="committee-role-content">
            <p className="committee-role-lead">À Aït Mesbah, sa légitimité repose sur les délégués des familles qui constituent le village.</p>
          </div>
        </section>

        <section className="committee-organization" id="organisation">
          <div className="committee-heading">
            <p className="eyebrow light">Une organisation adaptée</p>
            <h2>Représenter les familles, couvrir tout le territoire</h2>
          </div>
          <div className="committee-organization-grid">
            {organization.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="committee-mission" id="missions">
          <div className="committee-heading">
            <p className="eyebrow light">Sa raison d’être</p>
            <h2>Rassembler les énergies du village</h2>
          </div>
          <div className="committee-mission-grid">
            {missions.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="committee-priorities" id="chantiers">
          <div className="committee-heading">
            <p className="eyebrow">À construire ensemble</p>
            <h2>Des chantiers pour remettre le village en mouvement</h2>
          </div>
          <div className="committee-priority-grid">
            {priorities.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="committee-participate" id="participer">
          <div className="committee-heading">
            <p className="eyebrow">Chacun peut être utile</p>
            <h2>Participer sans forcément s’engager à plein temps</h2>
          </div>
          <div className="committee-participate-grid">
            {participation.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="committee-final">
          <p className="eyebrow">Faire sa part</p>
          <h2>Le village avance lorsque les bonnes volontés se rencontrent</h2>
          <div>
            <Link className="primary" href="/contribuer">Proposer une contribution <span aria-hidden="true">↗</span></Link>
            <Link href="/agir">Découvrir « Agir ensemble »</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

