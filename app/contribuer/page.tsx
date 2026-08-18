import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";

export const metadata: Metadata = {
  title: "Contribuer à la mémoire d’Aït Mesbah",
  description: "Découvrez comment il sera bientôt possible de transmettre une archive, une photographie, un témoignage ou une correction au projet éditorial d’Aït Mesbah.",
  alternates: { canonical: "/contribuer" },
};

const contents = [["Contenus recherchés", "contenus"], ["Critères de publication", "criteres"], ["Droits et autorisations", "droits"], ["Témoignages et vie privée", "vie-privee"], ["Vérification éditoriale", "verification"], ["Rôle des organisations", "organisations"], ["Modalités à venir", "modalites"]] as const;
const categories = ["Corrections historiques ou factuelles", "Photographies anciennes ou contemporaines", "Archives et documents", "Témoignages et récits de vie", "Informations sur les associations et initiatives", "Savoir-faire, lieux et traditions", "Éléments relatifs aux personnalités du village"];
const criteria = ["Lien identifiable avec Aït Mesbah", "Origine du contenu", "Date ou période, lorsqu’elle est connue", "Identité de l’auteur ou du propriétaire", "Contexte du document ou du témoignage", "Cohérence avec les autres sources disponibles", "Autorisation de publication", "Absence d’atteinte injustifiée à une personne"];
const rights = ["Ne proposer qu’un contenu dont la provenance est connue autant que possible", "Signaler l’auteur ou le propriétaire", "Préciser si le document appartient à une famille, une association ou une collection", "Indiquer si une autorisation de publication a été obtenue", "Respecter un refus de publication ou une demande de retrait légitime", "Ne pas retirer une signature ou une mention de provenance"];
const privacy = ["Consentement clair de la personne", "Possibilité de définir les passages publiables", "Vérification de l’identité et du contexte", "Prudence concernant les personnes vivantes", "Attention aux mineurs", "Protection des coordonnées", "Possibilité de retrait ou de correction selon les conditions qui seront définies", "Refus des accusations non vérifiables ou des atteintes injustifiées"];
const process = ["Réception de la proposition", "Vérification de sa provenance", "Échange éventuel avec le contributeur", "Examen des droits et du consentement", "Comparaison avec les sources disponibles", "Préparation éditoriale", "Validation avant publication", "Ajout des crédits et réserves nécessaires", "Conservation ou suppression selon les règles qui seront définies"];
const participants = ["Comité du village", "Associations locales", "Structures culturelles et sportives", "Personnes ressources", "Détenteurs d’archives", "Chercheurs", "Membres de la communauté établis ailleurs en Algérie", "Associations et collectifs de la diaspora"];
const requirements = ["Canal de transmission sécurisé", "Informations obligatoires pour chaque dépôt", "Conditions de publication", "Règles de consentement", "Méthode de validation", "Personnes ou structures chargées de l’examen", "Politique de conservation et de suppression", "Procédure de correction ou de retrait"];

