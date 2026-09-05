import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import ContributionIntakeForm from "@/components/contribute/ContributionIntakeForm";

export const metadata: Metadata = {
  title: "Contribuer au projet Aït Mesbah",
  description: "Partager une mémoire, une information ou une idée utile au village d’Aït Mesbah.",
  alternates: { canonical: "/contribuer" },
};

const paths = [
  { number: "01", label: "Mémoire", title: "Transmettre une trace", text: "Une photographie, un document, un récit, un lieu, un nom, un savoir-faire ou une correction historique.", href: "/histoire-memoire", action: "Explorer la mémoire" },
  { number: "02", label: "Vie du village", title: "Partager une information", text: "Un rendez-vous confirmé, une activité associative, une initiative locale ou une nouvelle utile à la communauté.", href: "/agenda", action: "Voir l’agenda" },
  { number: "03", label: "Avenir", title: "Proposer une initiative", text: "Une idée concrète pour le cadre de vie, la jeunesse, l’entraide, la culture ou un projet participatif.", href: "/agir", action: "Découvrir les projets" },
] as const;

const preparation = [
  ["Le contexte", "Ce que vous souhaitez partager et pourquoi cela concerne Aït Mesbah."],
  ["La provenance", "L’auteur, le propriétaire ou la personne à l’origine de l’information."],
  ["Les repères", "Une date, une période, un lieu et les personnes concernées, lorsqu’ils sont connus."],
  ["Les autorisations", "L’accord nécessaire pour publier un document, une image ou un témoignage."],
] as const;

const process = ["Réception", "Échange", "Vérification", "Publication"] as const;

export default function ContributePage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="contribute-new" tabIndex={-1}>
      <header className="contribute-new-hero">
        <div className="contribute-new-copy"><p className="eyebrow light">Faire vivre le projet</p><h1>Votre contribution compte</h1><p>Ce que vous savez, ce que vous conservez et ce que vous imaginez peut aider à mieux connaître Aït Mesbah et à construire son avenir.</p></div>
        <div className="contribute-new-seal" aria-hidden="true"><span>Partager</span><i>ⵣ</i><span>Transmettre</span></div>
      </header>

      <section className="contribute-new-intro"><p className="eyebrow">Chacun à sa manière</p><h2>Il n’est pas nécessaire d’avoir beaucoup pour apporter quelque chose</h2><div><p>Une photographie bien légendée, un souvenir précis, une correction, une information vérifiée ou une idée réalisable peuvent déjà être précieux.</p><p>Le projet accueillera progressivement les contributions dans un cadre simple, respectueux des personnes et transparent sur leur utilisation.</p></div></section>

      <section className="contribute-paths" aria-labelledby="contribute-paths-title"><div className="contribute-new-heading"><p className="eyebrow">Que souhaitez-vous partager&nbsp;?</p><h2 id="contribute-paths-title">Trois chemins pour contribuer</h2></div><div className="contribute-path-grid">{paths.map((path) => <article key={path.number}><span>{path.number}</span><small>{path.label}</small><h3>{path.title}</h3><p>{path.text}</p><Link href={path.href}>{path.action} <b aria-hidden="true">↗</b></Link></article>)}</div></section>

      <section className="contribute-prepare"><div><p className="eyebrow light">Avant de transmettre</p><h2>Quelques repères rendent une contribution beaucoup plus utile</h2></div><ol>{preparation.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></section>

      <section className="contribute-care"><div className="contribute-new-heading"><p className="eyebrow">Notre responsabilité</p><h2>Transmettre avec soin</h2></div><div className="contribute-care-grid"><article><span aria-hidden="true">◎</span><h3>Respecter les personnes</h3><p>Un témoignage ou une photographie ne sera pas publié sans tenir compte du consentement, de la vie privée et des personnes représentées.</p></article><article><span aria-hidden="true">◇</span><h3>Identifier les sources</h3><p>Une information certaine, une mémoire locale et une tradition orale ne seront pas présentées de la même manière.</p></article><article><span aria-hidden="true">↺</span><h3>Pouvoir corriger</h3><p>Une précision, un complément ou une demande légitime de retrait devra pouvoir être étudié après publication.</p></article></div></section>

      <section className="contribute-new-process"><div><p className="eyebrow">Un chemin transparent</p><h2>De votre proposition à sa publication</h2><p>Chaque contenu suivra le même principe : comprendre ce qui est proposé, dialoguer si nécessaire, vérifier ce qui peut l’être et expliquer clairement la décision éditoriale.</p></div><ol>{process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol></section>

      <ContributionIntakeForm />

      <section className="contribute-new-final"><p className="eyebrow">Construire ensemble</p><h2>Une mémoire à transmettre.<br/>Un village à faire vivre.</h2><p>Chaque contribution sérieuse peut enrichir la connaissance du village, rapprocher les générations ou faire naître une initiative utile.</p><div><Link className="primary" href="/agir">Découvrir « Agir ensemble » <span aria-hidden="true">↗</span></Link><Link href="/vivre">Vivre au village</Link></div></section>
    </main>
    <SiteFooter />
  </>;
}
