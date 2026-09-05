import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "La guerre d’Algérie à Aït Mesbah — mémoire et archives",
  description: "Un dossier consacré aux années 1954–1962 à Aït Mesbah : engagement, vie quotidienne, répression, pertes humaines, indépendance et travail de mémoire.",
  alternates: { canonical: "/guerre-algerie" },
};

const periods = [
  ["1954", "Le basculement", "Le déclenchement de l’insurrection ouvre une période de clandestinité, de choix difficiles et de réorganisation. Il reste à établir comment les premières structures du FLN et de l’ALN se sont implantées dans le village."],
  ["1955–1956", "La guerre gagne la Haute Kabylie", "Les réseaux se structurent dans la Wilaya III. Les liaisons, le ravitaillement, l’hébergement, le renseignement et les collectes reposent aussi sur des civils, dont les rôles doivent être documentés sans simplification."],
  ["1957", "Contrôle et contraintes", "À Beni-Douala, les sources signalent des restrictions de circulation, de transport des denrées et d’accueil des personnes. Leur application précise à Aït Mesbah doit être recherchée dans les rapports de la SAS et les témoignages."],
  ["1958–1960", "Une population sous pression", "Opérations militaires, surveillance, arrestations, rationnement et peur bouleversent la vie quotidienne. Les parcours diffèrent selon les familles ; aucun récit unique ne peut résumer ces années."],
  ["1961–1962", "Vers l’indépendance", "Les derniers mois sont marqués par l’attente, les pertes et l’incertitude. Le cessez-le-feu du 19 mars 1962 puis l’indépendance ouvrent le temps du retour, du deuil et de la reconstruction."],
] as const;

const themes = [
  ["Combattre", "Maquisards, militants, agents de liaison et responsables locaux : établir les itinéraires, fonctions, dates et unités à partir de sources croisées."],
  ["Soutenir", "Femmes, familles et habitants assurent hébergement, ravitaillement, soins, messages et protection, souvent au prix de risques considérables."],
  ["Subir", "Arrestations, interrogatoires, perquisitions, restrictions, violences, destructions et déplacements doivent être documentés personne par personne."],
  ["Continuer à vivre", "Cultiver, nourrir les enfants, se déplacer, se soigner, célébrer ou enterrer : la guerre transforme jusqu’aux gestes ordinaires."],
] as const;

const archivePlan = [
  ["Établir les noms", "Confronter le monument, les listes communales, les dossiers officiels et les documents familiaux avant toute publication nominative."],
  ["Cartographier les lieux", "Maisons, chemins, refuges, postes, lieux d’arrestation, de combat ou de mémoire — avec prudence lorsque des personnes sont encore concernées."],
  ["Recueillir les voix", "Enregistrer les témoins et descendants avec consentement, conserver l’entretien intégral et distinguer souvenir direct et récit transmis."],
  ["Numériser les pièces", "Photographier recto et verso, relever date, auteur, détenteur, contexte et droits de chaque lettre, carte ou photographie."],
  ["Croiser les regards", "Lire les archives françaises comme des documents produits par un pouvoir en guerre et les confronter aux archives algériennes et familiales."],
  ["Transmettre", "Créer un mémorial documenté, accessible aux nouvelles générations, qui rende aux personnes leur histoire et leur singularité."],
] as const;