function Heading({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <div className="contribute-section-heading"><span aria-hidden="true">{number}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

export default function ContributePage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="contribute-page" tabIndex={-1}>
      <header className="contribute-hero">
        <div className="contribute-hero-index" aria-hidden="true"><span>Transmission</span><i /></div>
        <p className="eyebrow">Transmettre, documenter, corriger</p>
        <h1>Contribuer à la mémoire d’Aït Mesbah</h1>
        <div className="contribute-hero-intro"><p>La mémoire d’un village se construit à partir de documents, de photographies, de récits, de savoir-faire et de connaissances transmis par plusieurs générations.</p><p>Le projet Aït Mesbah souhaite permettre, à terme, aux habitants, aux familles, aux associations, aux chercheurs et aux membres de la diaspora de proposer des contenus utiles à cette mémoire collective.</p></div>
        <aside className="contribute-availability" aria-labelledby="availability-title"><span aria-hidden="true">Information</span><div><h2 id="availability-title">Les contributions ne sont pas encore ouvertes</h2><p>Aucun document, témoignage ou renseignement ne peut actuellement être envoyé depuis le site. Les modalités de participation seront annoncées lorsque le processus de réception, de vérification et de protection des données sera prêt.</p></div></aside>
      </header>

      <nav className="contribute-toc" aria-label="Sommaire de la page"><p>Parcourir le cadre de contribution</p><ol>{contents.map(([label, id], index) => <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ol></nav>

      <section id="contenus" className="contribute-section contribute-types"><Heading number="01" eyebrow="Ce qui pourra être proposé" title="Des contributions de différentes natures" /><div className="contribute-body"><p className="contribute-lead">Les contributions pourront prendre plusieurs formes, à condition qu’elles présentent un lien réel avec Aït Mesbah et qu’elles puissent être examinées dans de bonnes conditions.</p><ul className="contribute-type-list">{categories.map((item, index) => <li key={item}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ul><p className="contribute-note">La transmission d’un contenu ne garantira pas sa publication. Chaque proposition devra être examinée au regard de son intérêt, de sa provenance, de sa précision et des droits associés.</p></div></section>

      <section id="criteres" className="contribute-section contribute-criteria"><Heading number="02" eyebrow="Exigence éditoriale" title="Ce qui sera vérifié avant publication" /><div className="contribute-body"><ul className="contribute-check-list">{criteria.map(item => <li key={item}>{item}</li>)}</ul><p className="contribute-note">Lorsqu’une information ne pourra pas être entièrement confirmée, son degré d’incertitude devra être indiqué clairement.</p></div></section>

      <section id="droits" className="contribute-section contribute-rights"><Heading number="03" eyebrow="Photographies et documents" title="Respecter les propriétaires et les auteurs" /><div className="contribute-body"><p className="contribute-lead">La possession matérielle d’une photographie ou d’un document ne signifie pas nécessairement que l’on dispose du droit de le publier.</p><p>Avant toute diffusion, il faudra identifier autant que possible l’auteur, le propriétaire du document, les personnes représentées et les conditions dans lesquelles le contenu a été obtenu.</p><ul className="contribute-rule-list">{rights.map(item => <li key={item}>{item}</li>)}</ul><p className="contribute-note">Les crédits de publication seront déterminés avec les personnes concernées. Ils ne seront pas inventés ou attribués sans confirmation.</p></div></section>

      <section id="vie-privee" className="contribute-section contribute-privacy"><Heading number="04" eyebrow="Paroles et consentement" title="Protéger les personnes avant de publier leur récit" /><div className="contribute-body"><p className="contribute-lead">Un témoignage peut contenir des informations personnelles, familiales ou sensibles. Son intérêt historique ne supprime pas l’obligation de respecter la personne qui témoigne et les autres personnes citées.</p><ul className="contribute-rule-list">{privacy.map(item => <li key={item}>{item}</li>)}</ul><p className="contribute-note">Aucune adresse personnelle, donnée de contact privée ou information sensible ne devra être rendue publique sans nécessité et sans consentement valable.</p></div></section>

      <section id="verification" className="contribute-process"><div className="contribute-process-intro"><Heading number="05" eyebrow="De la proposition à la publication" title="Un processus de vérification en plusieurs étapes" /><p>Le processus envisagé suivra, à terme et lorsque le dispositif sera ouvert, une progression attentive. Il ne suppose pas qu’une équipe éditoriale officielle existe déjà.</p></div><ol>{process.map((item, index) => <li key={item}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></section>

      <section id="organisations" className="contribute-section contribute-governance"><Heading number="06" eyebrow="Responsabilité collective" title="Associer les organisations du village" /><div className="contribute-body"><p className="contribute-lead">Le comité du village, les associations locales et les personnes ressources pourront jouer un rôle important dans l’identification des sujets, la vérification des informations et la mise en relation avec les détenteurs de documents ou de témoignages.</p><p>Les associations et collectifs établis ailleurs en Algérie ou à l’étranger pourront également contribuer à documenter les parcours de la communauté.</p><ul className="contribute-participants">{participants.map(item => <li key={item}>{item}</li>)}</ul><p className="contribute-note">Aucune organisation ou personne ne sera présentée comme responsable éditoriale ou représentante officielle sans son accord et sans définition préalable de son rôle.</p></div></section>

      <section id="modalites" className="contribute-section contribute-future"><Heading number="07" eyebrow="Prochaine étape" title="Ouvrir les contributions de manière progressive" /><div className="contribute-body"><p className="contribute-lead">Les modalités de participation seront définies après la mise en place d’un cadre éditorial, technique et organisationnel suffisamment clair.</p><p>La première ouverture pourra être limitée à quelques catégories de contenus et à un nombre restreint de contributeurs identifiés, avant un élargissement éventuel.</p><h3>Éléments nécessaires avant l’ouverture</h3><ul className="contribute-future-list">{requirements.map(item => <li key={item}>{item}</li>)}</ul><p className="contribute-date">Aucune date d’ouverture n’est annoncée à ce stade.</p></div></section>

      <section className="contribute-conclusion"><p className="eyebrow">Dès aujourd’hui</p><h2>Préparer une contribution utile et responsable</h2><p>En attendant l’ouverture du dispositif, chacun peut déjà identifier les photographies, documents, objets, récits et informations qu’il souhaiterait faire connaître.</p><p>Il est utile de conserver leur contexte : auteur, propriétaire, date approximative, personnes représentées, lieu, histoire du document et conditions d’utilisation.</p><div className="contribute-actions"><Link className="primary" href="/histoire-memoire">Explorer l’histoire et la mémoire <span aria-hidden="true">↗</span></Link><Link className="contribute-secondary" href="/diaspora">Découvrir la diaspora</Link></div><p className="contribute-final-reminder">Aucun envoi n’est actuellement possible depuis le site.</p></section>
    </main>
    <SiteFooter />
  </>;
}
