import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeaderClient from "@/components/layout/SiteHeaderClient";
import SiteFooter from "@/components/layout/SiteFooter";
import ShareDiscovery from "@/components/public/ShareDiscovery";
import "./parcours.css";

export const metadata: Metadata = {
  title: "Aït Mesbah en cinq minutes — Un premier regard",
  description: "Un parcours en cinq étapes pour découvrir le village, sa mémoire, ses savoir-faire et les liens qui le font vivre.",
  alternates: { canonical: "/decouvrir" },
  openGraph: {
    title: "Aït Mesbah en cinq minutes",
    description: "Cinq étapes pour découvrir les lieux, la mémoire, les savoir-faire et la vie du village.",
    url: "/decouvrir",
    siteName: "Aït Mesbah",
    locale: "fr_DZ",
    type: "website",
    images: [{ url: "/ait-mesbah-village.jpg", alt: "Vue du village d’Aït Mesbah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aït Mesbah en cinq minutes",
    description: "Un premier regard sur le village, en cinq étapes.",
    images: ["/ait-mesbah-village.jpg"],
  },
};

const steps = [
  { id: "lieux", label: "Un territoire", title: "D’abord, situer le village", text: "Aït Mesbah se trouve en Kabylie, dans la commune d’Ath Douala, au sein de la wilaya de Tizi Ouzou. Pour qui y revient ou le découvre de loin, ses reliefs, ses chemins et ses quartiers sont les premiers repères d’une histoire commune.", image: "/ait-mesbah-village.jpg", alt: "Vue des habitations d’Aït Mesbah", caption: "Le village et ses reliefs", href: "/village", action: "Explorer les lieux" },
  { id: "memoire", label: "Une mémoire", title: "Relier les générations", text: "L’histoire du village se découvre à travers des documents, des photographies et des témoignages. Le parcours d’Amar Imache, la guerre d’indépendance et les migrations y occupent une place. La chronologie distingue les faits documentés des mémoires locales qui restent à recouper.", image: "/images/amar-imache/portrait-ancien.jpg", alt: "Portrait ancien d’Amar Imache", caption: "Amar Imache · Portrait présenté dans le dossier historique", href: "/histoire-memoire", action: "Parcourir l’histoire" },
  { id: "gestes", label: "Des savoir-faire", title: "La mémoire passe aussi par les mains", text: "La poterie, la couture de robes kabyles et le tissage ouvrent une autre porte sur Aït Mesbah. Les pages métiers réunissent des gestes, des objets et des pistes documentaires. Le reportage photographique de 1939 offre notamment un regard ancien sur le travail de la poterie au village.", image: "/archives/poterie-1939/14.jpg", alt: "Photographie ancienne du décor d’une poterie", caption: "Décor d’une poterie, 1939 · Thérèse Rivière · Musée du quai Branly – Jacques Chirac, PP0193025", href: "/artisanat", action: "Rencontrer les savoir-faire" },
  { id: "present", label: "Une vie collective", title: "Un village qui se construit au présent", text: "Le comité de village, le football, le judo et l’association culturelle composent autant d’espaces où se rencontrer et transmettre. Leurs pages présentent leurs parcours, leurs activités et les besoins exprimés pour la jeunesse et la vie commune.", image: "/images/jcam-jeunes-taqaats.jpg", alt: "Groupe de jeunes judokas réunis dans la salle Taqaats", caption: "Les jeunes du JCAM à la salle Taqaats", href: "/vivre", action: "Découvrir la vie du village" },
  { id: "participer", label: "Un lien à faire vivre", title: "D’ici ou d’ailleurs, faire sa part", text: "On peut vivre loin et rester proche. Une photographie à identifier, un souvenir à transmettre, une compétence ou un peu de temps peuvent être utiles. Chacun peut proposer une contribution ; les contenus sont examinés avant leur publication.", image: "/images/asam-2026-finaliste.jpg", alt: "L’équipe de l’ASAM réunie devant ses supporters", caption: "ASAM · L’équipe finaliste en 2026", href: "/contribuer", action: "Proposer une contribution" },
];

export default function DiscoveryPage() {
  return <>
    <a className="skip-link" href="#contenu-principal">Aller au contenu principal</a>
    <SiteHeaderClient />
    <main id="contenu-principal" className="discovery-journey">
      <header className="journey-intro">
        <p className="journey-label">Un premier regard · Cinq étapes</p>
        <h1>Aït Mesbah<br /><em>en cinq minutes</em></h1>
        <p>Pour découvrir le village, retrouver ses racines ou partager un peu de son histoire avec la génération qui vient.</p>
        <a href="#lieux">Commencer la découverte <span aria-hidden="true">↓</span></a>
      </header>
      <nav className="journey-nav" aria-label="Les cinq étapes"><ol>{steps.map((step, index) => <li key={step.id}><a href={`#${step.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{step.label}</a></li>)}</ol></nav>
      <div className="journey-stages">{steps.map((step, index) => <section key={step.id} id={step.id} aria-labelledby={`titre-${step.id}`} className="journey-stage">
        <figure><Image src={step.image} alt={step.alt} width={720} height={720} sizes="(max-width: 760px) 90vw, 450px" /><figcaption>{step.caption}</figcaption></figure>
        <div><p className="journey-label">{String(index + 1).padStart(2, "0")} / 05 · {step.label}</p><h2 id={`titre-${step.id}`}>{step.title}</h2><p>{step.text}</p><Link href={step.href}>{step.action} <span aria-hidden="true">↗</span></Link><div className="journey-next"><a href={index < steps.length - 1 ? `#${steps[index + 1].id}` : "#continuer"}>{index < steps.length - 1 ? `Étape suivante : ${steps[index + 1].label.toLowerCase()}` : "Terminer le parcours"}<span aria-hidden="true">↓</span></a></div></div>
      </section>)}</div>
      <section id="continuer" className="journey-ending"><p className="journey-label">La découverte continue</p><h2>Une terre commune,<br />des liens sans frontières.</h2><p>Ce premier regard n’épuise pas l’histoire du village. Prenez le temps d’explorer les archives, de lire un récit ou de découvrir une initiative.</p><Link href="/diaspora">Retrouver les liens de la diaspora →</Link><Link href="/agir">Découvrir « Agir ensemble » →</Link></section>
      <ShareDiscovery />
    </main><SiteFooter />
  </>;
}