export default function GuerreAlgeriePage() {
  return <><a className="skip-link" href="#contenu-principal">Aller au contenu principal</a><SiteHeaderClient />
    <main id="contenu-principal" className="war-page" tabIndex={-1}>
      <header className="war-hero">
        <div className="war-hero-index"><span>Chapitre historique</span><span>1954 — 1962</span></div>
        <div className="war-hero-copy"><p className="eyebrow light">Aït Mesbah dans la guerre d’indépendance</p><h1>Les années<br/><em>de guerre</em></h1><p>Raconter les engagements, les épreuves et les vies bouleversées — avec respect, précision et sans réduire le village à une liste de noms.</p></div>
        <div className="war-hero-word" aria-hidden="true">MÉMOIRE</div>
      </header>

      <nav className="war-toc" aria-label="Sommaire du chapitre"><span>Parcourir</span><ol>{[["Comprendre","comprendre"],["Chronologie","chronologie"],["Vécus","vecus"],["Mémorial","memorial"],["Archives","archives-guerre"]].map(([label,id],i)=><li key={id}><a href={`#${id}`}><span>{String(i+1).padStart(2,"0")}</span>{label}</a></li>)}</ol></nav>

      <section className="war-opening" id="comprendre"><div><p className="eyebrow">Un chapitre sensible</p><h2>Écrire une histoire à hauteur d’habitants</h2></div><div><p className="war-lead">Entre 1954 et 1962, la guerre traverse les maisons, les familles, les chemins et les silences d’Aït Mesbah.</p><p>Ce chapitre ne cherchera ni l’héroïsation facile ni une neutralité qui effacerait la domination coloniale. Il documentera la lutte pour l’indépendance tout en restituant la pluralité des expériences : combattants, agents de liaison, familles, femmes, enfants, détenus, disparus, blessés et habitants pris dans la guerre.</p><aside><strong>Règle documentaire</strong><p>Un nom, une date ou une circonstance de décès ne seront publiés qu’après recoupement. Les souvenirs seront identifiés comme témoignages ; les archives administratives seront contextualisées selon leur producteur.</p></aside></div></section>

      <section className="war-timeline" id="chronologie"><div className="war-section-head"><p className="eyebrow light">Chronologie ouverte</p><h2>Huit années qui ont changé le village</h2><p>Ces repères constituent une ossature. Les faits propres à Aït Mesbah seront ajoutés à mesure que les familles et les fonds d’archives permettront de les établir.</p></div><div className="war-periods">{periods.map(([date,title,text],i)=><article key={date}><div><span>{date}</span><small>{String(i+1).padStart(2,"0")}</small></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="war-experiences" id="vecus"><div className="war-section-head"><p className="eyebrow">Vivre la guerre</p><h2>Des engagements visibles,<br/>d’autres restés dans l’ombre</h2><p>L’histoire collective doit faire place à toutes les formes d’action, mais aussi aux souffrances qui ne laissèrent parfois aucune archive écrite.</p></div><div className="war-theme-grid">{themes.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="war-memorial" id="memorial"><div><p className="eyebrow light">Les morts, les survivants et les familles</p><h2>Nommer sans se tromper.<br/>Honorer sans oublier.</h2><p>La mémoire locale évoque une soixantaine de femmes et d’hommes d’Aït Mesbah morts pendant la lutte pour l’indépendance. Cette estimation donne la mesure de l’épreuve traversée par le village, mais elle ne doit pas être figée avant le recoupement de la liste complète, des identités, des statuts et des circonstances.</p><p>Plusieurs combattants du village ont survécu à la guerre. Leurs itinéraires, leurs témoignages et leur retour à la vie civile font pleinement partie de cette histoire. Certains ont transmis leur expérience ; d’autres sont demeurés silencieux. Le futur mémorial donnera une place distincte aux morts, aux anciens combattants, aux détenus, aux blessés et aux familles.</p><p>Chaque notice présentera la personne dans son humanité : nom et variantes, quartier ou famille, parcours, rôle connu, documents associés et sources.</p><a href="https://www.depechedekabylie.com/ath-mesbah-au-rendez-vous/" target="_blank" rel="noreferrer">Consulter un témoignage de la mémoire publique du village <span>↗</span></a></div></section>

      <section className="war-archives" id="archives-guerre"><div><p className="eyebrow">Le chantier prioritaire</p><h2>Réunir les preuves et les voix</h2><p>Le dossier pourra grandir sans perdre sa rigueur grâce à une méthode commune.</p></div><ol>{archivePlan.map(([title,text],i)=><li key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>

      <section className="war-repositories"><div className="war-section-head"><p className="eyebrow light">Fonds identifiés</p><h2>Où chercher maintenant</h2></div><div className="war-repository-grid"><a href="https://recherche-anom.culture.gouv.fr/data/files/anom.diffusion/pdf/inventaires/FRANOM_01081_all.pdf?1726288046=" target="_blank" rel="noreferrer"><span>ANOM · 5 SAS 208–211</span><h3>Section administrative spécialisée de Beni-Douala</h3><p>Journaux de marche, rapports périodiques, situation de la population et fiches individuelles, 1956–1962.</p><strong>Ouvrir l’inventaire ↗</strong></a><a href="https://www.servicehistorique.sga.defense.gouv.fr/sites/default/files/notices_files/SHDGR_REP_1H_1091_A_4881_T3.pdf" target="_blank" rel="noreferrer"><span>Service historique de la Défense</span><h3>Archives militaires de Beni-Douala</h3><p>Monographies, photographies, opérations et journaux de marche à repérer dans la série 1 H.</p><strong>Ouvrir l’index ↗</strong></a><a href="https://www.univ-bejaia.dz/jspui/bitstream/123456789/22725/1/965MAS%2021.pdf" target="_blank" rel="noreferrer"><span>Recherche universitaire</span><h3>Presse et témoignages de la Wilaya III</h3><p>Une piste secondaire mentionnant restrictions à Beni-Douala et arrestation à Aït Mesbah en février 1959.</p><strong>Consulter l’étude ↗</strong></a></div></section>

      <section className="war-call"><p className="eyebrow light">Faire œuvre de mémoire</p><h2>Une photographie, un nom,<br/>une lettre, un souvenir&nbsp;?</h2><p>Chaque fragment peut éclairer l’histoire du village. Il sera conservé avec sa provenance, examiné avec soin et publié seulement avec l’accord nécessaire.</p><div><Link className="primary" href="/contribuer">Transmettre une archive <span>↗</span></Link><Link href="/histoire-memoire">Revenir à la chronologie</Link></div></section>
    </main><SiteFooter /></>;
}
