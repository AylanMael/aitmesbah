import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import TiwiziBarometer from "@/components/community/TiwiziBarometer";
import BeforeAfterGallery from "@/components/community/BeforeAfterGallery";

export const metadata: Metadata = {
  title: "Agir ensemble & Baromètre Tiwizi — Aït Mesbah",
  description: "Engagements citoyens, projets écologiques et rénovation du patrimoine à Aït Mesbah. Découvrez le baromètre Tiwizi et la galerie des transformations.",
  alternates: { canonical: "/agir" },
};

const pillars = [
  { number: "01", title: "Prendre soin", text: "Améliorer durablement la propreté, les chemins, les espaces communs et l’environnement du village.", icon: "✦" },
  { number: "02", title: "S’entraider", text: "Faire circuler les compétences, accompagner les besoins et renforcer les solidarités entre générations.", icon: "∞" },
  { number: "03", title: "Faire confiance aux jeunes", text: "Donner aux jeunes une place réelle pour proposer, apprendre, décider et porter leurs propres initiatives.", icon: "↑" },
  { number: "04", title: "Construire utile", text: "Transformer les idées en projets simples, suivis, transparents et réellement utiles au village.", icon: "ⵣ" },
] as const;

const projectIdeas = [
  ["Cadre de vie", "Prenons soin du village", "Imaginer une action régulière et conviviale autour d’un lieu clairement identifié."],
  ["Transmission", "La parole aux anciens", "Recueillir des récits, des souvenirs et des savoir-faire avec l’aide des nouvelles générations."],
  ["Jeunesse", "Une idée portée par les jeunes", "Créer un rendez-vous où les jeunes présentent leurs besoins et construisent une première initiative."],
  ["Compétences", "Le réseau d’Aït Mesbah", "Mettre en relation les savoir-faire disponibles au village et dans la diaspora autour de projets précis."],
] as const;

const steps = ["Proposer", "Échanger", "Vérifier", "Mobiliser", "Réaliser", "Rendre compte"] as const;

export default function ActTogetherPage() {
  return (
    <>
      <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
      <SiteHeaderClient />
      <main id="contenu-principal" className="act-page" tabIndex={-1}>
        <header className="act-hero">
          <div className="act-hero-copy">
            <p className="eyebrow light">Le village que nous construisons</p>
            <h1>Agir ensemble<br /><em>& Esprit Tiwizi</em></h1>
            <p className="act-hero-lead">
              Aït Mesbah est un héritage que nous recevons, un lieu que nous partageons et un avenir que nous construisons ensemble par l’entraide traditionnelle.
            </p>
            <div className="act-hero-actions">
              <a className="primary" href="#barometre-tiwizi">
                📊 Découvrir le Baromètre Tiwizi <span aria-hidden="true">↘</span>
              </a>
              <Link href="/contribuer">Proposer une initiative</Link>
            </div>
          </div>
          <div className="act-hero-mantra" aria-hidden="true">
            <span>Une idée</span><span>Une compétence</span><span>Un geste</span><strong>Un village</strong>
          </div>
        </header>

        {/* SECTION 1: BAROMETRE TIWIZI & ENGAGEMENTS */}
        <section id="barometre-tiwizi" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
          <div className="text-center mb-10 space-y-3">
            <span className="bg-[#e9c982] text-[#08281f] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
              🌿 Étape 2 · Action Citoyenne & Éco-Village
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Tiwizi : L&apos;Entraide en Action au Village
            </h2>
            <p className="text-sm md:text-base text-[#c8d6d0] max-w-2xl mx-auto leading-relaxed">
              Suivez l&apos;avancement des travaux collectifs, l&apos;impact écologique et rejoignez la dynamique de bénévolat communautaire.
            </p>
          </div>

          <TiwiziBarometer />
        </section>

        {/* SECTION 2: GALERIE AVANT / APRES RESTAURATIONS */}
        <section id="avant-apres" className="max-w-7xl mx-auto px-4 py-12">
          <BeforeAfterGallery />
        </section>

        <section className="act-manifesto">
          <p className="eyebrow">Notre conviction</p>
          <h2>Le village ne se résume pas à son passé</h2>
          <div>
            <p>Son histoire nous rassemble. Son présent nous concerne. Son avenir dépendra de notre capacité à écouter, proposer et agir avec constance.</p>
            <p>Personne ne peut tout faire. Mais chacun peut apporter quelque chose : une idée, une compétence, quelques heures, un soutien ou simplement une présence.</p>
          </div>
        </section>

        <section className="act-pillars" aria-labelledby="act-pillars-title">
          <div className="act-section-heading">
            <p className="eyebrow">Une énergie commune</p>
            <h2 id="act-pillars-title">Quatre manières de faire avancer le village</h2>
          </div>
          <div className="act-pillar-grid">
            {pillars.map((pillar) => (
              <article key={pillar.number}>
                <span>{pillar.number}</span>
                <i aria-hidden="true">{pillar.icon}</i>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projets" className="act-projects">
          <div className="act-section-heading">
            <p className="eyebrow light">Point de départ</p>
            <h2>Des premières idées à construire ensemble</h2>
            <p>Ces pistes ne sont ni des décisions prises ni des promesses. Elles ouvrent une discussion et pourront évoluer selon les besoins exprimés au village.</p>
          </div>
          <div className="act-project-list">
            {projectIdeas.map(([category, title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{category}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Link href="/contribuer" aria-label={`Contribuer à l’idée : ${title}`}>↗</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="act-method">
          <div>
            <p className="eyebrow">Notre méthode</p>
            <h2>Faire peu, mais le faire sérieusement</h2>
            <p>Chaque projet devra répondre à un besoin clair, identifier les personnes concernées et présenter honnêtement ses moyens, son avancement et ses résultats.</p>
          </div>
          <ol>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className="act-contributions">
          <div className="act-section-heading">
            <p className="eyebrow">Chacun à sa manière</p>
            <h2>Il existe plusieurs façons de participer</h2>
          </div>
          <ul>
            <li><span>01</span><strong>Donner du temps</strong><small>Participer ponctuellement ou régulièrement</small></li>
            <li><span>02</span><strong>Partager une compétence</strong><small>Technique, culturelle, professionnelle ou associative</small></li>
            <li><span>03</span><strong>Proposer une idée</strong><small>Partir d’un besoin concret et observable</small></li>
            <li><span>04</span><strong>Créer un lien</strong><small>Mettre en relation les personnes et les ressources</small></li>
            <li><span>05</span><strong>Transmettre</strong><small>Une histoire, un savoir-faire ou une expérience</small></li>
            <li><span>06</span><strong>Soutenir un projet</strong><small>Selon ses possibilités et en toute transparence</small></li>
          </ul>
        </section>

        <section className="act-principles">
          <p className="eyebrow light">Notre engagement</p>
          <h2>Rassembler sans juger.<br/>Agir sans exclure.</h2>
          <div>
            <p>Cette démarche n’a pas vocation à donner des leçons ni à parler au nom de tous. Elle doit permettre aux bonnes volontés de se rencontrer et aux projets utiles de devenir visibles.</p>
            <ul>
              <li>Pas de culpabilisation</li>
              <li>Pas de promesse sans suivi</li>
              <li>Pas de collecte sans transparence</li>
              <li>Pas de représentation sans accord</li>
            </ul>
          </div>
        </section>

        <section className="act-final">
          <p className="eyebrow">Une première étape</p>
          <h2>Une idée pour Aït Mesbah&nbsp;?</h2>
          <p>Elle peut devenir le point de départ d’une action collective. Partageons-la, confrontons-la aux besoins du village et voyons ce qu’il est réellement possible de construire.</p>
          <Link className="primary" href="/contribuer">Proposer une initiative <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

